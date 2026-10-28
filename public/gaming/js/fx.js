// Game feel: câmera (zoom/foco), tremor, speed lines, flashes, números de dano, faíscas.
G.FIELD_H = 144;
G.BASE_ZOOM = .86; // câmera um pouco afastada: cabe a party inteira e mais cenário
G.cam = { zoom: G.BASE_ZOOM, fx: G.W / 2, fy: G.FIELD_H / 2 };
G.worldToScreen = (x, y) => [(x - G.cam.fx) * G.cam.zoom + G.W / 2, (y - G.cam.fy) * G.cam.zoom + G.FIELD_H / 2];
G.fx = {
  shakeAmt: 0, shakeUntil: 0,
  lines: null,          // { until, dir, color, full }
  flash: { color: '#fff', alpha: 0 },
  fade: { alpha: 0 },
  popups: [],
  sparks: [],
};

G.shake = (amt, ms) => { G.fx.shakeAmt = Math.max(amt, G.real < G.fx.shakeUntil ? G.fx.shakeAmt : 0); G.fx.shakeUntil = G.real + ms; };
G.zoomTo = (zoom, fx = G.W / 2, fy = G.FIELD_H / 2, ms = 200) => G.tween(G.cam, { zoom, fx, fy }, ms, G.ease.inOut);
G.speedLines = (ms, dir = -1, color = 'rgba(255,255,255,.75)', full = false) => { G.fx.lines = { until: G.real + ms, dir, color, full }; };
G.flashScreen = (color = '#fff', alpha = .8, ms = 180) => {
  G.fx.flash.color = color; G.fx.flash.alpha = alpha;
  return G.tween(G.fx.flash, { alpha: 0 }, ms, G.ease.linear);
};
G.fadeTo = (alpha, ms = 300) => G.tween(G.fx.fade, { alpha }, ms, G.ease.linear);

// Número de dano estilo FF: pula, cai e some.
G.popup = (x, y, text, color = '#ffffff', big = false) => G.fx.popups.push({ x, y, text: String(text), color, t0: G.time, big });
G.spark = (x, y, color = '#ffffff', n = 8) => G.fx.sparks.push({ x, y, color, n, t0: G.time, seed: Math.random() * 10 });

G.shakeOffset = () => {
  if (G.real > G.fx.shakeUntil) return [0, 0];
  const a = G.fx.shakeAmt;
  return [Math.round((Math.random() - .5) * a * 2), Math.round((Math.random() - .5) * a * 2)];
};

G.drawWorldFx = (ctx) => {
  // faíscas de impacto
  for (let i = G.fx.sparks.length - 1; i >= 0; i--) {
    const s = G.fx.sparks[i], t = (G.time - s.t0) / 220;
    if (t > 1) { G.fx.sparks.splice(i, 1); continue; }
    ctx.fillStyle = s.color;
    for (let k = 0; k < s.n; k++) {
      const a = k / s.n * Math.PI * 2 + s.seed, r0 = 4 + t * 14, r1 = r0 + 6 * (1 - t);
      for (let r = r0; r < r1; r += 1) ctx.fillRect(Math.round(s.x + Math.cos(a) * r), Math.round(s.y + Math.sin(a) * r), 1, 1);
    }
  }
  (G.fx.overlays || []).forEach(o => o.draw(ctx));
  G.drawMarks(ctx);
  G.drawRingsAura(ctx);
  // números de dano
  ctx.font = G.FONT;
  ctx.textBaseline = 'top';
  for (let i = G.fx.popups.length - 1; i >= 0; i--) {
    const p = G.fx.popups[i], t = G.time - p.t0;
    if (t > 1000) { G.fx.popups.splice(i, 1); continue; }
    const bounce = t < 380 ? -Math.abs(Math.sin(t / 380 * Math.PI)) * 12 : t < 520 ? -Math.abs(Math.sin((t - 380) / 140 * Math.PI)) * 3 : 0;
    const w = ctx.measureText(p.text).width;
    const x = Math.round(p.x - w / 2), y = Math.round(p.y + bounce);
    ctx.globalAlpha = t > 850 ? 1 - (t - 850) / 150 : 1;
    ctx.fillStyle = '#000'; ctx.fillText(p.text, x + 1, y + 1);
    ctx.fillStyle = p.color; ctx.fillText(p.text, x, y);
    ctx.globalAlpha = 1;
  }
};

G.drawScreenFx = (ctx, fieldOnly) => {
  const L = G.fx.lines;
  if (L && G.real < L.until) {
    const h = L.full || !fieldOnly ? G.H : G.FIELD_H;
    ctx.fillStyle = L.color;
    for (let i = 0; i < 22; i++) {
      const y = (i * 37 + 11) % h, len = 24 + (i * 29) % 70;
      const x = ((i * 97 + G.real * .9 * (L.dir < 0 ? 1 : -1)) % (G.W + 140) + (G.W + 140)) % (G.W + 140) - 70;
      ctx.fillRect(Math.round(L.dir < 0 ? G.W - x : x), y, len, 1);
    }
  }
  if (G.fx.flash.alpha > 0) {
    ctx.globalAlpha = G.fx.flash.alpha; ctx.fillStyle = G.fx.flash.color; ctx.fillRect(0, 0, G.W, G.H); ctx.globalAlpha = 1;
  }
};

// ---------- Marcas de golpe por tipo de ataque ----------
// type: bite | claw | peck | blade | stab | shot | beam | rocket. dir: -1 golpe vindo da direita (party), 1 da esquerda.
G.fx.marks = [];
G.hitMark = (type, x, y, { dir = -1, crit = false, from = null } = {}) =>
  G.fx.marks.push({ type, x, y, dir, crit, from, t0: G.time, dur: ({ headbutt: 500, flame: 1300, acid: 900, spikes: 1100, plasma: 700, ice: 700, breath: 1100 })[type] || (crit ? 420 : 280) });

// Jato de fogo: bolas de labareda saindo da origem, crescendo e subindo, em camadas (roxo escuro → roxo → rosa → branco).
G.fireStream = (ctx, fx, fy, tx, ty, reach = 1, scale = 1) => {
  for (let k = 0; k < 34; k++) {
    const s = ((k / 34) + G.real / 700) % 1;
    if (s > reach) continue;
    const x = G.lerp(fx, tx, s) + Math.sin(G.real / 90 + k * 2.1) * 4 * s;
    const y = G.lerp(fy, ty, s) - s * s * 10 + Math.sin(G.real / 70 + k) * 3 * s;
    const r = (3 + s * 16) * scale;
    [['#4a0a80', 1], ['#9030d8', .78], ['#e090ff', .5], ['#fff4ff', .24]].forEach(([c, f]) => {
      ctx.fillStyle = c; ctx.beginPath(); ctx.arc(Math.round(x), Math.round(y), Math.max(1, r * f), 0, 7); ctx.fill();
    });
    if (k % 3 === 0) G.flameTongue(ctx, x, y - r * .6, r * 1.4, r * .9, k);
  }
};

// Jato tóxico: bolhas verdes grossas saindo da boca em arco, com gotas pingando e brilho ácido no miolo.
G.toxicStream = (ctx, fx, fy, tx, ty, reach = 1, scale = 1) => {
  for (let k = 0; k < 40; k++) {
    const s = ((k / 40) + G.real / 520) % 1;
    if (s > reach) continue;
    const x = G.lerp(fx, tx, s) + Math.sin(G.real / 80 + k * 1.7) * 3 * s;
    const y = G.lerp(fy, ty, s) - Math.sin(s * Math.PI) * 26 + Math.sin(G.real / 60 + k) * 2 * s;
    const r = (3 + s * 9) * scale;
    [['#1e4a10', 1], ['#4a9a20', .8], ['#8ae040', .55], ['#e0ffa0', .25]].forEach(([c, f]) => {
      ctx.fillStyle = c; ctx.beginPath(); ctx.arc(Math.round(x), Math.round(y), Math.max(1, r * f), 0, 7); ctx.fill();
    });
    if (k % 4 === 0) { ctx.fillStyle = '#b0ff60'; ctx.fillRect(Math.round(x), Math.round(y + r + ((G.real / 4 + k * 9) % 14)), 2, 3); }
  }
};

// Fumaça tóxica subindo de um corpo (fica 1 turno em quem levou o vômito).
G.drawToxicSmoke = (ctx, x, y, w, h) => {
  for (let i = 0; i < 10; i++) {
    const t = ((G.real / 1400) + i / 10) % 1;
    const px = x + Math.sin(i * 2.3 + G.real / 500) * w * .4, py = y - h * .2 - t * h * .9;
    const r = 3 + t * 7;
    ctx.globalAlpha = (1 - t) * .55;
    ctx.fillStyle = i % 3 ? '#5aa030' : '#9ae060';
    ctx.beginPath(); ctx.arc(Math.round(px), Math.round(py), r, 0, 7); ctx.fill();
  }
  ctx.globalAlpha = 1;
};

// Língua de chama púrpura (gota invertida tremulando): núcleo branco/rosa, corpo roxo, ponta escura.
G.flameTongue = (ctx, x, y, h, w, seed = 0) => {
  const fl = Math.sin(G.real / 60 + seed * 1.7) * .15 + Math.sin(G.real / 97 + seed) * .1;
  for (let yy = 0; yy < h; yy++) {
    const t = yy / h;
    const ww = w * Math.pow(Math.sin(Math.PI * Math.min(1, (1 - t) * .9 + .1)), .8) * (1 - t * .5);
    const sway = Math.sin(t * 5 + G.real / 80 + seed) * t * w * (.4 + fl);
    ctx.fillStyle = t < .2 ? '#fff0ff' : t < .38 ? '#f0a8ff' : t < .7 ? '#b040f0' : '#5a1090';
    ctx.fillRect(Math.round(x - ww / 2 + sway), Math.round(y - yy), Math.max(1, Math.round(ww)), 1);
  }
};

G.drawMarks = (ctx) => {
  for (let i = G.fx.marks.length - 1; i >= 0; i--) {
    const m = G.fx.marks[i], p = (G.time - m.t0) / m.dur;
    if (p > 1) { G.fx.marks.splice(i, 1); continue; }
    const k = m.crit ? 1.6 : 1, a = 1 - Math.max(0, p - .5) * 2;
    ctx.globalAlpha = a;
    const line = (x0, y0, x1, y1, c, w = 1) => {
      const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0));
      ctx.fillStyle = c;
      for (let j = 0; j <= n; j++) ctx.fillRect(Math.round(G.lerp(x0, x1, j / n)), Math.round(G.lerp(y0, y1, j / n)), w, w);
    };
    const grow = Math.min(1, p * 3);
    if (m.type === 'claw') {
      for (let s = -1; s <= 1; s++) {
        const ox = s * 5 * k, len = 22 * k * grow;
        line(m.x + ox - len / 2 * m.dir * -1, m.y - len / 2, m.x + ox + len / 2 * m.dir * -1, m.y + len / 2, s ? '#ffffff' : '#ff5050', m.crit ? 2 : 1);
      }
    } else if (m.type === 'bite') {
      const gap = 14 * k * (1 - grow);
      ctx.fillStyle = '#f4f0e0';
      for (let j = -3; j <= 3; j++) {
        const tx = m.x + j * 4 * k;
        for (let h = 0; h < 5 * k; h++) { ctx.fillRect(Math.round(tx), Math.round(m.y - gap - 6 * k + h), Math.max(1, 3 - h / 2), 1); ctx.fillRect(Math.round(tx + 2), Math.round(m.y + gap + 6 * k - h), Math.max(1, 3 - h / 2), 1); }
      }
      if (grow >= 1) { ctx.fillStyle = '#c01818'; ctx.fillRect(m.x - 12 * k, m.y - 1, 24 * k, 2); }
    } else if (m.type === 'peck') {
      const r = 12 * k * grow;
      for (let j = 0; j < 8; j++) { const an = j / 8 * Math.PI * 2; line(m.x, m.y, m.x + Math.cos(an) * r, m.y + Math.sin(an) * r, j % 2 ? '#c8b0ff' : '#ffffff'); }
      line(m.x - m.dir * -18 * k, m.y, m.x, m.y, '#e0e0f0', 2);
    } else if (m.type === 'blade') {
      const len = 40 * k * grow;
      line(m.x - len / 2, m.y + len / 3, m.x + len / 2, m.y - len / 3, '#eef4ff', m.crit ? 3 : 2);
      line(m.x - len / 2, m.y + len / 3 + 2, m.x + len / 2, m.y - len / 3 + 2, '#8aa0d0');
    } else if (m.type === 'stab') {
      const len = 20 * k * grow;
      line(m.x + m.dir * -len, m.y, m.x, m.y, '#ffffff', 2);
      ctx.fillStyle = '#ffe070'; ctx.fillRect(m.x - 2, m.y - 2, 4, 4);
    } else if (m.type === 'spikes') {
      // estacas de sombra: espinhos grandes e cristalinos brotando do chão em ângulos diferentes, em sequência
      ctx.globalAlpha = 1;
      const base = m.y;
      ctx.fillStyle = 'rgba(30,0,50,.6)'; ctx.beginPath(); ctx.ellipse(m.x, base, 44 * k, 7, 0, 0, 7); ctx.fill();
      for (let j = 0; j < 9; j++) {
        const delay = j * .06, q = G.clamp((p - delay) * 4, 0, 1);
        if (q <= 0) continue;
        const ang = (-38 + ((j * 29) % 76)) * Math.PI / 180;           // inclinação
        const len = (34 + ((j * 13) % 30)) * k * G.ease.back(Math.min(1, q)); // altura
        const bx = m.x + (j - 4) * 9 * k, wid = 7 + (j % 3) * 2;
        const tipX = bx + Math.sin(ang) * len, tipY = base - Math.cos(ang) * len;
        const nx = Math.cos(ang) * wid / 2, ny = Math.sin(ang) * wid / 2;
        const tri = (c, sh) => { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(bx - nx + sh, base - ny); ctx.lineTo(tipX + sh, tipY); ctx.lineTo(bx + nx + sh, base + ny); ctx.closePath(); ctx.fill(); };
        tri('#05000a', 1);                    // contorno/sombra
        tri(j % 2 ? '#2a0a48' : '#3a1060', 0); // corpo
        ctx.strokeStyle = '#c890ff'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(bx - nx * .3, base); ctx.lineTo(tipX, tipY); ctx.stroke(); // aresta brilhando
        ctx.fillStyle = '#f0d8ff'; ctx.fillRect(Math.round(tipX) - 1, Math.round(tipY) - 1, 2, 2);
      }
      // pedrinhas e poeira subindo
      for (let j = 0; j < 16; j++) {
        const t = G.clamp(p * 1.5 - j * .02, 0, 1);
        ctx.fillStyle = j % 2 ? '#6a4a8a' : '#2a1a3a';
        ctx.fillRect(Math.round(m.x + (j - 8) * 6), Math.round(base - t * (10 + (j % 5) * 6) + t * t * 12), 2, 2);
      }
    } else if (m.type === 'flame' && m.from) {
      // fogo púrpura do Uktena até o alvo, e o alvo sendo engolido pelas labaredas
      const [fx, fy] = m.from;
      const reach = Math.min(1, p * 2);
      ctx.globalAlpha = 1;
      G.fireStream(ctx, fx, fy, m.x, m.y, reach, 1);
      if (reach >= 1) for (let j = 0; j < 6; j++) G.flameTongue(ctx, m.x - 18 + j * 7, m.y + 16, 30 + (j % 3) * 8, 10, j + 40);
    } else if (m.type === 'plasma' && m.from) {
      // bola de plasma dos canhões: viaja com rastro e explode em anéis
      const [fx, fy] = m.from;
      const t = Math.min(1, p * 1.7);
      const x = G.lerp(fx, m.x, t), y = G.lerp(fy, m.y, t);
      if (t < 1) {
        for (let j = 6; j >= 0; j--) {
          const tx = G.lerp(fx, m.x, Math.max(0, t - j * .04)), ty = G.lerp(fy, m.y, Math.max(0, t - j * .04));
          ctx.globalAlpha = .12 + (6 - j) * .1;
          ctx.fillStyle = '#4aa8ff'; ctx.beginPath(); ctx.arc(tx, ty, 9 - j, 0, 7); ctx.fill();
        }
        ctx.globalAlpha = 1;
        const g = ctx.createRadialGradient(x, y, 1, x, y, 14);
        g.addColorStop(0, '#ffffff'); g.addColorStop(.4, '#bfe8ff'); g.addColorStop(1, 'rgba(60,140,255,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 14, 0, 7); ctx.fill();
      } else {
        const q = (p - 1 / 1.7) / (1 - 1 / 1.7);
        ctx.globalAlpha = Math.max(0, 1 - q);
        const g = ctx.createRadialGradient(m.x, m.y, 1, m.x, m.y, 10 + q * 36);
        g.addColorStop(0, '#ffffff'); g.addColorStop(.5, '#7ac8ff'); g.addColorStop(1, 'rgba(40,120,255,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(m.x, m.y, 10 + q * 36, 0, 7); ctx.fill();
        for (let j = 0; j < 14; j++) { const an = j / 14 * Math.PI * 2; line(m.x + Math.cos(an) * q * 14, m.y + Math.sin(an) * q * 14, m.x + Math.cos(an) * q * 34, m.y + Math.sin(an) * q * 34, '#e0f4ff'); }
      }
    } else if (m.type === 'breath' && m.from) {
      const [fx, fy] = m.from;
      for (let j = 0; j < 20; j++) {
        const t = G.clamp(p * 1.3 - j * .02, 0, 1);
        const x = G.lerp(fx, m.x, t) + Math.sin(j * 2 + G.real / 200) * 8, y = G.lerp(fy, m.y, t) + Math.sin(t * 3.14) * -12;
        ctx.globalAlpha = (1 - Math.abs(t - .5) * 2) * .8;
        ctx.fillStyle = j % 3 ? '#9ff0e8' : '#ffffff';
        ctx.fillRect(Math.round(x), Math.round(y), 2, 2);
      }
      ctx.globalAlpha = 1;
    } else if (m.type === 'ice') {
      // estilhaços de gelo explodindo em volta do alvo + anel de geada
      const q = Math.min(1, p * 2);
      for (let j = 0; j < 12; j++) {
        const an = j / 12 * Math.PI * 2 + .3, r0 = 4 + q * 10, r1 = r0 + 10 + (j % 3) * 6;
        const x0 = m.x + Math.cos(an) * r0, y0 = m.y + Math.sin(an) * r0, x1 = m.x + Math.cos(an) * r1, y1 = m.y + Math.sin(an) * r1;
        ctx.fillStyle = j % 2 ? '#e8faff' : '#8ad8ff';
        ctx.beginPath(); ctx.moveTo(x0 - Math.sin(an) * 3, y0 + Math.cos(an) * 3); ctx.lineTo(x1, y1); ctx.lineTo(x0 + Math.sin(an) * 3, y0 - Math.cos(an) * 3); ctx.closePath(); ctx.fill();
      }
      ctx.strokeStyle = '#c8f0ff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(m.x, m.y + 10, 16 + q * 26, 5 + q * 6, 0, 0, 7); ctx.stroke();
    } else if (m.type === 'acid' && m.from) {
      // jorro verde em arco, com gotas e respingos
      const [fx, fy] = m.from;
      const reach = Math.min(1, p * 1.8);
      for (let j = 0; j < 40; j++) {
        const t = (j / 40) * reach;
        const x = G.lerp(fx, m.x, t), y = G.lerp(fy, m.y, t) - Math.sin(t * Math.PI) * 30 + Math.sin(j) * 2;
        ctx.fillStyle = j % 3 ? '#80e040' : '#d0ff90';
        ctx.fillRect(Math.round(x), Math.round(y), 3, 3);
      }
      if (reach >= 1) for (let j = 0; j < 14; j++) {
        const an = -Math.PI / 2 + G.rand(-1.2, 1.2), r = G.rand(3, 16) * (p - .5) * 2;
        ctx.fillStyle = j % 2 ? '#b0ff60' : '#5aa020';
        ctx.fillRect(Math.round(m.x + Math.cos(an) * r), Math.round(m.y + Math.sin(an) * r), 2, 2);
      }
    } else if (m.type === 'headbutt') {
      // cabeçada: estrela de impacto grossa + estilhaços de metal
      const q = Math.min(1, p * 2.5);
      ctx.fillStyle = '#fff4c0';
      ctx.beginPath();
      for (let j = 0; j < 16; j++) { const an = j / 16 * Math.PI * 2, r = (j % 2 ? 8 : 26) * q * k; ctx.lineTo(m.x + Math.cos(an) * r, m.y + Math.sin(an) * r); }
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(m.x, m.y, 7 * q, 0, 7); ctx.fill();
      for (let j = 0; j < 10; j++) { const an = j * 2.4, r = 10 + q * 30; ctx.fillStyle = j % 2 ? '#a8b0c0' : '#ffe070'; ctx.fillRect(Math.round(m.x + Math.cos(an) * r), Math.round(m.y + Math.sin(an) * r), 2, 2); }
    } else if ((m.type === 'shot' || m.type === 'beam' || m.type === 'rocket') && m.from) {
      const [fx, fy] = m.from;
      const hx = G.lerp(fx, m.x, Math.min(1, p * 2.5)), hy = G.lerp(fy, m.y, Math.min(1, p * 2.5));
      if (m.type === 'beam') { line(fx, fy, hx, hy, '#bfe8ff', 3); line(fx, fy + 1, hx, hy + 1, '#4aa8ff', 1); }
      else if (m.type === 'shot') { line(G.lerp(fx, hx, .7), G.lerp(fy, hy, .7), hx, hy, '#fff4a0', 1); ctx.fillStyle = '#ffe070'; ctx.fillRect(fx - 2, fy - 2, 5, 5); }
      else { ctx.fillStyle = '#d0d0d8'; ctx.fillRect(Math.round(hx) - 2, Math.round(hy) - 1, 5, 3); ctx.fillStyle = '#ff9030'; ctx.fillRect(Math.round(hx) - 5, Math.round(hy), 3, 1); }
    }
    ctx.globalAlpha = 1;
  }
};

// ---------- Câmera lenta ----------
G.slowmo = async (scale, ms) => { G.timeScale = scale; await G.wait(ms * scale); G.timeScale = 1; };

// ---------- Ondas de choque, auras e rastros ----------
G.fx.rings = [];
G.ring = (x, y, color = '#ffffff', maxR = 60, ms = 450) => G.fx.rings.push({ x, y, color, maxR, ms, t0: G.time });
G.fx.aura = [];
// Partículas subindo em volta de um ponto (energia de transformação)
G.auraBurst = (x, y, color, n = 30, spread = 26) => {
  for (let i = 0; i < n; i++) G.fx.aura.push({ x: x + G.rand(-spread, spread), y: y + G.rand(-10, 20), vy: -G.rand(.02, .07), vx: G.rand(-.01, .01), color, t0: G.time, life: G.rand(400, 900), s: G.randInt(1, 3) });
};

G.drawRingsAura = (ctx) => {
  for (let i = G.fx.rings.length - 1; i >= 0; i--) {
    const r = G.fx.rings[i], p = (G.time - r.t0) / r.ms;
    if (p > 1) { G.fx.rings.splice(i, 1); continue; }
    const rad = r.maxR * G.ease.out(p);
    ctx.globalAlpha = 1 - p;
    ctx.fillStyle = r.color;
    for (let a = 0; a < 64; a++) {
      const an = a / 64 * Math.PI * 2;
      ctx.fillRect(Math.round(r.x + Math.cos(an) * rad), Math.round(r.y + Math.sin(an) * rad * .45), 2, 2);
    }
    ctx.globalAlpha = 1;
  }
  for (let i = G.fx.aura.length - 1; i >= 0; i--) {
    const a = G.fx.aura[i], t = G.time - a.t0;
    if (t > a.life) { G.fx.aura.splice(i, 1); continue; }
    ctx.globalAlpha = 1 - t / a.life;
    ctx.fillStyle = a.color;
    ctx.fillRect(Math.round(a.x + a.vx * t), Math.round(a.y + a.vy * t), a.s, a.s);
    ctx.globalAlpha = 1;
  }
};

// ---------- Passarinhos do catatônico ----------
G.drawDizzyBirds = (ctx, x, y) => {
  for (let i = 0; i < 2; i++) {
    const an = G.real / 380 + i * Math.PI;
    const bx = Math.round(x + Math.cos(an) * 12), by = Math.round(y + Math.sin(an) * 4);
    const flap = Math.floor(G.real / 120 + i) % 2;
    ctx.fillStyle = '#0a0a14';
    ctx.fillRect(bx - 3, by - 1, 7, 4);
    ctx.fillStyle = '#ffe040';
    ctx.fillRect(bx - 2, by, 5, 2);            // corpo
    ctx.fillRect(bx + (Math.cos(an) > 0 ? 3 : -3), by, 1, 1); // bico
    ctx.fillStyle = '#ffb000'; ctx.fillRect(bx + (Math.cos(an) > 0 ? 3 : -3), by, 1, 1);
    ctx.fillStyle = '#fff4a0';
    if (flap) { ctx.fillRect(bx - 1, by - 2, 3, 1); } else { ctx.fillRect(bx - 1, by + 2, 3, 1); } // asa
  }
};

// ---------- Fundo animado dos cut-ins (raios suaves girando, brilho central, poeira, vinheta) ----------
const BURST = {
  impacto: { base: ['#1a0406', '#3a0a0e'], ray: [255, 70, 60], glow: [255, 140, 90], dust: '#ffb080' },
  uktena:  { base: ['#0c0418', '#22083e'], ray: [180, 110, 255], glow: [220, 170, 255], dust: '#e0c0ff' },
  fomor:   { base: ['#040a04', '#10240a'], ray: [140, 220, 90], glow: [200, 255, 140], dust: '#c8ff90' },
  mente:   { base: ['#06040c', '#140a24'], ray: [150, 110, 220], glow: [190, 160, 255], dust: '#b8a0ff' },
};
let burstCache = null;
G.drawSunburst = (ctx, kind) => {
  const k = BURST[kind];
  if (!k) return false;
  const cx = G.W / 2, cy = G.H * .46;
  // base: gradiente radial escuro
  const g = ctx.createRadialGradient(cx, cy, 10, cx, cy, 260);
  g.addColorStop(0, k.base[1]); g.addColorStop(1, k.base[0]);
  ctx.fillStyle = g; ctx.fillRect(0, 0, G.W, G.H);
  // raios: faixas finas de largura e brilho variados, girando devagar, com queda de alfa pra fora
  const rot = G.real / 9000;
  for (let i = 0; i < 36; i++) {
    const seed = (i * 97.13) % 1, w = .018 + seed * .05;
    const a0 = i / 36 * Math.PI * 2 + rot * (i % 2 ? 1 : -.6);
    const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 300);
    const al = .05 + seed * .12 + Math.sin(G.real / 700 + i) * .03;
    rg.addColorStop(0, `rgba(${k.ray.join(',')},${al * 1.8})`);
    rg.addColorStop(.5, `rgba(${k.ray.join(',')},${al})`);
    rg.addColorStop(1, `rgba(${k.ray.join(',')},0)`);
    ctx.fillStyle = rg;
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a0) * 320, cy + Math.sin(a0) * 320);
    ctx.lineTo(cx + Math.cos(a0 + w) * 320, cy + Math.sin(a0 + w) * 320);
    ctx.fill();
  }
  // brilho central pulsando
  const pulse = .5 + Math.sin(G.real / 400) * .15;
  const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 90);
  cg.addColorStop(0, `rgba(${k.glow.join(',')},${.35 * pulse})`);
  cg.addColorStop(1, `rgba(${k.glow.join(',')},0)`);
  ctx.fillStyle = cg; ctx.fillRect(0, 0, G.W, G.H);
  // poeira flutuando
  if (!burstCache) burstCache = Array.from({ length: 60 }, () => [Math.random() * G.W, Math.random() * G.H, Math.random()]);
  ctx.fillStyle = k.dust;
  burstCache.forEach(([x, y, s]) => {
    ctx.globalAlpha = .25 + s * .45;
    const px = (x + G.real * .01 * (s + .3)) % G.W, py = (y - G.real * .008 * (s + .2) + G.H * 10) % G.H;
    ctx.fillRect(Math.round(px), Math.round(py), s > .8 ? 2 : 1, s > .8 ? 2 : 1);
  });
  ctx.globalAlpha = 1;
  // pontilhado 16-bit + vinheta
  ctx.fillStyle = 'rgba(0,0,0,.18)';
  for (let y = 0; y < G.H; y += 2) ctx.fillRect(0, y, G.W, 1);
  const v = ctx.createRadialGradient(cx, cy, 120, cx, cy, 260);
  v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.7)');
  ctx.fillStyle = v; ctx.fillRect(0, 0, G.W, G.H);
  return true;
};
