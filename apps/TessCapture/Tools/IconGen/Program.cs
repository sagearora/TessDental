using ImageMagick;

// Assets folder is at simplecapture.win/Assets; when run from IconGen/bin/Debug/net8.0 that's 5 levels up then Assets
var assetsDir = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "..", "Assets"));
if (!Directory.Exists(assetsDir))
    assetsDir = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", "Assets"));
var svgPath = Path.Combine(assetsDir, "TessDentalLogo.svg");
var icoPath = Path.Combine(assetsDir, "TessDental.ico");

if (!File.Exists(svgPath))
{
    Console.Error.WriteLine("SVG not found: " + svgPath);
    return 1;
}

using var image = new MagickImage(svgPath);
image.Format = MagickFormat.Ico;
image.Settings.SetDefine("icon:auto-resize", "256,48,32,16");
image.Write(icoPath);

Console.WriteLine("Written: " + icoPath);
return 0;
