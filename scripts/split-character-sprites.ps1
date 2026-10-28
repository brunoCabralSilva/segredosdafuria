Add-Type -AssemblyName System.Drawing
$drawingAssembly = [System.Drawing.Bitmap].Assembly.Location

Add-Type -ReferencedAssemblies $drawingAssembly @'
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Collections.Generic;

public static class SpriteSplitter {
  public static void Split(string input, string outputDir, string name) {
    using (var source = new Bitmap(input)) {
      int frameWidth = source.Width / 4;
      for (int frame = 0; frame < 4; frame++) {
        int x0 = frame * frameWidth;
        int width = frame == 3 ? source.Width - x0 : frameWidth;
        using (var image = new Bitmap(width, source.Height, PixelFormat.Format32bppArgb)) {
          using (var graphics = Graphics.FromImage(image)) {
            graphics.DrawImage(source, new Rectangle(0, 0, width, source.Height), new Rectangle(x0, 0, width, source.Height), GraphicsUnit.Pixel);
          }
          RemoveBorderBlack(image);
          Rectangle bounds = FindContent(image);
          if (bounds.Width > 0 && bounds.Height > 0) {
            using (var cropped = image.Clone(bounds, PixelFormat.Format32bppArgb)) {
              cropped.Save(System.IO.Path.Combine(outputDir, name + "-" + (frame + 1).ToString("00") + ".png"), ImageFormat.Png);
            }
          }
        }
      }
    }
  }

  private static bool IsBackground(Color color) {
    // Remove somente o preto do fundo. Tons escuros internos do cabelo,
    // roupa e calçado ficam preservados por não estarem ligados à borda.
    return color.A > 0 && color.R <= 8 && color.G <= 8 && color.B <= 8;
  }

  private static void RemoveBorderBlack(Bitmap image) {
    int width = image.Width, height = image.Height;
    var visited = new bool[width * height];
    var queue = new Queue<Point>();
    Action<int, int> enqueue = (x, y) => {
      int index = y * width + x;
      if (!visited[index] && IsBackground(image.GetPixel(x, y))) {
        visited[index] = true;
        queue.Enqueue(new Point(x, y));
      }
    };
    for (int x = 0; x < width; x++) { enqueue(x, 0); enqueue(x, height - 1); }
    for (int y = 0; y < height; y++) { enqueue(0, y); enqueue(width - 1, y); }
    while (queue.Count > 0) {
      Point p = queue.Dequeue();
      image.SetPixel(p.X, p.Y, Color.Transparent);
      if (p.X > 0) enqueue(p.X - 1, p.Y);
      if (p.X + 1 < width) enqueue(p.X + 1, p.Y);
      if (p.Y > 0) enqueue(p.X, p.Y - 1);
      if (p.Y + 1 < height) enqueue(p.X, p.Y + 1);
    }
  }

  private static Rectangle FindContent(Bitmap image) {
    int left = image.Width, top = image.Height, right = -1, bottom = -1;
    for (int y = 0; y < image.Height; y++) {
      for (int x = 0; x < image.Width; x++) {
        if (image.GetPixel(x, y).A > 0) {
          if (x < left) left = x;
          if (x > right) right = x;
          if (y < top) top = y;
          if (y > bottom) bottom = y;
        }
      }
    }
    return right < left ? Rectangle.Empty : new Rectangle(left, top, right - left + 1, bottom - top + 1);
  }
}
'@

$root = Join-Path $PSScriptRoot '..'
$sourceDir = Join-Path $root 'public\gaming\assets\characters'
$outputDir = Join-Path $sourceDir 'separated'
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

@('Agnes', 'Aruana', 'Caio Nogueira', 'Luena', 'Roberto') | ForEach-Object {
  [SpriteSplitter]::Split((Join-Path $sourceDir ($_.ToString() + '.png')), $outputDir, $_)
}
