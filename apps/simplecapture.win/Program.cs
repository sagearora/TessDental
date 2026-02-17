using System.Diagnostics;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using System.Threading.Channels;
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
    private static bool _isExiting;

    private static Icon? GetAppIcon()
    {
        try
        {
            var path = Path.Combine(AppContext.BaseDirectory, "TessDental.ico");
            return File.Exists(path) ? new Icon(path) : null;
        }
        catch { return null; }
    }

    [STAThread]
    static void Main()
    {
        Directory.CreateDirectory(SaveDir);
        _logFilePath = Path.Combine(LogDir, "tesscapture.log");
        Log("TessCapture starting (tray); SaveDir=" + SaveDir);

        ApplicationConfiguration.Initialize();

        var appIcon = GetAppIcon();
        _hostForm = new Form
        {
            Text = "TessCapture",
            Width = 320,
            Height = 120,
            StartPosition = FormStartPosition.CenterScreen,
            Visible = true,
            ShowInTaskbar = true,
            Icon = appIcon
        };

        var messageLabel = new Label
        {
            Dock = DockStyle.Fill,
            TextAlign = System.Drawing.ContentAlignment.MiddleCenter,
            Text = "TessCapture Started.\nYou may close this window",
            AutoSize = false,
            Font = new System.Drawing.Font(System.Drawing.SystemFonts.DefaultFont.FontFamily, 10f)
        };
        _hostForm.Controls.Add(messageLabel);

        // Start WebSocket server when form is loaded (same as before rename: BeginInvoke so server starts on message pump)
        _hostForm.Load += (_, __) =>
        {
            _hostForm!.BeginInvoke(() =>
            {
                StartWebSocketServer(_hostForm);
                Log("WebSocket server started; app running in system tray.");
            });
        };

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

        // System tray icon (use ApplicationContext so the form is never auto-shown)
        var trayIcon = new NotifyIcon
        {
            Icon = appIcon ?? SystemIcons.Application,
            Text = "TessCapture - WebSocket: ws://127.0.0.1:38732/ws/",
            Visible = true
        };
        var showItem = new ToolStripMenuItem("Show window");
        showItem.Click += (_, __) =>
        {
            if (_hostForm != null && !_hostForm.IsDisposed)
            {
                _hostForm.Show();
                _hostForm.BringToFront();
                _hostForm.Activate();
            }
        };
        var exitItem = new ToolStripMenuItem("Exit");
        exitItem.Click += (_, __) =>
        {
            _isExiting = true;
            trayIcon.Visible = false;
            trayIcon.Dispose();
            _hostForm?.Close();
        };
        trayIcon.ContextMenuStrip = new ContextMenuStrip();
        trayIcon.ContextMenuStrip.Items.Add(showItem);
        trayIcon.ContextMenuStrip.Items.Add(exitItem);
        trayIcon.DoubleClick += (_, __) => showItem.PerformClick();

        // Force form handle creation so Load fires; keep form hidden (no Show()).
        _ = _hostForm.Handle;
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
        var listener = new HttpListener();
        listener.Prefixes.Add(WsPrefix);
        listener.Start();

        _ = Task.Run(async () =>
        {
            while (listener.IsListening)
            {
                HttpListenerContext ctx;
                try
                {
                    ctx = await listener.GetContextAsync();
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

                // Replace any existing client (prototype)
                _clientWs?.Abort();
                _clientWs = wsCtx.WebSocket;
                Log("WebSocket client connected.");

                await SendJson(new
                {
                    type = "hello",
                    app = "tess-capture",
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
                Log("capture: source='" + sourceName + "' uploadToken=" + (string.IsNullOrEmpty(uploadToken) ? "no" : "yes") + " uploadUrl=" + (string.IsNullOrEmpty(uploadUrl) ? "no" : "yes"));
                await RunOnUi(ui, async () =>
                {
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
    /// <summary>ProductName in NTwain is a struct (e.g. TwStr32) that serializes as {}; convert to string.</summary>
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

    private static async Task CaptureFromSourceUi(string productName, string? uploadToken, string? uploadUrl)
    {
        _uploadToken = uploadToken;
        _uploadUrl = uploadUrl;
        Log("CaptureFromSourceUi: productName='" + productName + "'");

        var sources = EnsureTwainAndGetSources();
        var src = sources.FirstOrDefault(s => string.Equals(GetSourceProductName(s), productName, StringComparison.OrdinalIgnoreCase));

        if (src == null)
        {
            Log("CaptureFromSourceUi: Source not found for '" + productName + "'");
            await SendJson(new { type = "error", message = $"Source not found: {productName}" });
            return;
        }
        Log("CaptureFromSourceUi: Found source, closing any previous source...");

        // Close any previously open source
        try { _twain!.CloseSource(); } catch { }

        Log("CaptureFromSourceUi: OpenSource...");
        var sts = _twain!.OpenSource(src);
        Log("CaptureFromSourceUi: OpenSource result=" + sts);
        if (!sts.IsSuccess)
        {
            await SendJson(new { type = "error", message = $"OpenSource failed: {sts}", source = productName });
            return;
        }

        _xferCount = 0;
        _watch.Restart();

        await SendJson(new { type = "captureStarted", source = productName });
        Log("CaptureFromSourceUi: Sent captureStarted, calling EnableSource(ShowUI)...");

        sts = _twain.EnableSource(SourceEnableOption.ShowUI);
        Log("CaptureFromSourceUi: EnableSource(ShowUI) result=" + sts);
        if (!sts.IsSuccess)
        {
            await SendJson(new { type = "error", message = $"EnableSource failed: {sts}", source = productName });
            return;
        }
        Log("CaptureFromSourceUi: EnableSource succeeded; vendor UI should open now.");
    }

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

                var token = _uploadToken;
                var url = _uploadUrl;
                if (!string.IsNullOrEmpty(token) && !string.IsNullOrEmpty(url))
                {
                    var pathToUpload = outPath;
                    var index = _xferCount;
                    _ = Task.Run(async () =>
                    {
                        var msg = await UploadToBridgeAsync(pathToUpload, token, url, index);
                        if (msg != null)
                            await SendJson(msg);
                    });
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

    private static async Task<object?> UploadToBridgeAsync(string filePath, string uploadToken, string uploadUrl, int index)
    {
        try
        {
            var baseUrl = uploadUrl.TrimEnd('/');
            var endpoint = $"{baseUrl}/imaging/assets/upload-bridge";
            using var content = new MultipartFormDataContent();
            var fileBytes = await File.ReadAllBytesAsync(filePath);
            var fileName = Path.GetFileName(filePath);
            content.Add(new ByteArrayContent(fileBytes), "file", fileName);

            using var request = new HttpRequestMessage(HttpMethod.Post, endpoint);
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", uploadToken);
            request.Content = content;

            var response = await _httpClient.SendAsync(request, CancellationToken.None);
            if (!response.IsSuccessStatusCode)
            {
                var body = await response.Content.ReadAsStringAsync(CancellationToken.None);
                return new { type = "error", message = $"Upload failed: {response.StatusCode} - {body}" };
            }
            var json = await response.Content.ReadAsStringAsync(CancellationToken.None);
            using var doc = JsonDocument.Parse(json);
            var assetId = doc.RootElement.TryGetProperty("assetId", out var idEl) ? idEl.GetInt32() : 0;
            return new { type = "imageUploaded", assetId, index };
        }
        catch (Exception ex)
        {
            return new { type = "error", message = $"Upload failed: {ex.Message}" };
        }
    }

    private static void OnSourceDisabled(object? sender, dynamic e)
    {
        Log("OnSourceDisabled: capture session ended, transfers=" + _xferCount);
        _uploadToken = null;
        _uploadUrl = null;
        try
        {
            var elapsedMs = _watch.ElapsedMilliseconds;

            var sourceStr = e?.ProductName?.ToString() ?? "";
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
                tcs.SetResult(); // still resolve
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
