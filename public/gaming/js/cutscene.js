// Cut-ins: ilustração ao fundo + elementos que deslizam, bustos falando, tremor, speed lines e SFX.
G.cs = { active: false, bg: null, layers: [] };

const CS = {
  async open(bg, { fade = true } = {}) {
    if (fade) await G.fadeTo(1, 180);
    G.cs.active = true; G.cs.bg = bg; G.cs.layers = [];
    if (fade) await G.fadeTo(0, 180);
  },
  async close() {
    await G.fadeTo(1, 200);
    G.cs.active = false; G.cs.layers = []; G.ui.dialog = null;
    await G.fadeTo(0, 200);
  },
  setBg(bg) { G.cs.bg = bg; },
  add(sprite, { x = G.W / 2, y = 180, scale = 2, alpha = 1, flipX = false, tint = null, pose = 0, rot = 0 } = {}) {
    const l = { sprite, x, y, scale, alpha, flipX, tint, flash: 0, pose, rot };
    G.cs.layers.push(l);
    return l;
  },
  addDraw(fn) { const l = { draw: fn, alpha: 1, x: 0, y: 0 }; G.cs.layers.push(l); return l; },
  remove(l) { G.cs.layers = G.cs.layers.filter(o => o !== l); },
  async slideIn(l, from = 'left', ms = 380, sfx = 'whoosh') {
    const tx = l.x, ty = l.y;
    if (from === 'left') l.x = -140; if (from === 'right') l.x = G.W + 140;
    if (from === 'bottom') l.y = G.H + 220; if (from === 'top') l.y = -60;
    if (sfx) G.sfx(sfx);
    G.speedLines(ms + 100, from === 'right' ? -1 : 1, 'rgba(255,255,255,.7)', true);
    await G.tween(l, { x: tx, y: ty }, ms, G.ease.back);
  },
  async slideOut(l, to = 'left', ms = 300) {
    const t = { left: { x: -200 }, right: { x: G.W + 200 }, bottom: { y: G.H + 240 } }[to];
    await G.tween(l, t, ms, G.ease.in);
    CS.remove(l);
  },
  async impact(amt = 5, ms = 300, color = '#ffffff', sfx = 'heavy') {
    G.sfx(sfx); G.shake(amt, ms); G.hitstop(70);
    await G.flashScreen(color, .8, 200);
  },
  caption(text, color = '#ffffff', y = 24) {
    return CS.addDraw(ctx => {
      ctx.font = G.FONT;
      const w = ctx.measureText(text).width + 24;
      ctx.fillStyle = 'rgba(0,0,0,.7)'; ctx.fillRect(G.W / 2 - w / 2, y - 4, w, 16);
      G.text(ctx, text, G.W / 2, y, color, 'center');
    });
  },
  // Busto em close deslizando da lateral pra entregar a fala (fica apoiado em cima da caixa de diálogo).
  async talk(bust, speaker, text, { side: sideOpt, color = '#ffffff', keep = false, shake = 0 } = {}) {
    let key = G.art.get(bust) ? bust : (bust === 'busto_schneider_ri' ? 'busto_schneider_furia' : bust);
    // teste ?bust32: usa a versão 32-bit (dobro de pixels, desenhada na metade da escala)
    const k32 = G.params.has('bust32') && G.art.get(key + '_32') ? key + '_32' : null;
    const bscale = k32 ? .5 : 1;
    const s = G.art.get(k32 || key);
    // lado fixo por personagem (party à direita, inimigos à esquerda) e sempre olhando pro centro
    const info = BUSTS[key] || { side: sideOpt || 'left', faces: 'right' };
    const side = info.side;
    const flipX = info.faces !== (side === 'left' ? 'right' : 'left');
    const l = CS.add(k32 || key, { x: side === 'left' ? 96 : G.W - 96, y: 166, scale: bscale, flipX });
    // faixa escura atrás do busto
    const band = CS.addDraw(ctx => {
      ctx.fillStyle = 'rgba(0,0,0,.55)';
      const bw = (s ? s.fw * bscale : 160) + 30;
      ctx.fillRect(Math.round(l.x - bw / 2), 0, bw, 166);
      ctx.fillStyle = color; ctx.globalAlpha = .6;
      ctx.fillRect(Math.round(side === 'left' ? l.x + bw / 2 - 2 : l.x - bw / 2), 0, 2, 166);
      ctx.globalAlpha = 1;
    });
    CS.remove(l); G.cs.layers.push(l);
    await CS.slideIn(l, side, 320, 'whoosh');
    if (shake) G.shake(shake, 400);
    await G.say(speaker, text, { color });
    if (keep) return { l, band };
    await CS.slideOut(l, side, 220);
    CS.remove(band);
  },
};
G.CS = CS;

// Bustos: de que lado da tela entram e pra onde a arte original olha.
const BUSTS = {
  busto_matias: { side: 'right', faces: 'right' }, busto_espelho: { side: 'left', faces: 'right' },
  busto_espelho_guerra: { side: 'left', faces: 'left' }, busto_espelho_humano: { side: 'left', faces: 'right' },
  busto_sangria: { side: 'right', faces: 'left' }, busto_sangria_crinos: { side: 'right', faces: 'left' },
  busto_jan: { side: 'right', faces: 'left' }, busto_jan_crinos: { side: 'right', faces: 'left' },
  busto_valeria: { side: 'right', faces: 'left' }, busto_valeria_crinos: { side: 'right', faces: 'left' },
  busto_tinga: { side: 'right', faces: 'left' }, busto_tinga_archid: { side: 'right', faces: 'left' },
  busto_uktena: { side: 'right', faces: 'left' },
  busto_schneider_ri: { side: 'left', faces: 'left' }, busto_schneider_furia: { side: 'left', faces: 'left' },
  busto_fomor: { side: 'left', faces: 'left' }, busto_ciborgue: { side: 'left', faces: 'right' }, busto_ciborgue_derrotado: { side: 'left', faces: 'right' }, busto_agente: { side: 'left', faces: 'right' },
};

const BURST_BG = { cs_impacto: 'impacto', cs_uktena: 'uktena', cs_fomor: 'fomor', cs_mente: 'mente' };
G.drawCutscene = (ctx) => {
  if (!G.cs.active) return;
  const kind = BURST_BG[G.cs.bg];
  if (!(kind && G.drawSunburst(ctx, kind))) {
    const bg = G.art.get(G.cs.bg);
    if (bg) ctx.drawImage(bg.img, 0, 0);
  }
  for (const l of G.cs.layers) {
    if (l.draw) { ctx.globalAlpha = l.alpha; l.draw(ctx, l); ctx.globalAlpha = 1; continue; }
    if (l.flash > 0) l.flash = Math.max(0, l.flash - .08);
    if (l.rot) {
      ctx.save(); ctx.translate(Math.round(l.x), Math.round(l.y)); ctx.rotate(l.rot);
      G.art.draw(ctx, l.sprite, 0, 0, { scale: l.scale, alpha: l.alpha, flipX: l.flipX, tint: l.tint, flash: l.flash, frame: l.pose });
      ctx.restore();
    } else G.art.draw(ctx, l.sprite, Math.round(l.x), Math.round(l.y), { scale: l.scale, alpha: l.alpha, flipX: l.flipX, tint: l.tint, flash: l.flash, frame: l.pose });
  }
};

// ---------- Dado D10 rolando ----------
// O dado entra quicando e girando, os números trocam enquanto rola, e ele assenta no centro.
function drawD10(ctx, cx, cy, ang, sq, value, glow, glowRGB = '255,230,120') {
  const r = 30;
  const pts = [[0, -r], [r * .9, -r * .15], [0, r], [-r * .9, -r * .15]];
  const rp = pts.map(([x, y]) => [cx + (x * Math.cos(ang) - y * Math.sin(ang)) * (1 + sq), cy + (x * Math.sin(ang) + y * Math.cos(ang)) * (1 - sq)]);
  const mid = [cx + (-Math.sin(ang) * r * .25), cy + Math.cos(ang) * r * .25];
  if (glow) { ctx.fillStyle = `rgba(${glowRGB},${glow})`; ctx.beginPath(); ctx.arc(cx, cy, r * 1.5, 0, 7); ctx.fill(); }
  const face = (a, b, c, col) => { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.lineTo(...c); ctx.closePath(); ctx.fill(); };
  face(rp[0], rp[1], mid, '#f4f0ff'); face(rp[0], rp[3], mid, '#d8d0f0');
  face(rp[1], rp[2], mid, '#a89cd0'); face(rp[3], rp[2], mid, '#8878b8');
  ctx.strokeStyle = '#20103a'; ctx.lineWidth = 1;
  ctx.beginPath(); rp.forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.closePath(); ctx.stroke();
  G.text(ctx, String(value), Math.round(mid[0]), Math.round(mid[1] - 12), '#20103a', 'center');
}

G.rollD10 = async (label, { min = 1 } = {}) => {
  const d = { value: G.randInt(min, 10), shown: '?', x: G.W / 2, y: 92, ang: 0, sq: 0, rolling: false, done: false, glow: 0 };
  const layer = CS.addDraw(ctx => {
    ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(0, 0, G.W, G.H);
    G.text(ctx, label, G.W / 2, 22, '#ffe070', 'center');
    ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.ellipse(d.x, 128, 26 * (1 - (92 - d.y) / 120), 5, 0, 0, 7); ctx.fill();
    drawD10(ctx, d.x, d.y, d.ang, d.sq, d.shown, d.glow);
    if (!d.rolling && !d.done && Math.floor(G.real / 350) % 2) G.text(ctx, 'TOQUE PRA ROLAR', G.W / 2, 146, '#ffffff', 'center');
    if (d.done) G.text(ctx, `${d.value} → ${Math.max(6, d.value) * 10}% DO HP`, G.W / 2, 146, '#ff8080', 'center');
    if (d.done && d.value < 6) G.text(ctx, '(mínimo 60%)', G.W / 2, 160, '#c8d0ff', 'center');
  });
  await G.waitAdvance();
  d.rolling = true;
  // atravessa a tela quicando 3 vezes, girando
  d.x = -40; d.y = 40;
  const bounces = [[G.W * .25, 92, 70], [G.W * .42, 92, 40], [G.W * .5, 92, 18]];
  let from = [d.x, d.y];
  for (const [bx, by, hgt] of bounces) {
    G.sfx('dice');
    const t0 = G.time, dur = 300;
    await new Promise(res => {
      const step = () => {
        const p = Math.min(1, (G.time - t0) / dur);
        d.x = G.lerp(from[0], bx, p); d.y = G.lerp(from[1], by, p) - Math.sin(p * Math.PI) * hgt;
        d.ang += .35; d.sq = 0; d.shown = G.randInt(1, 10);
        if (p < 1) G.wait(16).then(step); else res();
      };
      step();
    });
    d.sq = .25; G.shake(2, 100); await G.wait(60); d.sq = 0;
    from = [bx, by];
  }
  // assenta
  await G.tween(d, { ang: Math.round(d.ang / (Math.PI * 2)) * Math.PI * 2 }, 220, G.ease.out);
  d.shown = d.value; d.rolling = false; d.done = true;
  d.glow = .5; G.tween(d, { glow: 0 }, 600);
  G.sfx('ok'); G.shake(3, 150);
  await G.wait(300);
  await G.waitAdvance();
  CS.remove(layer);
  return d.value;
};

// ---------- Card do Enemy Ways ----------
function enemyWaysCard() {
  return CS.addDraw((ctx) => {
    const x = 40, y = 14, w = G.W - 80, h = 128;
    ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(0, 0, G.W, G.H);
    G.window(ctx, x, y, w, h);
    G.text(ctx, 'DOM DE ESPELHO: ENEMY WAYS', x + w / 2, y + 8, '#c8b0ff', 'center');
    ctx.fillStyle = '#7880a8'; ctx.fillRect(x + 10, y + 19, w - 20, 1);
    G.art.draw(ctx, 'agente', x + 50, y + 116);
    G.art.draw(ctx, 'agente', x + 100, y + 116);
    const gl = Math.abs(Math.sin(G.real / 200));
    ctx.fillStyle = `rgba(230,240,255,${.5 + gl * .5})`;
    [[x + 34, y + 88], [x + 84, y + 88]].forEach(([gx, gy]) => {
      ctx.fillRect(gx - 5, gy, 11, 1); ctx.fillRect(gx, gy - 5, 1, 11);
      ctx.strokeStyle = '#ffe070'; ctx.strokeRect(gx - 8.5, gy - 8.5, 17, 17);
    });
    G.text(ctx, '2 AGENTES TÁTICOS', x + 145, y + 38, '#ffffff');
    G.text(ctx, 'Possuem armas', x + 145, y + 60, '#ffe070');
    G.text(ctx, 'de prata', x + 145, y + 71, '#ffe070');
    G.text(ctx, '+50% de dano', x + 145, y + 92, '#ff9a9a');
    G.text(ctx, 'em Garou', x + 145, y + 103, '#ff9a9a');
  });
}

// ---------- Cordas trançadas prendendo alguém no pilar ----------
// Voltas grossas de corda (trança em duas cores, contorno, nó) + a parte que some atrás do pilar.
function ropes(target, h, count = 3) {
  const rope = { pieces: null, count }; // count: quantas voltas aparecem (o Tinga amarra uma a uma)
  const wraps = [.3, .46, .62];
  const layer = CS.addDraw(ctx => {
    const top = target.y - h;
    if (rope.pieces) {
      rope.pieces.forEach(p => {
        const t = (G.time - p.t0) / 700;
        if (t > 1) return;
        ctx.globalAlpha = 1 - t;
        ctx.fillStyle = '#b08850';
        ctx.fillRect(Math.round(p.x + p.vx * t * 60), Math.round(p.y + p.vy * t * 60 + t * t * 40), 6, 3);
        ctx.globalAlpha = 1;
      });
      return;
    }
    wraps.forEach((k, i) => {
      if (i >= rope.count) return;
      const yy = Math.round(top + h * k), x0 = Math.round(target.x - h * .3), x1 = Math.round(target.x + h * .3);
      ctx.fillStyle = '#2a1a0a'; ctx.fillRect(x0 - 1, yy - 1, x1 - x0 + 2, 6);
      for (let x = x0; x < x1; x++) {
        const tw = (x + i * 2) % 4;
        ctx.fillStyle = tw < 2 ? '#c8a060' : '#8a6a38';
        ctx.fillRect(x, yy, 1, 4);
        ctx.fillStyle = tw === 0 ? '#e8c890' : '#a07a48';
        ctx.fillRect(x, yy + (tw < 2 ? 0 : 3), 1, 1);
      }
      // curvatura nas pontas (a corda dá a volta)
      ctx.fillStyle = '#6a4e2a';
      ctx.fillRect(x0 - 2, yy + 1, 2, 2); ctx.fillRect(x1, yy + 1, 2, 2);
    });
    if (rope.count < 3) return;
    // nó no meio
    const ky = Math.round(top + h * .46);
    ctx.fillStyle = '#2a1a0a'; ctx.fillRect(Math.round(target.x - 5), ky - 3, 10, 10);
    ctx.fillStyle = '#b08850'; ctx.fillRect(Math.round(target.x - 4), ky - 2, 8, 8);
    ctx.fillStyle = '#e8c890'; ctx.fillRect(Math.round(target.x - 3), ky - 1, 3, 2);
    ctx.fillStyle = '#b08850'; ctx.fillRect(Math.round(target.x + 1), ky + 6, 2, 8); ctx.fillRect(Math.round(target.x - 3), ky + 6, 2, 6);
  });
  rope.snap = () => {
    const top = target.y - h;
    rope.pieces = [];
    wraps.forEach(k => { for (let i = 0; i < 6; i++) rope.pieces.push({ x: target.x - h * .3 + i * h * .1, y: top + h * k, vx: G.rand(-1.5, 1.5), vy: G.rand(-1.2, -.2), t0: G.time }); });
  };
  rope.layer = layer;
  return rope;
}

// ---------- Volta da morte (reviver) ----------
// Deitado na forma natural → close dos olhos abrindo → D10 → transformação na forma de guerra.
async function reviveSequence(a, warSprite, { label, intro } = {}) {
  const natural = a.def.natural || a.def.sprite;
  CS.setBg('cs_mente');
  const lying = CS.add(natural, { x: G.W / 2 + 20, y: 150, scale: 2, pose: 2, rot: -Math.PI / 2, tint: { color: '#300010', alpha: .4 } });
  await G.say(null, intro || `${a.name} está no chão. Imóvel.`, { color: '#ff9a9a' });
  for (let i = 0; i < 2; i++) { G.sfx('thud'); G.flashScreen('#600000', .35, 250); G.shake(2, 150); await G.wait(420); }
  CS.remove(lying);
  // close dos olhos
  const eyes = CS.add(`olhos_${a.id}`, { x: G.W / 2, y: 160, scale: 1.5, pose: 0, alpha: 0 });
  await G.tween(eyes, { alpha: 1 }, 500);
  await G.wait(700);
  G.sfx('thud'); await G.wait(300); G.sfx('thud');
  eyes.pose = 1; eyes.flash = 1;
  G.flashScreen('#ffffff', .6, 250);
  G.sfx('crit'); G.shake(5, 300);
  await G.wait(900);
  CS.remove(eyes);
  // dado
  const d = await G.rollD10(label || `${a.name} · ROLE O D10`, { min: 7 }); // volta da morte: sempre 7 ou mais
  // transformação
  CS.setBg('cs_impacto');
  const standing = CS.add(natural, { x: G.W / 2, y: 150, scale: 2, pose: 0 });
  G.sfx('transform');
  for (let i = 0; i < 8; i++) {
    standing.flash = 1;
    G.shake(1 + i, 140);
    await G.wait(260 - i * 25);
  }
  CS.remove(standing);
  G.flashScreen('#ffffff', 1, 500);
  G.hitstop(120);
  const war = CS.add(warSprite, { x: G.W / 2, y: 150, scale: 2, pose: 1 });
  const rings = CS.addDraw(ctx => {
    for (let r = 0; r < 3; r++) {
      const t = ((G.real / 700) + r / 3) % 1;
      ctx.globalAlpha = 1 - t; ctx.strokeStyle = r % 2 ? '#ff4040' : '#ffffff'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(G.W / 2, 140, 30 + t * 170, (30 + t * 170) * .35, 0, 0, 7); ctx.stroke();
    }
    ctx.globalAlpha = 1;
  });
  G.speedLines(900, 1, 'rgba(255,200,200,.7)', true);
  G.sfx('howlFury');
  await CS.impact(10, 600, '#ff2020', 'roar');
  await G.say(a.name, a.id === 'espelho' ? 'KRAAAAAHH!!' : a.id === 'tinga' ? 'GRRROOOOAAHH!!' : 'RRRAAAAAHHH!!', { color: '#ff6060' });
  CS.remove(rings); CS.remove(war);
  return d;
}

// ---------- Falas dos closes de crítico e de golpe final ----------
// natural = forma inicial (Espelho corvo, Sangria loba, os outros humanos) · guerra = forma de guerra · mata = golpe que derruba
const FALAS_CRIT = {
  espelho: {
    cor: '#d8b8ff',
    natural: ['Ô, coisa esquisita. Sorria pro passarinho.', 'Eu acho que vi um gatinho. Só que não.', 'Cês são lentos demais. Por Gaia.', 'Você disse pi-po-ca!', 'Olha o passarinho... ops, tarde demais.', 'Que pontaria, hein. Pena que é a minha.'],
    guerra: ['Relaxa, é só um passarinho. Um passarinho de dois metros.', 'Isso aí foi só o aperitivo, parceiro.', 'Pode gritar. Grite bastante para o bicudo.', 'Asa, bico e garra. Escolha por onde eu começo.', 'Você apanha de qualquer um, seu traste.'],
    mata: ['Deu a sua hora. Adeus, carniça.', 'Foi um desprazer, bicho feio.', 'Esse aqui foi de arrasta.', 'Die motherfucker, die. DIE!'],
  },
  valeria: {
    cor: '#ff9a9a',
    natural: ['Olha bem pra mim. Eu sou Garou. Você é só mais um erro da Wyrm.', 'Ajoelhe-se, lacaio da Wyrm. Entregue-se.', 'Vocês vão lembrar de mim até no inferno.', 'Minha canção vai contar como você caiu.', 'Prata na mão e fúria no sangue.'],
    guerra: ['Isso aqui é o que sobra quando vocês matam uma Garou. Olha bem.', 'Você não é digno de nenhuma canção.', 'Cale-se pra sempre, seu lixo.'],
    mata: ['Acabou. Cai de joelhos.', 'Esse é o último verso da tua canção.', 'Por Gaia, acabou pra você.', 'Silêncio. A Galliard terminou aqui.'],
  },
  jan: {
    cor: '#c8e0ff',
    natural: ['Com licença, cavalheiro. A prata costuma ser bem mais educada do que eu.', 'Tsc. Sujou meu casaco.', 'Postura, cavalheiro. Até na hora de morrer.', 'Permita-me encerrar esta conversa.', 'Não é de bom alvitre cruzar o caminho do lobo.'],
    guerra: ['Ah... o doce assobio da prata entrando na sua carne.', 'A prata não perdoa. Eu também não.', 'Curve-se. É o protocolo.', 'Que deselegante da sua parte continuar de pé.'],
    mata: ['Adieu, cavalheiro.', 'Considere-se dispensado.', 'Encerramos por aqui.', 'Com os meus cumprimentos.'],
  },
  tinga: {
    cor: '#ffc070',
    natural: ['HRAAAAH! Tua carne é minha! Vou roer teus ossos!', 'CARNE PODRE!', 'Vou meter a faca no seu bucho!', 'Corre não, que é pior!', 'Vou pendurar tua pele na parede.'],
    guerra: ['AGORA EU TE ENGULO INTEIRO!', 'Vou roer teu osso até brilhar!', 'O lagarto velho acordou com fome!', 'HRAAAH! Escama, dente e mais nada!', 'Tu virou comida, bicho!'],
    mata: ['Esse vai pro espeto!', 'Acabou a corrida, mané!', 'HRAAAH! Morra! Já vai tarde.', 'Logo agora que estava divertido, é sua hora.'],
  },
  sangria: {
    cor: '#ff7060',
    natural: ['Grrrrrrrrrr...', 'Rrrrr... rrrraaAAAH!', 'AU! AU! AU!', 'AUUUUUUUUUUU!', 'Hrrrrr... grrrr.', 'Rrrrau! Grrrr!'],
    guerra: ['GRRRRAAAAAHHH!!', 'AAAUUUUUUUUUUUU!!', 'Atacar, atacar!', 'GRRRR... HRAAAAH!', 'Lobo, lobo, LOBO!'],
    mata: ['Matar, matar, MATAR!', 'AUUUUUUUUU!!!', 'Rrrrr... RAU!', 'RAU! RAU! GRRRAAAH!'],
  },
};

// ================= ROTEIRO DOS CUT-INS =================
G.SCENES = {
  // 0) Prólogo: cenário e matilha em forma humana (a Sangria é loba), como foram parar ali; os dois presos são amarrados.
  async prologo() {
    G.cs.active = true; G.cs.layers = []; CS.setBg('bg_estrada');
    const bars = () => CS.addDraw(ctx => { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, G.W, 14); ctx.fillRect(0, G.H - 14, G.W, 14); });
    let barLayer = bars();
    const cap = CS.caption('ALTO DO MORRO · MADRUGADA', '#c8b0ff', 22);
    if (G.fx.fade.alpha >= 1) await G.fadeTo(0, 900);
    G.fx.fade.color = '#000';
    G.sfx('wind');
    await G.say(null, 'Um galpão abandonado no alto do morro, engolido pela mata. Três horas da manhã.');
    CS.remove(cap);
    await G.fadeTo(1, 350);
    // dentro do galpão: a matilha à direita, os dois presos desacordados no chão
    CS.setBg('bg_galpao'); G.cs.layers = []; barLayer = bars();
    const out = { color: '#000010', alpha: .2 };
    const sch = CS.add('schneider', { x: 150, y: 150, scale: 1.1, rot: -Math.PI / 2, tint: out, pose: 2 });
    const cib = CS.add('ciborgue', { x: 218, y: 162, scale: 1.1, rot: -Math.PI / 2, tint: out, pose: 0 });
    const party = [['espelho_humano', 238], ['valeria', 266], ['jan', 294], ['tinga', 322], ['sangria', 350]].map(([k, x]) => CS.add(k, { x, y: 158, scale: 1.3 }));
    await G.fadeTo(0, 450);
    await G.say(null, 'Lá dentro, a matilha recupera o fôlego. No chão, desacordados, os dois prisioneiros.');
    await CS.talk('busto_valeria', 'VALÉRIA', 'Mal conseguimos escapar do ataque de sanguessugas da mansão.', { color: '#ff9a9a' });
    await CS.talk('busto_espelho_humano', 'ESPELHO', 'Aquilo foi uma zona. Mas fizemos um belo estrago.', { color: '#d8b8ff' });
    await CS.talk('busto_jan', 'JAN VON MARTIUS', 'E tivemos sucesso sequestrando esses dois vermes.', { color: '#c8e0ff' });
    await CS.talk('busto_tinga', 'TINGA', 'Verme amarrado não foge. Deixa comigo.', { color: '#ffc070' });
    // o Tinga amarra o Schneider no pilar, volta por volta
    await G.fadeTo(1, 300);
    G.cs.layers = []; barLayer = bars();
    const sch2 = CS.add('schneider', { x: 96, y: 166, scale: 1.5, pose: 2, tint: out });
    const tinga = CS.add('tinga', { x: 176, y: 170, scale: 1.5 });
    const rope = ropes(sch2, 108, 0);
    await G.fadeTo(0, 350);
    for (let i = 0; i < 3; i++) {
      tinga.pose = 1; await G.tween(tinga, { x: 150 }, 160, G.ease.out);
      G.sfx('rope'); rope.count = i + 1; G.shake(2, 150); sch2.flash = .4;
      await G.wait(260);
      tinga.pose = 0; await G.tween(tinga, { x: 176 }, 200, G.ease.inOut);
      await G.wait(180);
    }
    G.sfx('snap'); G.shake(3, 200);
    await G.say(null, 'O Tinga amarra o Schneider no pilar. Três voltas e um nó de caçador.');
    // a Sangria rosna a um palmo do Ciborgue amarrado
    await G.fadeTo(1, 300);
    G.cs.layers = []; barLayer = bars();
    const cib2 = CS.add('ciborgue', { x: 282, y: 166, scale: 1.5, pose: 0, tint: out });
    ropes(cib2, 108);
    const sangria = CS.add('sangria', { x: 120, y: 170, scale: 1.5, flipX: true });
    await G.fadeTo(0, 350);
    G.sfx('dash');
    await G.tween(sangria, { x: 214 }, 500, G.ease.out);
    sangria.pose = 1; G.sfx('growl'); G.shake(5, 500); cib2.flash = .6;
    await CS.talk('busto_sangria', 'SANGRIA', 'Grrrrrrrrrr...', { color: '#ff7060', shake: 5 });
    await G.say(null, 'A Sangria rosna a um palmo do rosto do Ciborgue, amarrado no outro pilar. Ele nem pisca.');
    await G.fadeTo(1, 400);
    G.cs.active = false; G.cs.layers = [];
  },

  async intro() {
    await G.SCENES.prologo();
    // 1) Matias desova o carro
    await CS.open('bg_estrada', { fade: G.fx.fade.alpha < 1 });
    if (G.fx.fade.alpha >= 1) await G.fadeTo(0, 900);
    G.fx.fade.color = '#000';
    const cap = CS.caption('ALGOZES DE ANHANGÁ · O GALPÃO', '#c8b0ff');
    const car = CS.add('carro_matias', { x: 150, y: 150, scale: 1 });
    G.sfx('engine');
    await G.say(null, 'Estrada de terra, morro acima. O carro do sequestro não tem mais capota, e a porta do motorista pende de uma mola estourada.');
    CS.remove(cap);
    await CS.talk('busto_matias', 'MATIAS', 'Essa lata tá marcada. Vou desovar lá embaixo e fazer ela sumir. Ninguém acha nem o chassi.', { side: 'right' });
    await CS.talk('busto_espelho', 'ESPELHO', 'Dois V. Vai e volta. Na surdina.', { side: 'left', color: '#d8b8ff' });
    G.sfx('engine');
    G.speedLines(1100, 1, 'rgba(255,255,255,.6)', true);
    G.shake(3, 400);
    await G.tween(car, { x: 470, y: 260 }, 1100, G.ease.in);
    CS.remove(car);
    await G.say(null, 'O carro some morro abaixo. A matilha sobe até o galpão.');

    // 2) Os dois presos nos pilares se soltam
    CS.setBg('bg_galpao');
    const sch = CS.add('schneider', { x: 96, y: 166, scale: 1.5 });
    const cib = CS.add('ciborgue', { x: 282, y: 166, scale: 1.5, pose: 0 });
    const r1 = ropes(sch, 108), r2 = ropes(cib, 108);
    await G.say(null, 'Lá dentro, Schneider e o Ciborgue da Pentex seguem amarrados em dois pilares.');
    await CS.talk('busto_schneider_ri', 'SCHNEIDER', 'Vocês acham mesmo que uma corda é capaz de nos conter? Tolos!', { side: 'right' });
    for (let i = 0; i < 5; i++) {
      G.sfx('buzz'); G.shake(3 + i, 220);
      sch.x += i % 2 ? 3 : -3; cib.x += i % 2 ? -3 : 3;
      sch.flash = cib.flash = .5;
      await G.wait(220);
    }
    G.sfx('snap'); await G.wait(90); G.sfx('snap');
    r1.snap(); r2.snap();
    await CS.impact(8, 450, '#ffb060', 'explode');
    G.speedLines(500, 1, 'rgba(255,255,255,.7)', true);
    await Promise.all([G.tween(sch, { x: 110 }, 250, G.ease.back), G.tween(cib, { x: 270 }, 250, G.ease.back)]);
    cib.pose = 1; G.sfx('heavy');
    await G.say(null, 'As cordas arrebentam. Os dois se soltam, furiosos, e se preparam pro combate.');
    CS.remove(r1.layer); CS.remove(r2.layer);
    G.sfx('laugh');
    await CS.talk('busto_schneider_ri', 'SCHNEIDER', 'Agora sim. Vamos conversar direito.', { side: 'right' });
    await CS.close();
  },

  async vulto() {
    const mata = G.art.get('bg_mata') ? 'bg_mata' : 'cs_mata';
    await CS.open(mata);
    // arbustos em primeiro plano + folhas que caem quando eles mexem
    const bushes = [[64, 222, 0], [196, 228, 1], [330, 220, 2]].map(([x, y, f]) => CS.add('arbustos', { x, y, pose: f, scale: 1.1 }));
    const leaves = [];
    CS.addDraw(ctx => {
      for (const lf of leaves) {
        const t = (G.time - lf.t0) / 1200;
        if (t > 1) continue;
        ctx.globalAlpha = 1 - t; ctx.fillStyle = lf.c;
        ctx.fillRect(Math.round(lf.x + Math.sin(t * 9 + lf.k) * 6), Math.round(lf.y + t * 40), 2, 1);
      }
      ctx.globalAlpha = 1;
    });
    const rustle = async (b, force = 1) => {
      G.sfx('rustle');
      for (let i = 0; i < 6; i++) leaves.push({ x: b.x + G.rand(-30, 30), y: b.y - G.rand(60, 100), c: i % 2 ? '#3a7a50' : '#6ab0a0', t0: G.time, k: G.rand(0, 6) });
      const x0 = b.x;
      for (let i = 0; i < 6; i++) { b.x = x0 + (i % 2 ? -3 : 3) * force; b.rot = (i % 2 ? -.03 : .03) * force; await G.wait(55); }
      b.x = x0; b.rot = 0;
    };
    G.sfx('wind');
    await G.wait(900);
    // arbustos se mexendo, sem revelar nada
    await rustle(bushes[2]); await G.wait(500);
    await rustle(bushes[0]); await G.wait(300);
    await G.say('JAN', 'Tem coisa se mexendo na mata. Rápido demais pra ser gente.');
    await rustle(bushes[1], 1.5); await G.wait(250); await rustle(bushes[2], 1.2);
    G.shake(1, 300);
    await G.wait(400);
    const corvo = CS.add('espelho', { x: 200, y: 110 });
    await CS.slideIn(corvo, 'right', 420);
    await G.tween(corvo, { x: 150, y: 70 }, 500, G.ease.inOut);
    CS.setBg('cs_mente');
    CS.remove(corvo); bushes.forEach(b => { b.alpha = 0; });
    await CS.talk('busto_espelho', 'ESPELHO (TELEPATICAMENTE)', 'Se engrossar aqui fora, matem esses desgraçados aí dentro.', { color: '#d8b8ff' });
    CS.setBg(mata); bushes.forEach(b => { b.alpha = 1; });
    G.sfx('magic');
    await G.flashScreen('#b86bff', .6, 300);
    const card = enemyWaysCard();
    await G.say('ESPELHO', 'Atenção, Lobos. Tem prata na área.', { color: '#d8b8ff' });
    CS.remove(card);
    // os arbustos explodem e as agentes saltam
    await Promise.all([rustle(bushes[0], 2.5), rustle(bushes[2], 2.5)]);
    // 32-bit: dobro de pixels e 96 cores, desenhadas na metade da escala (mesmo tamanho na tela)
    const ag = G.art.get('agente_32') ? ['agente_32', .5] : ['agente', 2];
    const a1 = CS.add(ag[0], { x: 120, y: 162, scale: ag[1] });
    const a2 = CS.add(ag[0], { x: 260, y: 162, scale: ag[1] });
    await CS.slideIn(a1, 'left', 260);
    await CS.slideIn(a2, 'right', 260);
    await CS.impact(4, 200, '#e8f0ff', 'slash');
    await G.say(null, 'As agentes saltam da mata. O Ciborgue e o Schneider recuam pro fundo do galpão.');
    CS.remove(a1); CS.remove(a2);
    G.sfx('laugh');
    await CS.talk('busto_schneider_ri', 'SCHNEIDER', 'Heh. Brinquem com elas primeiro.', { side: 'right' });
    await CS.close();
  },

  async agenteProvoca() {
    await CS.open('cs_impacto', { fade: false });
    await CS.talk('busto_agente', 'AGENTE', 'Sintam minha prata em sua carne.', { color: '#ffc080', shake: 3 });
    await CS.close();
  },

  async retorno(glockNames) {
    await CS.open('cs_impacto');
    if (glockNames.length) {
      // M91: close da mão alcançando a arma no chão
      if (G.art.get('mao_glock')) {
        CS.setBg('mao_glock');
        G.sfx('snap'); G.shake(2, 150);
      }
      const dois = glockNames.length > 1;
      await G.say(null, `As agentes caem e largam as Glocks. ${glockNames.join(' e ')} ${dois ? 'pegam uma arma cada' : 'pega uma das armas'}: 8 balas${dois ? ' em cada' : ''}.`, { color: '#ffe070' });
      CS.setBg('cs_impacto');
    }

    const sch = CS.add('schneider', { x: 110, y: 164, scale: 1.5 });
    const cib = CS.add('ciborgue', { x: 290, y: 164, scale: 1.5 });
    await CS.slideIn(sch, 'left', 280);
    await CS.slideIn(cib, 'right', 280, 'heavy');
    G.shake(5, 250);
    CS.remove(sch); CS.remove(cib);
    await CS.talk('busto_schneider_furia', 'SCHNEIDER', 'Chega de aquecimento. A loba primeiro. A que canta.', { side: 'right', shake: 4 });
    await CS.close();
  },

  async execucao() {
    await CS.open('cs_impacto');
    const val = CS.add('valeria', { x: 140, y: 160, tint: { color: '#600000', alpha: .35 }, pose: 2 });
    const cib = CS.add('ciborgue', { x: 300, y: 164, scale: 1.5 });
    await CS.slideIn(cib, 'right', 260, 'heavy');
    cib.pose = 1;
    await G.tween(cib, { x: 220 }, 140, G.ease.in);
    await CS.impact(10, 500, '#ff3030', 'heavy');
    val.rot = -Math.PI / 2; val.y = 196;
    await G.say(null, 'O Ciborgue executa a Valéria. O corpo cai e não se mexe.');
    CS.remove(cib); CS.remove(val);
    G.sfx('laugh');
    await CS.talk('busto_schneider_ri', 'SCHNEIDER', 'HAHAHAHA! Uma a menos.', { side: 'right' });
    const v = G.B.party.find(p => p.id === 'valeria');
    const d = await reviveSequence(v, 'valeria_crinos', { label: 'FRENESI SELVAGEM · ROLE O D10', intro: 'Mas a Fúria não morre junto. Algo no chão ainda respira.' });
    await CS.close();
    return d;
  },

  async revive(a, warSprite) {
    await CS.open('cs_mente');
    const d = await reviveSequence(a, warSprite);
    await CS.close();
    return d;
  },

  // M13: a transformação do Schneider em fomor, por etapas.
  async fomor() {
    await CS.open('cs_fomor');
    const sch = CS.add('schneider', { x: G.W / 2, y: 162, scale: 1.5 });
    await CS.talk('busto_schneider_furia', 'SCHNEIDER', 'Vocês não fazem ideia do que eu sou.', { side: 'right' });
    G.sfx('transform');
    // rachaduras verdes crescendo pelo corpo
    const cracks = { n: 0 };
    const crackLayer = CS.addDraw(ctx => {
      ctx.fillStyle = '#90ff50';
      for (let i = 0; i < cracks.n; i++) {
        const sx = G.W / 2 - 40 + ((i * 37) % 80), sy = 90 + ((i * 53) % 100);
        for (let j = 0; j < 10; j++) ctx.fillRect(Math.round(sx + Math.sin(i + j) * j), Math.round(sy + j * 1.5), 1, 2);
      }
    });
    for (let i = 0; i < 6; i++) {
      cracks.n += 4; sch.flash = .6;
      G.shake(2 + i, 180);
      sch.scale = 1.5 + i * .03;
      await G.wait(260);
    }
    // alterna humano/monstro cada vez mais rápido
    for (let i = 0; i < 8; i++) {
      sch.sprite = i % 2 ? 'schneider' : 'fomor'; sch.scale = i % 2 ? 1.6 : 1.4; sch.y = 212;
      G.sfx('hit'); G.shake(4, 100);
      await G.wait(180 - i * 15);
    }
    CS.remove(crackLayer); CS.remove(sch);
    // explosão de gosma e revelação
    const slime = CS.addDraw(ctx => {
      for (let i = 0; i < 60; i++) {
        const t = ((G.time - slime.t0) / 900);
        const an = i / 60 * Math.PI * 2, r = t * (60 + (i % 7) * 12);
        ctx.globalAlpha = Math.max(0, 1 - t);
        ctx.fillStyle = i % 2 ? '#90ff50' : '#3a7020';
        ctx.fillRect(Math.round(G.W / 2 + Math.cos(an) * r), Math.round(130 + Math.sin(an) * r * .6 + t * t * 40), 3, 3);
      }
      ctx.globalAlpha = 1;
    });
    slime.t0 = G.time;
    G.flashScreen('#c0ff90', 1, 500);
    const f = CS.add('fomor', { x: G.W / 2, y: 164, scale: 1.2, pose: 1 });
    G.speedLines(900, 1, 'rgba(180,255,140,.7)', true);
    await CS.impact(14, 900, '#80ff40', 'roar');
    await G.say(null, 'A pele racha. Guelras, olhos saltados, uma boca que não fecha. A forma anfíbia completa. É horrendo.', { color: '#c8ff90' });
    CS.remove(slime); CS.remove(f);
  },

  // M92: um D10 por personagem rolando lado a lado; depois a tabela com o resultado.
  async testeVontade(results) {
    G.cs.active = true;
    CS.setBg('cs_mente');
    const n = results.length, gap = Math.min(72, (G.W - 40) / n);
    const dice = results.map((r, i) => ({ r, x: G.W / 2 + (i - (n - 1) / 2) * gap, y: -50, ang: i * 1.3, shown: '?', done: false, glow: 0 }));
    const diceLayer = CS.addDraw(ctx => {
      G.text(ctx, 'TESTE DE FORÇA DE VONTADE · DIFICULDADE 6', G.W / 2, 14, '#ffe070', 'center');
      dice.forEach(d => {
        if (d.r.down) { G.text(ctx, 'CAÍDO', d.x, 86, '#7c7c96', 'center'); }
        else {
          ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.ellipse(d.x, 124, 22, 4, 0, 0, 7); ctx.fill();
          drawD10(ctx, d.x, d.y, d.ang, 0, d.shown, d.glow, d.done && !d.r.ok ? '255,90,90' : d.done ? '120,255,150' : '255,230,120');
        }
        G.text(ctx, d.r.name, d.x, 138, '#ffffff', 'center');
        if (d.done && !d.r.down) G.text(ctx, d.r.ok ? 'RESISTE' : 'FALHA', d.x, 152, d.r.ok ? '#70ff90' : '#ff7070', 'center');
      });
    });
    const roll = async (d, delay) => {
      await G.wait(delay);
      if (d.r.down) { d.done = true; return; }
      G.sfx('dice');
      const t0 = G.time, dur = 900;
      await new Promise(res => {
        const step = () => {
          const p = Math.min(1, (G.time - t0) / dur);
          // cai e quica duas vezes, girando e trocando o número
          const b = p < .5 ? p / .5 : p < .8 ? (p - .5) / .3 : (p - .8) / .2;
          const hgt = p < .5 ? 150 : p < .8 ? 36 : 12;
          d.y = p < .5 ? -50 + (92 + 50) * (b * b) : 92 - Math.sin(b * Math.PI) * hgt;
          d.ang += .45 * (1 - p * .6); d.shown = G.randInt(1, 10);
          if (p >= .5 && !d.b1) { d.b1 = true; G.sfx('dice'); G.shake(1, 60); }
          if (p < 1) G.wait(16).then(step); else res();
        };
        step();
      });
      d.y = 92; d.ang = Math.round(d.ang / (Math.PI * 2)) * Math.PI * 2; d.shown = d.r.roll; d.done = true;
      d.glow = .45; G.tween(d, { glow: 0 }, 700);
      G.sfx(d.r.ok ? 'ok' : 'buzz'); if (!d.r.ok) G.shake(3, 150);
    };
    await Promise.all(dice.map((d, i) => roll(d, i * 220)));
    await G.wait(700);
    await G.waitAdvance();
    CS.remove(diceLayer);
    // tabela com o resultado
    const layer = CS.addDraw(ctx => {
      G.window(ctx, 30, 30, G.W - 60, 24 + results.length * 16);
      G.text(ctx, 'TESTE DE FORÇA DE VONTADE', G.W / 2, 38, '#ffe070', 'center');
      results.forEach((r, i) => {
        if (i >= layer.shown) return;
        G.text(ctx, r.name, 44, 58 + i * 16);
        if (r.down) { G.text(ctx, 'caído, não testa', G.W - 42, 58 + i * 16, '#7c7c96', 'right'); return; }
        G.text(ctx, `D10:${r.roll}`, 136, 58 + i * 16, '#c8d0ff');
        G.text(ctx, r.ok ? 'RESISTE' : r.catatonico ? 'CATATÔNICO 3T' : 'PERDE 1 TURNO', G.W - 42, 58 + i * 16, r.ok ? '#70ff90' : '#ff7070', 'right');
      });
    });
    layer.shown = 0;
    for (let i = 0; i < results.length; i++) { await G.wait(250); layer.shown = i + 1; G.sfx('cursor'); }
    await G.wait(300);
    await G.waitAdvance();
    await CS.close();
  },

  async drones(cibAlive) {
    await CS.open('cs_fomor');
    await CS.talk('busto_fomor', 'SCHNEIDER', 'Desgraçados. Acham mesmo que podem me conter?', { side: 'right', color: '#b0ff80', shake: 5 });
    const f = CS.add('fomor', { x: G.W / 2, y: 164, scale: 1.2, pose: 2 });
    await G.tween(f, { x: 90, alpha: .4 }, 500, G.ease.inOut);
    await G.say(null, 'O fomor recua, arfando, pra se recuperar. O Ciborgue vem à frente.');
    CS.remove(f);
    if (cibAlive) {
      CS.setBg('cs_impacto');
      await CS.talk('busto_ciborgue', 'CIBORGUE', 'Cachorros versus máquinas. Patético.', { color: '#bfe8ff', shake: 3 });
      const cib = CS.add('ciborgue', { x: 250, y: 162, scale: 1.5 });
      await CS.slideIn(cib, 'right', 300, 'heavy');
      G.sfx('transform');
      for (let i = 0; i < 3; i++) { cib.flash = 1; G.shake(3 + i * 2, 150); await G.wait(180); }
      cib.sprite = 'ciborgue_sb'; cib.pose = 0;
      G.sfx('explode');
      const d1 = CS.add('drone', { x: cib.x - 40, y: 130 });
      const d2 = CS.add('drone', { x: cib.x + 40, y: 130 });
      G.speedLines(600, 1, 'rgba(160,220,255,.8)', true);
      await Promise.all([G.tween(d1, { x: 120, y: 70 }, 500, G.ease.back), G.tween(d2, { x: 320, y: 80 }, 500, G.ease.back)]);
      d1.pose = 1; d2.pose = 1; G.sfx('rocket');
      await G.say(null, 'Os braços desacoplam do corpo e levantam voo: dois drones lança-foguetes.', { color: '#bfe8ff' });
    } else {
      await G.say(null, 'Mas o Ciborgue já está no chão. Dois drones de reserva saem da carcaça e levantam voo.', { color: '#bfe8ff' });
    }
    await CS.close();
  },

  // m18
  async fomorVolta() {
    await CS.open('cs_fomor');
    const f = CS.add('fomor', { x: G.W / 2, y: 164, scale: 1.2, pose: 1 });
    await CS.slideIn(f, 'left', 400, 'roar');
    await CS.impact(10, 500, '#80ff40', 'roar');
    await G.say(null, 'Schneider, o monstro anfíbio, retorna para a batalha.', { color: '#b0ff80' });
    CS.remove(f);
    await CS.talk('busto_fomor', 'SCHNEIDER', 'Seus idiotas! Morram, imprestáveis!', { side: 'right', color: '#b0ff80', shake: 7 });
    await CS.close();
  },

  // M15
  async uktenaInvoca() {
    await CS.open('cs_uktena', { fade: false });
    G.sfx('magic');
    await CS.talk('busto_espelho', 'ESPELHO', 'Uktena. Você disse que perscruta a Wyrm. Ela tá aqui na minha frente.', { side: 'left', color: '#d8b8ff' });
    const glow = CS.addDraw(ctx => {
      const g = ctx.createRadialGradient(G.W - 96, 80, 5, G.W - 96, 80, 120);
      g.addColorStop(0, 'rgba(200,150,255,.5)'); g.addColorStop(1, 'rgba(200,150,255,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, G.W, G.H);
    });
    await CS.talk('busto_uktena', 'UKTENA', 'Eu vejo. Prepare-se, Corvo. O espírito Uktena está convosco.', { side: 'right', color: '#9ff0e8' });
    CS.remove(glow);
    await CS.close();
  },

  // M16: Uktena reúne energia na boca e solta um jato espiralado de fogo púrpura no fomor.
  async chamasPurpuras() {
    await CS.open('cs_uktena', { fade: false });
    const ukt = CS.add('uktena', { x: 300, y: 164, scale: 1.6, pose: 0 });
    await CS.slideIn(ukt, 'right', 400, 'transform');
    const cap = CS.caption('CHAMAS PÚRPURAS', '#e0a0ff', 10);
    const mouth = [232, 52];
    // energia sendo sugada pra boca
    const gather = CS.addDraw(ctx => {
      for (let i = 0; i < 40; i++) {
        const t = ((G.real / 600) + i / 40) % 1;
        const an = i * 2.4, r = (1 - t) * 90;
        ctx.fillStyle = i % 2 ? '#e0a0ff' : '#8a2ae0';
        ctx.fillRect(Math.round(mouth[0] + Math.cos(an) * r), Math.round(mouth[1] + Math.sin(an) * r), 2, 2);
      }
    });
    G.sfx('charge');
    for (let i = 0; i < 4; i++) { G.shake(1 + i, 200); await G.wait(250); }
    CS.remove(gather);
    ukt.pose = 1;
    const f = CS.add('fomor', { x: 80, y: 164, scale: 1.2, pose: 2 });
    G.sfx('fire');
    // jato de fogo: labaredas que saem da boca e se abrem até o fomor
    const fire = { reach: 0 };
    G.tween(fire, { reach: 1 }, 500, G.ease.out);
    const beam = CS.addDraw(ctx => G.fireStream(ctx, mouth[0], mouth[1], 110, 86, fire.reach, 1.4));
    G.speedLines(1600, -1, 'rgba(210,140,255,.8)', true);
    for (let i = 0; i < 4; i++) { G.shake(7, 300); G.flashScreen('#b050ff', .3, 200); await G.wait(360); }
    // o fomor pega fogo: labaredas em volta e por cima do corpo
    const burn = CS.addDraw(ctx => {
      const w = 150, h = 130;
      for (let i = 0; i < 8; i++) G.flameTongue(ctx, f.x - w / 2 + i * w / 7, f.y, 30 + (i % 3) * 14, 16, i);
      for (let i = 0; i < 4; i++) { G.flameTongue(ctx, f.x - w / 2, f.y - h * (.2 + i * .18), 26, 12, i + 10); G.flameTongue(ctx, f.x + w / 2, f.y - h * (.25 + i * .18), 26, 12, i + 20); }
      for (let i = 0; i < 5; i++) G.flameTongue(ctx, f.x - w / 3 + i * w / 6, f.y - h * .78, 34 + (i % 2) * 12, 16, i + 30);
    });
    f.tint = { color: '#b050ff', alpha: .45 };
    await CS.impact(12, 800, '#d070ff', 'explode');
    await G.say(null, 'O Espelho chama, e o Uktena responde: fogo púrpura direto na boca do Schneider. O fomor queima por dentro e agoniza.', { color: '#e8d0ff' });
    [cap, beam, burn, f, ukt].forEach(CS.remove);
    await CS.close();
  },

  // m19: a Valéria arranca a cabeça do fomor — versão longa, com sangue, gosma e respingo na tela.
  async finalValeria() {
    await CS.open('cs_impacto');
    // 32-bit: fomor e Valéria com o dobro de pixels (desenhados na metade da escala, mesmo tamanho na tela)
    const fs = G.art.get('fomor_32') || G.art.get('fomor');
    const f = { x: 110, y: 164, sc: G.art.get('fomor_32') ? .6 : 1.2, headOff: [0, 0], headRot: 0, headOut: false, fall: 0, alpha: 1, sway: 0, kneel: 0 };
    const HEAD = .38; // parte de cima do sprite que vira a cabeça
    const neck = () => { const h = fs ? fs.fh * f.sc : 130; return [f.x + f.sway, f.y - h + (fs ? fs.fh * HEAD * f.sc : 50) + f.fall + f.kneel]; };
    // partículas de sangue/gosma no mundo (caem com gravidade e mancham o chão)
    const drops = [], pools = [];
    const spray = (x, y, n, { ang = -Math.PI / 2, spread = 1.2, vmin = 1, vmax = 4, green = .35, big = false } = {}) => {
      for (let i = 0; i < n; i++) {
        const a = ang + G.rand(-spread, spread), v = G.rand(vmin, vmax);
        const isG = Math.random() < green;
        drops.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, s: big ? G.randInt(2, 5) : G.randInt(1, 3), g: isG, c: isG ? (i % 2 ? '#8ae040' : '#4a9a20') : (i % 3 ? '#a01010' : '#e02020'), t0: G.time });
      }
    };
    // o caldo tóxico: jatos grossos e contínuos saindo do pescoço, e vapor verde subindo das poças
    const broth = { on: false, power: 0 };
    const steam = [];
    // respingos na "lente" (tela), escorrendo devagar
    const splats = [];
    const splatScreen = (n, { green = .3 } = {}) => {
      for (let i = 0; i < n; i++) {
        const g = Math.random() < green;
        splats.push({ x: G.rand(10, G.W - 10), y: G.rand(0, G.H - 60), f: (g ? 3 : 0) + G.randInt(0, 2), sc: G.rand(.35, .7), flip: Math.random() < .5, t0: G.time, slide: G.rand(4, 14) });
      }
    };
    const body = CS.addDraw(ctx => {
      if (!fs) return;
      const w = fs.fw * f.sc, h = fs.fh * f.sc, x = f.x - w / 2 + f.sway, y = f.y - h + f.kneel;
      ctx.globalAlpha = f.alpha;
      // poças de sangue no chão
      pools.forEach(p => { const k = Math.min(1, (G.time - p.t0) / 1500); ctx.fillStyle = p.c; ctx.beginPath(); ctx.ellipse(p.x, 166, p.r * k, p.r * k * .22, 0, 0, 7); ctx.fill(); });
      const sy = f.headOut ? fs.fh * HEAD : 0;
      ctx.drawImage(fs.img, 2 * fs.fw, sy, fs.fw, fs.fh - sy, x, y + sy * f.sc + f.fall, w, h - sy * f.sc);
      // chamas púrpuras ainda comendo o corpo
      if (f.alpha > .5) for (let i = 0; i < 5; i++) G.flameTongue(ctx, x + 20 + i * (w - 40) / 4, y + h + f.fall, 18 + (i % 2) * 10, 9, i + 50);
      if (f.headOut) {
        ctx.save();
        ctx.translate(x + w / 2 + f.headOff[0], y + fs.fh * HEAD * f.sc / 2 + f.headOff[1]);
        ctx.rotate(f.headRot);
        ctx.drawImage(fs.img, 2 * fs.fw, 0, fs.fw, fs.fh * HEAD, -w / 2, -fs.fh * HEAD * f.sc / 2, w, fs.fh * HEAD * f.sc);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    });
    const brothLayer = CS.addDraw(ctx => {
      if (broth.on) {
        const [nx, ny] = neck();
        if (G.art.get('jato_toxico')) {
          const pw = broth.power;
          // gêiser (sprite 32-bit animado) saindo do pescoço, com um segundo jato inclinado atrás
          G.art.draw(ctx, 'jato_toxico', nx - 14, ny + 6, { scale: .28 * pw, alpha: .8, flipX: true });
          G.art.draw(ctx, 'jato_toxico', nx, ny + 6, { scale: .36 * pw * (1 + Math.sin(G.real / 80) * .05) });
        }
        // bolhas estourando na boca do pescoço
        for (let i = 0; i < 6; i++) { const b = ((G.real / 300) + i / 6) % 1; ctx.fillStyle = '#b8ff70'; ctx.beginPath(); ctx.arc(nx - 12 + i * 5, ny - b * 10, 2 + (1 - b) * 3, 0, 7); ctx.fill(); }
      }
      steam.forEach(st => {
        const t = (G.time - st.t0) / 2600; if (t < 0 || t > 1) return;
        ctx.globalAlpha = (1 - t) * .35; ctx.fillStyle = '#8ad850';
        ctx.beginPath(); ctx.arc(st.x + Math.sin(t * 6 + st.k) * 6, 166 - t * 70, 4 + t * 14, 0, 7); ctx.fill();
      });
      ctx.globalAlpha = 1;
    });
    const gore = CS.addDraw(ctx => {
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i], t = (G.time - d.t0) / 16;
        const x = d.x + d.vx * t, y = d.y + d.vy * t + .06 * t * t;
        if (y > 168) {
          if (Math.random() < .15) pools.push({ x, r: G.rand(6, 16), c: d.c, t0: G.time });
          if (d.g && Math.random() < .08) steam.push({ x, k: Math.random() * 6, t0: G.time });
          drops.splice(i, 1); continue;
        }
        ctx.fillStyle = d.c; ctx.fillRect(Math.round(x), Math.round(y), d.s, d.s + 1);
      }
    });
    const lens = CS.addDraw(ctx => {
      const img = G.art.get('respingos');
      splats.forEach(s => {
        const t = Math.min(1, (G.time - s.t0) / 3000);
        const pop = Math.min(1, (G.time - s.t0) / 90); // estala na lente e escorre devagar
        if (img) G.art.draw(ctx, 'respingos', s.x, s.y + img.fh * s.sc * .5 + s.slide * t, { frame: s.f, scale: s.sc * (.6 + .4 * pop), alpha: .92, flipX: s.flip });
      });
    });
    const v32 = G.art.get('valeria_crinos_32');
    const v = CS.add(v32 ? 'valeria_crinos_32' : 'valeria_crinos', { x: 340, y: 162, pose: 0, scale: v32 ? .5 : 2 });
    const staggering = setInterval(() => { f.sway = Math.sin(G.time / 180) * 4; }, 30);
    await G.say(null, 'O fomor cambaleia, em chamas, babando ácido pelo chão do galpão.');
    await CS.talk('busto_fomor', 'SCHNEIDER', 'Vocês... não entendem... A Pentex é maior que tudo isso!', { side: 'left', color: '#b0ff80', shake: 3 });
    await CS.talk('busto_valeria_crinos', 'VALÉRIA', 'Então manda lembranças pra eles.', { color: '#ff9a9a', shake: 2 });
    // corrida e salto
    v.pose = 1; G.sfx('dash'); G.sfx('roar');
    G.speedLines(700, -1, 'rgba(255,255,255,.8)', true);
    await G.tween(v, { x: 230 }, 200, G.ease.in);
    await G.tween(v, { x: 170, y: 150 }, 180, G.ease.out);
    // três garradas cruzadas, cada uma abrindo um talho que espirra
    const slashes = [];
    const slashLayer = CS.addDraw(ctx => {
      slashes.forEach(s => {
        const t = (G.time - s.t0) / 350;
        if (t > 1) return;
        ctx.globalAlpha = 1 - t; ctx.fillStyle = s.c;
        for (let i = 0; i < 60; i++) ctx.fillRect(Math.round(s.x + i * s.dx), Math.round(s.y + i * s.dy), 3, 2);
        ctx.globalAlpha = 1;
      });
    });
    for (let i = 0; i < 3; i++) {
      slashes.push({ x: 60 + i * 14, y: 70, dx: 1.3, dy: 1.4, c: i % 2 ? '#ff4040' : '#ffffff', t0: G.time });
      G.sfx('slash'); G.shake(6, 150); G.flashScreen('#ff2020', .3, 120);
      spray(100 + i * 18, 95 + i * 12, 26, { ang: -Math.PI / 4, spread: 1.4, vmax: 5 });
      if (i === 2) splatScreen(4);
      await G.wait(170);
    }
    await CS.talk('busto_fomor', 'SCHNEIDER', 'Ghhk... isso... não termina aqui...', { side: 'left', color: '#b0ff80', shake: 4 });
    await G.say(null, 'Ela se atira no peito do monstro e crava as garras fundo no pescoço.');
    await CS.talk('busto_valeria_crinos', 'VALÉRIA', 'Você me matou uma vez. Olha bem pra mim agora.', { color: '#ff6060', shake: 5 });
    await CS.talk('busto_valeria_crinos', 'VALÉRIA', 'Termina sim. Termina comigo.', { color: '#ff6060', shake: 3 });
    // o puxão: tremor crescendo, o pescoço cedendo, gosma escorrendo
    G.sfx('growl');
    const pullLine = G.say(null, 'Os tendões estalam um a um. Um caldo verde e fervente começa a vazar pelas bordas das garras.', { color: '#b0ff80' });
    for (let i = 0; i < 6; i++) {
      const [nx, ny] = neck();
      spray(nx, ny, 8 + i * 3, { spread: .9, vmin: .5, vmax: 2 + i * .4, green: .75, big: i > 2 });
      G.shake(2 + i, 180); v.flash = .3; G.sfx(i % 2 ? 'hit' : 'buzz');
      await G.wait(260 - i * 15);
    }
    await pullLine;
    // a cabeça sai
    G.slowmo(.25, 900);
    G.hitstop(260);
    clearInterval(staggering);
    await CS.impact(16, 800, '#ff1010', 'explode');
    f.headOut = true;
    const [nx, ny] = neck();
    // jato arterial contínuo do pescoço + respingo na tela
    broth.on = true; G.tween(broth, { power: 1 }, 250, G.ease.out);
    G.sfx('fire');
    const fountain = setInterval(() => spray(nx + f.sway, ny + f.fall, 10, { spread: .6, vmin: 2.5, vmax: 7, green: .85, big: true }), 40 / G.speed);
    splatScreen(12, { green: .7 });
    G.flashScreen('#a00000', .5, 300);
    G.tween(f.headOff, { 0: -90, 1: -70 }, 500, G.ease.out).then(() => G.tween(f.headOff, { 0: -135, 1: 88 }, 520, G.ease.in));
    G.tween(f, { headRot: -Math.PI * 2.5 }, 1020, G.ease.linear);
    await G.wait(1050);
    G.sfx('thud'); G.shake(6, 300);
    spray(f.x - 135 + 20, 160, 30, { spread: 1.3, vmax: 3 });
    await G.say(null, 'Com um puxão seco, a cabeça sai inteira.', { color: '#ff7070' });
    splatScreen(5, { green: .9 }); G.sfx('fire'); G.shake(4, 400);
    await G.say(null, 'Um jorro de caldo tóxico explode do pescoço: verde, espesso, fervendo. Onde cai, o concreto chia e derrete.', { color: '#b0ff80' });
    await CS.talk('busto_espelho', 'ESPELHO (TELEPATICAMENTE)', 'Por Hélius, Fúria Negra!', { color: '#d8b8ff' });
    await G.tween(broth, { power: .35 }, 900, G.ease.inOut);
    clearInterval(fountain);
    const drip = setInterval(() => spray(nx + f.sway, ny + f.fall, 3, { spread: .3, vmin: .5, vmax: 1.5, green: .95, big: true }), 90 / G.speed);
    // o corpo ajoelha e desaba numa poça, ainda escorrendo
    await G.tween(f, { kneel: 18 }, 500, G.ease.in);
    clearInterval(drip); broth.on = false;
    for (let i = 0; i < 8; i++) steam.push({ x: f.x - 40 + i * 12, k: i, t0: G.time + i * 150 });
    G.sfx('thud'); G.shake(5, 250);
    pools.push({ x: f.x, r: 60, c: '#6a0808', t0: G.time }, { x: f.x + 20, r: 70, c: '#3a8a18', t0: G.time }, { x: f.x - 30, r: 40, c: '#6ac828', t0: G.time });
    await G.tween(f, { fall: 30 }, 500, G.ease.in);
    G.sfx('heavy'); G.shake(8, 400);
    v.pose = 0; v.y = 166;
    G.sfx('howlFury');
    await CS.impact(8, 500, '#ff2020', 'roar');
    await G.say('VALÉRIA', 'RRRRAAAAAAAHHHH!!', { color: '#ff6060' });
    await CS.talk('busto_tinga_archid', 'TINGA', 'Esse derreteu no próprio lodo tóxico.', { color: '#ffc070', shake: 2 });
    // M56: close da pata erguendo a cabeça (segura bastante na tela e corta seco pro M73); o respingo fica na lente
    f.alpha = 0; v.alpha = 0;
    [body, slashLayer, gore, brothLayer].forEach(CS.remove);
    CS.remove(lens); splats.length = 0; // o troféu entra limpo, sem respingo cobrindo a cabeça
    const trophy = CS.add('valeria_cabeca', { x: G.W / 2, y: 172, scale: 1 });
    await CS.slideIn(trophy, 'bottom', 450, 'heavy');
    G.shake(4, 300);
    G.sfx('roar');
    await G.tween(trophy, { y: 166 }, 3800, G.ease.inOut); // sobe devagar, erguendo o troféu
    await G.wait(600);
    [trophy, v].forEach(CS.remove);
  },

  // Matias no barranco (depois que as agentes caem): isqueiro, trago, peteleco, cigarro em câmera lenta,
  // a brasa cai na trilha de gasolina, o fogo corre até o carro, explosão; ele vai embora e um pneu voa por cima dele.
  async matiasCigarro() {
    const bar = G.art.get('bg_barranco') ? 'bg_barranco' : 'bg_estrada';
    G.cs.active = true; CS.setBg(bar); G.cs.layers = [];
    const barsDraw = ctx => { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, G.W, 14); ctx.fillRect(0, G.H - 14, G.W, 14); };
    const cap = CS.caption('ENQUANTO ISSO, NO ALTO DO BARRANCO', '#ffd8a0', 22);
    const m = CS.add('matias', { x: 130, y: 66, scale: .9, flipX: true, pose: 0 }); // de pé na beirada do barranco
    const mh = (G.art.get('matias') || { fh: 53 }).fh * .9;
    const cig = { on: false, glow: 0 };
    const smoke = [];
    const head = () => [m.x + 6, m.y - mh * .84];
    const fx = CS.addDraw(ctx => {
      if (cig.on) {
        const [cx, cy] = head();
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 6 + cig.glow * 8);
        g.addColorStop(0, `rgba(255,160,60,${.5 + cig.glow * .5})`); g.addColorStop(1, 'rgba(255,120,40,0)');
        ctx.fillStyle = g; ctx.fillRect(cx - 16, cy - 16, 32, 32);
        ctx.fillStyle = '#ffb040'; ctx.fillRect(Math.round(cx), Math.round(cy), 2, 1);
      }
      smoke.forEach(sm => { const t = (G.time - sm.t0) / 2600; if (t < 0 || t > 1) return; ctx.globalAlpha = (1 - t) * .45; ctx.fillStyle = '#c8c8d8'; ctx.beginPath(); ctx.arc(sm.x + t * 22 + Math.sin(t * 5 + sm.k) * 3, sm.y - t * 30, 2 + t * 9, 0, 7); ctx.fill(); ctx.globalAlpha = 1; });
      barsDraw(ctx);
    });
    G.sfx('wind');
    await G.wait(1400);
    CS.remove(cap);
    // 1) close: o isqueiro (a chama tremula e ilumina o rosto)
    if (G.art.get('matias_isqueiro')) {
      CS.setBg('matias_isqueiro');
      const flame = CS.addDraw(ctx => { ctx.fillStyle = `rgba(255,140,40,${.06 + Math.random() * .09})`; ctx.fillRect(0, 0, G.W, G.H); barsDraw(ctx); });
      G.sfx('cursor'); await G.wait(250); G.sfx('snap'); G.flashScreen('#ffb060', .25, 120);
      await G.wait(1700);
      CS.remove(flame);
      CS.setBg(bar);
    }
    // 2) o trago: a brasa acende forte, fumaça sai devagar
    cig.on = true;
    await G.tween(cig, { glow: 1 }, 900, G.ease.inOut);
    await G.tween(cig, { glow: .25 }, 600);
    const [hx, hy] = head();
    for (let i = 0; i < 6; i++) smoke.push({ x: hx + 4, y: hy, k: i, t0: G.time + i * 140 });
    G.sfx('wind');
    await G.wait(1300);
    // 3) o peteleco em close: empurra a câmera, estalo, faíscas saindo da ponta dos dedos
    if (G.art.get('matias_peteleco')) {
      const pet = G.art.get('matias_peteleco');
      const push = { z: 1, t0: 0, flick: false };
      const sparks = [];
      CS.setBg(null);
      const close = CS.addDraw(ctx => {
        ctx.save(); ctx.translate(G.W / 2, G.H / 2); ctx.scale(push.z, push.z); ctx.translate(-G.W / 2, -G.H / 2);
        ctx.drawImage(pet.img, 0, 0);
        ctx.restore();
        if (push.flick) {
          const t = Math.min(1, (G.time - push.t0) / 600);
          ctx.globalAlpha = 1 - t; ctx.fillStyle = '#ffffff';
          for (let i = 0; i < 5; i++) ctx.fillRect(Math.round(200 + t * 60), Math.round(60 + i * 7), Math.round(40 * (1 - t)), 1);
          ctx.globalAlpha = 1;
        }
        sparks.forEach(sp => { const t = (G.time - sp.t0) / 700; if (t > 1) return; ctx.globalAlpha = 1 - t; ctx.fillStyle = t < .3 ? '#fff4b0' : '#ff8030'; ctx.fillRect(Math.round(sp.x + sp.vx * t * 40), Math.round(sp.y + sp.vy * t * 40 + t * t * 14), 2, 2); ctx.globalAlpha = 1; });
        barsDraw(ctx);
      });
      await G.tween(push, { z: 1.12 }, 700, G.ease.in);
      push.flick = true; push.t0 = G.time;
      G.sfx('snap'); G.sfx('whoosh'); G.hitstop(120); G.shake(3, 200);
      for (let i = 0; i < 18; i++) sparks.push({ x: 285, y: 72, vx: G.rand(-.4, 1.4), vy: G.rand(-1, 1), t0: G.time });
      await G.tween(push, { z: 1 }, 500, G.ease.out);
      await G.wait(600);
      CS.remove(close);
      CS.setBg(bar);
    }
    m.pose = 1; cig.on = false; m.alpha = 0; // nos closes ele sai de quadro
    // 4) câmera lenta: ilustração do cigarro caindo sobre o vale (imagem gerada), com zoom lento e brasas vivas
    G.timeScale = .6;
    if (G.art.get('cigarro_queda')) {
      const pic = G.art.get('cigarro_queda');
      const cam = { z: 1, dx: 0, dy: 0 };
      const ember = [228, 118];
      const sparks = [];
      const slow = CS.addDraw(ctx => {
        ctx.save(); ctx.translate(ember[0], ember[1]); ctx.scale(cam.z, cam.z); ctx.translate(-ember[0] + cam.dx, -ember[1] + cam.dy);
        ctx.drawImage(pic.img, 0, 0); ctx.restore();
        const pulse = .6 + Math.sin(G.real / 120) * .25;
        const g = ctx.createRadialGradient(ember[0], ember[1], 0, ember[0], ember[1], 26);
        g.addColorStop(0, `rgba(255,220,120,${pulse})`); g.addColorStop(.35, `rgba(255,110,30,${pulse * .6})`); g.addColorStop(1, 'rgba(255,60,0,0)');
        ctx.fillStyle = g; ctx.fillRect(ember[0] - 30, ember[1] - 30, 60, 60);
        sparks.forEach(sp => { const t = (G.time - sp.t0) / 1300; if (t > 1) return; ctx.globalAlpha = 1 - t; ctx.fillStyle = t < .3 ? '#fff0a0' : '#ff7020'; ctx.fillRect(Math.round(sp.x - t * 40 + Math.sin(t * 8 + sp.k) * 3), Math.round(sp.y - t * 28), 1, 1); ctx.globalAlpha = 1; });
        barsDraw(ctx);
      });
      const emit = setInterval(() => sparks.push({ x: ember[0] + G.rand(-3, 3), y: ember[1] + G.rand(-3, 3), k: Math.random() * 6, t0: G.time }), 45 / G.speed);
      G.sfx('wind');
      await G.tween(cam, { z: 1.22, dx: 8, dy: 10 }, 3200, G.ease.inOut);
      clearInterval(emit); CS.remove(slow);
    }
    G.timeScale = 1;
    // 5) lá embaixo: a brasa cai na trilha de gasolina, o fogo corre até o carro
    let boomX = 300, boomY = 176;
    if (G.art.get('carro_vale')) {
      CS.setBg('carro_vale');
      const path = [[18, 190], [60, 180], [100, 174], [140, 166], [180, 160], [220, 154], [255, 150]];
      const fire = { reach: 0, drop: 0, lit: false };
      // chama laranja de gasolina (a do Uktena é roxa)
      const fogo = (ctx, x, y, h, w, seed) => {
        for (let yy = 0; yy < h; yy++) {
          const t = yy / h, ww = w * (1 - t * .8), sway = Math.sin(t * 5 + G.real / 70 + seed) * t * 2;
          ctx.fillStyle = t < .25 ? '#fff4c0' : t < .5 ? '#ffc040' : t < .8 ? '#ff7020' : '#a02010';
          ctx.fillRect(Math.round(x - ww / 2 + sway), Math.round(y - yy), Math.max(1, Math.round(ww)), 1);
        }
      };
      const at = (k) => { const n = path.length - 1, f = Math.min(n - 1e-6, k * n), i = Math.floor(f), r = f - i; return [G.lerp(path[i][0], path[i + 1][0], r), G.lerp(path[i][1], path[i + 1][1], r)]; };
      const valley = CS.addDraw(ctx => {
        if (!fire.lit) {
          const x = 18, y = G.lerp(-20, 188, fire.drop);
          ctx.fillStyle = '#f0ece0'; ctx.fillRect(x - 5, Math.round(y) - 1, 9, 2);
          ctx.fillStyle = '#ff7020'; ctx.fillRect(x + 4, Math.round(y) - 1, 2, 2);
        }
        if (fire.lit) {
          const steps = Math.floor(fire.reach * 40);
          for (let i = 0; i <= steps; i++) { const [x, y] = at(i / 40); fogo(ctx, x, y, 9 + (i % 3) * 3, 5, i); }
          const glow = ctx.createRadialGradient(...at(fire.reach), 0, ...at(fire.reach), 50);
          glow.addColorStop(0, 'rgba(255,150,40,.35)'); glow.addColorStop(1, 'rgba(255,150,40,0)');
          ctx.fillStyle = glow; ctx.fillRect(0, 0, G.W, G.H);
        }
        barsDraw(ctx);
      });
      await G.tween(fire, { drop: 1 }, 700, G.ease.in);
      fire.lit = true; G.sfx('fire'); G.flashScreen('#ff9030', .3, 150);
      await G.wait(400);
      await G.tween(fire, { reach: 1 }, 1800, G.ease.in);
      G.sfx('fire'); G.shake(2, 300);
      await G.wait(350);
      // clarão da explosão no close
      G.flashScreen('#ffffff', 1, 250); G.sfx('explode'); G.hitstop(150);
      CS.remove(valley);
    }
    // 6) plano aberto: ele já vira as costas; o vale explode, onda de choque, destroços, coluna de fumaça, pneu voando
    CS.setBg(bar);
    m.pose = 2; m.flipX = false; m.alpha = 1;
    const walk = G.tween(m, { x: 30 }, 3400, G.ease.linear);
    const boom = { t0: G.time };
    const debris = Array.from({ length: 28 }, (_, i) => ({ a: -Math.PI / 2 + G.rand(-1.3, 1.3), v: G.rand(1.5, 4.5), s: G.randInt(1, 3), c: i % 3 ? '#2a2a2a' : '#c03020' }));
    const tire = { x: 300, y: 170, rot: 0, on: false };
    const arc = { t: 0 };
    const blast = CS.addDraw(ctx => {
      const t = (G.time - boom.t0) / 1600;
      // coluna de fumaça (fica)
      for (let i = 0; i < 12; i++) {
        const k = Math.min(1, (G.time - boom.t0) / 3000);
        ctx.globalAlpha = .35; ctx.fillStyle = i % 2 ? '#3a3440' : '#2a2630';
        ctx.beginPath(); ctx.arc(boomX + Math.sin(i + G.real / 700) * 8, boomY - i * 12 * k, 10 + i * 2 * k, 0, 7); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (t < 1) {
        // onda de choque
        ctx.strokeStyle = `rgba(255,220,160,${1 - t})`; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.ellipse(boomX, boomY, t * 140, t * 40, 0, 0, 7); ctx.stroke();
        // bola de fogo em camadas
        for (let i = 0; i < 18; i++) {
          const a = i / 18 * Math.PI * 2, r = 8 + t * 70 * (.6 + (i % 3) * .2);
          ctx.globalAlpha = Math.max(0, 1 - t);
          ctx.fillStyle = i % 3 === 0 ? '#fff0a0' : i % 3 === 1 ? '#ff9030' : '#c02010';
          ctx.beginPath(); ctx.arc(boomX + Math.cos(a) * r * .7, boomY - Math.abs(Math.sin(a)) * r, 7 + (1 - t) * 12, 0, 7); ctx.fill();
        }
        ctx.globalAlpha = 1;
        // destroços
        debris.forEach(d => { const k = t * 60; ctx.fillStyle = d.c; ctx.fillRect(Math.round(boomX + Math.cos(d.a) * d.v * k), Math.round(boomY + Math.sin(d.a) * d.v * k + .05 * k * k), d.s, d.s); });
      }
      const glow = ctx.createRadialGradient(boomX, boomY, 0, boomX, boomY, 150);
      glow.addColorStop(0, `rgba(255,140,40,${Math.max(.12, .5 - t * .3) * (.85 + Math.random() * .15)})`); glow.addColorStop(1, 'rgba(255,100,20,0)');
      ctx.fillStyle = glow; ctx.fillRect(0, 0, G.W, G.H);
      if (tire.on) {
        tire.x = G.lerp(300, -40, arc.t); tire.y = G.lerp(176, 40, arc.t) - Math.sin(arc.t * Math.PI) * 100;
        ctx.save(); ctx.translate(tire.x, tire.y); ctx.rotate(tire.rot);
        ctx.fillStyle = '#141414'; ctx.beginPath(); ctx.arc(0, 0, 11, 0, 7); ctx.fill();
        ctx.fillStyle = '#3a3a3a'; ctx.beginPath(); ctx.arc(0, 0, 7, 0, 7); ctx.fill();
        ctx.fillStyle = '#9a9aa0'; ctx.beginPath(); ctx.arc(0, 0, 4, 0, 7); ctx.fill();
        ctx.fillStyle = '#ff7020'; ctx.fillRect(-11, -2, 3, 3); ctx.fillRect(8, 1, 3, 3);
        ctx.restore();
      }
      barsDraw(ctx);
    });
    await CS.impact(12, 900, '#ffb060', 'explode');
    G.sfx('explode'); G.shake(6, 600);
    await G.wait(300);
    tire.on = true; G.sfx('whoosh');
    G.tween(tire, { rot: -Math.PI * 9 }, 1700, G.ease.linear);
    await G.tween(arc, { t: 1 }, 1700, G.ease.linear);
    tire.on = false; G.sfx('thud'); G.shake(2, 150);
    await walk;
    // 7) close do sorriso de canto de boca
    CS.remove(m); CS.remove(fx); CS.remove(blast);
    if (G.art.get('matias_sorriso')) CS.setBg('matias_sorriso');
    const embers = CS.addDraw(ctx => {
      for (let i = 0; i < 30; i++) { const t = ((G.real / 2200) + i / 30) % 1; ctx.globalAlpha = 1 - t; ctx.fillStyle = i % 2 ? '#ffb040' : '#ff6020'; ctx.fillRect(Math.round((i * 53) % G.W + Math.sin(t * 6 + i) * 6), Math.round(G.H - t * G.H), 2, 2); }
      ctx.globalAlpha = 1; barsDraw(ctx);
    });
    await G.wait(900);
    await G.say('MATIAS', 'Vai ser uma longa caminhada de volta agora.', { color: '#ffd8a0' });
    CS.remove(embers);
    G.cs.layers = [];
  },

  // Close do 1º golpe (imagem gerada), no estilo do close da Glock: empurra a câmera, clarão, tremor.
  async golpeClose(img, sfx = 'heavy') {
    if (!G.art.get(img)) return;
    const pic = G.art.get(img);
    await CS.open('cs_impacto', { fade: false });
    CS.setBg(null);
    const cam = { z: 1.12 };
    const layer = CS.addDraw(ctx => {
      ctx.save(); ctx.translate(G.W / 2, G.H / 2); ctx.scale(cam.z, cam.z); ctx.translate(-G.W / 2, -G.H / 2);
      ctx.drawImage(pic.img, 0, 0); ctx.restore();
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, G.W, 12); ctx.fillRect(0, G.H - 12, G.W, 12);
    });
    G.speedLines(700, 1, 'rgba(255,255,255,.6)', true);
    G.sfx('whoosh');
    await G.tween(cam, { z: 1 }, 280, G.ease.in);
    G.sfx(sfx); G.flashScreen('#ffffff', .7, 120); G.shake(5, 250); G.hitstop(100);
    await G.wait(750);
    CS.remove(layer);
    G.cs.active = false; G.cs.layers = [];
  },

  // Crítico dos inimigos: close com fala.
  async critInimigo(e) {
    const kind = e.id.startsWith('agente') ? 'agente' : e.id.startsWith('drone') ? 'drone' : e.id === 'ciborgue' ? 'ciborgue' : e.id;
    const T = {
      schneider: ['busto_schneider_ri', 'SCHNEIDER', '#c8d0ff', ['Isso é o que acontece com cachorro que morde a mão errada.', 'Ajoelhem. A Pentex manda lembranças.', 'Heh. Quebrou? Que pena.']],
      fomor: ['busto_fomor', 'SCHNEIDER', '#b0ff80', ['BLUAAARGH! Sintam a Wyrm!', 'Vou digerir vocês devagar.', 'Carne de lobo... que delícia.']],
      ciborgue: ['busto_ciborgue', 'CIBORGUE', '#bfe8ff', ['Alvo neutralizado. Próximo.', 'Carne é fraca.', 'Cachorros versus máquinas. Um a zero.']],
      agente: ['busto_agente', 'AGENTE', '#ffc080', ['Prata na veia, lobinho.', 'Fica quietinho que dói menos.', 'Mais um pra coleção da Pentex.']],
      drone: ['busto_ciborgue', 'DRONE', '#bfe8ff', ['ALVO ATINGIDO. RECARREGANDO.', 'IMPACTO CONFIRMADO.', 'AMEAÇA REDUZIDA.']],
    }[kind];
    if (!T) return;
    G.lastEnemyLine = G.lastEnemyLine || {};
    const opts = T[3].filter(t => t !== G.lastEnemyLine[kind]);
    const text = opts.at(G.randInt(0, opts.length - 1));
    G.lastEnemyLine[kind] = text;
    await G.SCENES.closeRapido(T[0], T[1], text, T[2], { sfx: kind === 'fomor' ? 'roar' : 'crit', shake: 4 });
  },

  // Entreato: a cena do Matias como um bloco próprio (abre e fecha a tela de cena).
  async matiasEntreato() {
    await G.fadeTo(1, 350);
    const cena = G.SCENES.matiasCigarro();
    await G.fadeTo(0, 450);
    await cena;
    await CS.close();
  },

  // Mira dos drones: HUD vermelho trava num personagem.
  async miraDrones(alvo) {
    await CS.open('cs_impacto', { fade: false });
    const bust = G.SCENES.bustoDe(alvo);
    const b = CS.add(bust, { x: G.W / 2, y: 180, scale: 1, tint: { color: '#ff0000', alpha: .25 } });
    const hud = { r: 90, lock: 0 };
    const layer = CS.addDraw(ctx => {
      ctx.fillStyle = 'rgba(255,0,0,.06)'; ctx.fillRect(0, 0, G.W, G.H);
      for (let y = 0; y < G.H; y += 3) { ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.fillRect(0, y, G.W, 1); }
      const cx = G.W / 2, cy = 92, r = hud.r;
      ctx.strokeStyle = hud.lock ? '#ff2020' : '#ff6060'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - r - 14, cy); ctx.lineTo(cx - r * .4, cy); ctx.moveTo(cx + r * .4, cy); ctx.lineTo(cx + r + 14, cy);
      ctx.moveTo(cx, cy - r - 14); ctx.lineTo(cx, cy - r * .4); ctx.moveTo(cx, cy + r * .4); ctx.lineTo(cx, cy + r + 14); ctx.stroke();
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => { ctx.fillStyle = '#ff3030'; ctx.fillRect(cx + sx * (r + 6) - 4, cy + sy * (r + 6) - 1, 8, 2); ctx.fillRect(cx + sx * (r + 6) - 1, cy + sy * (r + 6) - 4, 2, 8); });
      G.text(ctx, hud.lock ? `ALVO TRAVADO: ${alvo.name}` : 'PROCURANDO ALVO...', G.W / 2, 12, '#ff4040', 'center');
      if (hud.lock && Math.floor(G.real / 200) % 2) G.text(ctx, 'FOGUETE ARMADO', G.W / 2, 176, '#ffb0b0', 'center');
    });
    for (let i = 0; i < 5; i++) { G.sfx('cursor'); await G.tween(hud, { r: 90 - (i + 1) * 12 }, 180, G.ease.out); }
    hud.lock = 1; G.sfx('buzz'); G.shake(3, 200); b.flash = .6;
    await G.wait(1300);
    [b, layer].forEach(CS.remove);
    G.cs.active = false; G.cs.layers = [];
  },

  // Último de pé: close de resistência + sussurro do Uktena.
  async ultimoDePe(a) {
    const FALA = {
      espelho: 'Sobrou eu. Tá bom. Eu sempre gostei de plateia.',
      valeria: 'Eu canto sozinha, então. Venham.',
      jan: 'Um Von Martius não foge. Nem sozinho.',
      tinga: 'Mais carne pra mim! HRAAAAH!',
      sangria: 'GRRRRRRR... AUUUUUUUUUU!',
    };
    const cor = { espelho: '#d8b8ff', valeria: '#ff9a9a', jan: '#c8e0ff', tinga: '#ffc070', sangria: '#ff7060' }[a.id];
    await CS.open('cs_mente', { fade: false });
    G.sfx('thud');
    await CS.talk(G.SCENES.bustoDe(a), a.name, FALA[a.id] || '...', { color: cor, keep: false, shake: 2 });
    const glow = CS.addDraw(ctx => { const g = ctx.createRadialGradient(G.W - 96, 80, 5, G.W - 96, 80, 140); g.addColorStop(0, 'rgba(160,240,230,.3)'); g.addColorStop(1, 'rgba(160,240,230,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, G.W, G.H); });
    G.sfx('magic');
    await CS.talk('busto_uktena', 'UKTENA (SUSSURRO)', 'Não desista.', { color: '#9ff0e8' });
    CS.remove(glow);
    G.cs.active = false; G.cs.layers = []; G.ui.dialog = null;
  },

  // Primeira transformação em campo: close da forma nova se apresentando.
  async primeiraForma(a) {
    const FALA = {
      espelho: 'Agora o céu é meu.',
      valeria: 'Agora vocês vão ouvir a Fúria.',
      jan: 'Permitam-me... tirar as luvas.',
      tinga: 'O lagarto acordou!',
      sangria: 'RRRRAAAAAUUUUUUU!!',
    };
    const cor = { espelho: '#d8b8ff', valeria: '#ff9a9a', jan: '#c8e0ff', tinga: '#ffc070', sangria: '#ff7060' }[a.id];
    await G.SCENES.closeRapido(G.SCENES.bustoDe(a), a.name, FALA[a.id] || '...', cor, { sfx: 'roar', shake: 6 });
  },

  // Ataque em dupla: close dividido com os dois.
  async ataqueDupla(a, b) {
    await CS.open('cs_impacto', { fade: false });
    const side = (key, s) => { const info = BUSTS[key] || { faces: 'left' }; return info.faces !== (s === 'left' ? 'right' : 'left'); };
    const ka = G.SCENES.bustoDe(a), kb = G.SCENES.bustoDe(b);
    // bustos menores, cada um na sua metade, olhando pro centro: os dois rostos ficam livres
    const la = CS.add(ka, { x: 92, y: 172, scale: .78, flipX: side(ka, 'left') }), lb = CS.add(kb, { x: G.W - 92, y: 172, scale: .78, flipX: side(kb, 'right') });
    const mid = CS.addDraw(ctx => {
      ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(0, 0, G.W / 2 - 2, 176); ctx.fillRect(G.W / 2 + 2, 0, G.W / 2, 176);
      ctx.fillStyle = '#fff'; ctx.fillRect(G.W / 2 - 1, 0, 2, 176);
    });
    CS.remove(mid); G.cs.layers.unshift(mid);
    G.sfx('crit');
    await Promise.all([CS.slideIn(la, 'left', 300, 'whoosh'), CS.slideIn(lb, 'right', 300, null)]);
    G.shake(5, 300); G.flashScreen('#ffffff', .5, 150);
    const cap = CS.caption(`ATAQUE EM DUPLA · ${a.name} + ${b.name}`, '#ffe070', 186);
    await G.wait(1100);
    [la, lb, mid, cap].forEach(CS.remove);
    G.cs.active = false; G.cs.layers = [];
  },

  // Cena pós-créditos: a Pentex assistindo.
  async posCreditos() {
    await CS.open(G.art.get('bg_pentex') ? 'bg_pentex' : 'cs_mente');
    const flick = CS.addDraw(ctx => { ctx.fillStyle = `rgba(80,200,160,${.03 + Math.random() * .04})`; ctx.fillRect(0, 0, G.W, G.H); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, G.W, 14); ctx.fillRect(0, G.H - 14, G.W, 14); });
    const cap = CS.caption('ENQUANTO ISSO...', '#9ad0c0', 22);
    G.sfx('buzz');
    await G.wait(1800);
    CS.remove(cap);
    await G.say('???', 'Interessante.', { color: '#c8d0c0' });
    await G.say('???', 'Mandem a próxima equipe. Tragam-me as carcaças dessas criaturas vulgares.', { color: '#c8d0c0' });
    G.sfx('laugh');
    await G.wait(600);
    await G.fadeTo(1, 900);
    G.cs.layers = [];
    const fim = CS.caption('CONTINUA...', '#ffe070', G.H / 2 - 6);
    CS.setBg(null);
    await G.fadeTo(0, 500);
    await G.wait(1800);
    CS.remove(fim); CS.remove(flick);
    await CS.close();
  },

  // Close deslizando + fala. kind: 'crit' (golpe crítico) ou 'mata' (o golpe vai derrubar o inimigo).
  // Sorteio sem repetir: cada fala sai da lista quando usada; quando a lista acaba, ela recomeça (nunca a mesma duas vezes seguidas).
  async ameaca(a, kind = 'crit', fixed = null) {
    const F = FALAS_CRIT[a.id];
    if (!F) return false;
    G.usedLines = G.usedLines || new Set();
    G.lastLine = G.lastLine || {};
    const pick = (list) => {
      if (!list || !list.length) return null;
      let left = list.filter(t => !G.usedLines.has(t));
      if (!left.length) { list.forEach(t => G.usedLines.delete(t)); left = list.filter(t => t !== G.lastLine[a.id] || list.length === 1); }
      return left.at(G.randInt(0, left.length - 1));
    };
    const text = fixed || pick(kind === 'mata' ? F.mata : a.form ? F.guerra : F.natural);
    if (!text) return false;
    G.usedLines.add(text); G.lastLine[a.id] = text;
    const war = { espelho_guerra: 'busto_espelho_guerra', sangria_crinos: 'busto_sangria_crinos', jan_crinos: 'busto_jan_crinos', valeria_crinos: 'busto_valeria_crinos', archid: 'busto_tinga_archid' }[a.form];
    const bust = (war && G.art.get(war)) ? war : `busto_${a.id}`;
    const fera = a.id === 'sangria' || a.id === 'tinga';
    await CS.open('cs_impacto', { fade: false });
    G.flashScreen('#ffffff', .6, 150);
    G.sfx(a.id === 'sangria' ? (/^A+U|UUU/.test(text) ? 'howl' : 'growl') : fera ? 'growl' : 'crit');
    await CS.talk(bust, a.name, text, { color: F.cor, shake: fera ? 6 : 3 });
    G.cs.active = false; G.cs.layers = []; G.ui.dialog = null; // volta seco pro golpe
    return true;
  },

  // Busto da forma atual de um personagem da matilha.
  bustoDe(a) {
    const war = { espelho_guerra: 'busto_espelho_guerra', sangria_crinos: 'busto_sangria_crinos', jan_crinos: 'busto_jan_crinos', valeria_crinos: 'busto_valeria_crinos', archid: 'busto_tinga_archid' }[a.form];
    return (war && G.art.get(war)) ? war : `busto_${a.id}`;
  },
  async closeRapido(bust, nome, texto, cor, { bg = 'cs_impacto', sfx = 'crit', shake = 3 } = {}) {
    await CS.open(bg, { fade: false });
    G.flashScreen('#ffffff', .4, 150); G.sfx(sfx);
    await CS.talk(bust, nome, texto, { color: cor, shake });
    G.cs.active = false; G.cs.layers = []; G.ui.dialog = null;
  },

  // 1ª queda de cada personagem: um aliado reage.
  async reacaoQueda(quem, caido) {
    const N = caido.name.charAt(0) + caido.name.slice(1).toLowerCase();
    const FALA = {
      espelho: [`Levanta, porra! ${N}!`, `Ô ${N}, não é hora de cochilo!`],
      valeria: [`${N}! Não ouse morrer aqui!`, `Levanta, ${N}! A canção ainda não acabou!`],
      jan: [`${N}! Aguente firme, por Gaia.`, `Não... ${N}, ainda não.`],
      tinga: [`${N}! Eu vou comer quem fez isso!`, `NÃO! ${N}! HRAAAAH!`],
      sangria: ['AUUUUUUUU...', 'Hrrr... hrrrr... AUUUU!'],
    };
    const cor = { espelho: '#d8b8ff', valeria: '#ff9a9a', jan: '#c8e0ff', tinga: '#ffc070', sangria: '#ff7060' }[quem.id];
    const list = FALA[quem.id];
    await G.SCENES.closeRapido(G.SCENES.bustoDe(quem), quem.name, list.at(G.randInt(0, list.length - 1)), cor, { sfx: quem.id === 'sangria' ? 'howl' : 'thud', shake: 4 });
  },

  // Últimas palavras das agentes e do Ciborgue.
  async ultimasPalavras(e) {
    if (e.id.startsWith('agente')) {
      const primeira = !G.SCENES._agenteCaiu; G.SCENES._agenteCaiu = true;
      await G.SCENES.closeRapido('busto_agente', 'AGENTE', primeira ? 'A Pentex... vai mandar mais.' : 'Isso... não acabou...', '#ffc080', { sfx: 'thud', shake: 2 });
      return;
    }
    // Ciborgue: ajoelha soltando faíscas e devolve a própria frase, agora como ironia
    await CS.open('cs_impacto', { fade: false });
    const c = CS.add(e.sprite, { x: G.W / 2, y: 170, scale: 1.5, tint: { color: '#200000', alpha: .3 } });
    const sparks = CS.addDraw(ctx => {
      for (let i = 0; i < 14; i++) {
        const t = ((G.real / 500) + i / 14) % 1;
        ctx.globalAlpha = 1 - t; ctx.fillStyle = i % 2 ? '#ffe070' : '#8ad8ff';
        ctx.fillRect(Math.round(G.W / 2 - 40 + (i * 23) % 80 + t * (i % 2 ? 20 : -20)), Math.round(100 + (i * 17) % 50 - t * 30), 2, 2);
      }
      ctx.globalAlpha = 1;
    });
    G.sfx('buzz'); G.shake(3, 400);
    await G.tween(c, { y: 186, rot: .12 }, 500, G.ease.in);
    CS.remove(c); CS.remove(sparks);
    await CS.talk(G.art.get('busto_ciborgue_derrotado') ? 'busto_ciborgue_derrotado' : 'busto_ciborgue', 'CIBORGUE', 'Cachorros... versus... máquinas...', { color: '#bfe8ff', shake: 2 });
    G.cs.active = false; G.cs.layers = []; G.ui.dialog = null;
  },

  // Jan sai da catatonia.
  async janVolta(jan) {
    await G.SCENES.closeRapido(G.SCENES.bustoDe(jan), 'JAN', 'Perdoem. Eu estava... em outro lugar.', '#c8e0ff', { bg: 'cs_mente', sfx: 'magic', shake: 0 });
  },

  // 1ª cura do Uktena.
  async uktenaCura() {
    await G.SCENES.closeRapido('busto_uktena', 'UKTENA', 'Cabeças erguidas, espíritos de Gaia.', '#9ff0e8', { bg: 'cs_uktena', sfx: 'heal', shake: 0 });
  },

  // 1º tiro de Glock: close do cano disparando.
  async glockDispara(a) {
    if (!G.art.get('glock_tiro')) return;
    await CS.open('glock_tiro', { fade: false });
    G.sfx('shot'); G.flashScreen('#fff4c0', .8, 120); G.shake(4, 200); G.hitstop(90);
    await G.wait(260);
    G.sfx('shot'); G.flashScreen('#fff4c0', .6, 100); G.shake(3, 150);
    await G.wait(600);
    G.cs.active = false; G.cs.layers = [];
  },

  // Schneider provocando na virada das fases.
  async schneiderProvoca(k) {
    if (k === 'resiste') {
      G.sfx('laugh');
      await G.SCENES.closeRapido('busto_schneider_ri', 'SCHNEIDER', 'Heh. Cócegas. É só isso que a matilha tem?', '#c8d0ff', { sfx: 'laugh', shake: 2 });
    } else if (k === 'fase3') {
      await CS.open('cs_fomor', { fade: false });
      G.sfx('roar');
      await CS.talk('busto_fomor', 'SCHNEIDER', 'Agora sim. Agora vocês vão sentir o gosto da Wyrm.', { color: '#b0ff80', shake: 6 });
      await CS.close();
    }
  },

  // Schneider (fomor) antes do vômito tóxico: 50% de chance de aparecer.
  async fomorVomita() {
    const FALAS = ['Engole isso, vira-lata!', 'Bebam, cachorrinhos. É por minha conta.', 'Guardei isso aqui especialmente pra vocês.', 'Que cheirinho bom de lobo cozido. HAHAHA!'];
    await CS.open('cs_fomor', { fade: false });
    G.flashScreen('#80ff40', .4, 150);
    G.sfx('roar');
    await CS.talk('busto_fomor', 'SCHNEIDER', FALAS[G.randInt(0, FALAS.length - 1)], { color: '#b0ff80', shake: 5 });
    G.cs.active = false; G.cs.layers = []; G.ui.dialog = null;
  },

  // M73 → M74 → M75: corte seco pra matilha vitoriosa, o Uktena reconhece a Valéria, o uivo em volta do corpo,
  // e o corvo sai pelo buraco do teto e voa até a lua (tudo na mesma linguagem ilustrada).
  async uivoFinal() {
    // M73: corte seco, sem fade
    G.cs.active = true; G.cs.layers = []; CS.setBg('bg_final_chao');
    const dust = CS.addDraw(ctx => {
      for (let i = 0; i < 50; i++) {
        const x = (i * 67 + G.real * .006 * (i % 5 + 1)) % G.W, y = (i * 41 + Math.sin(G.real / 900 + i) * 8) % 180;
        ctx.globalAlpha = .25 + (i % 4) * .12; ctx.fillStyle = '#c8d8ff';
        ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
      }
      ctx.globalAlpha = 1;
    });
    const bars = CS.addDraw(ctx => { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, G.W, 14); ctx.fillRect(0, G.H - 14, G.W, 14); });
    G.shake(6, 300);
    G.sfx('victory');
    await G.wait(3200);
    await G.say(null, 'O monstro cai sem cabeça. A matilha se ergue sobre os escombros, viva.', { color: '#c8d8ff' });
    CS.remove(dust); CS.remove(bars);
    await G.fadeTo(1, 400);
    G.cs.active = false;
    await G.SCENES.reconhecimento({ keepOpen: true });
    // M74: plano vertical, começa embaixo (matilha uivando em volta do corpo) e sobe até o buraco no teto
    await G.fadeTo(1, 10);
    G.cs.active = true; G.cs.layers = []; CS.setBg(null);
    const tall = G.art.get('bg_final_alto'), sky = G.art.get('bg_final_ceu');
    const cam = { y: tall ? tall.fh - G.H : 0, img: tall, fade: 0 };
    // o corvo sai do meio da matilha e sobe
    const crow = { x: 60, y: 560, s: .8, on: false, sil: 0 };
    const pan = CS.addDraw(ctx => {
      if (cam.img) ctx.drawImage(cam.img.img, 0, -Math.round(cam.y));
      for (let i = 0; i < 70; i++) {
        const x = (i * 53 + G.real * .005 * (i % 4 + 1)) % G.W, y = (i * 97) % 683 - cam.y;
        if (y < 0 || y > G.H) continue;
        ctx.globalAlpha = .3; ctx.fillStyle = '#c8d8ff'; ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
      }
      ctx.globalAlpha = 1;
      if (crow.on) G.art.draw(ctx, 'espelho', crow.x, crow.y - cam.y, { scale: crow.s, tint: { color: '#0a0818', alpha: crow.sil } });
      if (cam.fade > 0) { ctx.fillStyle = `rgba(210,220,255,${cam.fade})`; ctx.fillRect(0, 0, G.W, G.H); }
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, G.W, 14); ctx.fillRect(0, G.H - 14, G.W, 14);
    });
    await G.fadeTo(0, 700);
    await G.wait(700);
    G.sfx('howlChorus');
    await G.wait(1800);
    // a câmera sobe da matilha até o buraco do teto (o Corvo guerreiro fica de pé na imagem)
    await G.tween(cam, { y: 0 }, 7000, G.ease.inOut);
    await G.wait(500);
    // M75: continuação por fora do galpão, na mesma ilustração: sai pelo buraco do teto e sobe até a lua
    await G.tween(cam, { fade: 1 }, 250);
    if (sky) { cam.img = sky; cam.y = sky.fh - G.H; }
    Object.assign(crow, { x: 212, y: 566, s: .55, sil: .35, on: true });
    await G.tween(cam, { fade: 0 }, 400);
    G.sfx('wind');
    G.tween(cam, { y: 0 }, 7000, G.ease.inOut);
    G.tween(crow, { sil: 1 }, 6500);
    await G.tween(crow, { x: 196, y: 130, s: .3 }, 7000, G.ease.inOut);
    // atravessa a lua e some na luz
    G.sfx('howl');
    await G.tween(crow, { x: 250, y: 70, s: .12 }, 1600, G.ease.in);
    crow.on = false;
    await G.wait(1800);
    CS.remove(pan);
    await CS.close();
  },

  // O Uktena reconhece a Valéria; o símbolo dele acende em púrpura no peito dela.
  async reconhecimento({ keepOpen = false } = {}) {
    await CS.open('cs_uktena');
    // 32-bit: sprite com o dobro de pixels e 96 cores, desenhado na metade da escala (mesmo tamanho na tela)
    const v32 = G.art.get('valeria_crinos_32');
    const v = CS.add(v32 ? 'valeria_crinos_32' : 'valeria_crinos', { x: 110, y: 162, pose: 0, scale: v32 ? .5 : 2 });
    // brasas roxas subindo em volta dela
    const motes = CS.addDraw(ctx => {
      for (let i = 0; i < 26; i++) {
        const t = ((G.real / 2400) + i / 26) % 1;
        ctx.globalAlpha = (1 - t) * .7; ctx.fillStyle = i % 3 ? '#c080ff' : '#ffffff';
        ctx.fillRect(Math.round(v.x - 60 + (i * 37) % 120 + Math.sin(G.real / 400 + i) * 4), Math.round(v.y - t * 150), 1, 1);
      }
      ctx.globalAlpha = 1;
    });
    const glow = { a: 0 };
    const sym = G.art.get('simbolo_uktena');
    const symLayer = CS.addDraw(ctx => {
      if (!sym || glow.a <= 0) return;
      const cx = v.x + 4, cy = v.y - 84; // peito da Valéria (escala 2)
      const pulse = .6 + Math.sin(G.real / 250) * .4;
      const g = ctx.createRadialGradient(cx, cy, 2, cx, cy, 40);
      g.addColorStop(0, `rgba(200,120,255,${.6 * glow.a * pulse})`); g.addColorStop(1, 'rgba(200,120,255,0)');
      ctx.fillStyle = g; ctx.fillRect(cx - 40, cy - 40, 80, 80);
      const [tc, tx] = G.makeCanvas(sym.fw, sym.fh);
      tx.drawImage(sym.img, 0, 0);
      tx.globalCompositeOperation = 'source-in';
      tx.fillStyle = pulse > .8 ? '#ffffff' : '#d890ff'; tx.fillRect(0, 0, sym.fw, sym.fh);
      ctx.globalAlpha = glow.a;
      ctx.drawImage(tc, Math.round(cx - sym.fw / 2), Math.round(cy - sym.fh / 2));
      ctx.globalAlpha = 1;
    });
    await CS.talk('busto_uktena', 'UKTENA', 'Muito bem, criança. Você demonstra seu valor e espírito no combate à Wyrm.', { side: 'right', color: '#9ff0e8', keep: false });
    G.sfx('magic');
    G.flashScreen('#c080ff', .6, 400);
    await G.tween(glow, { a: 1 }, 800);
    await CS.talk('busto_uktena', 'UKTENA', 'Erga-se agora, Voz da Fúria. Como a Galliard de Algozes de Anhangá.', { side: 'right', color: '#9ff0e8' });
    G.sfx('victory');
    await G.say(null, 'O símbolo Uktena arde aceso no peito de Valéria.', { color: '#e0b0ff' });
    [symLayer, v, motes].forEach(CS.remove);
    if (keepOpen) { await G.fadeTo(1, 300); G.ui.dialog = null; return; }
    await CS.close();
  },
};
