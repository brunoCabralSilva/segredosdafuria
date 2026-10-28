// Tela de título (só o horizonte + logo) e a abertura cinematográfica:
// o lobo sobe a colina, uiva, vira lobisomem enquanto a lua enche, salta na câmera e a lua explode em branco.
(() => {
  const MOON = { x: 427, y: 47, r: 44 };                     // lua desenhada por cima da lua pintada do panorama
  // pés do lobo sobre a linha do terreno (medida no panorama): planície → encosta → topo plano
  const PATH = [[160, 141], [220, 139], [262, 137], [286, 128], [300, 119], [330, 112], [350, 106], [372, 99], [386, 92], [418, 92]];
  const HILLTOP = [418, 92];

  const O = G.opening = {
    cam: { cx: 192, cy: 108, zoom: 1 },
    moonPhase: 0,        // 0 = crescente, 1 = cheia
    moonScale: 1,
    wolf: null,          // { x, y, frame, sprite, pose, alpha }
    leap: null,          // { scale, alpha, silhouette }
    white: 0,            // tela branca no fim
    wind: 0,
    skip: false,
  };

  const clouds = Array.from({ length: 9 }, (_, i) => ({ x: i * 70 - 60, y: 18 + (i * 23) % 60, w: 60 + (i * 37) % 70, s: .004 + (i % 3) * .002 }));
  const grass = Array.from({ length: 70 }, (_, i) => ({ x: (i * 53) % 504, y: 100 + (i * 29) % 110 }));

  // Lua em pixel: disco claro com crateras, sombra que recua conforme a fase, halo que cresce.
  // A parte escura é recortada (transparente), então o céu aparece por trás — sem disco escuro.
  function drawMoon(ctx, x, y, r, phase, scale = 1, haloK = 1) {
    const R = Math.round(r * scale), S = R * 2 + 4;
    const [mc, mx] = G.makeCanvas(S, S);
    const c = S / 2;
    mx.fillStyle = '#e8e2c4'; mx.beginPath(); mx.arc(c, c, R, 0, 7); mx.fill();
    mx.fillStyle = '#cfc7a2';
    [[-.3, -.2, .18], [.25, .3, .14], [.1, -.45, .1], [-.4, .35, .12], [.45, -.05, .09]].forEach(([dx, dy, rr]) => {
      mx.beginPath(); mx.arc(c + dx * R, c + dy * R, rr * R, 0, 7); mx.fill();
    });
    if (phase < 1) {
      mx.globalCompositeOperation = 'destination-out';
      mx.beginPath(); mx.arc(c - R * .32 - phase * R * 2.4, c - R * .1, R * 1.02, 0, 7); mx.fill();
    }
    const halo = ctx.createRadialGradient(x, y, R * .7, x, y, R * (2 + phase * 1.6));
    halo.addColorStop(0, `rgba(230,225,190,${(.08 + phase * .4) * haloK})`);
    halo.addColorStop(1, 'rgba(230,225,190,0)');
    ctx.fillStyle = halo; ctx.fillRect(x - R * 4, y - R * 4, R * 8, R * 8);
    ctx.drawImage(mc, Math.round(x - c), Math.round(y - c));
  }

  function drawClouds(ctx, over) {
    clouds.forEach((c, i) => {
      const x = ((c.x + G.real * c.s * 20) % 620) - 60;
      ctx.fillStyle = over ? 'rgba(20,16,48,.55)' : 'rgba(60,50,110,.35)';
      for (let k = 0; k < 4; k++) ctx.fillRect(Math.round(x + k * 9), Math.round(c.y + k * 2 + (i % 2) * 10), Math.round(c.w - k * 14), 2);
    });
  }

  function drawGrassWind(ctx) {
    ctx.fillStyle = 'rgba(200,190,150,.35)';
    grass.forEach(g => {
      const sway = Math.round(Math.sin(G.real / 300 + g.x) * (2 + O.wind * 3));
      ctx.fillRect(g.x + sway, g.y, 1, 3);
      ctx.fillRect(g.x + sway + 1, g.y - 1, 1, 1);
    });
  }

  // Mundo = panorama 504×216 com a câmera (centro + zoom).
  function drawWorld(ctx) {
    const bg = G.art.get('bg_horizonte');
    ctx.save();
    ctx.translate(G.W / 2, G.H / 2);
    ctx.scale(O.cam.zoom, O.cam.zoom);
    ctx.translate(-O.cam.cx, -O.cam.cy);
    if (bg) ctx.drawImage(bg.img, 0, 0);
    drawClouds(ctx, false);
    drawMoon(ctx, MOON.x, MOON.y, MOON.r, O.moonPhase, O.moonScale);
    drawClouds(ctx, true);
    // o morro repintado por cima da lua (a lua fica atrás da colina)
    if (bg) ctx.drawImage(bg.img, 360, 88, 144, 128, 360, 88, 144, 128);
    drawGrassWind(ctx);
    const w = O.wolf;
    if (w) {
      // fusão entre quadros (transformação suave): o próximo quadro aparece por cima enquanto o atual some
      const bl = w.blend || 0;
      G.art.draw(ctx, w.sprite, Math.round(w.x), Math.round(w.y), { frame: w.frame, alpha: w.alpha * (1 - bl * .6), flash: w.flash || 0 });
      if (bl > 0) G.art.draw(ctx, w.sprite, Math.round(w.x), Math.round(w.y), { frame: w.frame + 1, alpha: w.alpha * bl, flash: w.flash || 0 });
      if (w.flash > 0) w.flash = Math.max(0, w.flash - .05);
    }
    ctx.restore();
  }

  G.drawMoonPx = drawMoon; // usado também no final

  // ---------- Tela de título ----------
  G.drawTitleScreen = (ctx) => {
    O.cam.cx = 312; O.cam.cy = 108; O.cam.zoom = 1; O.moonPhase = 0; O.wolf = null;
    drawWorld(ctx);
    const v = ctx.createLinearGradient(0, 0, 0, G.H);
    v.addColorStop(0, 'rgba(0,0,0,.35)'); v.addColorStop(.5, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.55)');
    ctx.fillStyle = v; ctx.fillRect(0, 0, G.W, G.H);
    const logo = G.art.get('logo');
    if (logo) G.art.draw(ctx, 'logo', G.W / 2, 8 + logo.fh + Math.round(Math.sin(G.real / 700) * 1.5));
    if (Math.floor(G.real / 450) % 2) G.text(ctx, 'APERTE A PARA COMEÇAR', G.W / 2, 150, '#ffe070', 'center');
    G.text(ctx, 'Setas para navegação', G.W / 2, 172, '#c8d0ff', 'center');
    G.text(ctx, 'A para ação / avançar e S para voltar', G.W / 2, 185, '#c8d0ff', 'center');
    G.text(ctx, 'F para tela cheia (Esc para sair)', G.W / 2, 198, '#c8d0ff', 'center');
  };

  // ---------- Abertura ----------
  G.drawOpening = (ctx) => {
    drawWorld(ctx);
    // a lua explode em luz: o brilho vem ATRÁS do lobisomem (contraluz)...
    if (O.white > 0) {
      const g = ctx.createRadialGradient(G.W / 2, G.H * .4, 0, G.W / 2, G.H * .4, 60 + O.white * 400);
      g.addColorStop(0, `rgba(255,255,255,${Math.min(1, O.white * 1.6)})`);
      g.addColorStop(1, `rgba(255,255,255,${Math.max(0, O.white - .2)})`);
      ctx.fillStyle = g; ctx.fillRect(0, 0, G.W, G.H);
    }
    const L = O.leap;
    if (L) {
      // lobisomem saltando na direção da câmera (espaço da tela), virando silhueta no contraluz
      const s = G.art.get('lobisomem_salto');
      if (s) {
        const tint = L.silhouette > 0 ? { color: '#07060c', alpha: L.silhouette } : null;
        G.art.draw(ctx, 'lobisomem_salto', Math.round(L.x), Math.round(L.y), { scale: L.scale, alpha: L.alpha, tint, frame: L.frame || 0 });
      }
    }
    // ...e depois engole a silhueta até o branco absoluto
    if (O.engulf > 0) { ctx.fillStyle = `rgba(255,255,255,${O.engulf})`; ctx.fillRect(0, 0, G.W, G.H); }
    // faixas de cinema
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, G.W, 14); ctx.fillRect(0, G.H - 14, G.W, 14);
    if (!O.skip && Math.floor(G.real / 600) % 2) G.text(ctx, 'Enter para pular introdução', G.W - 8, G.H - 12, '#8a8ab0', 'right');
  };

  const along = (t) => {
    // posição na encosta (0..1)
    const n = PATH.length - 1, f = Math.min(n - 1e-6, t * n), i = Math.floor(f), k = f - i;
    return [G.lerp(PATH[i][0], PATH[i + 1][0], k), G.lerp(PATH[i][1], PATH[i + 1][1], k)];
  };

  G.playOpening = async () => {
    Object.assign(O, { cam: { cx: 192, cy: 108, zoom: 1 }, moonPhase: 0, moonScale: 1, leap: null, white: 0, engulf: 0, wind: 0, skip: false });
    const off = G.onAction(a => { if (a === 'ok' || a === 'tap') O.skip = true; });
    const until = (ms) => new Promise(res => {
      const t0 = G.time;
      const tick = () => (O.skip || G.time - t0 >= ms ? res() : G.wait(30).then(tick));
      tick();
    });
    G.music && G.music.stop && G.music.stop();
    G.music && G.music.intro && G.music.intro(true);

    // 1) plano geral: o lobo, pequeno, sobe a colina; travelling lento pra direita
    O.wolf = { sprite: 'lobo_andando', x: PATH[0][0], y: PATH[0][1], frame: 0, alpha: 1 };
    G.sfx('wind');
    const walk = { t: 0 };
    G.tween(O.cam, { cx: 330, cy: 100 }, 7000, G.ease.inOut);
    const walking = G.tween(walk, { t: 1 }, 7000, G.ease.linear);
    const stepper = setInterval(() => {
      if (!O.wolf || O.wolf.sprite !== 'lobo_andando') return;
      const [x, y] = along(walk.t); O.wolf.x = x; O.wolf.y = y; O.wolf.frame = Math.floor(G.real / 160) % 4;
    }, 30);
    await Promise.race([walking, until(7000)]);
    clearInterval(stepper);
    if (O.skip) return finish();

    // 2) no topo, para e ergue a cabeça: uivo longo; vento aumenta; câmera fecha devagar
    O.wolf = { sprite: 'lobisomem_transforma', x: HILLTOP[0], y: HILLTOP[1], frame: 0, alpha: 1 };
    O.wind = 1; G.sfx('wind');
    G.tween(O.cam, { cx: HILLTOP[0] - 6, cy: 66, zoom: 2.1 }, 4500, G.ease.inOut);
    await until(600);
    G.sfx('howl');
    // 3) transformação gradual durante o uivo, com a lua enchendo
    G.tween(O, { moonPhase: 1 }, 5200, G.ease.inOut);
    // 9 quadros com fusão entre eles: cada passo é uma mudança pequena, sem corte seco
    const frames = (G.art.get('lobisomem_transforma') || { frames: 5 }).frames;
    const stepMs = 5200 / (frames - 1);
    for (let f = 0; f < frames - 1; f++) {
      await until(stepMs * .35);
      if (O.skip) return finish();
      await G.tween(O.wolf, { blend: 1 }, stepMs * .65, G.ease.inOut);
      O.wolf.frame = f + 1; O.wolf.blend = 0;
      if (f % 2 === 1) { G.sfx('growl'); G.shake(1 + f * .5, 220); }
      if (f === 3 || f === 6) O.wolf.flash = .7;
    }
    // 4) encara a câmera, imóvel
    await until(1000);
    if (O.skip) return finish();

    // 5) salta em direção à câmera em 3 tempos: agacha (no mesmo tamanho e lugar do lobisomem na colina),
    //    toma impulso e dá o bote na tela; a lua cresce atrás
    const sx = G.W / 2 + (HILLTOP[0] - O.cam.cx) * O.cam.zoom, sy = G.H / 2 + (HILLTOP[1] - O.cam.cy) * O.cam.zoom;
    const wolfH = (G.art.get('lobisomem_transforma') || { fh: 73 }).fh * O.cam.zoom, leapH = (G.art.get('lobisomem_salto') || { fh: 151 }).fh;
    O.leap = { x: sx, y: sy, scale: wolfH / leapH * .9, alpha: 0, silhouette: 0, frame: 0 };
    G.tween(O.wolf, { alpha: 0 }, 260);
    await G.tween(O.leap, { alpha: 1 }, 260);
    G.sfx('growl'); G.shake(2, 300);
    await until(380);
    if (O.skip) return finish();
    O.leap.frame = 1;
    G.sfx('roar');
    await G.tween(O.leap, { y: sy - 14, scale: O.leap.scale * 1.15 }, 200, G.ease.out);
    O.leap.frame = 2;
    G.tween(O.cam, { zoom: 3.2, cy: 52 }, 1200, G.ease.in);
    G.tween(O, { moonScale: 2.4 }, 1200, G.ease.in);
    G.speedLines(1300, 1, 'rgba(255,255,255,.7)', true);
    await G.tween(O.leap, { x: G.W / 2, y: G.H / 2 + leapH * 1.8 * .55, scale: 1.8 }, 1200, G.ease.in);
    // 6) a lua explode em luz branca e engole a silhueta
    G.sfx('explode');
    G.tween(O.leap, { scale: 2.1, y: G.H / 2 + leapH * 2.1 * .55, silhouette: 1 }, 600, G.ease.out);
    await G.tween(O, { white: 1 }, 800, G.ease.in);
    await G.wait(250);
    await G.tween(O, { engulf: 1 }, 1100, G.ease.in);
    return finish();

    async function finish() {
      off();
      clearInterval(stepper);
      O.skip = true;
      G.music && G.music.intro && G.music.intro(false);
      if (O.engulf < 1) await G.tween(O, { engulf: 1 }, 400);
      await G.wait(500);
    }
  };
})();
