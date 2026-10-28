<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Algozes de Anhangá</title>
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Pixelify+Sans:wght@400;600&family=VT323&display=swap" rel="stylesheet">
<style>
  :root { --bg: #000; }
  html, body { margin: 0; height: 100%; background: var(--bg); overflow: hidden; }
  body { display: flex; align-items: center; justify-content: center; touch-action: manipulation; }
  #screen {
    image-rendering: pixelated; image-rendering: crisp-edges;
    width: min(100vw, calc(100vh * 16 / 9)); height: auto; aspect-ratio: 384 / 216;
    background: #000; display: block;
  }
</style>
</head>
<body>
<canvas id="screen"></canvas>
<script src="js/core.js"></script>
<script src="js/audio.js"></script>
<script src="js/data.js"></script>
<script src="assets/sprites.js"></script>
<script src="js/art.js"></script>
<script src="js/fx.js"></script>
<script src="js/ui.js"></script>
<script src="js/cutscene.js"></script>
<script src="js/battle.js"></script>
<script src="js/opening.js"></script>
<script src="js/main.js"></script>
</body>
</html>
