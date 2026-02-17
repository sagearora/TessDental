using System.Diagnostics;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using System.Windows.Forms;
using NTwain;
using NTwain.Data;
using NTwain.Events;

namespace TessCapture;

internal static class Program
{
    // ====== Config ======
    private const string WsPrefix = "http://127.0.0.1:38732/ws/";
    private static readonly string SaveDir = Path.Combine(
        Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
        "TessDental",
        "TessCapture",
        "captures"
    );
    private static readonly string LogDir = Path.Combine(
        Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
        "TessDental",
        "TessCapture"
    );

    private static readonly object _logLock = new();
    private static string? _logFilePath;

    private static void Log(string message)
    {
        var line = $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}] {message}";
        lock (_logLock)
        {
            try
            {
                Directory.CreateDirectory(LogDir);
                _logFilePath ??= Path.Combine(LogDir, "tesscapture.log");
                File.AppendAllText(_logFilePath, line + Environment.NewLine);
            }
            catch { /* ignore */ }
        }

        Debug.WriteLine(line);
    }

    // ====== Runtime state ======
    private static Form? _hostForm;
    private static TwainAppSession? _twain;
    private static readonly object _twainLock = new();

    private static int _xferCount = 0;
    private static readonly Stopwatch _watch = new();

    // Single active websocket client for prototype simplicity
    private static WebSocket? _clientWs;
    private static readonly SemaphoreSlim _wsSendLock = new(1, 1);

    // Optional direct-upload context (set when capture command includes uploadToken/uploadUrl)
    private static string? _uploadToken;
    private static string? _uploadUrl;
    private static readonly HttpClient _httpClient = new HttpClient();

    // Capture session state (no UI form; web can start another capture after captureDone).
    // One session = one open of the scanner UI; the user can acquire multiple photos before closing, all are uploaded.
    private static string? _sessionSourceName;
    private static string? _sessionUploadToken;
    private static string? _sessionUploadUrl;

    // Pending upload tasks: we wait for all to complete before sending captureDone
    private static readonly List<Task> _pendingUploadTasks = new();
    private static readonly object _pendingUploadLock = new();
    private const int UploadWaitTimeoutMs = 120000; // 2 minutes

    private static bool _isExiting;
    private static HttpListener? _listener;

    [STAThread]
    static void Main()
    {
        Directory.CreateDirectory(SaveDir);
        Directory.CreateDirectory(LogDir);

        _logFilePath = Path.Combine(LogDir, "tesscapture.log");
        Log("TessCapture starting; SaveDir=" + SaveDir);

        ApplicationConfiguration.Initialize();

        _hostForm = new Form
        {
            Text = "TessCapture",
            Width = 420,
            Height = 140,
            StartPosition = FormStartPosition.CenterScreen,
            ShowInTaskbar = true
        };

        var status = new Label
        {
            Dock = DockStyle.Fill,
            TextAlign = System.Drawing.ContentAlignment.MiddleCenter,
            Font = new System.Drawing.Font("Segoe UI", 11f),
            Text = "TessCapture Started.\r\nYou may close this window."
        };
        _hostForm.Controls.Add(status);

        // Closing the window hides it; app keeps running in tray
        _hostForm.FormClosing += (_, e) =>
        {
            if (!_isExiting)
            {
                e.Cancel = true;
                _hostForm!.Hide();
            }
        };

        _hostForm.FormClosed += (_, __) =>
        {
            try
            {
                lock (_twainLock)
                {
                    try { _twain?.CloseSource(); } catch { }
                    try { _twain?.CloseDsm(); } catch { }
                    try { _twain?.Dispose(); } catch { }
                    _twain = null;
                }
            }
            catch { }
        };

        // Force form handle creation (important for TWAIN sources even if window is later hidden)
        _ = _hostForm.Handle;

        // System tray icon + menu (use app icon from exe when set, else default)
        Icon? trayIconIcon = null;
        try
        {
            trayIconIcon = Icon.ExtractAssociatedIcon(Application.ExecutablePath);
        }
        catch { /* ignore */ }

        var trayIcon = new NotifyIcon
        {
            Icon = trayIconIcon ?? SystemIcons.Application,
            Text = "TessCapture - ws://127.0.0.1:38732/ws/",
            Visible = true
        };

        var showWindowItem = new ToolStripMenuItem("Show Window");
        showWindowItem.Click += (_, __) =>
        {
            if (_hostForm != null && !_hostForm.IsDisposed)
            {
                _hostForm.Show();
                _hostForm.BringToFront();
            }
        };

        var showLogsItem = new ToolStripMenuItem("Show Logs");
        showLogsItem.Click += (_, __) =>
        {
            try
            {
                Directory.CreateDirectory(LogDir);
                _logFilePath ??= Path.Combine(LogDir, "tesscapture.log");
                Process.Start(new ProcessStartInfo
                {
                    FileName = _logFilePath,
                    UseShellExecute = true
                });
            }
            catch (Exception ex)
            {
                Log("Show Logs failed: " + ex.Message);
            }
        };

        var restartItem = new ToolStripMenuItem("Restart");
        restartItem.Click += (_, __) =>
        {
            try
            {
                Log("Restart requested.");
                var exe = Application.ExecutablePath;
                Process.Start(new ProcessStartInfo
                {
                    FileName = exe,
                    UseShellExecute = true
                });
            }
            catch (Exception ex)
            {
                Log("Restart failed: " + ex.Message);
            }

            _isExiting = true;
            trayIcon.Visible = false;
            trayIcon.Dispose();
            _hostForm?.Close();
        };

        var quitItem = new ToolStripMenuItem("Quit");
        quitItem.Click += (_, __) =>
        {
            _isExiting = true;
            trayIcon.Visible = false;
            trayIcon.Dispose();
            _hostForm?.Close();
        };

        trayIcon.ContextMenuStrip = new ContextMenuStrip();
        trayIcon.ContextMenuStrip.Items.Add(showWindowItem);
        trayIcon.ContextMenuStrip.Items.Add(showLogsItem);
        trayIcon.ContextMenuStrip.Items.Add(new ToolStripSeparator());
        trayIcon.ContextMenuStrip.Items.Add(restartItem);
        trayIcon.ContextMenuStrip.Items.Add(quitItem);

        trayIcon.DoubleClick += (_, __) => showWindowItem.PerformClick();

        // Start WebSocket server now (no Load event dependency)
        StartWebSocketServer(_hostForm);
        Log("WebSocket server started; app running in system tray.");

        var appContext = new ApplicationContext
        {
            MainForm = _hostForm
        };
        Application.Run(appContext);
    }

    // =========================
    // WebSocket Server (HttpListener)
    // =========================
    private static void StartWebSocketServer(Form ui)
    {
        _listener = new HttpListener();
        _listener.Prefixes.Add(WsPrefix);
        _listener.Start();

        _ = Task.Run(async () =>
        {
            while (_listener != null && _listener.IsListening)
            {
                HttpListenerContext ctx;
                try
                {
                    ctx = await _listener.GetContextAsync();
                }
                catch
                {
                    break;
                }

                if (!ctx.Request.IsWebSocketRequest)
                {
                    ctx.Response.StatusCode = 400;
                    ctx.Response.Close();
                    continue;
                }

                HttpListenerWebSocketContext wsCtx;
                try
                {
                    wsCtx = await ctx.AcceptWebSocketAsync(subProtocol: null);
                }
                catch
                {
                    ctx.Response.StatusCode = 500;
                    ctx.Response.Close();
                    continue;
                }

                _clientWs?.Abort();
                _clientWs = wsCtx.WebSocket;
                Log("WebSocket client connected.");

                await SendJson(new
                {
                    type = "hello",
                    app = "tesscapture",
                    pid = Environment.ProcessId,
                    bitness = Environment.Is64BitProcess ? "x64" : "x86",
                    saveDir = SaveDir
                });

                await ReceiveLoop(ui, _clientWs);
            }
        });
    }

    private static async Task ReceiveLoop(Form ui, WebSocket ws)
    {
        var buffer = new byte[64 * 1024];

        while (ws.State == WebSocketState.Open)
        {
            WebSocketReceiveResult res;
            using var ms = new MemoryStream();
            do
            {
                res = await ws.ReceiveAsync(buffer, CancellationToken.None);
                if (res.MessageType == WebSocketMessageType.Close)
                {
                    try { await ws.CloseAsync(WebSocketCloseStatus.NormalClosure, "bye", CancellationToken.None); } catch { }
                    return;
                }

                ms.Write(buffer, 0, res.Count);
            } while (!res.EndOfMessage);

            var msg = Encoding.UTF8.GetString(ms.ToArray());
            Log("WS received: " + (msg.Length > 500 ? msg[..500] + "..." : msg));
            await HandleCommand(ui, msg);
        }
    }

    // =========================
    // Command Handling
    // =========================
    private static async Task HandleCommand(Form ui, string json)
    {
        JsonDocument doc;
        try
        {
            doc = JsonDocument.Parse(json);
        }
        catch (Exception ex)
        {
            Log("HandleCommand: Invalid JSON - " + ex.Message);
            await SendJson(new { type = "error", message = "Invalid JSON" });
            return;
        }

        if (!doc.RootElement.TryGetProperty("type", out var typeEl))
        {
            Log("HandleCommand: Missing 'type' in message");
            await SendJson(new { type = "error", message = "Missing 'type'" });
            return;
        }

        var type = typeEl.GetString() ?? "";
        Log("HandleCommand: type=" + type);

        switch (type)
        {
            case "listSources":
                await RunOnUi(ui, async () =>
                {
                    Log("listSources: getting TWAIN sources...");
                    var sources = EnsureTwainAndGetSources();
                    var names = sources.Select(s => GetSourceProductName(s)).ToList();
                    Log("listSources: found " + sources.Count + " source(s): " + string.Join(", ", names));
                    await SendJson(new
                    {
                        type = "sources",
                        sources = sources.Select(s => new { productName = GetSourceProductName(s) }).ToArray()
                    });
                });
                break;

            case "capture":
                if (!doc.RootElement.TryGetProperty("source", out var srcEl))
                {
                    Log("capture: Missing 'source'");
                    await SendJson(new { type = "error", message = "Missing 'source' for capture" });
                    return;
                }

                var sourceName = srcEl.GetString() ?? "";
                doc.RootElement.TryGetProperty("uploadToken", out var tokEl);
                doc.RootElement.TryGetProperty("uploadUrl", out var urlEl);

                var uploadToken = tokEl.ValueKind == JsonValueKind.String ? tokEl.GetString() : null;
                var uploadUrl = urlEl.ValueKind == JsonValueKind.String ? urlEl.GetString() : null;

                Log("capture: source='" + sourceName + "' uploadToken=" +
                    (string.IsNullOrEmpty(uploadToken) ? "no" : "yes") + " uploadUrl=" +
                    (string.IsNullOrEmpty(uploadUrl) ? "no" : "yes"));

                await RunOnUi(ui, async () =>
                {
                    _sessionSourceName = sourceName;
                    _sessionUploadToken = uploadToken;
                    _sessionUploadUrl = uploadUrl;

                    lock (_pendingUploadLock)
                        _pendingUploadTasks.Clear();

                    await CaptureFromSourceUi(sourceName, uploadToken, uploadUrl);
                });
                break;

            default:
                Log("HandleCommand: Unknown type '" + type + "'");
                await SendJson(new { type = "error", message = $"Unknown command type: {type}" });
                break;
        }
    }

    // =========================
    // TWAIN Operations (UI thread)
    // =========================
    private static string GetSourceProductName(TWIdentityWrapper wrapper)
    {
        try
        {
            var pn = wrapper.ProductName;
            if (pn == null) return "";
            return pn.ToString() ?? "";
        }
        catch
        {
            return "";
        }
    }

    private static IList<TWIdentityWrapper> EnsureTwainAndGetSources()
    {
        lock (_twainLock)
        {
            if (_twain == null)
            {
                Log("TWAIN: Creating TwainAppSession, opening DSM...");
                _twain = new TwainAppSession();
                _twain.Transferred += OnTransferred;
                _twain.SourceDisabled += OnSourceDisabled;

                var sts = _twain.OpenDsm();
                Log("TWAIN: OpenDsm result=" + sts);
                if (!sts.IsSuccess)
                    throw new InvalidOperationException($"OpenDsm failed: {sts}");
            }
        }

        var sources = _twain!.GetSources();
        Log("TWAIN: GetSources returned " + sources.Count + " source(s)");
        return sources;
    }

    private static void ClearSessionState()
    {
        _sessionSourceName = null;
        _sessionUploadToken = null;
        _sessionUploadUrl = null;
        _uploadToken = null;
        _uploadUrl = null;
    }

    private static async Task CaptureFromSourceUi(string productName, string? uploadToken, string? uploadUrl)
    {
        _uploadToken = uploadToken;
        _uploadUrl = uploadUrl;

        Log("CaptureFromSourceUi: productName='" + productName + "'");

        var sources = EnsureTwainAndGetSources();
        var src = sources.FirstOrDefault(s =>
            string.Equals(GetSourceProductName(s), productName, StringComparison.OrdinalIgnoreCase));

        if (src == null)
        {
            Log("CaptureFromSourceUi: Source not found for '" + productName + "'");
            ClearSessionState();
            await SendJson(new { type = "error", message = $"Source not found: {productName}" });
            return;
        }

        try { _twain!.CloseSource(); } catch { }

        Log("CaptureFromSourceUi: OpenSource...");
        var sts = _twain!.OpenSource(src);
        Log("CaptureFromSourceUi: OpenSource result=" + sts);
        if (!sts.IsSuccess)
        {
            ClearSessionState();
            await SendJson(new { type = "error", message = $"OpenSource failed: {sts}", source = productName });
            return;
        }

        _xferCount = 0;
        _watch.Restart();

        await SendJson(new { type = "captureStarted", source = productName });
        Log("CaptureFromSourceUi: calling EnableSource(ShowUI)...");

        sts = _twain.EnableSource(SourceEnableOption.ShowUI);
        Log("CaptureFromSourceUi: EnableSource(ShowUI) result=" + sts);
        if (!sts.IsSuccess)
        {
            ClearSessionState();
            await SendJson(new { type = "error", message = $"EnableSource failed: {sts}", source = productName });
            return;
        }

        Log("CaptureFromSourceUi: EnableSource succeeded; vendor UI should open now.");
    }

    /// <summary>Fired once per image; a session can produce multiple photos before the user closes the scanner UI.</summary>
    private static void OnTransferred(object? sender, TransferredEventArgs e)
    {
        Log("OnTransferred: Data=" + (e.Data != null ? "yes" : "no") + " FileInfo=" + (e.FileInfo != null ? "yes" : "no"));

        if (e.Data != null)
        {
            var baseName = $"twain_{DateTime.Now:yyyyMMdd_HHmmss}_{_xferCount}";
            var pathNoExt = Path.Combine(SaveDir, baseName);

            try
            {
                using var img = new ImageMagick.MagickImage(e.Data.AsStream());
                string outPath;

                if (img.ColorType == ImageMagick.ColorType.Palette)
                {
                    outPath = pathNoExt + ".png";
                    img.Write(outPath, ImageMagick.MagickFormat.Png);
                }
                else
                {
                    outPath = pathNoExt + ".jpg";
                    img.Settings.Compression = ImageMagick.CompressionMethod.JPEG;
                    img.Quality = 85;
                    img.Write(outPath, ImageMagick.MagickFormat.Jpeg);
                }

                _xferCount++;
                var index = _xferCount;

                var token = _uploadToken;
                var url = _uploadUrl;
                if (!string.IsNullOrEmpty(token) && !string.IsNullOrEmpty(url))
                {
                    var pathToUpload = outPath;
                    static void NoOpStatus(int _idx, bool? _success, string _text) { }
                    var uploadTask = Task.Run(async () =>
                    {
                        var msg = await RunUploadWithRetriesAsync(pathToUpload, token, url, index, NoOpStatus);
                        if (msg != null)
                            await SendJson(msg);
                    });
                    lock (_pendingUploadLock)
                        _pendingUploadTasks.Add(uploadTask);
                }
                else
                {
                    _ = SendJson(new
                    {
                        type = "imageSaved",
                        path = outPath,
                        index = _xferCount
                    });
                }
            }
            catch (Exception ex)
            {
                Log("OnTransferred: Save failed - " + ex.Message);
                _ = SendJson(new { type = "error", message = $"Save failed: {ex.Message}" });
            }
        }
        else if (e.FileInfo != null)
        {
            var fi = e.FileInfo.Value;
            _xferCount++;
            _ = SendJson(new
            {
                type = "imageFile",
                path = fi.FileName,
                index = _xferCount
            });
        }
        else
        {
            _ = SendJson(new { type = "error", message = "No data returned from transfer" });
        }
    }

    /// <summary>One upload attempt. Returns (message to send, true if failure was transient and retry makes sense).</summary>
    private static async Task<(object? message, bool isTransientFailure)> UploadOneAttemptAsync(string filePath, string uploadToken, string uploadUrl, int index)
    {
        try
        {
            var baseUrl = uploadUrl.TrimEnd('/');
            var endpoint = $"{baseUrl}/imaging/assets/upload-bridge";

            using var content = new MultipartFormDataContent();
            var fileBytes = await File.ReadAllBytesAsync(filePath);
            var fileName = Path.GetFileName(filePath);
            var extension = Path.GetExtension(filePath).ToLowerInvariant();
            var mediaType = extension switch
            {
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                _ => "image/jpeg"
            };
            var fileContent = new ByteArrayContent(fileBytes);
            fileContent.Headers.ContentType = new MediaTypeHeaderValue(mediaType);
            content.Add(fileContent, "file", fileName);

            using var request = new HttpRequestMessage(HttpMethod.Post, endpoint);
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", uploadToken);
            request.Content = content;

            var response = await _httpClient.SendAsync(request, CancellationToken.None);
            if (response.IsSuccessStatusCode)
            {
                var json = await response.Content.ReadAsStringAsync(CancellationToken.None);
                using var doc = JsonDocument.Parse(json);
                var assetId = doc.RootElement.TryGetProperty("assetId", out var idEl)
                    ? ParseAssetId(idEl)
                    : 0;
                return (new { type = "imageUploaded", assetId, index }, false);
            }

            var body = await response.Content.ReadAsStringAsync(CancellationToken.None);
            var status = (int)response.StatusCode;
            var isTransient = status == 408 || status == 429 || (status >= 500 && status < 600);
            return (new { type = "error", message = $"Upload failed: {response.StatusCode} - {body}" }, isTransient);
        }
        catch (Exception ex)
        {
            var isTransient = ex is HttpRequestException || ex is TaskCanceledException;
            return (new { type = "error", message = $"Upload failed: {ex.Message}" }, isTransient);
        }
    }

    private const int UploadMaxAttempts = 3;
    private static readonly int[] UploadRetryDelayMs = { 1000, 2000 };

    private static async Task<object?> RunUploadWithRetriesAsync(string filePath, string uploadToken, string uploadUrl, int index, Action<int, bool?, string> reportStatus)
    {
        reportStatus(index, null, "Uploading…");
        object? lastMessage = null;
        for (var attempt = 1; attempt <= UploadMaxAttempts; attempt++)
        {
            var (message, isTransient) = await UploadOneAttemptAsync(filePath, uploadToken, uploadUrl, index);
            if (message is not null && IsSuccessMessage(message))
            {
                reportStatus(index, true, "Uploaded");
                return message;
            }
            lastMessage = message;
            if (!isTransient || attempt == UploadMaxAttempts)
            {
                var errMsg = GetErrorMessage(message);
                reportStatus(index, false, errMsg);
                return message;
            }
            reportStatus(index, null, $"Retrying ({attempt + 1}/{UploadMaxAttempts})…");
            await Task.Delay(UploadRetryDelayMs[attempt - 1]);
        }
        var finalErr = GetErrorMessage(lastMessage);
        reportStatus(index, false, finalErr);
        return lastMessage;
    }

    private static bool IsSuccessMessage(object msg)
    {
        if (msg is null) return false;
        try
        {
            using var doc = JsonDocument.Parse(JsonSerializer.Serialize(msg));
            return doc.RootElement.TryGetProperty("type", out var t) && t.GetString() == "imageUploaded";
        }
        catch { return false; }
    }

    private static string GetErrorMessage(object? msg)
    {
        if (msg is null) return "Upload failed.";
        try
        {
            using var doc = JsonDocument.Parse(JsonSerializer.Serialize(msg));
            if (doc.RootElement.TryGetProperty("message", out var m))
                return m.GetString() ?? "Upload failed.";
        }
        catch { }
        return "Upload failed.";
    }

    /// <summary>Parse assetId from JSON response; server may return number or string (e.g. bigint as string).</summary>
    private static int ParseAssetId(JsonElement idEl)
    {
        return idEl.ValueKind switch
        {
            JsonValueKind.Number => idEl.GetInt32(),
            JsonValueKind.String => int.TryParse(idEl.GetString(), out var n) ? n : 0,
            _ => 0
        };
    }

    private static void OnSourceDisabled(object? sender, dynamic e)
    {
        Log("OnSourceDisabled: capture session ended, transfers=" + _xferCount);

        var sourceStr = e?.ProductName?.ToString() ?? "";
        var elapsedMs = _watch.ElapsedMilliseconds;
        var inSession = !string.IsNullOrEmpty(_sessionSourceName);

        if (inSession)
        {
            _ = Task.Run(async () =>
            {
                await Task.Delay(100);
                _hostForm?.BeginInvoke(() => ScheduleFinishWhenIdle());
            });
            return;
        }

        _uploadToken = null;
        _uploadUrl = null;
        try
        {
            _ = SendJson(new
            {
                type = "captureDone",
                source = sourceStr,
                transfers = _xferCount,
                elapsedMs
            });
            try { _twain?.CloseSource(); } catch { }
        }
        catch (Exception ex)
        {
            _ = SendJson(new { type = "error", message = $"OnSourceDisabled error: {ex.Message}" });
        }
    }

    /// <summary>
    /// Schedules finish to run when the UI message queue is empty, so any OnTransferred-posted work
    /// is processed before we wait for uploads and close the source.
    /// </summary>
    private static void ScheduleFinishWhenIdle()
    {
        void OnIdle(object? sender, EventArgs e)
        {
            Application.Idle -= OnIdle;
            var sourceStr = _sessionSourceName ?? "";
            var elapsedMs = _watch.ElapsedMilliseconds;
            List<Task> toWait;
            lock (_pendingUploadLock)
            {
                toWait = new List<Task>(_pendingUploadTasks);
            }
            ClearSessionState();
            _ = FinishCaptureSessionAsync(sourceStr, elapsedMs, toWait);
        }
        Application.Idle += OnIdle;
    }

    private static async Task FinishCaptureSessionAsync(string sourceStr, long elapsedMs, List<Task> uploadTasks)
    {
        await WaitForUploadsThenFinishAsync(sourceStr, elapsedMs, uploadTasks);
        try { _twain?.CloseSource(); } catch { }
    }

    private static async Task WaitForUploadsThenFinishAsync(string sourceStr, long elapsedMs, List<Task> uploadTasks)
    {
        if (uploadTasks.Count > 0)
        {
            try
            {
                await Task.WhenAll(uploadTasks).WaitAsync(TimeSpan.FromMilliseconds(UploadWaitTimeoutMs));
            }
            catch (TimeoutException)
            {
                Log("FinishCaptureSession: upload wait timed out.");
            }
        }

        _uploadToken = null;
        _uploadUrl = null;
        _sessionUploadToken = null;
        _sessionUploadUrl = null;
        lock (_pendingUploadLock)
            _pendingUploadTasks.Clear();

        await SendJson(new
        {
            type = "captureDone",
            source = sourceStr,
            transfers = _xferCount,
            elapsedMs
        });
    }

    // =========================
    // Helpers
    // =========================
    private static Task RunOnUi(Form ui, Func<Task> work)
    {
        var tcs = new TaskCompletionSource();
        ui.BeginInvoke(async () =>
        {
            try
            {
                await work();
                tcs.SetResult();
            }
            catch (Exception ex)
            {
                await SendJson(new { type = "error", message = ex.Message });
                tcs.SetResult();
            }
        });
        return tcs.Task;
    }

    private static async Task SendJson(object payload)
    {
        var ws = _clientWs;
        if (ws == null || ws.State != WebSocketState.Open)
            return;

        var json = JsonSerializer.Serialize(payload);
        var bytes = Encoding.UTF8.GetBytes(json);

        await _wsSendLock.WaitAsync();
        try
        {
            await ws.SendAsync(bytes, WebSocketMessageType.Text, endOfMessage: true, CancellationToken.None);
        }
        catch
        {
            // ignore broken pipe
        }
        finally
        {
            _wsSendLock.Release();
        }
    }
}
