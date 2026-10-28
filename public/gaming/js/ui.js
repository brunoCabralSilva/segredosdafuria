// Interface estilo FF de SNES: janelas azuis, menus com a mãozinha, painel da party, faixa de ação.
// Texto em resolução "32-bit", fonte simples (Arial) pra leitura fácil: negrito nos menus e nomes.
G.FONT = 'bold 9px Arial, Helvetica, sans-serif';
G.FONT_SMALL = '9px Arial, Helvetica, sans-serif';
G.ui = { menu: null, target: null, banner: null, dialog: null };

G.text = (ctx, str, x, y, color = '#ffffff', align = 'left', font = G.FONT) => {
  ctx.font = font;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  const w = ctx.measureText(str).width;
  const dx = Math.round(align === 'center' ? x - w / 2 : align === 'right' ? x - w : x);
  ctx.fillStyle = '#000'; ctx.fillText(str, dx + .5, y + .5);
  ctx.fillStyle = color; ctx.fillText(str, dx, y);
  return w;
};

// Janela azul com borda clara (FF6).
G.window = (ctx, x, y, w, h) => {
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, '#3848b8'); g.addColorStop(1, '#0e1650');
  ctx.fillStyle = g; ctx.fillRect(x + 1, y + 1, w - 2, h - 2);
  ctx.fillStyle = '#e8e8f4';
  ctx.fillRect(x + 1, y, w - 2, 1); ctx.fillRect(x + 1, y + h - 1, w - 2, 1);
  ctx.fillRect(x, y + 1, 1, h - 2); ctx.fillRect(x + w - 1, y + 1, 1, h - 2);
  ctx.fillStyle = '#7880a8';
  ctx.fillRect(x + 2, y + 1, w - 4, 1); ctx.fillRect(x + 1, y + 2, 1, h - 4);
};

// Quebra o texto em linhas pela largura real da fonte compacta.
const wrap = (ctx, text, maxW) => {
  ctx.font = G.FONT_SMALL;
  const lines = [''];
  text.split(' ').forEach(w => {
    const tryL = (lines[lines.length - 1] + ' ' + w).trim();
    if (ctx.measureText(tryL).width > maxW && lines[lines.length - 1]) lines.push(w); else lines[lines.length - 1] = tryL;
  });
  return lines;
};
const bar = (ctx, x, y, w, h, frac, color, back = '#1a1a2a') => {
  ctx.fillStyle = back; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = color; ctx.fillRect(x, y, Math.round(w * G.clamp(frac, 0, 1)), h);
};
G.bar = bar;

// Cor do HP: verde cheio → amarelo → laranja → vermelho.
G.hpColor = (frac) => frac > .6 ? ['#58e070', '#a8ffb0'] : frac > .4 ? ['#d8e040', '#fbff9a'] : frac > .2 ? ['#f09030', '#ffd090'] : ['#e83838', '#ff9a9a'];
// Barra de HP caprichada: moldura escura, fundo, cor por faixa e brilho em cima.
G.hpBar = (ctx, x, y, w, h, frac) => {
  const [c, hi] = G.hpColor(frac);
  const fw = Math.round((w - 2) * G.clamp(frac, 0, 1));
  ctx.fillStyle = '#05050c'; ctx.fillRect(x - 1, y - 1, w + 2, h + 2);
  ctx.fillStyle = '#20203a'; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = c; ctx.fillRect(x + 1, y + 1, fw, h - 2);
  ctx.fillStyle = hi; ctx.fillRect(x + 1, y + 1, fw, 1);
  // perigo: pisca no vermelho
  if (frac <= .2 && Math.floor(G.real / 250) % 2) { ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(x + 1, y + 1, fw, h - 2); }
};

// ---------- Menu genérico ----------
// items: [{ label, right?, disabled?, desc? }]. Resolve com o índice, ou -1 se voltar.
G.menu = (opts) => new Promise(res => {
  const m = { x: 4, y: G.FIELD_H + 1, w: 132, rowH: 11, title: null, idx: 0, ...opts };
  m.idx = Math.min(m.idx, m.items.length - 1);
  const finish = (v) => { off(); G.ui.menu = null; res(v); };
  m.pick = (i) => {
    if (m.items[i].disabled) { G.sfx('buzz'); return; }
    G.sfx('ok'); finish(i);
  };
  const off = G.onAction(a => {
    const n = m.items.length, cols = m.cols || 1;
    if (a === 'up') { m.idx = (m.idx - cols + n) % n; G.sfx('cursor'); }
    if (a === 'down') { m.idx = (m.idx + cols) % n; G.sfx('cursor'); }
    if (cols > 1 && a === 'left') { m.idx = (m.idx - 1 + n) % n; G.sfx('cursor'); }
    if (cols > 1 && a === 'right') { m.idx = (m.idx + 1) % n; G.sfx('cursor'); }
    if (a === 'ok') m.pick(m.idx);
    if (a === 'back' && m.canBack !== false) { G.sfx('back'); finish(-1); }
  });
  G.ui.menu = m;
});

G.drawMenu = (ctx, m) => {
  const rows = Math.ceil(m.items.length / (m.cols || 1));
  const h = m.h || rows * m.rowH + 8 + (m.title ? 12 : 0);
  G.window(ctx, m.x, m.y, m.w, h);
  let y0 = m.y + 5;
  if (m.title) { G.text(ctx, m.title, m.x + 8, y0, m.titleColor || '#ffe070'); y0 += 12; }
  const colW = (m.w - 16) / (m.cols || 1);
  m.items.forEach((it, i) => {
    const cx = m.x + 18 + (i % (m.cols || 1)) * colW, cy = y0 + Math.floor(i / (m.cols || 1)) * m.rowH;
    G.text(ctx, it.label, cx, cy, it.disabled ? '#7c7c96' : (it.color || '#ffffff'));
    if (it.right) G.text(ctx, it.right, m.x + m.w - 8, cy, it.disabled ? '#7c7c96' : (it.rightColor || '#c8d0ff'), 'right');
    G.region(cx - 14, cy - 2, colW, m.rowH, () => m.pick(i), () => { if (m.idx !== i) { m.idx = i; G.sfx('cursor'); } });
    if (i === m.idx) G.art.draw(ctx, 'hand', cx - 9, cy + 8 + Math.round(Math.sin(G.real / 120)));
  });
  // Botão de voltar pro toque
  if (m.canBack !== false) {
    const bx = m.x + m.w - 20, by = m.y - 12;
    G.window(ctx, bx, by, 20, 12);
    G.text(ctx, '←', bx + 6, by + 2, '#ffe070');
    G.region(bx, by, 20, 12, () => { G.emitAction && G.emitAction('back'); });
  }
  const cur = m.items[m.idx];
  if (cur && cur.desc) {
    // descrição na fonte compacta, quebrando em até 2 linhas pra nunca estourar a caixa
    const lines = wrap(ctx, cur.desc, G.W - 28).slice(0, 2);
    G.window(ctx, 4, 24, G.W - 8, 8 + lines.length * 10);
    lines.forEach((l, i) => G.text(ctx, l, 12, 28 + i * 10, '#ffffff', 'left', G.FONT_SMALL));
  }
};

// ---------- Seleção de alvo ----------
G.pickTarget = (list, { canBack = true } = {}) => new Promise(res => {
  if (!list.length) { res(null); return; }
  const t = { list, idx: 0 };
  const finish = (v) => { off(); G.ui.target = null; res(v); };
  t.pick = (i) => { G.sfx('ok'); finish(t.list[i]); };
  const off = G.onAction(a => {
    const n = t.list.length;
    if (a === 'up' || a === 'left') { t.idx = (t.idx - 1 + n) % n; G.sfx('cursor'); }
    if (a === 'down' || a === 'right') { t.idx = (t.idx + 1) % n; G.sfx('cursor'); }
    if (a === 'ok') t.pick(t.idx);
    if (a === 'back' && canBack) { G.sfx('back'); finish(null); }
  });
  G.ui.target = t;
});

// Seta de seleção com ponta de verdade (triângulo), contorno escuro e brilho. dir -1 aponta pra esquerda.
G.drawArrow = (ctx, x, y, dir = -1) => {
  const pts = (ox, oy, k) => [[ox, oy], [ox - dir * 9 * k, oy - 7 * k], [ox - dir * 9 * k, oy - 3 * k], [ox - dir * 17 * k, oy - 3 * k], [ox - dir * 17 * k, oy + 3 * k], [ox - dir * 9 * k, oy + 3 * k], [ox - dir * 9 * k, oy + 7 * k]];
  const poly = (p, c) => { ctx.fillStyle = c; ctx.beginPath(); p.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py))); ctx.closePath(); ctx.fill(); };
  poly(pts(x + dir * 2, y, 1.25), '#0a0a14');
  poly(pts(x, y, 1), '#ffe070');
  poly(pts(x, y, 1).slice(0, 3).concat([[x - dir * 9, y]]), '#fff8c0');
};

G.drawTarget = (ctx, t) => {
  const box = (a) => {
    const s = G.art.get(a.sprite);
    const w = (s ? s.fw : 30) * G.cam.zoom, h = (s ? s.fh : 40) * G.cam.zoom;
    const [sx, sy] = G.worldToScreen(a.x + a.ox, a.y + a.oy);
    return { sx, sy, w, h };
  };
  t.list.forEach((a, i) => {
    const b = box(a);
    G.region(b.sx - b.w / 2, b.sy - b.h, b.w, b.h, () => t.pick(i), () => { if (t.idx !== i) { t.idx = i; G.sfx('cursor'); } });
  });
  const a = t.list[t.idx];
  const b = box(a);
  // seta à direita do inimigo apontando pra ele (aliados: à esquerda apontando pra direita)
  const wob = Math.round(Math.sin(G.real / 100) * 2);
  if (a.side === 'enemy') G.drawArrow(ctx, Math.round(b.sx + b.w / 3 + 6 - wob), Math.round(b.sy - b.h / 2), -1);
  else G.drawArrow(ctx, Math.round(b.sx - b.w / 3 - 6 + wob), Math.round(b.sy - b.h / 2), 1);
  G.window(ctx, 4, 24, G.W - 8, 16);
  G.text(ctx, a.name + (a.side === 'party' ? `  HP ${a.hp}/${a.maxHp}` : ''), 12, 28);
};

// ---------- Faixa com o nome da ação ----------
G.showBanner = (text, ms = 700, color) => { G.ui.banner = { text, until: G.time + ms, color }; };
G.drawBanner = (ctx) => {
  const b = G.ui.banner;
  if (!b || G.time > b.until) return;
  ctx.font = G.FONT;
  const w = Math.max(80, ctx.measureText(b.text).width + 24);
  G.window(ctx, Math.round(G.W / 2 - w / 2), 24, w, 16);
  G.text(ctx, b.text, G.W / 2, 28, b.color || '#ffffff', 'center');
};

// ---------- Barras de HP dos inimigos (topo da tela) ----------
G.drawEnemyBars = (ctx, B) => {
  // mesma ordem da tela: quem está mais à esquerda vem primeiro
  const list = B.enemies.filter(e => e.present && !e.bg && e.alive()).sort((a, b) => a.x - b.x);
  if (!list.length) return;
  G.window(ctx, 0, 0, G.W, 22);
  const cw = (G.W - 8) / Math.max(3, list.length);
  list.forEach((e, i) => {
    const x = 6 + i * cw;
    const sel = G.ui.target && G.ui.target.list[G.ui.target.idx] === e;
    G.text(ctx, (sel ? '▶' : '') + e.name, x, 3, sel ? '#ffe070' : '#ffffff');
    G.hpBar(ctx, x, 14, cw - 14, 5, e.hp / e.maxHp);
  });
};

// ---------- Painel de baixo: legenda dos recursos à esquerda, party à direita ----------
G.GNOSE_COLOR = '#c8a0ff';
G.FURIA_COLOR = '#ff8a6a';

// Bolinhas de recurso (5 máx): cheias na cor, vazias escuras.
const pips = (ctx, x, y, n, max, color) => {
  for (let i = 0; i < max; i++) {
    ctx.fillStyle = '#0a0a18'; ctx.fillRect(x + i * 5, y, 4, 4);
    ctx.fillStyle = i < n ? color : '#2a2a48'; ctx.fillRect(x + i * 5, y, 3, 3);
  }
};
// Selo de buff (Canção de Fúria): seta pra cima laranja e o número de turnos que ainda restam.
G.drawBuffBadge = (ctx, x, y, turns) => {
  const pulse = Math.floor(G.real / 300) % 2;
  ctx.fillStyle = '#0a0a14'; ctx.fillRect(x - 1, y - 1, 17, 11);
  ctx.fillStyle = pulse ? '#ffb040' : '#ff8a20';
  ctx.beginPath(); ctx.moveTo(x + 4, y); ctx.lineTo(x + 8, y + 4); ctx.lineTo(x + 5.5, y + 4); ctx.lineTo(x + 5.5, y + 9); ctx.lineTo(x + 2.5, y + 9); ctx.lineTo(x + 2.5, y + 4); ctx.lineTo(x, y + 4); ctx.closePath(); ctx.fill();
  G.text(ctx, String(turns), x + 10, y - 1, '#ffe070', 'left', G.FONT_SMALL);
};

// Ícone de pistola (Glock) em pixel.
const pistol = (ctx, x, y) => {
  ctx.fillStyle = '#0a0a18'; ctx.fillRect(x, y, 10, 4); ctx.fillRect(x + 1, y + 3, 4, 5);
  ctx.fillStyle = '#d8d8e8'; ctx.fillRect(x + 1, y + 1, 8, 2); ctx.fillRect(x + 2, y + 3, 2, 4);
};

G.drawBattlePanel = (ctx, B) => {
  const y = G.FIELD_H, max = G.DATA.resources.max;
  G.window(ctx, 0, y, 140, G.H - y);
  G.window(ctx, 140, y, G.W - 140, G.H - y);
  // legenda
  G.text(ctx, 'GNOSE', 10, y + 7, G.GNOSE_COLOR); G.text(ctx, '→ Dons', 58, y + 7);
  G.text(ctx, 'FÚRIA', 10, y + 20, G.FURIA_COLOR); G.text(ctx, '→ Ataques', 58, y + 20);
  G.text(ctx, '+1 de cada', 10, y + 36, '#9aa4d8');
  G.text(ctx, 'por turno', 10, y + 47, '#9aa4d8');
  // cabeçalho
  G.text(ctx, 'HP', 232, y + 4, '#9aa4d8');
  G.text(ctx, 'GNO', 318, y + 4, G.GNOSE_COLOR);
  G.text(ctx, 'FÚR', 348, y + 4, G.FURIA_COLOR);
  B.party.forEach((p, i) => {
    const ry = y + 15 + i * 11;
    const active = B.activeId === p.id;
    const bad = p.status.catatonico > 0 || p.status.paralisado > 0;
    const color = p.hp <= 0 ? '#ff6060' : bad ? '#9a9ab0' : p.hp < p.maxHp * .25 ? '#ffe070' : '#ffffff';
    if (active) { ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fillRect(143, ry - 1, G.W - 146, 10); }
    G.text(ctx, p.name, 148, ry, color);
    if (p.glock) pistol(ctx, 206, ry);
    if (p.status.buff > 0 && p.alive()) G.drawBuffBadge(ctx, p.glock ? 218 : 206, ry - 1, p.status.buff);
    G.text(ctx, `${Math.max(0, Math.round(p.hp))}`, 250, ry, color, 'right');
    G.text(ctx, `/${p.maxHp}`, 250, ry, '#9aa4d8');
    if (bad) G.text(ctx, p.status.catatonico > 0 ? 'CATATÔN' : 'PARALIS', 318, ry, '#ff9a60');
    else {
      pips(ctx, 318, ry + 2, p.gnose, max, G.GNOSE_COLOR);
      pips(ctx, 348, ry + 2, p.furia, max, G.FURIA_COLOR);
    }
    G.hpBar(ctx, 286, ry + 1, 27, 6, Math.max(0, p.hp) / p.maxHp);
  });
};

// ---------- Custo em destaque (primeira vez de cada personagem) ----------
// Janela com as 5 bolinhas grandes; as gastas piscam e apagam uma a uma.
G.drawCostDrain = (ctx, c) => {
  const R = G.DATA.resources, isG = c.res === 'gnose';
  const color = isG ? G.GNOSE_COLOR : G.FURIA_COLOR;
  const t = G.time - c.t0, spent = c.from - c.to;
  const w = 132, h = 36, x = Math.round(G.W / 2 - w / 2), y = 62;
  G.window(ctx, x, y, w, h);
  G.text(ctx, `${c.name}: ${isG ? 'GNOSE' : 'FÚRIA'}`, x + 8, y + 4, color, 'left', G.FONT_SMALL);
  G.text(ctx, `-${spent}`, x + w - 8, y + 4, '#ff6060', 'right', G.FONT_SMALL);
  for (let i = 0; i < R.max; i++) {
    const px = x + 10 + i * 23, py = y + 17;
    let on = i < c.from; // as gastas somem da direita pra esquerda
    if (i >= c.to && i < c.from) {
      const k = c.from - 1 - i, tk = 350 + k * 350;
      if (t > tk) on = false;
      else if (t > tk - 250 && Math.floor(t / 60) % 2) on = false;
    }
    ctx.fillStyle = '#05050c'; ctx.fillRect(px - 1, py - 1, 18, 12);
    ctx.fillStyle = on ? color : '#2a2a48'; ctx.fillRect(px, py, 16, 10);
    if (on) { ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.fillRect(px, py, 16, 2); }
  }
  G.text(ctx, isG ? 'Dons gastam Gnose' : 'Ataques fortes gastam Fúria', G.W / 2, y + h + 3, '#c8d0ff', 'center', G.FONT_SMALL);
};

// ---------- Caixa de diálogo (cut-ins) ----------
// Escreve letra por letra; tocar durante a digitação completa o texto.
const LINES_PER_PAGE = 2;
const DIALOG_W = G.W - 8;

// Escreve letra por letra; tocar durante a digitação completa a página. Falas longas viram páginas de 2 linhas.
G.say = async (speaker, text, { color = '#ffffff', box = 'bottom', portrait = null, linesPerPage = LINES_PER_PAGE } = {}) => {
  const lines = wrap(G.ctx, text, DIALOG_W - 20);
  const pages = [];
  for (let i = 0; i < lines.length; i += linesPerPage) pages.push(lines.slice(i, i + linesPerPage).join('\n'));
  G.music && G.music.duck(true);
  for (const page of pages) {
    const d = { speaker, text: page, shown: 0, color, box, portrait, linesPerPage, done: false };
    G.ui.dialog = d;
    const skip = G.onAction(a => { if ((a === 'ok' || a === 'tap') && !d.done) d.shown = page.length; });
    while (d.shown < page.length) {
      await G.wait(24);
      d.shown = Math.min(page.length, d.shown + 1);
      if (d.shown % 3 === 0 && page[d.shown - 1] !== ' ') G.sfx('cursor');
    }
    skip();
    await G.wait(60);
    d.done = true;
    await G.waitAdvance();
  }
  G.ui.dialog = null;
  G.music && G.music.duck(false);
};

G.drawDialog = (ctx, d) => {
  const hasPortrait = !!d.portrait;
  const h = hasPortrait ? 58 : (d.linesPerPage > 2 ? 58 : (d.speaker ? 38 : 28)), boxX = 4, boxW = DIALOG_W;
  const y = d.box === 'top' ? 4 : G.H - h - 4;
  if (hasPortrait && d.portrait.naturalWidth) {
    const scale = Math.min(112 / d.portrait.naturalWidth, 132 / d.portrait.naturalHeight);
    const pw = Math.round(d.portrait.naturalWidth * scale), ph = Math.round(d.portrait.naturalHeight * scale);
    ctx.drawImage(d.portrait, 8, y - ph + 8, pw, ph);
  }
  if (hasPortrait) {
    ctx.fillStyle = 'rgba(5, 18, 24, 1)';
    ctx.fillRect(boxX, y, boxW, h);
    ctx.strokeStyle = 'rgba(143, 240, 255, .72)';
    ctx.lineWidth = 1;
    ctx.strokeRect(boxX + .5, y + .5, boxW - 1, h - 1);
  } else {
    G.window(ctx, boxX, y, boxW, h);
  }
  let tx = 12;
  let ty = y + 5;
  if (d.speaker) { G.text(ctx, d.speaker, tx, ty, '#ffe070', 'left', G.FONT_SMALL); ty += 10; }
  d.text.slice(0, d.shown).split('\n').forEach((l, i) => G.text(ctx, l, tx, ty + i * 10, d.color, 'left', G.FONT_SMALL));
  if (d.done && Math.floor(G.real / 300) % 2) G.text(ctx, '▼', G.W - 16, y + h - 11, '#ffffff', 'left', G.FONT_SMALL);
};
