Add-Type -AssemblyName System.Drawing
$drawingAssembly = [System.Drawing.Bitmap].Assembly.Location

Add-Type -ReferencedAssemblies $drawingAssembly @'
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;

public static class PixelCharacterBuilder {
  public static void Convert(string input, string output) {
    using (var source = new Bitmap(input))
    using (var result = new Bitmap(63, 53, PixelFormat.Format32bppArgb)) {
      using (var graphics = Graphics.FromImage(result)) {
        graphics.CompositingMode = CompositingMode.SourceCopy;
        graphics.Clear(Color.Transparent);
        graphics.InterpolationMode = InterpolationMode.NearestNeighbor;
        graphics.PixelOffsetMode = PixelOffsetMode.Half;
        graphics.SmoothingMode = SmoothingMode.None;
        double scale = Math.Min(63.0 / source.Width, 53.0 / source.Height);
        int width = Math.Max(1, (int)Math.Round(source.Width * scale));
        int height = Math.Max(1, (int)Math.Round(source.Height * scale));
        int x = (63 - width) / 2;
        int y = (53 - height) / 2;
        graphics.DrawImage(source, new Rectangle(x, y, width, height), 0, 0, source.Width, source.Height, GraphicsUnit.Pixel);
      }
      result.Save(output, ImageFormat.Png);
    }
  }
}
'@

$root = Join-Path $PSScriptRoot '..'
$sourceDir = Join-Path $root 'public\gaming\assets\characters\separated'
$outputDir = Join-Path $root 'public\gaming\assets\characters\pixel-characters'
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

@('Agnes', 'Aruana', 'Caio Nogueira', 'Luena', 'Roberto') | ForEach-Object {
  $name = $_
  1..3 | ForEach-Object {
    $frame = $_.ToString('00')
    [PixelCharacterBuilder]::Convert(
      (Join-Path $sourceDir ($name + '-' + $frame + '.png')),
      (Join-Path $outputDir ($name + '-' + $frame + '.png'))
    )
  }
}
