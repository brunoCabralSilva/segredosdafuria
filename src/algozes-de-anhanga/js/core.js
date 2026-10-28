// Núcleo: canvas, relógio de jogo (com hit-stop), esperas, tweens e entrada.
const G = window.G = {};
G.W = 384;
G.H = 216;

const params = new URLSearchParams(location.search);
G.params = params;
G.auto = params.has('auto');                 // modo de teste: joga sozinho
G.speed = Number(params.get('speed')) || 1;  // multiplicador de tempo (teste)
G.debug = params.has('debug');
G.mash = params.has('mash') || params.has('teclas');           // teste: aperta Confirmar sem parar (exercita os menus)

// No modo debug, o log também vai pra um <pre> na página (lido pelo teste headless).
if (G.debug) {
  const pre = document.createElement('pre');
  pre.id = 'log'; pre.style.display = 'none';
  document.body.appendChild(pre);
  const log = console.log.bind(console);
  console.log = (...a) => { log(...a); pre.textContent += a.join(' ') + '\n'; };
  addEventListener('error', e => { pre.textContent += `ERRO: ${e.message} @ ${e.filename}:${e.lineno}\n`; });
  addEventListener('unhandledrejection', e => { pre.textContent += `ERRO (promise): ${e.reason && e.reason.stack || e.reason}\n`; });
}

// Estatísticas: o jogo avisa o servidor quando uma partida começa, muda de fase, termina em vitória ou derrota.
// Só no link publicado (http/https) e nunca nos testes automáticos. Sem dados pessoais: um id aleatório por aba.
G.sessao = Math.random().toString(36).slice(2, 12);
G.track = (tipo, extra = {}) => {
  if (!/^https?:/.test(location.protocol) || G.auto || G.mash || params.has('cena') || params.has('debug')) return;
  const body = JSON.stringify({ tipo, sessao: G.sessao, ...extra });
  try {
    if (navigator.sendBeacon && navigator.sendBeacon('/api/evento', new Blob([body], { type: 'application/json' }))) return;
    fetch('/api/evento', { method: 'POST', body, headers: { 'content-type': 'application/json' }, keepalive: true }).catch(() => {});
  } catch (e) { /* estatística nunca atrapalha o jogo */ }
};

G.rand = (a, b) => a + Math.random() * (b - a);
G.randInt = (a, b) => Math.floor(G.rand(a, b + 1));
G.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
G.lerp = (a, b, t) => a + (b - a) * t;

// ---------- Relógio ----------
G.time = 0;        // tempo de jogo (congela no hit-stop)
G.timeScale = 1;   // câmera lenta (<1) nos impactos
G.real = 0;        // tempo real
G.hitstopLeft = 0;
const timers = [];
const tweens = [];

G.wait = (ms) => new Promise(res => timers.push({ at: G.time + ms, res }));
G.hitstop = (ms) => { G.hitstopLeft = Math.max(G.hitstopLeft, ms); };

G.ease = {
  linear: t => t,
  out: t => 1 - (1 - t) * (1 - t),
  in: t => t * t,
  inOut: t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
  back: t => { const c = 1.70158; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); },
};

// Anima propriedades numéricas de `obj` até `to` em `ms`.
G.tween = (obj, to, ms, ease = G.ease.out) => new Promise(res => {
  const from = {};
  for (const k in to) from[k] = obj[k];
  tweens.push({ obj, from, to, ms: Math.max(1, ms), t: 0, ease, res });
});

G.update = (dtReal) => {
  G.real += dtReal;
  if (G.hitstopLeft > 0) { G.hitstopLeft -= dtReal; return; }
  const dt = dtReal * G.speed * G.timeScale;
  G.time += dt;
  for (let i = tweens.length - 1; i >= 0; i--) {
    const tw = tweens[i];
    tw.t += dt;
    const p = Math.min(1, tw.t / tw.ms), e = tw.ease(p);
    for (const k in tw.to) tw.obj[k] = G.lerp(tw.from[k], tw.to[k], e);
    if (p >= 1) { tweens.splice(i, 1); tw.res(); }
  }
  for (let i = timers.length - 1; i >= 0; i--) {
    if (G.time >= timers[i].at) { const t = timers[i]; timers.splice(i, 1); t.res(); }
  }
};

// ---------- Canvas ----------
// A tela lógica continua 384×216 (arte 16-bit), mas o canvas tem o dobro de pixels:
// sprites saem com os mesmos blocos, e o texto ganha resolução "32-bit", bem mais legível.
G.SCALE = 2;
G.canvas = document.getElementById('screen');
G.canvas.width = G.W * G.SCALE;
G.canvas.height = G.H * G.SCALE;
G.ctx = G.canvas.getContext('2d');
G.ctx.imageSmoothingEnabled = false;
G.baseTransform = () => G.ctx.setTransform(G.SCALE, 0, 0, G.SCALE, 0, 0);
G.baseTransform();

G.makeCanvas = (w, h) => {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const x = c.getContext('2d');
  x.imageSmoothingEnabled = false;
  return [c, x];
};

// ---------- Entrada ----------
// Ações: up, down, left, right, ok, back. Regiões clicáveis são registradas a cada frame pela UI.
G.regions = [];
G.region = (x, y, w, h, onClick, onHover) => G.regions.push({ x, y, w, h, onClick, onHover });
const actionListeners = new Set();
G.onAction = (fn) => { actionListeners.add(fn); return () => actionListeners.delete(fn); };
const emit = (a) => { for (const fn of [...actionListeners]) fn(a); };
G.emitAction = emit;
if (G.mash) setInterval(() => emit(Math.random() < .08 ? 'down' : 'ok'), 60);
// Teste roteirizado: ?teclas=down,down,ok,ok,ok avança até o 1º menu do Espelho, digita a sequência e depois segue apertando OK.
if (params.has('teclas')) {
  const seq = params.get('teclas').split(',');
  let phase = 0;
  setInterval(() => {
    if (phase === 0) {
      if (G.ui && G.ui.menu && G.B && G.B.activeId === 'espelho') phase = 1; else emit('ok');
    } else if (phase === 1) {
      if (seq.length) emit(seq.shift()); else phase = 2;
    } else emit('ok');
  }, 150);
}

const KEYMAP = {
  ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
  // A = ação/avançar, S = voltar (Enter/Espaço/Esc continuam funcionando como atalho)
  a: 'ok', A: 'ok', s: 'back', S: 'back',
  Enter: 'ok', ' ': 'ok', z: 'ok', Z: 'ok', Escape: 'back', x: 'back', X: 'back', Backspace: 'back',
};
// F = tela cheia (Esc sai, pelo próprio navegador)
G.toggleFullscreen = () => {
  const d = document;
  if (d.fullscreenElement || d.webkitFullscreenElement) (d.exitFullscreen || d.webkitExitFullscreen).call(d);
  else { const el = d.documentElement; const req = el.requestFullscreen || el.webkitRequestFullscreen; if (req) { const p = req.call(el); if (p && p.catch) p.catch(() => {}); } }
};
addEventListener('keydown', (e) => {
  if ((e.key === 'f' || e.key === 'F') && !e.repeat) { e.preventDefault(); G.toggleFullscreen(); return; }
  const a = KEYMAP[e.key];
  if (!a) return;
  e.preventDefault();
  if (!e.repeat || a !== 'ok') emit(a);
});

const toInternal = (e) => {
  const r = G.canvas.getBoundingClientRect();
  return [(e.clientX - r.left) / r.width * G.W, (e.clientY - r.top) / r.height * G.H];
};
const hitRegion = (x, y) => {
  for (let i = G.regions.length - 1; i >= 0; i--) {
    const r = G.regions[i];
    if (x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h) return r;
  }
  return null;
};
G.canvas.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  const [x, y] = toInternal(e);
  const r = hitRegion(x, y);
  if (r && r.onClick) r.onClick();
  else emit('tap');
});
G.canvas.addEventListener('pointermove', (e) => {
  const [x, y] = toInternal(e);
  const r = hitRegion(x, y);
  G.canvas.style.cursor = r ? 'pointer' : 'default';
  if (r && r.onHover) r.onHover();
});

// Espera o jogador avançar (tecla de confirmar, toque ou clique fora de botões).
G.waitAdvance = () => new Promise(res => {
  if (G.auto) { G.wait(120).then(res); return; }
  const off = G.onAction(a => { if (a === 'ok' || a === 'tap') { off(); res(); } });
});
