// Arte: manifesto de sprites/fundos + placeholders em pixel art desenhados em código.
// Pra trocar por arte final: coloque a PNG em assets/ e preencha `src` (e fw/fh/frames) na entrada do MANIFESTO.
(() => {
  const OUTLINE = '#0b0a14';

  // Pintor de pixel: desenha formas numa grade, depois aplica contorno automático.
  function paint(w, h, fn, { outline = OUTLINE, flip = false } = {}) {
    const g = Array.from({ length: h }, () => Array(w).fill(null));
    const set = (x, y, c) => { x |= 0; y |= 0; if (c && x >= 0 && y >= 0 && x < w && y < h) g[y][x] = c; };
    const inPoly = (x, y, pts) => {
      let ins = false;
      for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
        const [xi, yi] = pts[i], [xj, yj] = pts[j];
        if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) ins = !ins;
      }
      return ins;
    };
    const P = {
      px: set,
      rect(x0, y0, x1, y1, c) { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) set(x, y, typeof c === 'function' ? c(x, y) : c); },
      // c pode ser função (nx, ny) => cor, com nx/ny normalizados em -1..1 (sombreamento)
      ell(cx, cy, rx, ry, c) {
        for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
          for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
            const nx = (x - cx) / rx, ny = (y - cy) / ry;
            if (nx * nx + ny * ny <= 1) set(x, y, typeof c === 'function' ? c(nx, ny) : c);
          }
      },
      poly(pts, c) {
        const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
        const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
        for (let y = Math.floor(y0); y <= y1; y++) for (let x = Math.floor(x0); x <= x1; x++)
          if (inPoly(x + .5, y + .5, pts)) set(x, y, typeof c === 'function' ? c(x, y) : c);
      },
      line(x0, y0, x1, y1, c) {
        const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1;
        for (let i = 0; i <= n; i++) set(Math.round(G.lerp(x0, x1, i / n)), Math.round(G.lerp(y0, y1, i / n)), c);
      },
      get: (x, y) => g[y] && g[y][x],
    };
    fn(P);
    const [cv, cx] = G.makeCanvas(w, h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      let c = g[y][x];
      if (!c && outline) {
        const n = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([ax, ay]) => g[y + ay] && g[y + ay][x + ax]);
        if (n) c = outline;
      }
      if (c) { cx.fillStyle = c; cx.fillRect(flip ? w - 1 - x : x, y, 1, 1); }
    }
    return cv;
  }
  G.paint = paint;

  const shade = (light, mid, dark) => (nx, ny) => ny < -.5 ? light : (nx > .45 || ny > .6) ? dark : mid;

  // ---------- Humanoide (virado pra esquerda) 26×50 ----------
  function human(o) {
    return paint(26, 50, P => {
      const skinD = o.skinD || o.skin;
      if (o.hairLong) P.rect(14, 5, 18, o.hairLong, o.hair);            // cabelo comprido atrás
      P.rect(17, 16, 19, 29, o.top2);                                   // braço de trás
      P.rect(14, 32, 17, 46, o.bottom2 || o.bottom);                    // perna de trás
      P.rect(14, 46, 18, 48, o.shoes);
      P.rect(9, 32, 12, 46, o.bottom);                                  // perna da frente
      P.rect(8, 46, 12, 48, o.shoes);
      if (o.coat) P.poly([[8, 15], [19, 15], [20, 39], [7, 39]], (x) => x > 15 ? o.top2 : o.top);
      P.poly([[8, 15], [18, 15], [17, 32], [9, 32]], (x) => x > 15 ? o.top2 : o.top);
      if (o.shirt) { P.rect(11, 15, 12, 24, o.shirt); if (o.tie) P.rect(11, 16, 11, 22, o.tie); }
      P.rect(12, 13, 14, 14, skinD);                                    // pescoço
      P.ell(13, 8, 4.5, 5.2, (nx) => nx > .45 ? skinD : o.skin);        // cabeça
      P.ell(13, 6, 5, 4.2, (nx, ny) => (ny < .1 || nx > .55) ? o.hair : null); // topo do cabelo
      if (o.visor) P.rect(8, 7, 12, 8, o.visor); else P.px(10, 8, '#15121a');
      P.rect(7, 16, 9, 28, o.top);                                      // braço da frente
      P.rect(7, 29, 9, 30, o.skin);                                     // mão
      if (o.marks) [[8, 18], [8, 22], [8, 26], [11, 10], [12, 11], [10, 19], [14, 24], [13, 18], [10, 36], [15, 40]]
        .forEach(([x, y]) => P.px(x, y, o.marks));
      if (o.weapon === 'dagger') { P.line(7, 29, 3, 25, '#dfe4f0'); P.px(8, 30, '#6b4a2a'); }
      if (o.weapon === 'klaive') { P.line(7, 29, 1, 19, '#eef2ff'); P.line(8, 29, 2, 19, '#aab3c8'); P.rect(7, 29, 9, 30, '#c9a040'); }
      if (o.weapon === 'knife') { P.line(7, 30, 2, 30, '#f4f7ff'); P.px(1, 30, '#ffffff'); P.rect(8, 29, 9, 31, '#2a2a30'); }
    }, { flip: !!o.flip });
  }

  // ---------- Lobisomem Crinos (virado pra esquerda) 46×58 ----------
  function crinos(f) {
    return paint(46, 58, P => {
      P.poly([[26, 36], [33, 36], [34, 48], [31, 56], [27, 56], [28, 48]], f.dark);
      P.rect(26, 55, 34, 57, f.dark);
      P.poly([[30, 20], [37, 22], [35, 40], [31, 44], [28, 40]], f.dark);
      P.ell(25, 27, 12, 13, shade(f.light, f.mid, f.dark));
      P.poly([[17, 36], [25, 36], [25, 47], [22, 56], [17, 56], [19, 47]], f.mid);
      P.rect(15, 55, 23, 57, f.mid);
      for (let i = 0; i < 7; i++) P.px(28 + i * 1.5, 15 + i * 1.2, f.dark);
      P.ell(13, 15, 7, 6, shade(f.light, f.mid, f.dark));
      P.poly([[1, 17], [9, 12], [10, 21], [3, 21]], f.mid);
      P.rect(3, 20, 8, 20, '#f0ead8');
      P.px(1, 17, '#111'); P.px(2, 17, '#111');
      P.poly([[10, 3], [15, 10], [8, 10]], f.dark);
      P.poly([[15, 4], [20, 11], [13, 11]], f.dark);
      P.px(9, 13, f.eye); P.px(10, 13, f.eye);
      P.poly([[14, 20], [21, 20], [17, 36], [10, 44], [7, 43]], f.mid);
      [[6, 44], [8, 45], [10, 45]].forEach(([x, y]) => P.px(x, y, '#f0ead8'));
    });
  }

  // ---------- Lobo (Sangria) 58×36 ----------
  function wolf(f) {
    return paint(58, 36, P => {
      P.poly([[46, 12], [57, 5], [56, 12], [48, 18]], f.dark);
      P.rect(40, 22, 43, 34, f.dark); P.rect(46, 21, 49, 33, f.dark);
      P.ell(31, 17, 17, 8, shade(f.light, f.mid, f.dark));
      P.rect(21, 22, 24, 34, f.dark);
      P.rect(15, 21, 18, 34, f.mid);
      P.ell(17, 13, 6, 7, shade(f.light, f.mid, f.dark));
      P.ell(11, 12, 6, 5, shade(f.light, f.mid, f.dark));
      P.poly([[0, 14], [8, 9], [9, 17], [2, 17]], f.mid);
      P.px(0, 14, '#111'); P.px(1, 14, '#111');
      P.poly([[9, 2], [14, 8], [7, 8]], f.dark);
      P.px(8, 11, f.eye);
      for (let i = 0; i < 6; i++) P.px(20 + i * 4, 10 - (i % 2), f.light);
    });
  }

  // ---------- Archid (crocodilo bípede do Tinga) 52×64 ----------
  function archid() {
    const c = { mid: '#3f6b3a', dark: '#27452a', light: '#6f9a52', belly: '#c9c79a' };
    return paint(52, 64, P => {
      P.poly([[30, 42], [51, 54], [51, 60], [29, 54]], c.dark);
      P.rect(29, 46, 35, 61, c.dark); P.rect(28, 61, 37, 63, c.dark);
      P.rect(33, 26, 36, 38, c.dark);
      P.ell(27, 35, 11, 14, shade(c.light, c.mid, c.dark));
      P.ell(22, 38, 5, 10, c.belly);
      P.rect(19, 46, 26, 61, c.mid); P.rect(16, 61, 27, 63, c.mid);
      P.poly([[0, 17], [18, 10], [26, 14], [26, 22], [2, 22]], (x, y) => y < 14 ? c.light : c.mid);
      P.line(2, 19, 20, 19, c.dark);
      [3, 6, 9, 12, 15].forEach(x => P.px(x, 20, '#f4f0e0'));
      P.px(19, 13, '#ffd23a'); P.px(1, 17, '#111');
      P.poly([[18, 26], [23, 26], [18, 38], [13, 38]], c.mid);
      P.px(12, 39, '#e8e0c8'); P.px(15, 39, '#e8e0c8');
      for (let i = 0; i < 6; i++) P.px(30 + i * 1.5, 22 + i * 2.5, c.dark);
    });
  }

  // ---------- Ciborgue (virado pra direita) 50×64 ----------
  function ciborgue() {
    const c = { m: '#6b7280', d: '#40454f', l: '#a7adb8', r: '#ff3030' };
    return paint(50, 64, P => {
      P.rect(5, 20, 11, 40, c.d); P.rect(4, 40, 11, 45, c.d);
      P.rect(15, 42, 22, 60, c.d); P.rect(13, 60, 23, 63, c.d);
      P.rect(28, 42, 35, 60, c.m); P.rect(27, 60, 37, 63, c.d);
      P.poly([[9, 17], [41, 17], [37, 42], [13, 42]], (x) => x < 17 ? c.d : c.m);
      P.rect(17, 21, 33, 29, c.l);
      P.ell(25, 35, 3, 3, c.r);
      P.ell(12, 19, 5, 4, c.l); P.ell(38, 19, 5, 4, c.l);
      P.rect(19, 5, 31, 16, c.m); P.rect(19, 5, 22, 16, c.d);
      P.rect(24, 10, 32, 11, c.r);
      P.rect(20, 14, 30, 16, c.d);
      P.rect(37, 21, 44, 29, c.d); P.rect(44, 23, 49, 27, '#2a2d33'); P.px(49, 25, c.r);
    });
  }

  // ---------- Schneider Fomor (virado pra direita) 76×80 ----------
  function fomor() {
    const c = { m: '#4f7a3a', d: '#2e4a24', l: '#86b060', b: '#c8c890', mo: '#5a1020', e: '#f2e04a' };
    return paint(76, 80, P => {
      P.poly([[14, 46], [21, 46], [10, 66], [3, 66]], c.d);
      P.ell(22, 71, 9, 7, c.d); P.ell(52, 71, 9, 7, c.m);
      P.poly([[12, 76], [32, 76], [28, 79], [10, 79]], c.d);
      P.poly([[44, 76], [64, 76], [62, 79], [42, 79]], c.m);
      P.ell(38, 46, 28, 26, shade(c.l, c.m, c.d));
      P.ell(42, 55, 16, 13, c.b);
      P.poly([[40, 40], [74, 33], [72, 47], [44, 49]], c.mo);
      for (let x = 44; x < 72; x += 4) { P.px(x, 40 - (x - 40) / 5, '#f4f0e0'); P.px(x + 1, 47, '#f4f0e0'); }
      P.ell(48, 20, 7, 7, c.e); P.rect(48, 15, 48, 25, '#111');
      P.ell(64, 24, 6, 6, c.e); P.rect(64, 20, 64, 28, '#111');
      P.poly([[56, 52], [64, 50], [75, 70], [68, 74], [58, 62]], c.m);
      P.px(74, 72, '#e8e0c8'); P.px(70, 75, '#e8e0c8'); P.px(66, 74, '#e8e0c8');
      [[20, 30], [26, 38], [18, 50], [30, 26], [34, 60], [14, 40], [24, 58]].forEach(([x, y]) => P.px(x, y, c.d));
      [[50, 50], [56, 52], [62, 51]].forEach(([x, y]) => P.rect(x, y, x, y + 3, '#9fd070'));
    });
  }

  // ---------- Uktena (serpente cornuda, pra cut-ins) 160×90 ----------
  function uktena() {
    const c = { m: '#5a2a8a', d: '#35185a', l: '#8a4ac0', t: '#3cbeb4', b: '#c9a0ff' };
    return paint(160, 90, P => {
      for (let i = 60; i >= 0; i--) {
        const t = i / 60, x = 40 + t * 115, y = 50 + Math.sin(t * Math.PI * 2.2) * 22, r = 13 - t * 9;
        P.ell(x, y, r, r, (nx, ny) => ny < -.4 ? c.l : ny > .5 ? c.b : ((i % 4 === 0 && nx > -.2) ? c.t : c.m));
      }
      P.poly([[34, 30], [26, 4], [38, 16], [44, 30]], c.b);
      P.poly([[46, 32], [52, 8], [58, 22], [54, 34]], c.b);
      P.ell(30, 44, 22, 14, shade(c.l, c.m, c.d));
      P.poly([[8, 46], [30, 50], [10, 58]], '#1a0a24');
      P.ell(34, 34, 3, 3, '#e8fbff');
      P.ell(24, 39, 3, 2, '#ff8cff'); P.px(24, 39, '#ffffff');
    });
  }

  // ---------- Fundos ----------
  function bands(x, colors, y0, h) {
    const bh = h / colors.length;
    colors.forEach((c, i) => {
      x.fillStyle = c; x.fillRect(0, y0 + i * bh, x.canvas.width, Math.ceil(bh));
      if (i > 0) { x.fillStyle = colors[i - 1]; for (let px = 0; px < x.canvas.width; px += 2) x.fillRect(px + (i % 2), y0 + i * bh, 1, 1); }
    });
  }
  function trees(x, y0, color, step, hmin, hmax, seed = 1) {
    let s = seed;
    const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    x.fillStyle = color;
    for (let tx = -10; tx < x.canvas.width + 10; tx += step) {
      const h = hmin + rnd() * (hmax - hmin), w = step * 1.4;
      for (let yy = 0; yy < h; yy++) {
        const ww = Math.max(2, w * (yy / h));
        x.fillRect(Math.round(tx - ww / 2), Math.round(y0 - h + yy), Math.round(ww), 1);
      }
    }
  }

  function bgGalpao(w = 384, h = 152) {
    const [cv, x] = G.makeCanvas(w, h);
    bands(x, ['#141722', '#191c29', '#1e2231', '#23283a'], 0, 96);
    x.fillStyle = '#2a3044';
    for (let px = 0; px < w; px += 6) x.fillRect(px, 14, 1, 82);
    x.fillStyle = '#0c0e16'; x.fillRect(0, 0, w, 12);
    x.strokeStyle = '#0c0e16'; x.lineWidth = 1;
    for (let px = 0; px < w; px += 32) { x.beginPath(); x.moveTo(px, 12); x.lineTo(px + 16, 2); x.lineTo(px + 32, 12); x.stroke(); }
    // porta aberta pra mata (onde aparece o vulto)
    x.fillStyle = '#05080a'; x.fillRect(300, 26, 54, 72);
    const [dc, dx] = G.makeCanvas(50, 68);
    bands(dx, ['#0b1030', '#131a40', '#1c2250'], 0, 40);
    dx.fillStyle = '#e8e4c0'; dx.fillRect(34, 8, 5, 5);
    trees(dx, 68, '#06120a', 7, 20, 44, 3);
    x.drawImage(dc, 302, 28);
    x.fillStyle = '#3a3f52'; x.fillRect(298, 24, 58, 3); x.fillRect(298, 24, 3, 74); x.fillRect(353, 24, 3, 74);
    // chão de concreto
    bands(x, ['#2a2622', '#24201d', '#1e1b18', '#181512'], 96, 56);
    x.fillStyle = '#12100e';
    [[20, 110, 40], [140, 124, 30], [230, 104, 26], [60, 138, 50], [300, 132, 44]].forEach(([a, b, l]) => x.fillRect(a, b, l, 1));
    // pilar e corda (onde o Schneider estava preso)
    x.fillStyle = '#34394a'; x.fillRect(150, 12, 12, 96); x.fillStyle = '#262a38'; x.fillRect(158, 12, 4, 96);
    x.fillStyle = '#8a7048'; x.fillRect(148, 70, 16, 2); x.fillRect(148, 76, 16, 2);
    // lâmpada e cone de luz pontilhado
    x.fillStyle = '#0c0e16'; x.fillRect(205, 12, 1, 14);
    x.fillStyle = '#f4e8a0'; x.fillRect(201, 26, 9, 3);
    x.fillStyle = 'rgba(244,232,160,.10)';
    for (let yy = 30; yy < 148; yy++) {
      const half = (yy - 30) * .55;
      for (let px = Math.round(205 - half); px < 205 + half; px++) if ((px + yy) % 2 === 0) x.fillRect(px, yy, 1, 1);
    }
    // caixotes
    [[8, 76, 34, 28], [30, 88, 26, 16]].forEach(([a, b, cw, ch]) => {
      x.fillStyle = '#4a3622'; x.fillRect(a, b, cw, ch);
      x.fillStyle = '#2e2014'; x.fillRect(a, b, cw, 2); x.fillRect(a, b + ch / 2, cw, 1); x.fillRect(a + cw / 2, b, 1, ch);
    });
    return cv;
  }

  function bgCutscene(kind) {
    const [cv, x] = G.makeCanvas(G.W, G.H);
    if (kind === 'galpao') {
      x.drawImage(bgGalpao(G.W, G.H), 0, 0);
      x.fillStyle = 'rgba(0,0,0,.35)'; x.fillRect(0, 0, G.W, G.H);
    } else if (kind === 'mata') {
      bands(x, ['#070a1c', '#0b1030', '#131a40', '#1c2250', '#232a5a'], 0, 150);
      x.fillStyle = '#e8e4c0'; x.beginPath(); x.arc(300, 44, 16, 0, 7); x.fill();
      x.fillStyle = '#070a1c'; x.beginPath(); x.arc(306, 40, 14, 0, 7); x.fill();
      trees(x, 170, '#0a1a12', 22, 60, 120, 5);
      trees(x, 216, '#040c08', 30, 70, 150, 9);
    } else if (kind === 'impacto' || kind === 'uktena' || kind === 'fomor' || kind === 'mente') {
      const pal = {
        impacto: ['#1a0406', '#5a0a10', '#b01818'],
        uktena: ['#0c0418', '#2a0c4a', '#6a2aa8'],
        fomor: ['#040a04', '#16300e', '#3a5a1a'],
        mente: ['#06040c', '#140a24', '#24123c'],
      }[kind];
      x.fillStyle = pal[0]; x.fillRect(0, 0, G.W, G.H);
      for (let i = 0; i < 64; i++) {
        const a = i / 64 * Math.PI * 2;
        x.fillStyle = i % 2 ? pal[1] : pal[2];
        x.beginPath(); x.moveTo(G.W / 2, G.H / 2);
        x.lineTo(G.W / 2 + Math.cos(a) * 400, G.H / 2 + Math.sin(a) * 400);
        x.lineTo(G.W / 2 + Math.cos(a + .05) * 400, G.H / 2 + Math.sin(a + .05) * 400);
        x.fill();
      }
      if (kind === 'mente') { x.fillStyle = 'rgba(180,120,255,.12)'; for (let yy = 0; yy < G.H; yy += 3) x.fillRect(0, yy, G.W, 1); }
    } else {
      x.fillStyle = '#05040a'; x.fillRect(0, 0, G.W, G.H);
    }
    return cv;
  }

  // ---------- Cursor (mão do FF) ----------
  function hand() {
    return paint(12, 9, P => {
      P.rect(0, 3, 7, 5, '#f4f4f4'); P.rect(6, 1, 10, 7, '#f4f4f4'); P.rect(7, 2, 9, 6, '#d0d0dc');
    });
  }

  // ---------- Manifesto ----------
  const PAL = {
    jan: { skin: '#e8c4a8', skinD: '#c9a088', hair: '#d8d8e4', top: '#26305a', top2: '#1a2140', bottom: '#1c1c24', shoes: '#0e0e14' },
    tinga: { skin: '#f1e6e0', skinD: '#d6c4bc', hair: '#f8f8f8', top: '#f1e6e0', top2: '#d6c4bc', bottom: '#6b4a2a', bottom2: '#4e3620', shoes: '#2a1c10', marks: '#c42a2a' },
    valeria: { skin: '#d9a27f', skinD: '#b88262', hair: '#1a1418', top: '#2a1f2e', top2: '#1a121e', bottom: '#1c1c24', shoes: '#0e0e14' },
    schneider: { skin: '#e8c8b0', skinD: '#c8a890', hair: '#d8b860', top: '#5a5e6a', top2: '#43464f', bottom: '#43464f', shoes: '#141418', shirt: '#e8e8e8', tie: '#8a1a1a' },
    agente: { skin: '#b88a70', hair: '#23252c', top: '#1d1f26', top2: '#121318', bottom: '#1d1f26', shoes: '#0a0a0e', visor: '#4ad0ff' },
  };
  // Sprites de IA (assets/sprites.js, gerado pelo arte-ia/converter.py); placeholders em código como reserva.
  const MANIFESTO = {
    espelho: { draw: () => paint(16, 16, P => P.rect(0, 0, 15, 15, '#223')) },
    sangria: { draw: () => wolf({ mid: '#8a3a24', dark: '#5a2014', light: '#b8603a', eye: '#ffd23a' }) },
    jan: { draw: () => human({ ...PAL.jan, coat: true, weapon: 'klaive' }) },
    jan_crinos: { draw: () => crinos({ mid: '#9a9aa8', dark: '#6a6a78', light: '#d0d0dc', eye: '#6fd0ff' }) },
    tinga: { draw: () => human({ ...PAL.tinga, hairLong: 30 }) },
    tinga_archid: { draw: archid },
    valeria: { draw: () => human({ ...PAL.valeria, hairLong: 26, weapon: 'dagger' }) },
    valeria_crinos: { draw: () => crinos({ mid: '#2e2a34', dark: '#18161c', light: '#4e4858', eye: '#ff4a3a' }) },
    schneider: { draw: () => human({ ...PAL.schneider, coat: true, flip: true }) },
    ciborgue: { draw: ciborgue },
    agente: { draw: () => human({ ...PAL.agente, weapon: 'knife', flip: true }) },
    fomor: { draw: fomor },
    uktena: { draw: uktena },
    hand: { draw: hand },
    // Fundos dos cut-ins sem ilustração própria
    cs_impacto: { draw: () => bgCutscene('impacto') },
    cs_uktena: { draw: () => bgCutscene('uktena') },
    cs_fomor: { draw: () => bgCutscene('fomor') },
    cs_mente: { draw: () => bgCutscene('mente') },
    cs_mata: { draw: () => bgCutscene('mata') },
    bg_galpao: { draw: () => bgCutscene('galpao') },
    bg_estrada: { draw: () => bgCutscene('mata') },
    // Símbolo do Uktena (m20), branco sobre transparente; o jogo tinge de púrpura.
    simbolo_uktena: { src: 'assets/simbolo_uktena.png', draw: () => paint(8, 8, P => P.rect(0, 0, 7, 7, '#fff')) },
  };
  const ANIMATED = { espelho: 8, espelho_guerra_voo: 12, jato_toxico: 10 }; // sprites com ciclo contínuo (fps); os outros usam poses 0/1/2
  for (const [key, m] of Object.entries(G.SPRITE_META || {})) {
    MANIFESTO[key] = { ...(MANIFESTO[key] || {}), src: `assets/${key}.png`, fw: m.fw, fh: m.fh, frames: m.frames, fps: ANIMATED[key] || 0 };
  }

  const cache = {};
  G.art = {
    load() {
      return Promise.all(Object.entries(MANIFESTO).map(([key, m]) => new Promise(res => {
        const fallback = () => {
          const cv = m.draw ? m.draw() : paint(16, 16, P => P.rect(0, 0, 15, 15, '#f0f'));
          cache[key] = { img: cv, fw: cv.width, fh: cv.height, frames: 1, fps: 0 };
          res();
        };
        if (!m.src) { fallback(); return; }
        const img = new Image();
        img.onload = () => { cache[key] = { img, fw: m.fw || img.width, fh: m.fh || img.height, frames: m.frames || 1, fps: m.fps || 0 }; res(); };
        img.onerror = () => { if (m.draw) fallback(); else { console.warn('arte faltando:', key); fallback(); } };
        img.src = m.src;
      })));
    },
    get: (key) => cache[key],
    // Desenha o sprite com âncora no centro dos pés.
    draw(ctx, key, x, y, { frame = 0, scale = 1, alpha = 1, flash = 0, flipX = false, tint = null } = {}) {
      const s = cache[key];
      if (!s) return;
      const f = s.frames > 1 ? (s.fps ? Math.floor(G.real / (1000 / s.fps)) : Math.min(Math.floor(frame), s.frames - 1)) % s.frames : 0;
      const w = s.fw * scale, h = s.fh * scale;
      const dx = Math.round(x - w / 2), dy = Math.round(y - h);
      ctx.save();
      ctx.globalAlpha = alpha;
      if (flipX) { ctx.translate(dx + w, dy); ctx.scale(-1, 1); ctx.drawImage(s.img, f * s.fw, 0, s.fw, s.fh, 0, 0, w, h); }
      else ctx.drawImage(s.img, f * s.fw, 0, s.fw, s.fh, dx, dy, w, h);
      ctx.restore();
      if (flash > 0 || tint) {
        // Silhueta colorida por cima (flash branco de impacto / tinta de status)
        const [tc, tx] = G.makeCanvas(s.fw, s.fh);
        tx.drawImage(s.img, f * s.fw, 0, s.fw, s.fh, 0, 0, s.fw, s.fh);
        tx.globalCompositeOperation = 'source-in';
        tx.fillStyle = flash > 0 ? '#ffffff' : tint.color;
        tx.fillRect(0, 0, s.fw, s.fh);
        ctx.save();
        ctx.globalAlpha = alpha * (flash > 0 ? Math.min(1, flash) : tint.alpha);
        if (flipX) { ctx.translate(dx + w, dy); ctx.scale(-1, 1); ctx.drawImage(tc, 0, 0, w, h); }
        else ctx.drawImage(tc, dx, dy, w, h);
        ctx.restore();
      }
    },
  };
})();
