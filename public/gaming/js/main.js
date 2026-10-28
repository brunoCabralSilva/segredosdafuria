// Boot, tela de título e loop de render.
(() => {
  const ctx = G.ctx;
  G.actors = [];
  G.scene = 'loading';

  // Morto: a forma natural deitada no chão (sprite girado 90°).
  function drawLying(a, x, y) {
    const s = G.art.get(a.sprite);
    if (!s) return;
    ctx.save();
    ctx.globalAlpha = a.alpha;
    ctx.translate(Math.round(x), Math.round(y - 4));
    ctx.rotate(-Math.PI / 2);
    ctx.drawImage(s.img, 2 * s.fw, 0, s.fw, s.fh, -s.fh + 4, -s.fw / 2, s.fw, s.fh);
    ctx.restore();
    ctx.fillStyle = 'rgba(120,0,0,.45)';
    ctx.fillRect(Math.round(x - s.fh / 2), Math.round(y - 2), s.fh, 3);
  }

  // Chamas púrpuras engolindo o corpo (1 turno depois de cada Chamas Púrpuras).
  // Chamas envolvendo o corpo: línguas de fogo nas laterais, na base e acima da cabeça, com faíscas subindo.
  function drawBurn(x, y, w, h) {
    // base e laterais
    for (let i = 0; i < 7; i++) G.flameTongue(ctx, x - w / 2 + i * w / 6, y + 2, 18 + (i % 3) * 8, 10, i);
    for (let i = 0; i < 4; i++) {
      G.flameTongue(ctx, x - w / 2 - 2, y - h * (.2 + i * .18), 16 + i * 3, 8, i + 10);
      G.flameTongue(ctx, x + w / 2 + 2, y - h * (.25 + i * .18), 16 + i * 3, 8, i + 20);
    }
    // em cima
    for (let i = 0; i < 4; i++) G.flameTongue(ctx, x - w / 4 + i * w / 6, y - h * .8, 22 + (i % 2) * 10, 11, i + 30);
    // faíscas
    for (let i = 0; i < 24; i++) {
      const t = (G.real / 4 + i * 37) % (h + 30);
      ctx.globalAlpha = 1 - t / (h + 30);
      ctx.fillStyle = i % 3 ? '#e0a0ff' : '#ffffff';
      ctx.fillRect(Math.round(x - w / 2 + ((i * 23) % w) + Math.sin(G.real / 90 + i) * 4), Math.round(y - t), 1, 2);
    }
    ctx.globalAlpha = 1;
  }

  // Uktena invocado. spirit = corpo vai ficando transparente de cima (cabeça) pra baixo (cauda).
  function drawSummon(sm) {
    const s = G.art.get(sm.sprite);
    if (!s) return;
    const bob = Math.round(Math.sin(G.real / 250) * 3);
    if (!sm.spirit) { G.art.draw(ctx, sm.sprite, sm.x, sm.y + bob, { frame: sm.pose, alpha: sm.alpha, scale: sm.scale || 1 }); return; }
    const [c, x] = G.makeCanvas(s.fw, s.fh);
    x.drawImage(s.img, sm.pose * s.fw, 0, s.fw, s.fh, 0, 0, s.fw, s.fh);
    x.globalCompositeOperation = 'destination-in';
    const g = x.createLinearGradient(0, 0, 0, s.fh);
    g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(.45, 'rgba(0,0,0,.7)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = g; x.fillRect(0, 0, s.fw, s.fh);
    const k = sm.scale || 1, w = s.fw * k, h = s.fh * k;
    ctx.save(); ctx.globalAlpha = sm.alpha;
    ctx.drawImage(c, Math.round(sm.x - w / 2), Math.round(sm.y + bob - h), w, h);
    ctx.restore();
  }

  function drawActor(a) {
    if (!a.present || a.alpha <= 0) return;
    const ko = a.side === 'party' && !a.alive();
    const flying = (a.id === 'espelho' && a.sprite !== 'espelho_guerra') || a.id.startsWith('drone');
    const bob = a.alive() && !(a.status.catatonico > 0) ? Math.round(Math.sin(G.real / 320 + a.x) * (flying ? 2.5 : .6)) : 0;
    const x = a.x + a.ox, y = a.y + a.oy + bob;
    if (ko) { drawLying(a, x, a.y); return; }
    let tint = null;
    if (a.status.catatonico > 0) tint = { color: '#606070', alpha: .45 };
    else if (a.status.paralisado > 0) tint = { color: '#4060a0', alpha: .4 };
    else if (a.status.frenesiGlow > 0) tint = { color: '#ff2020', alpha: .15 + Math.abs(Math.sin(G.real / 200)) * .25 };
    else if (a.status.dying) tint = { color: '#b050ff', alpha: .6 };
    else if (a.status.acidFx > G.time) tint = { color: '#80ff40', alpha: .35 };
    else if (a.status.toxico > 0) tint = { color: '#60c030', alpha: .18 + Math.abs(Math.sin(G.real / 300)) * .12 };
    else if (a.status.frozen > 0) tint = { color: '#a0e8ff', alpha: .5 };
    else if (a.status.burnFx > 0) tint = { color: '#b050ff', alpha: .25 + Math.abs(Math.sin(G.real / 90)) * .2 };
    // rastro (golpes, esquivas, crítico)
    if (a.trailUntil > G.time) {
      a.trail.unshift([x, y]); if (a.trail.length > 5) a.trail.pop();
      a.trail.forEach(([tx, ty], i) => { if (i) G.art.draw(ctx, a.sprite, tx, ty, { frame: a.pose, alpha: .35 - i * .06, tint: { color: '#a0c0ff', alpha: .6 } }); });
    } else if (a.trail.length) a.trail.length = 0;
    const atkPose = a.pose === 1 && a.atkSprite;
    // Pássaro de Guerra parado: voa (batendo asas, pairando acima do chão com sombra)
    if (a.sprite === 'espelho_guerra' && a.pose === 0 && !atkPose && G.art.get('espelho_guerra_voo')) {
      const hover = 16 + Math.round(Math.sin(G.real / 200) * 3);
      ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(x, a.y + a.oy, 14, 3, 0, 0, 7); ctx.fill();
      G.art.draw(ctx, 'espelho_guerra_voo', x, y - hover, { alpha: a.alpha, flash: a.flash, tint });
    } else
    G.art.draw(ctx, atkPose ? a.atkSprite : a.sprite, x, y, { frame: atkPose ? a.atkFrame : a.pose, alpha: a.alpha, flash: a.flash, tint });
    const s = G.art.get(a.sprite), w = s ? s.fw : 40, h = s ? s.fh : 40;
    if (a.status.burnFx > 0 && a.alive()) drawBurn(x, y, Math.round(w * .7), Math.round(h * .9));
    else if (a.status.queimando > 0 && a.alive()) {
      for (let i = 0; i < 10; i++) {
        const t = (G.real / 6 + i * 23) % 30;
        ctx.fillStyle = i % 2 ? '#d070ff' : '#8a2ae0';
        ctx.fillRect(Math.round(x - 20 + (i * 13) % 40), Math.round(y - 10 - t), 2, 2);
      }
    }
    if (a.status.toxico > 0 && a.alive()) G.drawToxicSmoke(ctx, x, y, w, h);
    // M81: o fomor ajoelhado se recuperando solta vapor verde pela cabeça e pelas costas
    if (a.status.vapor && a.alive()) {
      for (let i = 0; i < 14; i++) {
        const t = ((G.real / 1600) + i / 14) % 1;
        const px = x - w * .15 + Math.sin(i * 1.9 + G.real / 600) * w * .3, py = y - h * .75 - t * 40;
        ctx.globalAlpha = (1 - t) * .45 * a.alpha / .45;
        ctx.fillStyle = i % 3 ? '#7ac850' : '#c0f090';
        ctx.beginPath(); ctx.arc(Math.round(px), Math.round(py), 3 + t * 9, 0, 7); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    if (a.status.catatonico > 0 || a.status.stun) G.drawDizzyBirds(ctx, x, y - h - 4);
    // Canção de Fúria: seta laranja + turnos restantes sobre a cabeça
    if (a.status.buff > 0 && a.alive()) G.drawBuffBadge(ctx, Math.round(x + 10), Math.round(y - h - 10), a.status.buff);
    if (a.status.paralisado > 0) G.text(ctx, '!!', x, y - h - 8, '#8ab0ff', 'center');
  }

  function drawWorld() {
    const [sx, sy] = G.shakeOffset();
    ctx.save();
    ctx.beginPath(); ctx.rect(0, 0, G.W, G.FIELD_H); ctx.clip();
    ctx.translate(G.W / 2 + sx, G.FIELD_H / 2 + sy);
    ctx.scale(G.cam.zoom, G.cam.zoom);
    ctx.translate(-G.cam.fx, -G.cam.fy);
    const bg = G.art.get('bg_galpao');
    if (bg) ctx.drawImage(bg.img, -48, -84, 480, 270);
    // fundo → inimigos/party por profundidade → quem está atacando por cima de todos
    if (G.B && G.B.summon && G.B.summon.behind) drawSummon(G.B.summon);
    [...G.actors].sort((a, b) => (b.bg - a.bg) || ((a.front ? 1 : 0) - (b.front ? 1 : 0)) || (a.y - b.y)).forEach(drawActor);
    const sm = G.B && G.B.summon;
    if (sm && !sm.behind) drawSummon(sm);
    G.drawWorldFx(ctx);
    ctx.restore();
  }

  function render() {
    G.regions = [];
    G.baseTransform();
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, G.W, G.H);
    if (G.scene === 'title') G.drawTitleScreen(ctx);
    else if (G.scene === 'mainMenu') {
      G.drawMainMenu(ctx);
      if (G.ui.menu) G.drawMainMenuOptions(ctx, G.ui.menu);
      G.drawBanner(ctx);
    }
    else if (G.scene === 'character') {
      try {
        G.drawCharacterCreation(ctx);
      } catch (error) {
        console.error('Erro ao renderizar seleção de personagem:', error);
        ctx.fillStyle = '#f4f7ff';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Erro na tela de seleção. Verifique os dados dos sprites.', G.W / 2, G.H / 2);
      }
    }
    else if (G.scene === 'characterIntro') {
      G.drawCharacterIntroBackdrop(ctx);
      if (G.ui.dialog) G.drawDialog(ctx, G.ui.dialog);
    }
    else if (G.scene === 'dreamPrompt') {
      G.drawDreamPromptBackdrop(ctx);
      if (G.ui.dialog) G.drawDialog(ctx, G.ui.dialog);
      if (G.ui.menu) G.drawMenu(ctx, G.ui.menu);
    }
    else if (G.scene === 'nightmare') {
      const [sx, sy] = G.shakeOffset();
      ctx.save();
      ctx.translate(sx, sy);
      G.drawNightmare(ctx);
      ctx.restore();
      if (G.ui.dialog) G.drawDialog(ctx, G.ui.dialog);
    }
    else if (G.scene === 'opening') { const [sx, sy] = G.shakeOffset(); ctx.save(); ctx.translate(sx, sy); G.drawOpening(ctx); ctx.restore(); G.drawScreenFx(ctx, false); }
    else if (G.scene === 'battle') {
      drawWorld();
      G.drawScreenFx(ctx, true);
      if (!G.cs.active) {
        G.drawBattlePanel(ctx, G.B);
        // barras de HP dos inimigos só aparecem na hora de escolher o alvo
        if (G.ui.target && G.ui.target.list[0] && G.ui.target.list[0].side === 'enemy') G.drawEnemyBars(ctx, G.B);
        G.drawBanner(ctx);
      }
      if (G.cs.active) {
        const [sx, sy] = G.shakeOffset();
        ctx.save(); ctx.translate(sx, sy);
        G.drawCutscene(ctx);
        ctx.restore();
        G.drawScreenFx(ctx, false);
      }
      if (G.ui.costDrain) G.drawCostDrain(ctx, G.ui.costDrain);
      if (G.ui.target) G.drawTarget(ctx, G.ui.target);
      if (G.ui.menu) G.drawMenu(ctx, G.ui.menu);
      if (G.ui.dialog) G.drawDialog(ctx, G.ui.dialog);
    }
    if (G.fx.fade.alpha > 0) { ctx.globalAlpha = G.fx.fade.alpha; ctx.fillStyle = G.fx.fade.color || '#000'; ctx.fillRect(0, 0, G.W, G.H); ctx.globalAlpha = 1; }
    for (const a of G.actors) if (a.flash > 0) a.flash = Math.max(0, a.flash - .12);
  }

  let last = performance.now();
  function frame(now) {
    const dt = Math.min(50, now - last); last = now;
    G.update(dt);
    render();
    requestAnimationFrame(frame);
  }
  // Modo de teste: relógio por setTimeout (o headless não avança requestAnimationFrame no tempo virtual).
  function autoFrame() {
    G.update(16);
    render();
    setTimeout(autoFrame, 16);
  }

  async function boot() {
    try { await Promise.race([Promise.all([document.fonts.load(G.FONT), document.fonts.load(G.FONT_SMALL)]), new Promise(r => setTimeout(r, 2000))]); } catch (e) { /* fonte é opcional */ }
    if (G.debug) console.log('boot: fonte ok');
    await G.art.load();
    if (G.debug) console.log('boot: arte ok');
    await G.loadTitleArt();
    if (G.auto || G.mash) autoFrame(); else requestAnimationFrame(frame);
    for (;;) {
      G.scene = 'title';
      await G.waitAdvance();
      G.audioUnlock();
      G.sfx('ok');
      G.scene = 'mainMenu';
      const menuChoice = await G.menu({
        items: [{ label: 'INICIAR' }, { label: 'CARREGAR' }, { label: 'SAIR' }],
        x: 106, y: 96, w: 172, rowH: 14, canBack: false,
      });
      if (menuChoice === 1) {
        G.showBanner('Nenhum jogo salvo encontrado', 1800, '#ffe070');
        await G.wait(1800);
        continue;
      }
      if (menuChoice === 2) {
        window.top.location.href = '/';
        return;
      }
      G.scene = 'character';
      await G.loadCharacterData();
      await G.loadCharacterSheet();
      await G.loadAnimationSheet();
      await G.loadCombatSheet();
      await G.loadSelectionSheets();
      const player = await G.characterCreation();
      if (!player) continue;
      G.playerCharacter = player;
      await G.playCharacterIntro(player);
      const dreamChoice = await G.playDreamPrompt();
      if (dreamChoice === 0) await G.playNightmare(player);
      const cena = G.params.get('cena');
      // abertura cinematográfica (pula nos testes automáticos e na revisão de cenas)
      if (dreamChoice !== 0 && (G.params.has('abertura') || (!G.auto && !G.mash)) && !cena) {
        G.scene = 'opening';
        await G.playOpening();
        // o branco da lua se dissolve direto na primeira cena (a estrada)
        G.fx.fade.color = '#ffffff'; G.fx.fade.alpha = 1;
        G.scene = 'battle';
      } else {
        await G.fadeTo(1, 300);
        G.scene = 'battle';
        await G.fadeTo(0, 300);
      }
      if (G.debug) console.log('boot: batalha');
      try {
        if (cena) { await G.previewScene(cena); console.log('[cena] fim ' + cena); continue; }
        await G.runBattle();
      } catch (e) { console.log('ERRO batalha: ' + (e && e.stack || e)); throw e; }
    }
  }
  boot();
})();
