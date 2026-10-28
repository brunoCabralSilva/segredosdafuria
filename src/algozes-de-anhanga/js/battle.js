// Batalha: rodadas estilo FFIII, IA inimiga, travas de HP e gatilhos do roteiro semi-fixo.
(() => {
  const D = G.DATA;
  const S = () => G.SCENES;

  class Actor {
    constructor(def, side, id) {
      Object.assign(this, {
        id, side, name: def.name, sprite: def.sprite, def,
        maxHp: def.hp, hp: def.hp, atk: def.atk, def_: def.def, agi: def.agi, eva: def.eva,
        garou: !!def.garou, silver: !!def.silver, actions: def.actions || 1,
        gnose: side === 'party' ? D.resources.gnoseStart : 0, furia: side === 'party' ? D.resources.furiaStart : 0, skills: def.skills || [],
        x: 0, y: 0, ox: 0, oy: 0, alpha: 1, flash: 0, pose: 0, trail: [], trailUntil: 0,
        present: true, bg: false, form: null, revived: false, glock: null, armless: false, wasHit: false, deathRound: null,
        status: {},
      });
    }
    alive() { return this.hp > 0; }
  }

  const PARTY_POS = { espelho: [304, 42], jan: [296, 100], tinga: [390, 116], sangria: [352, 138], valeria: [298, 154] }; // Sangria na frente, entre Jan e Tinga
  const ENEMY_POS = {
    schneider: [158, 116], ciborgue: [44, 126], agente1: [128, 96], agente2: [190, 142], fomor: [170, 148],
    drone1: [214, 46], drone2: [252, 86],
  };
  const BG_POS = { schneider: [40, 88], ciborgue: [104, 84], fomor: [48, 96] };
  const AURA = { espelho: '#c080ff', sangria: '#ff5040', jan: '#a0d0ff', tinga: '#ffc040', valeria: '#ff3030' };

  const B = G.B = {
    party: [], enemies: [], phase: '1', round: 1, flags: {}, uktenaNext: 0, phase4Start: 0,
    activeId: null, abortRound: false, result: null, checkpoint: null, stats: { dmg: 0 }, summon: null,
  };
  const P = (id) => B.party.find(a => a.id === id);
  const E = (id) => B.enemies.find(a => a.id === id);

  function setup() {
    B.party = D.party.map(d => new Actor(d, 'party', d.id));
    B.party.forEach(a => { [a.x, a.y] = PARTY_POS[a.id]; });
    // teste: ?fragil deixa a party com 1/3 do HP pra exercitar morte e volta
    if (G.params.has('fragil')) B.party.forEach(a => { a.hp = Math.round(a.hp / 3); });
    if (G.params.has('gnose')) B.party.forEach(a => { a.gnose = Number(G.params.get('gnose')); });
    if (G.params.has('furia')) B.party.forEach(a => { a.furia = Number(G.params.get('furia')); });
    if (G.params.has('formas')) B.party.forEach(a => setForm(a, a.def.warForm));
    B.enemies = [
      new Actor(D.enemies.schneider, 'enemy', 'schneider'),
      new Actor(D.enemies.ciborgue, 'enemy', 'ciborgue'),
      new Actor(D.enemies.agente, 'enemy', 'agente1'),
      new Actor(D.enemies.agente, 'enemy', 'agente2'),
      new Actor(D.enemies.fomor, 'enemy', 'fomor'),
      new Actor(D.enemies.drone, 'enemy', 'drone1'),
      new Actor(D.enemies.drone, 'enemy', 'drone2'),
    ];
    B.enemies.forEach(e => { [e.x, e.y] = ENEMY_POS[e.id]; });
    ['agente1', 'agente2', 'fomor', 'drone1', 'drone2'].forEach(id => { E(id).present = false; });
    Object.assign(B, { phase: '1', round: 1, flags: {}, uktenaNext: 0, phase4Start: 0, result: null, stats: { dmg: 0 }, summon: null });
    G.actors = [...B.party, ...B.enemies];
  }

  // ---------- Checkpoints ----------
  const FIELDS = ['hp', 'maxHp', 'atk', 'def_', 'agi', 'gnose', 'furia', 'sprite', 'form', 'present', 'bg', 'x', 'y', 'alpha', 'status', 'revived', 'glock', 'armless', 'name', 'wasHit', 'deathRound'];
  function saveCheckpoint() {
    B.checkpoint = JSON.stringify({
      actors: G.actors.map(a => Object.fromEntries(FIELDS.map(f => [f, a[f]]))),
      phase: B.phase, flags: B.flags, round: B.round, uktenaNext: B.uktenaNext, phase4Start: B.phase4Start,
    });
  }
  function loadCheckpoint() {
    const s = JSON.parse(B.checkpoint);
    G.actors.forEach((a, i) => { Object.assign(a, s.actors[i]); a.ox = a.oy = 0; a.flash = 0; a.pose = 0; a.trail = []; });
    Object.assign(B, { phase: s.phase, flags: s.flags, round: s.round, uktenaNext: s.uktenaNext, phase4Start: s.phase4Start, result: null, summon: null });
  }

  // ---------- Consultas ----------
  // Quem voltou da morte (ou a Valéria em Frenesi) só ataca, até cair o primeiro inimigo depois da volta dele.
  const emFrenesi = (a) => (a.revived || !!a.status.frenesi) && !a.liberado;
  const targetableEnemies = () => B.enemies.filter(e => e.present && !e.bg && e.alive());
  const canAct = (a) => a.alive() && !(a.status.catatonico > 0) && !(a.status.paralisado > 0);
  const aliveParty = () => B.party.filter(a => a.alive());
  const attacksFor = (a) => (a.form ? D.forms[a.form].attacks : a.def.attacks);
  const espelhoGone = () => !P('espelho').alive() && P('espelho').revived;

  // Travas de HP que garantem o roteiro.
  function hpFloor(t) {
    const f = B.flags;
    const pct = (p) => Math.ceil(t.maxHp * p);
    if (t.id === 'valeria') return (f.focusValeria && !f.m1done) ? 0 : 1;
    if (t.id === 'ciborgue' && !f.m1done) return pct(.15);
    if (t.id === 'ciborgue' && !f.dronesOut) return pct(.2);
    if (t.id === 'schneider') return f.m1done ? pct(.2) : pct(.31);
    if (t.id === 'fomor' && B.phase === '3') return pct(.3);
    if (t.id === 'fomor') return pct(.1);
    return 0;
  }

  // ---------- Animação de golpe ----------
  const spriteSize = (a) => { const s = G.art.get(a.sprite); return s ? [s.fw, s.fh] : [30, 40]; };
  const center = (a) => { const [, h] = spriteSize(a); return [a.x + a.ox, a.y + a.oy - h / 2]; };
  const resetZoom = () => G.zoomTo(G.BASE_ZOOM, G.W / 2, G.FIELD_H / 2, 320);
  // Zoom que nunca sai do cenário (fundo cobre x -48..432, y -84..186): o foco é preso aos limites.
  const camFocus = (zoom, x, y, ms) => {
    const hw = G.W / 2 / zoom, hh = G.FIELD_H / 2 / zoom;
    return G.zoomTo(zoom, G.clamp(x, -48 + hw, 432 - hw), G.clamp(y, -84 + hh, 186 - hh), ms);
  };
  const trail = (a, ms) => { a.trailUntil = G.time + ms; };

  // Close do 1º golpe de cada um (forma natural e de guerra) e de cada tipo de ataque dos inimigos.
  function golpeKey(user, atk) {
    if (user.side === 'party') return `golpe_${user.id}_${user.form ? 'guerra' : 'natural'}`;
    if (user.id === 'schneider') return 'golpe_schneider';
    if (user.id === 'ciborgue') return user.armless ? 'golpe_ciborgue_cabecada' : 'golpe_ciborgue_plasma';
    if (user.id.startsWith('drone')) return 'golpe_drone';
    if (user.id.startsWith('agente') && atk && atk.fx === 'stab') return 'golpe_agente';
    return null;
  }
  async function primeiroGolpe(user, atk, key = golpeKey(user, atk)) {
    if (!key || !G.art.get(key)) return;
    const seen = B.flags.golpes = B.flags.golpes || {};
    if (seen[key]) return;
    seen[key] = true;
    resetZoom();
    await S().golpeClose(key, user.side === 'enemy' && (key.includes('plasma') || key.includes('drone')) ? 'explode' : 'heavy');
  }

  // Aproximação em 3 tempos: prepara (recua), dispara com rastro, chega.
  async function approach(user, target) {
    const [uw] = spriteSize(user), [tw] = spriteSize(target);
    const dir = user.side === 'party' ? -1 : 1;
    const destX = target.x - dir * (tw / 3 + uw / 3);
    const [cx, cy] = center(target);
    user.pose = 1;
    await G.tween(user, { ox: -dir * 8 }, 140, G.ease.out);
    G.sfx('dash');
    G.speedLines(320, dir);
    trail(user, 300);
    camFocus(1.35, G.lerp(user.x, cx, .7), G.clamp(cy, 50, 100), 220); // foco puxado pro alvo
    await G.tween(user, { ox: destX - user.x, oy: (target.y - user.y) * .6 }, 220, G.ease.in);
  }
  async function retreat(user) {
    resetZoom();
    trail(user, 200);
    await G.tween(user, { ox: 0, oy: 0 }, 280, G.ease.out);
    user.pose = 0;
  }

  // Close com fala antes do crítico: todo mundo aparece ao menos uma vez em cada forma (1º crítico da forma);
  // nos críticos seguintes, 80% de chance. As falas não se repetem até a lista acabar (cutscene.js).
  async function critLine(user) {
    if (user.status.duplaCrit) { user.status.duplaCrit = false; user.status.critGarantido = false; return; } // o close da dupla já rolou
    if (user.status.critGarantido) { // volta da morte da Valéria: close fixo, uma vez
      user.status.critGarantido = false; user.status.duplaCrit = false;
      B.flags.slideSeen = B.flags.slideSeen || {}; B.flags.slideSeen[user.id + ':guerra'] = true;
      await S().ameaca(user, 'crit', 'Uma Garou nunca cai duas vezes para o mesmo verme.');
      return;
    }
    const seen = B.flags.slideSeen = B.flags.slideSeen || {};
    const key = user.id + (user.form ? ':guerra' : ':natural');
    const first = !seen[key];
    seen[key] = true; await S().ameaca(user, 'crit'); // todo crítico tem close
  }
  // Golpe que vai derrubar um inimigo (menos o Schneider): close anunciando antes do golpe.
  const willKill = (user, t, dmg) => user.side === 'party' && t.side === 'enemy' && t.id !== 'schneider' && hpFloor(t) === 0 && t.hp - dmg <= 0;
  async function killLine(user) {
    const seen = B.flags.slideSeen = B.flags.slideSeen || {};
    seen[user.id + (user.form ? ':guerra' : ':natural')] = true;
    await S().ameaca(user, 'mata');
  }

  // Crítico: salta alto com rastro, a tela congela, mergulha no alvo em câmera lenta.
  async function critSequence(user, target) {
    const [cx, cy] = center(target);
    const dir = user.side === 'party' ? -1 : 1;
    G.sfx('crit');
    G.showBanner('CRÍTICO!', 1400, '#ff6060');
    trail(user, 900);
    camFocus(1.5, cx, cy - 20, 200);
    await G.tween(user, { oy: user.oy - 46, ox: user.ox - dir * 18 }, 220, G.ease.out);
    G.flashScreen('#ffffff', .6, 160);
    G.hitstop(200);
    G.speedLines(700, dir, 'rgba(255,90,90,.85)');
    await G.wait(120);
    camFocus(1.9, cx, cy, 120);
    await G.tween(user, { oy: (target.y - user.y) * .6, ox: target.x - user.x - dir * 10 }, 130, G.ease.in);
    G.ring(cx, cy, '#ffffff', 70, 500); G.ring(cx, cy, '#ff5050', 100, 700);
    G.spark(cx, cy, '#ffe070', 20);
    G.flashScreen('#ff2020', .6, 320);
    G.shake(10, 450);
    G.slowmo(.3, 500);
  }

  // Valéria perseguida (antes de cair pela 1ª vez): não esquiva e leva dano dobrado.
  // Perseguição: da ordem do Schneider até a Valéria cair, os dois não ficam atordoados nem erram.
  const huntOn = () => B.flags.focusValeria && !B.flags.m1done;
  const hunted = (t) => t.id === 'valeria' && huntOn();
  // Quem está atordoado (ou é a Valéria perseguida) não esquiva: toma o golpe.
  const cantDodge = (t) => !!t.status.stun || hunted(t) || t.id.startsWith('drone'); // drones não esquivam
  // Multiplicador de dano da party por tipo de inimigo: drones ×2, agentes +15%.
  const partyBonus = (user, t) => (user.side !== 'party' ? 1 : t.id.startsWith('drone') ? 2 : t.id.startsWith('agente') ? 1.15 : 1);

  function rollHit(user, target, mult, { noMiss = false, acc = 0, physical = true } = {}) {
    const eva = target.eva + (target.status.esquiva ? 45 : 0) - acc;
    if (user.side === 'enemy' && huntOn()) noMiss = true;
    if (user.status.critGarantido && physical) noMiss = true;
    // em forma de guerra, a matilha acerta 80% dos golpes (em vez de depender da esquiva do inimigo)
    const missChance = user.side === 'party' && user.form && target.side === 'enemy' ? 20 : eva;
    if (!noMiss && !cantDodge(target) && Math.random() * 100 < missChance) return { miss: true };
    let atk = user.atk;
    const forced = physical && user.status.critGarantido; // Valéria voltando da morte: 1º golpe crítico
    if (user.side === 'party' && (user.revived || user.status.frenesi)) atk *= 1.3; // voltou da morte / Frenesi: +30%
    if (user.status.buff > 0) atk *= 1.3;
    if (user.status.rage) atk *= 1 + .08 * user.status.rage;
    let dmg = Math.max(1, atk * mult - target.def_ / 2) * G.rand(.9, 1.1);
    let crit = false;
    if (forced) crit = true;
    else if (physical && user.side === 'party') crit = Math.random() < D.crit.chance;
    else if (physical) crit = Math.random() < .08;
    if (crit) dmg *= user.side === 'party' ? D.crit.mult : 1.5;
    const silver = user.silver && target.garou;
    if (silver) dmg *= 1.5;
    dmg *= partyBonus(user, target);
    if (user.side === 'enemy' && hunted(target)) dmg *= 2;
    return { dmg: Math.max(1, Math.round(dmg)), crit, silver };
  }

  async function applyDamage(target, dmg, { crit = false, heavy = false, color = '#ffffff' } = {}) {
    const floor = hpFloor(target);
    const wasAtFloor = floor > 0 && target.hp <= floor;
    target.hp = Math.max(floor, target.hp - dmg);
    if (wasAtFloor && target.side === 'enemy') G.popup(target.x, target.y - spriteSize(target)[1] - 4, 'RESISTE!', '#ffe070');
    if (target.id === 'schneider' && floor > 0 && target.hp - dmg <= floor && !B.flags.schneiderDebocha && B.phase === '1') { B.flags.schneiderDebocha = true; B.pendingProvoca = 'resiste'; }
    if (target.side === 'enemy') B.stats.dmg += dmg;
    if (target.side === 'party') target.wasHit = true;
    const [cx, cy] = center(target);
    target.flash = 1;
    target.pose = 2;
    setTimeout(() => { if (target.pose === 2) target.pose = 0; }, 450 / G.speed);
    G.spark(cx, cy, crit ? '#ffe070' : '#ffffff', crit ? 16 : 10);
    G.popup(cx, cy - 10, dmg, crit ? '#ffe070' : color, crit);
    G.sfx(heavy || crit ? 'heavy' : 'hit');
    G.hitstop(crit ? 200 : heavy ? 150 : 110);
    G.shake(crit ? 8 : heavy ? 5 : 3, 220);
    if (!crit) G.ring(cx, cy, '#ffffff', 26, 260);
    const push = target.side === 'party' ? 7 : -7;
    G.tween(target, { ox: push }, 70).then(() => G.tween(target, { ox: 0 }, 220));
    if (target.alive()) {
      if (target.id === 'ciborgue') { target.status.rage = Math.min(5, (target.status.rage || 0) + 1); G.popup(cx + 14, cy - 26, 'GRRR', '#ff5050'); }
      if (target.id === 'schneider') G.popup(cx + 14, cy - 26, 'heh.', '#c8d0ff');
      if (target.id === 'fomor' && target.hp === floor && floor > 0) target.status.acuado = true;
    } else await knockOut(target);
  }

  // Morto: volta pra forma natural, deitado. Pode reviver 1 vez, depois de passar 1 turno no chão.
  async function knockOut(t) {
    if (t.side === 'enemy') {
      // um inimigo caiu: quem estava em Frenesi desde a volta recupera o controle (menu completo)
      for (const p of B.party) if (p.alive() && (p.revived || p.status.frenesi) && !p.liberado) {
        p.liberado = true; p.status.frenesi = false;
        G.popup(p.x, p.y - 40, 'Recuperou o controle!', '#70ff90');
      }
      // últimas palavras: agentes e Ciborgue
      if (t.id.startsWith('agente') || t.id === 'ciborgue') { resetZoom(); await S().ultimasPalavras(t); }
      G.sfx('explode');
      t.status.dying = true;
      await G.tween(t, { alpha: 0 }, 500, G.ease.linear);
      return;
    }
    G.sfx('thud');
    G.popup(t.x, t.y - 30, 'K.O.', '#ff6060');
    const scripted = t.id === 'valeria' && !B.flags.m1done;
    t.form = null; t.maxHp = t.def.hp; t.atk = t.def.atk; t.agi = t.def.agi;
    t.sprite = t.def.natural || t.def.sprite;
    t.glock = null;
    t.status = {};
    if (!scripted) t.deathRound = B.round;
    // 1ª queda de cada um: um aliado de pé reage em close
    const quedas = B.flags.quedas = B.flags.quedas || {};
    if (!scripted && !quedas[t.id]) {
      quedas[t.id] = true;
      const allies = aliveParty().filter(p => p !== t);
      if (allies.length) { resetZoom(); await S().reacaoQueda(allies[G.randInt(0, allies.length - 1)], t); }
    }
  }

  async function doMiss(target) {
    const [cx, cy] = center(target);
    G.sfx('miss');
    G.popup(cx, cy - 10, target.status.esquiva ? 'Esquivou!' : 'Miss', '#c8d0ff');
    const hop = target.side === 'party' ? 14 : -14;
    trail(target, 250);
    await G.tween(target, { ox: hop }, 110);
    G.tween(target, { ox: 0 }, 200);
    if (target.id === 'schneider') G.popup(cx + 14, cy - 26, 'Tsc.', '#c8d0ff');
  }

  // Golpe corpo a corpo (ou à distância, com projétil). O impacto tem câmera lenta; o crítico, um salto próprio.
  async function strike(user, target, atk, { name, heavy = false, noMiss = false } = {}) {
    const hits = atk.hits || 1;
    const atkKey = `${user.sprite}_atk`;
    if (user.side === 'party' && atk.fx && G.art.get(atkKey)) { user.atkSprite = atkKey; user.atkFrame = (atk.fx === 'bite' || atk.fx === 'peck') ? 1 : 0; }
    user.front = true;
    await primeiroGolpe(user, atk);
    if (name) G.showBanner(name, 1100);
    const ranged = atk.ranged || atk.fx === 'beam';
    if (ranged) {
      user.pose = 1;
      G.sfx(atk.fx === 'rocket' ? 'rocket' : 'heavy');
      await G.wait(150);
    } else await approach(user, target);
    const dir = user.side === 'party' ? -1 : 1;
    let announced = false;
    for (let h = 0; h < hits; h++) {
      const r = rollHit(user, target, atk.mult, { noMiss, acc: atk.acc || 0 });
      const [cx, cy] = center(target);
      if (ranged) { G.hitMark(atk.fx, cx, cy, { dir, from: center(user) }); await G.wait(260); }
      if (r.miss) await doMiss(target);
      else {
        const kills = willKill(user, target, r.dmg);
        if (kills && !announced) { announced = true; await killLine(user); }
        if (r.crit && user.side === 'enemy' && h === 0) { resetZoom(); await S().critInimigo(user); }
        if (r.crit && user.side === 'party' && !ranged && h === 0) {
          if (!announced) await critLine(user);
          await critSequence(user, target);
        }
        else if (!ranged) G.slowmo(.45, 220);
        if (atk.fx && !ranged) G.hitMark(atk.fx, cx, cy, { dir, crit: r.crit });
        if (r.silver) G.popup(cx, cy - 30, 'PRATA!', '#e8f0ff');
        await applyDamage(target, r.dmg, { crit: r.crit, heavy: heavy || atk.heavy });
      }
      await G.wait(hits > 1 ? 220 : 380);
      if (!target.alive()) break;
    }
    if (ranged) { user.pose = 0; resetZoom(); } else await retreat(user);
    user.atkSprite = null; user.front = false;
    user.status.critGarantido = false; user.status.duplaCrit = false;
  }

  // ---------- Formas ----------
  // Forma de guerra: bônus de HP, força e agilidade da forma (data.js) sobre os valores da forma natural.
  const bonusText = (f) => { const b = f.bonus || {}; return [b.hp && `HP+${b.hp * 100}%`, b.atk && `FOR+${Math.round(b.atk * 100)}%`, b.agi && `AGI+${b.agi * 100}%`].filter(Boolean).join(' '); };

  function setForm(a, formKey) {
    const f = D.forms[formKey], R = D.resources;
    if (!a.form) {
      const b = f.bonus || {};
      const add = Math.round(a.def.hp * (b.hp || 0));
      a.maxHp = a.def.hp + add;
      a.hp = Math.min(a.maxHp, a.hp + add);
      a.atk = Math.round(a.def.atk * (1 + (b.atk || 0)));
      a.agi = Math.round(a.def.agi * (1 + (b.agi || 0)));
    }
    a.sprite = f.sprite; a.form = formKey;
    if (a.glock) { a.glock = null; G.popup(a.x, a.y - 60, 'Largou a Glock', '#c8d0ff'); }
  }

  // Transformação em campo: aura crescendo, silhueta piscando cada vez mais rápido, explosão de luz e rugido.
  async function transformAnim(a, formKey) {
    const color = AURA[a.id] || '#ffffff';
    const cy = a.y - 26;
    G.showBanner(`${a.name}: ${D.forms[formKey].name}`, 1800, '#ffb060');
    camFocus(1.7, a.x, cy, 260);
    G.sfx('transform');
    for (let i = 0; i < 7; i++) {
      a.flash = 1;
      G.auraBurst(a.x, a.y - 16, color, 10 + i * 3, 18 + i * 2);
      G.shake(1 + i * .8, 140);
      await G.wait(230 - i * 26);
    }
    G.ring(a.x, cy, color, 34, 300);
    await G.wait(120);
    G.flashScreen('#ffffff', .95, 420);
    G.hitstop(140);
    setForm(a, formKey);
    a.pose = 1; a.flash = 1;
    G.ring(a.x, cy, '#ffffff', 60, 450); G.ring(a.x, cy, color, 110, 800);
    G.auraBurst(a.x, a.y - 30, color, 50, 34);
    G.sfx('roar'); G.shake(9, 600);
    G.popup(a.x, a.y - spriteSize(a)[1] - 6, bonusText(D.forms[formKey]), '#ffe070');
    await G.wait(800);
    a.pose = 0;
    resetZoom();
    await G.wait(250);
  }

  // Volta da morte: deitado na forma natural, close nos olhos abrindo, D10 (mínimo 60%), vira forma de guerra.
  async function revive(a) {
    const formKey = a.def.warForm;
    const d = await S().revive(a, D.forms[formKey].sprite);
    if (G.debug) console.log(`  REVIVE ${a.id} d10=${d}`);
    a.form = null;
    setForm(a, formKey);
    a.revived = true;
    a.deathRound = null;
    a.status = a.id === 'valeria' ? { critGarantido: true } : {};
    a.wasHit = true;
    a.hp = Math.round(a.maxHp * Math.max(6, d) / 10);
    a.alpha = 1;
  }

  // Primeira vez que o personagem gasta Gnose ou Fúria: mostra as bolinhas sumindo, pra ensinar o custo.
  async function showCostOnce(a, res, cost) {
    if (!cost) return;
    G.costSeen = G.costSeen || {};
    if (G.costSeen[res]) return;
    G.costSeen[res] = true;
    G.ui.costDrain = { name: a.name, res, from: a[res], to: a[res] - cost, t0: G.time };
    G.sfx('cursor');
    for (let i = 0; i < cost; i++) setTimeout(() => G.sfx('back'), (350 + i * 350) / G.speed);
    await G.wait(750 + cost * 350);
    G.ui.costDrain = null;
  }

  // ---------- Ações da party ----------
  // Executa um Dom. free = true quando vem do Reflexo do Corvo (a Gnose já foi paga pelo Fetiche).
  async function doSkill(a, key, target, { free = false, power = 1 } = {}) {
    const sk = D.skills[key];
    if (!free) { await showCostOnce(a, 'gnose', sk.cost); a.gnose -= sk.cost; }
    a.status.domCd = D.resources.domCooldown;
    if (key === 'cancao_furia') {
      G.showBanner(sk.name, 1000); G.sfx('magic');
      const turns = 3 * power; // pelo Reflexo do Corvo dura o dobro
      aliveParty().forEach(p => { p.status.buff = turns; p.flash = 1; G.popup(p.x, p.y - 34, `ATK↑ ${turns} turnos`, '#ffb040'); });
      await G.wait(700); return;
    }
    if (!target) return;
    if (key === 'penas_navalha') { await strike(a, target, { mult: .7 * power, hits: 3, fx: 'claw' }, { name: sk.name }); return; }
    if (key === 'presas_ahroun') { await strike(a, target, { mult: 2.2 * power, fx: 'bite' }, { name: sk.name, heavy: true }); return; }
    if (key === 'golpe_klaive') { await strike(a, target, { mult: (target.id === 'fomor' ? 2.6 : 2) * power, fx: 'blade' }, { name: sk.name, heavy: true }); return; }
    if (key === 'giro_morte') {
      await strike(a, target, { mult: 2.4 * power, fx: 'bite' }, { name: sk.name, heavy: true });
      if (target.alive() && target.id !== 'fomor' && !huntOn() && Math.random() < .4) { target.status.stun = true; G.popup(target.x, target.y - 50, 'ATORDOADO', '#ffe070'); await G.wait(400); }
    }
  }

  // Fetiche da Valéria: espículas de sombra brotam do chão sob todos os inimigos.
  // Fetiche do Jan: o klaive se cobre de gelo; golpe pesado que pode congelar o alvo.
  async function klaiveDeGelo(a, target) {
    if (!target) return;
    G.showBanner(D.fetish.jan.name, 1600, '#a0e8ff');
    G.sfx('magic');
    camFocus(1.5, a.x, a.y - 30, 260);
    for (let i = 0; i < 4; i++) { a.flash = .7; G.auraBurst(a.x - 10, a.y - 30, i % 2 ? '#e0f8ff' : '#70c8ff', 14, 16); await G.wait(160); }
    G.flashScreen('#c0f0ff', .5, 250);
    await approach(a, target);
    const [cx, cy] = center(target);
    G.hitMark('ice', cx, cy, { crit: true });
    G.slowmo(.35, 400);
    const r = rollHit(a, target, 4.8, { noMiss: true, physical: false }); // fetiche: dano dobrado
    if (willKill(a, target, r.dmg)) await killLine(a);
    await applyDamage(target, r.dmg, { heavy: true, color: '#a0e8ff' });
    if (target.alive() && target.id !== 'fomor' && !huntOn() && Math.random() < .6) { target.status.stun = true; target.status.frozen = 1; G.popup(target.x, target.y - 50, 'CONGELADO', '#a0e8ff'); }
    await G.wait(400);
    await retreat(a);
  }

  async function estacasDeSombra(a) {
    G.showBanner(D.fetish.valeria.name, 1600, '#b070ff');
    G.sfx('transform');
    camFocus(1.2, G.W * .35, 90, 300);
    a.pose = 1; a.flash = 1;
    G.auraBurst(a.x, a.y - 20, '#6a2ab0', 30, 24);
    await G.wait(500);
    G.flashScreen('#200030', .7, 400);
    for (const e of targetableEnemies()) {
      G.hitMark('spikes', e.x, e.y, { crit: true });
      G.sfx('slash');
      await G.wait(160);
    }
    G.shake(9, 500);
    await G.wait(250);
    const rolls = targetableEnemies().map(e => [e, rollHit(a, e, 3.2, { noMiss: true, physical: false })]); // fetiche: dano dobrado
    if (rolls.some(([e, r]) => willKill(a, e, r.dmg))) await killLine(a);
    for (const [e, r] of rolls) {
      await applyDamage(e, r.dmg, { heavy: true, color: '#d0a0ff' });
      if (e.alive() && e.id !== 'fomor' && !huntOn() && Math.random() < .4) { e.status.stun = true; G.popup(e.x, e.y - 50, 'PRESO', '#d0a0ff'); }
      await G.wait(120);
    }
    a.pose = 0;
    resetZoom();
    await G.wait(300);
  }

  // Ataque em dupla: se o aliado anterior acabou de bater no mesmo inimigo, 50% de chance de um close dividido
  // e o golpe sai crítico. Cada dupla aparece uma vez por partida.
  async function tryDupla(a, target) {
    const last = B.lastHit;
    if (!last || last.target !== target || last.actor === a || !target.alive() || !last.actor.alive()) return;
    const pair = [last.actor.id, a.id].sort().join('+');
    const shown = B.flags.duplas = B.flags.duplas || {};
    if (shown[pair] || Math.random() >= .5) return;
    shown[pair] = true;
    resetZoom();
    await S().ataqueDupla(last.actor, a);
    a.status.critGarantido = true; a.status.duplaCrit = true;
  }

  async function execParty(act) {
    const a = act.actor;
    let target = act.target;
    if (target && target.side === 'enemy' && (!target.alive() || !target.present || target.bg)) target = targetableEnemies()[0];
    if (act.type === 'dodge') {
      a.status.esquiva = true;
      G.showBanner(`${a.name}: Esquivar`, 600); G.sfx('ok');
      trail(a, 300);
      await G.tween(a, { ox: 10 }, 120); await G.tween(a, { ox: 0 }, 180);
      return;
    }
    if ((act.type === 'attack' || act.type === 'skill') && target && target.side === 'enemy') await tryDupla(a, target);
    if (act.type === 'attack') {
      if (!target) return;
      await showCostOnce(a, 'furia', act.attack.cost || 0);
      a.furia -= act.attack.cost || 0;
      await strike(a, target, act.attack, { name: act.attack.name });
      return;
    }
    if (act.type === 'glock') {
      if (!target || !a.glock) return;
      if (!B.flags.primeiroTiro) { B.flags.primeiroTiro = true; await S().glockDispara(a); }
      const shots = Math.min(D.glock.perTurn, a.glock.ammo);
      G.showBanner(`Glock ×${shots}`, 900);
      a.pose = 1;
      for (let i = 0; i < shots; i++) {
        a.glock.ammo--;
        G.sfx('shot');
        const [cx, cy] = center(target);
        G.hitMark('shot', cx, cy, { from: [a.x - 16, a.y - 30] });
        G.shake(2, 80);
        await G.wait(180);
        if (!cantDodge(target) && Math.random() * 100 < target.eva + (target.status.esquiva ? 45 : 0)) await doMiss(target);
        else {
          const dmg = Math.max(1, Math.round((D.glock.dmg - target.def_ / 2) * G.rand(.9, 1.1) * partyBonus(a, target)));
          if (willKill(a, target, dmg)) await killLine(a);
          await applyDamage(target, dmg);
        }
        await G.wait(200);
        if (!target.alive()) break;
      }
      a.pose = 0;
      if (a.glock && a.glock.ammo <= 0) { a.glock = null; G.popup(a.x, a.y - 60, 'Sem balas', '#c8d0ff'); }
      return;
    }
    if (act.type === 'uktena') { await uktenaAction(a, act.mode, target); return; }
    if (act.type === 'transform') {
      if (a.form || a.furia < D.resources.transformNeed) return;
      await showCostOnce(a, 'furia', D.resources.transformCost);
      a.furia -= D.resources.transformCost;
      await transformAnim(a, a.def.warForm);
      if (!B.flags['transf_' + a.id]) { B.flags['transf_' + a.id] = true; await S().primeiraForma(a); }
      return;
    }
    if (act.type === 'fetish') {
      const f = D.fetish[a.id];
      if (!f || a.gnose < f.cost) return;
      await showCostOnce(a, 'gnose', f.cost);
      a.gnose -= f.cost;
      if (a.id === 'valeria') { await estacasDeSombra(a); return; }
      if (a.id === 'jan') { await klaiveDeGelo(a, target); return; }
      // Reflexo do Corvo: o Espelho usa o Dom de um aliado
      G.showBanner(`${f.name}: ${D.skills[act.skill].name}`, 1600, '#c8a0ff');
      a.flash = 1; G.auraBurst(a.x, a.y - 20, '#c080ff', 24, 20); G.sfx('magic');
      await G.wait(500);
      markReflexo(a, act.skill);
      await doSkill(a, act.skill, target, { free: true, power: 2 }); // fetiche: dano dobrado
      return;
    }
    if (act.type === 'skill') { await doSkill(a, act.skill, target); }
  }

  // Uktena: o totem surge sobre o Espelho e cospe Chamas Púrpuras ou cura a matilha.
  async function uktenaAction(esp, mode, target) {
    B.uktenaNext = B.round + D.uktena.cooldown;
    if (!B.flags.uktenaMet) { B.flags.uktenaMet = true; if (esp.id === 'espelho') await S().uktenaInvoca(); }
    // o Uktena passa a responder a outro da matilha: avisa uma vez por pessoa
    const avisos = B.flags.uktenaAviso = B.flags.uktenaAviso || {};
    if (esp.id !== 'espelho' && !avisos[esp.id]) {
      avisos[esp.id] = true;
      const nome = esp.name.charAt(0) + esp.name.slice(1).toLowerCase();
      await S().closeRapido('busto_uktena', 'UKTENA', `O Corvo caiu. Agora eu respondo a você, ${nome}.`, '#9ff0e8', { bg: 'cs_uktena', sfx: 'magic', shake: 0 });
    }
    if (mode === 'chamas') {
      if (!target) return;
      const firstOnFomor = target.id === 'fomor' && !B.flags.chamasCut;
      if (firstOnFomor) { B.flags.chamasCut = true; await S().chamasPurpuras(); }
      else {
        B.summon = { sprite: 'uktena', x: esp.x - 24, y: 128, alpha: 0, pose: 0 };
        G.showBanner(D.uktena.chamas.name, 1600, '#e0a0ff');
        camFocus(1.25, (esp.x + target.x) / 2, 70, 300);
        G.auraBurst(esp.x - 24, 100, '#c080ff', 40, 30);
        await G.tween(B.summon, { alpha: .95, y: 118 }, 400, G.ease.out);
        B.summon.pose = 1;
        G.sfx('fire');
        const [cx, cy] = center(target);
        G.hitMark('flame', cx, cy, { from: [B.summon.x - 36, B.summon.y - 64], crit: true });
        G.speedLines(900, -1, 'rgba(210,140,255,.7)');
        for (let i = 0; i < 4; i++) { G.shake(3 + i, 200); await G.wait(210); }
        G.flashScreen('#b050ff', .55, 350);
        G.ring(cx, cy, '#e0a0ff', 70, 600);
      }
      B.flags.chamasUsed = true;
      target.status.queimando = D.uktena.chamas.burn;
      target.status.burnFx = 1;
      await applyDamage(target, Math.round(target.maxHp * D.uktena.chamas.pct), { crit: true, heavy: true, color: '#e0a0ff' });
      if (B.summon) { await G.tween(B.summon, { alpha: 0 }, 350); B.summon = null; }
      resetZoom();
      return;
    }
    // Cura: o Uktena grande, atrás e à direita do grupo, corpo sumindo como espírito, soprando luz sobre todos.
    if (!B.flags.uktenaCurou) { B.flags.uktenaCurou = true; await S().uktenaCura(); }
    B.summon = { sprite: 'uktena', x: 356, y: 150, alpha: 0, pose: 2, scale: 1.6, spirit: true, behind: true };
    G.showBanner(D.uktena.curar.name, 1600, '#9ff0e8');
    G.sfx('heal');
    camFocus(G.BASE_ZOOM * 1.05, 300, 90, 400);
    await G.tween(B.summon, { alpha: .95, y: 142 }, 600, G.ease.out);
    const party = aliveParty();
    const breath = setInterval(() => party.forEach(p => G.auraBurst(p.x + G.rand(-10, 10), p.y - G.rand(30, 60), '#9ff0e8', 3, 8)), 60 / G.speed);
    for (let i = 0; i < 18; i++) G.hitMark('breath', party[i % party.length].x, party[i % party.length].y - 30, { from: [320, 32] });
    await G.wait(900);
    clearInterval(breath);
    G.flashScreen('#60ffe0', .25, 400);
    for (const p of party) {
      const heal = Math.round(p.maxHp * D.uktena.curar.pct);
      p.hp = Math.min(p.maxHp, p.hp + heal); p.flash = 1;
      G.popup(p.x, p.y - 30, heal, '#70ff90');
      await G.wait(90);
    }
    await G.wait(600);
    await G.tween(B.summon, { alpha: 0 }, 500); B.summon = null;
    resetZoom();
  }

  // ---------- IA inimiga ----------
  function pickPartyTarget() {
    if (B.flags.focusValeria && !B.flags.m1done && P('valeria').alive()) return P('valeria');
    const alive = aliveParty();
    return alive[G.randInt(0, alive.length - 1)];
  }

  // Vômito ácido do fomor: a barriga incha e borbulha, close no rosto, e um jato tóxico grosso varre a party.
  // Quem é atingido fica com fumaça verde em cima do corpo por 1 turno.
  async function acidVomit(e, atk) {
    if (Math.random() < .5) await S().fomorVomita();
    await primeiroGolpe(e, atk, 'golpe_fomor_vomito');
    G.showBanner(atk.name, 1500, '#b0ff80');
    const [ex, ey] = center(e);
    const mouth = [ex + 26, ey - 26];
    camFocus(1.8, ex + 20, ey - 20, 250);
    e.pose = 1;
    G.sfx('roar');
    // bolhas subindo pela garganta
    for (let i = 0; i < 5; i++) {
      e.flash = .5; G.shake(1 + i, 150);
      G.auraBurst(ex + G.rand(-10, 16), ey + G.rand(-6, 10), i % 2 ? '#80e040' : '#d0ff90', 8, 10);
      G.sfx('hit');
      await G.wait(160);
    }
    G.ring(mouth[0], mouth[1], '#90ff50', 30, 300);
    G.hitstop(120);
    resetZoom();
    await G.wait(120);
    // o jato: sai da boca e vai varrendo alvo por alvo
    const targets = aliveParty();
    const jet = { reach: 0, tx: mouth[0] + 40, ty: mouth[1] + 20, on: true };
    const layer = { draw: (ctx) => { if (jet.on) G.toxicStream(ctx, mouth[0], mouth[1], jet.tx, jet.ty, jet.reach, 1.3); } };
    G.fx.overlays = G.fx.overlays || [];
    G.fx.overlays.push(layer);
    G.sfx('fire');
    G.speedLines(1600, 1, 'rgba(150,255,90,.6)');
    await G.tween(jet, { reach: 1 }, 260, G.ease.out);
    for (const t of targets) {
      const [tx, ty] = center(t);
      await G.tween(jet, { tx, ty }, 200, G.ease.inOut);
      G.hitMark('acid', tx, ty, { from: [tx - 30, ty - 30] });
      G.auraBurst(tx, ty, '#90ff50', 14, 12);
      G.shake(3, 150);
      await G.wait(130);
    }
    G.flashScreen('#80ff40', .4, 300);
    await G.wait(200);
    jet.on = false;
    G.fx.overlays = G.fx.overlays.filter(o => o !== layer);
    for (const t of targets) {
      const r = rollHit(e, t, atk.mult, { noMiss: true, physical: false });
      t.status.acidFx = G.time + 900;
      t.status.toxico = 1; // fumaça verde até o fim da próxima rodada
      await applyDamage(t, r.dmg, { color: '#b0ff80' });
      await G.wait(90);
    }
    e.pose = 0;
    await G.wait(300);
  }

  // Ciborgue sem braços: só dá cabeçada. Corre abaixado e enfia a cabeça de metal no alvo.
  async function headbutt(e, target, atk) {
    await primeiroGolpe(e, atk);
    G.showBanner(atk.name, 1100, '#bfe8ff');
    e.front = true;
    await approach(e, target);
    await G.tween(e, { ox: e.ox + 10, oy: e.oy + 6 }, 90, G.ease.in);
    const r = rollHit(e, target, atk.mult);
    const [cx, cy] = center(target);
    if (r.miss) await doMiss(target);
    else {
      G.hitMark('headbutt', cx - 6, cy - 8, { crit: r.crit });
      G.slowmo(.4, 250);
      G.sfx('explode');
      await applyDamage(target, r.dmg, { crit: r.crit, heavy: true });
    }
    await G.wait(300);
    await retreat(e);
    e.front = false;
  }

  async function execEnemy(e) {
    if (huntOn()) { e.status.stun = false; e.status.frozen = 0; } // na perseguição ninguém segura os dois
    if (e.status.stun) { e.status.stun = false; e.status.frozen = 0; G.showBanner(`${e.name} está atordoado`, 700); await G.wait(500); return; }
    if (!aliveParty().length) return;
    const atks = e.armless ? D.ciborgueSemBracos.attacks : e.def.attacks;
    let atk = atks[G.randInt(0, atks.length - 1)];
    if (atk.area && Math.random() < .5) atk = atks[0];
    if (atk.area) { await acidVomit(e, atk); return; }
    if (e.armless) { const t = pickPartyTarget(); if (t) await headbutt(e, t, atk); return; }
    if (e.id.startsWith('agente') && !B.flags.agenteProvocou) { B.flags.agenteProvocou = true; await S().agenteProvoca(); }
    let target = pickPartyTarget();
    if (e.id.startsWith('drone') && B.lockTarget) { if (B.lockTarget.alive()) target = B.lockTarget; B.lockTarget = null; }
    // na perseguição, o Schneider zomba da Valéria antes do primeiro golpe nela
    if (e.id === 'schneider' && huntOn() && target && target.id === 'valeria' && !B.flags.cantaLoba) {
      B.flags.cantaLoba = true;
      await S().closeRapido('busto_schneider_ri', 'SCHNEIDER', 'Canta agora, loba. Canta.', '#c8d0ff', { sfx: 'laugh', shake: 2 });
    }
    if (!target) return;
    await strike(e, target, atk, { name: atk.name, heavy: atk.heavy });
  }

  // ---------- Fase de comando ----------
  const GNOSE_COLOR = '#c8a0ff', FURIA_COLOR = '#ff8a6a';
  const costLabel = (cost, res) => (cost ? `${cost} ${res}` : 'LIVRE');
  const subMenu = (items, title, titleColor) => G.menu({ items, title, titleColor, x: 4, y: 88, w: 272, rowH: 11 });

  function chooseTarget(kind, a) {
    if (kind === 'enemy') return G.pickTarget(targetableEnemies().sort((x, y) => x.x - y.x)); // esquerda → direita, como na tela
    return Promise.resolve(a);
  }

  // Quem comanda o Uktena: o Espelho; se ele cair, a Sangria; depois o Jan; depois a Valéria.
  // (O Matias estaria antes da Valéria, mas ele não luta nesta cena.)
  const uktenaHolder = () => ['espelho', 'sangria', 'jan', 'valeria'].map(P).find(p => p && p.alive() && !emFrenesi(p)) || null;
  const uktenaReady = (a) => uktenaHolder() === a && ['3', '4', '5'].includes(B.phase) && B.round >= B.uktenaNext;
  // Dons dos aliados que o Reflexo do Corvo pode copiar
  const allCopyable = (a) => [...new Set(aliveParty().filter(p => p !== a).flatMap(p => p.skills))];
  // Reflexo do Corvo: cada Dom copiado fica travado até todos os outros serem usados; aí o ciclo recomeça.
  const reflexoUsed = () => (B.flags.reflexoUsed = B.flags.reflexoUsed || []);
  const copyableSkills = (a) => { const all = allCopyable(a), left = all.filter(k => !reflexoUsed().includes(k)); return left.length ? left : all; };
  function markReflexo(a, key) {
    const used = reflexoUsed();
    if (!used.includes(key)) used.push(key);
    if (allCopyable(a).every(k => used.includes(k))) B.flags.reflexoUsed = [];
  }

  async function chooseCommand(a) {
    const frenesi = emFrenesi(a); // voltou da morte / Frenesi: só ataca, até um inimigo cair depois da volta
    const R = D.resources;
    const cmds = [];
    const fet = D.fetish[a.id]; // precisa existir fora do bloco (usado no submenu do Fetiche)
    if (frenesi) {
      // voltou da morte / Frenesi: o menu tem só Ataque (mordida, garrada, bicada)
      cmds.push({ key: 'attack', label: 'Ataque', color: '#ff8080', desc: a.revived ? 'Voltou da morte: só ataca.' : 'Frenesi: só ataca.' });
    } else {
    if (uktenaHolder() === a && ['3', '4', '5'].includes(B.phase))
      cmds.push({ key: 'uktena', label: 'Uktena', color: '#e0a0ff', disabled: !uktenaReady(a),
        desc: uktenaReady(a) ? 'Comandar o totem Uktena.' : 'O Uktena descansa (a cada 2 turnos).' });
    cmds.push({ key: 'attack', label: 'Ataque', color: frenesi ? '#ff8080' : undefined });
    const domCd = a.status.domCd > 0;
    cmds.push({ key: 'dons', label: 'Dons', disabled: frenesi || domCd || !a.skills.length,
      desc: domCd ? 'Dons descansando: voltam no próximo turno.' : frenesi ? 'Em Frenesi não há Dons.' : 'Poderes que gastam Gnose.' });
    if (fet) cmds.push({ key: 'fetish', label: 'Fetiche', right: `${fet.cost}`, rightColor: GNOSE_COLOR, color: '#d0a0ff',
      disabled: a.gnose < fet.cost || (a.id === 'espelho' && !copyableSkills(a).length), desc: `${fet.name}: ${fet.desc} (${fet.cost} Gnose)` });
    if (a.form) cmds.push({ key: 'transform', label: 'Mudança de forma', disabled: true, desc: `Já está em ${D.forms[a.form].name}.` });
    else cmds.push({ key: 'transform', label: 'Mudança de forma', right: `${R.transformCost}`, rightColor: FURIA_COLOR,
      disabled: a.furia < R.transformNeed,
      desc: a.furia < R.transformNeed ? `Libera com Fúria cheia (${R.transformNeed}). Custa ${R.transformCost}.` : `${D.forms[a.def.warForm].name}: ${R.transformCost} Fúria. ${bonusText(D.forms[a.def.warForm])}.` });
    if (a.glock) cmds.push({ key: 'item', label: 'Item', desc: `Glock: ${a.glock.ammo} balas` }); // só quem pegou a arma das agentes
    cmds.push({ key: 'dodge', label: 'Esquivar', desc: 'Muito mais difícil de acertar nesta rodada.' });
    }
    if (G.debug) console.log('  menu', a.id, `furia=${a.furia}`, cmds.map(c => c.label + (c.disabled ? '(x)' : '')).join('|'));
    let idx = cmds[0].disabled ? 1 : 0;
    for (;;) {
      idx = await G.menu({ items: cmds, idx, title: a.name, rowH: 10, w: 136, y: G.H - cmds.length * 10 - 21 });
      if (idx < 0) return 'back';
      const c = cmds[idx].key;
      if (c === 'dodge') return { actor: a, type: 'dodge' };
      if (c === 'transform') return { actor: a, type: 'transform' };
      if (c === 'attack') {
        const list = attacksFor(a);
        const ai = await subMenu(list.map(t => ({ label: t.name + (t.hits ? ` ×${t.hits}` : ''), right: costLabel(t.cost, 'FÚRIA'), rightColor: FURIA_COLOR, disabled: (t.cost || 0) > a.furia,
          desc: (t.cost ? `Ataque de Fúria: bate mais forte (${t.cost} Fúria).` : 'Ataque básico, não gasta Fúria.') })), `ATAQUE · FÚRIA ${a.furia}/${R.max}`, FURIA_COLOR);
        if (ai < 0) continue;
        const t = await chooseTarget('enemy');
        if (t) return { actor: a, type: 'attack', attack: list[ai], target: t };
        continue;
      }
      if (c === 'uktena') {
        const ui = await subMenu([
          { label: D.uktena.chamas.name, color: '#e0a0ff', desc: D.uktena.chamas.desc },
          { label: 'Curar', color: '#9ff0e8', desc: D.uktena.curar.desc },
        ], 'UKTENA');
        if (ui < 0) continue;
        if (ui === 1) return { actor: a, type: 'uktena', mode: 'curar' };
        const t = await chooseTarget('enemy');
        if (t) return { actor: a, type: 'uktena', mode: 'chamas', target: t };
        continue;
      }
      if (c === 'fetish') {
        if (a.id === 'valeria' || a.id === 'jan') {
          const fi = await subMenu([{ label: fet.name, right: `${fet.cost} GNOSE`, rightColor: GNOSE_COLOR, color: '#d0a0ff', desc: fet.desc }], `FETICHE · GNOSE ${a.gnose}/${R.max}`, GNOSE_COLOR);
          if (fi < 0) continue;
          if (a.id === 'valeria') return { actor: a, type: 'fetish' };
          const t = await chooseTarget('enemy'); if (t) return { actor: a, type: 'fetish', target: t }; continue;
        }
        const keys = allCopyable(a), open = copyableSkills(a);
        const si = await subMenu(keys.map(k => ({ label: D.skills[k].name, right: open.includes(k) ? 'COPIAR' : 'USADO', rightColor: GNOSE_COLOR, disabled: !open.includes(k),
          desc: open.includes(k) ? `${D.skills[k].desc} Com o Reflexo: dano dobrado.` : 'Já copiado. Volta quando você usar os outros Dons.' })), `REFLEXO · ${fet.cost} GNOSE`, GNOSE_COLOR);
        if (si < 0) continue;
        const t = await chooseTarget(D.skills[keys[si]].target, a);
        if (t) return { actor: a, type: 'fetish', skill: keys[si], target: t };
        continue;
      }
      if (c === 'dons') {
        const list = a.skills.map(k => {
          const s = D.skills[k];
          const disabled = s.cost > a.gnose || (s.needsForm && a.form !== s.needsForm);
          return { key: k, label: s.name, right: costLabel(s.cost, 'GNOSE'), rightColor: GNOSE_COLOR, disabled, desc: s.desc };
        });
        const si = await subMenu(list, `DONS · GNOSE ${a.gnose}/${R.max}`, GNOSE_COLOR);
        if (si < 0) continue;
        const sk = D.skills[list[si].key];
        const t = await chooseTarget(sk.target, a);
        if (t) return { actor: a, type: 'skill', skill: list[si].key, target: t };
        continue;
      }
      if (c === 'item') {
        const ii = await subMenu([{ label: 'Glock', right: `${a.glock.ammo} balas`, desc: `Até ${D.glock.perTurn} tiros neste turno.` }], 'ITENS');
        if (ii < 0) continue;
        const t = await chooseTarget('enemy');
        if (t) return { actor: a, type: 'glock', target: t };
        continue;
      }
    }
  }

  // IA do modo de teste (?auto): joga o combate inteiro sozinha.
  function autoCommand(a) {
    const en = targetableEnemies();
    const open = en.filter(e => e.hp > hpFloor(e));
    const target = open.find(e => e.id.startsWith('drone')) || open[G.randInt(0, open.length - 1)] || en[0];
    if (uktenaReady(a)) {
      const hurt = aliveParty().filter(p => p.hp < p.maxHp * .4).length >= 2;
      return hurt ? { actor: a, type: 'uktena', mode: 'curar' } : { actor: a, type: 'uktena', mode: 'chamas', target: en.find(e => e.id === 'fomor') || target };
    }
    const atks = attacksFor(a).filter(t => (t.cost || 0) <= a.furia);
    const attack = { actor: a, type: 'attack', attack: atks[G.randInt(0, atks.length - 1)], target };
    const fet = D.fetish[a.id];
    if (fet && a.gnose >= fet.cost && Math.random() < .5) {
      if (a.id === 'valeria') return { actor: a, type: 'fetish' };
      if (a.id === 'jan') return { actor: a, type: 'fetish', target };
      const keys = copyableSkills(a);
      if (keys.length) { const k = keys[G.randInt(0, keys.length - 1)]; return { actor: a, type: 'fetish', skill: k, target: D.skills[k].target === 'enemy' ? target : a }; }
    }
    if (emFrenesi(a)) return attack;
    if (!a.form && a.furia >= D.resources.transformNeed && Math.random() < .6) return { actor: a, type: 'transform' };
    if (a.glock && Math.random() < .5) return { actor: a, type: 'glock', target };
    if (!(a.status.domCd > 0)) for (const k of a.skills) {
      const s = D.skills[k];
      if (s.cost > a.gnose || (s.needsForm && a.form !== s.needsForm)) continue;
      if (Math.random() < .5) return { actor: a, type: 'skill', skill: k, target: s.target === 'enemy' ? target : a };
    }
    return Math.random() < .08 ? { actor: a, type: 'dodge' } : attack;
  }

  async function commandPhase() {
    const actors = B.party.filter(canAct);
    const acts = [];
    let i = 0;
    while (i < actors.length) {
      const a = actors[i];
      B.activeId = a.id;
      if (G.debug) console.log('  cmd', a.id);
      const act = G.auto ? autoCommand(a) : await chooseCommand(a);
      if (act === 'back') { if (i > 0) i--; continue; }
      acts[i] = act; i++;
    }
    B.activeId = null;
    return acts;
  }

  // ---------- Resolução ----------
  async function resolvePhase(partyActs) {
    const all = partyActs.map(a => ({ ...a, init: a.actor.agi + G.rand(0, 6) + (a.type === 'dodge' ? 100 : 0) }));
    targetableEnemies().forEach(e => {
      for (let k = 0; k < e.actions; k++) all.push({ actor: e, type: 'enemy', init: e.agi + G.rand(0, 6) - k * 10 });
    });
    all.sort((a, b) => b.init - a.init);
    for (const act of all) {
      if (B.abortRound || B.result) return;
      const a = act.actor;
      if (G.debug) console.log('  acao', a.id, act.type, act.attack ? act.attack.name : act.skill || '', act.target ? act.target.id : '');
      if (!a.alive()) continue;
      if (a.side === 'party') {
        if (!canAct(a)) continue;
        await execParty(act);
        const tg = act.target;
        B.lastHit = (tg && tg.side === 'enemy' && (act.type === 'attack' || act.type === 'skill')) ? { actor: a, target: tg } : null;
      } else {
        if (!a.present || a.bg) continue;
        B.lastHit = null;
        await execEnemy(a);
      }
      await G.wait(160);
      if (B.pendingProvoca) { const k = B.pendingProvoca; B.pendingProvoca = null; await S().schneiderProvoca(k); }
      await checkTriggers();
    }
  }

  async function endRound() {
    for (const p of B.party) {
      p.status.esquiva = false;
      if (p.status.buff > 0) p.status.buff--;
      if (p.status.domCd > 0) p.status.domCd--;
      if (p.status.frenesiGlow > 0) p.status.frenesiGlow--;
      if (p.status.toxico > 0) p.status.toxico--;
      if (p.status.paralisado > 0) { p.status.paralisado--; if (!p.status.paralisado && p.alive()) G.popup(p.x, p.y - 30, 'Voltou!', '#70ff90'); }
      if (p.status.catatonico > 0) {
        p.status.catatonico--;
        if (!p.status.catatonico && p.alive()) { G.popup(p.x, p.y - 30, 'Voltou a si!', '#70ff90'); if (p.id === 'jan') await S().janVolta(p); }
      }
    }
    // Gnose e Fúria: +1 por turno pra todo mundo de pé
    const R = D.resources;
    aliveParty().forEach(p => { p.gnose = Math.min(R.max, p.gnose + R.perTurn); p.furia = Math.min(R.max, p.furia + R.perTurn); });
    for (const e of B.enemies) if (e.status.burnFx > 0) e.status.burnFx--;
    for (const e of targetableEnemies()) {
      if (e.status.queimando > 0) {
        e.status.queimando--;
        await applyDamage(e, Math.round(e.maxHp * D.uktena.chamas.burnPct), { color: '#e0a0ff' });
        await G.wait(250);
      }
    }
    // Quem ficou 1 turno inteiro no chão pode tentar voltar (uma vez por combate)
    for (const p of B.party) {
      if (!p.alive() && !p.revived && p.deathRound !== null && B.round - p.deathRound >= 1) await revive(p);
    }
    await checkTriggers();
    // Fase 4: os drones duram exatamente duas rodadas; o que sobrar explode no fim da 2ª
    if (B.phase === '4' && B.round - B.phase4Start >= 1) {
      for (const d of ['drone1', 'drone2'].map(E)) if (d.alive() && d.present) { d.hp = 1; await applyDamage(d, 1, { heavy: true }); G.popup(d.x, d.y - 30, 'PANE!', '#bfe8ff'); await G.wait(200); }
      await checkTriggers();
    }
    if (B.flags.focusValeria && !B.flags.m1done && !P('valeria').alive()) { await momento1(); await S().matiasEntreato(); }
    // caçada curta: depois de 2 turnos com a Valéria de pé, o Matias entra e a caçada acaba (sem execução)
    else if (B.flags.focusValeria && !B.flags.m1done && B.flags.huntMode === 'curta' && B.round - B.flags.huntStart >= 1) {
      B.flags.focusValeria = false; B.flags.m1done = true; B.flags.semExecucao = true;
      await S().matiasEntreato();
    }
    // Momento 2: depois que a Valéria volta, o Schneider (preso em 20%) se transforma no fim da rodada em que chega lá
    else if (B.phase === '2b' && B.flags.m1done && E('schneider').hp <= Math.ceil(E('schneider').maxHp * .2)) await momento2();
    B.round++;
  }

  // ---------- Gatilhos do roteiro ----------
  // Derrota: todos (menos a Valéria) no chão sem volta possível.
  function partyWiped() {
    return B.party.filter(p => p.id !== 'valeria').every(p => !p.alive() && (p.revived || p.deathRound === null));
  }

  async function checkTriggers() {
    if (B.result) return;
    if (partyWiped()) { B.result = 'defeat'; return; }
    const vivos = aliveParty();
    if (vivos.length === 1 && !B.flags.ultimoDePe) { B.flags.ultimoDePe = true; resetZoom(); await S().ultimoDePe(vivos[0]); }
    const sch = E('schneider'), cib = E('ciborgue'), fom = E('fomor');
    if (B.phase === '1' && sch.hp + cib.hp <= .7 * (sch.maxHp + cib.maxHp)) return fase2();
    if (B.phase === '2' && !E('agente1').alive() && !E('agente2').alive()) return retorno();
    if (B.phase === '3' && fom.hp <= fom.maxHp * .3) return drones();
    if (B.phase === '4' && !E('drone1').alive() && !E('drone2').alive()) return fomorVolta();
    if (B.phase === '5' && !cib.alive() && (B.flags.chamasUsed || espelhoGone() || P('espelho').revived) && fom.hp <= fom.maxHp * .1) return final();
  }

  async function fase2() {
    B.abortRound = true;
    await S().vulto();
    [E('schneider'), E('ciborgue')].forEach(e => { e.bg = true; [e.x, e.y] = BG_POS[e.id]; e.alpha = .45; });
    ['agente1', 'agente2'].forEach(id => { const a = E(id); a.present = true; a.alpha = 1; });
    B.phase = '2';
    G.track('fase', { fase: '2' });
    saveCheckpoint();
  }

  async function retorno() {
    B.abortRound = true;
    // As Glocks dos agentes: até dois personagens ainda em forma humana pegam.
    const humans = B.party.filter(p => p.alive() && p.def.human && !p.form).sort(() => Math.random() - .5).slice(0, 2);
    humans.forEach(p => { p.glock = { ammo: D.glock.ammo }; });
    await S().retorno(humans.map(p => p.name));
    ['schneider', 'ciborgue'].forEach(id => { const e = E(id); e.bg = false; [e.x, e.y] = ENEMY_POS[id]; e.alpha = 1; });
    B.phase = '2b';
    B.flags.focusValeria = true;
    // Rota da perseguição, decidida pelo HP da Valéria na hora da ordem do Schneider:
    // 50% ou mais → a caçada dura 2 turnos, entra o Matias e a luta segue normal (sem execução);
    // abaixo de 50% → caçada até ela morrer, execução, Frenesi, e aí o Matias.
    const v = P('valeria');
    B.flags.huntMode = v.alive() && v.hp >= v.maxHp * .5 ? 'curta' : 'ate_morrer';
    B.flags.huntStart = B.round;
    G.track('fase', { fase: '2b', rota: B.flags.huntMode });
    if (G.debug) console.log(`  perseguição: ${B.flags.huntMode} (Valéria ${v.hp}/${v.maxHp})`);
    saveCheckpoint();
  }

  async function momento1() {
    const v = P('valeria');
    const d = await S().execucao();
    v.form = null;
    setForm(v, 'valeria_crinos');
    v.status = { frenesi: true, frenesiGlow: 1, critGarantido: true };
    v.revived = true;
    v.wasHit = true;
    v.alpha = 1;
    v.hp = Math.round(v.maxHp * Math.max(6, d) / 10);
    B.flags.focusValeria = false;
    B.flags.m1done = true;
  }

  async function momento2() {
    B.abortRound = true;
    const sch = E('schneider'), fom = E('fomor');
    await S().fomor();
    G.music.setLevel(2);
    sch.present = false;
    fom.present = true; fom.hp = fom.maxHp; fom.alpha = 1;
    // M92: Espelho sempre resiste, Jan sempre fica catatônico e mais UM (sorteado) perde o próximo turno.
    const others = B.party.filter(p => p.alive() && !['espelho', 'jan'].includes(p.id));
    const loser = others[G.randInt(0, others.length - 1)];
    const results = B.party.map(p => {
      if (!p.alive()) return { name: p.name, id: p.id, down: true };
      // dificuldade 6: resiste com 7–10, falha com 2–5; só o Jan tira 1
      if (p.id === 'espelho') return { name: p.name, id: p.id, ok: true, roll: G.randInt(7, 10) };
      if (p.id === 'jan') { p.status.catatonico = 3; return { name: p.name, id: p.id, ok: false, catatonico: true, roll: 1 }; }
      if (p === loser) { p.status.paralisado = 1; return { name: p.name, id: p.id, ok: false, roll: G.randInt(2, 5) }; }
      return { name: p.name, id: p.id, ok: true, roll: G.randInt(7, 10) };
    });
    await S().testeVontade(results);
    await S().schneiderProvoca('fase3');
    B.phase = '3';
    G.track('fase', { fase: '3' });
    saveCheckpoint();
  }

  async function drones() {
    B.abortRound = true;
    const fom = E('fomor'), cib = E('ciborgue');
    await S().drones(cib.alive());
    fom.bg = true; [fom.x, fom.y] = BG_POS.fomor; fom.alpha = .45; fom.status.acuado = false;
    // M81: ajoelhado, cabeça baixa, soltando vapor verde enquanto se recupera
    if (G.art.get('fomor_ajoelhado')) { fom.sprite = 'fomor_ajoelhado'; fom.pose = 0; }
    fom.status.vapor = true;
    if (cib.alive()) { cib.armless = true; cib.sprite = D.ciborgueSemBracos.sprite; cib.atk = D.ciborgueSemBracos.atk; }
    ['drone1', 'drone2'].forEach(id => { const d = E(id); d.present = true; d.alpha = 1; });
    B.flags.dronesOut = true;
    // mira travada: o primeiro foguete vai nesse alvo
    const vivos = aliveParty();
    if (vivos.length) { B.lockTarget = vivos[G.randInt(0, vivos.length - 1)]; await S().miraDrones(B.lockTarget); }
    B.phase = '4';
    B.phase4Start = B.round;
    G.track('fase', { fase: '4' });
    saveCheckpoint();
  }

  async function fomorVolta() {
    B.abortRound = true;
    const fom = E('fomor');
    await S().fomorVolta();
    fom.bg = false; [fom.x, fom.y] = ENEMY_POS.fomor; fom.alpha = 1;
    fom.sprite = D.enemies.fomor.sprite; fom.status.vapor = false;
    // força ajustada ao HP da matilha: 0 = esgotada, 1 = cheia
    const alive = aliveParty(), R = D.resources;
    const r = alive.length ? alive.reduce((t, p) => t + p.hp / p.maxHp, 0) / B.party.length : 0; // só o HP da matilha
    fom.hp = Math.round(fom.maxHp * (.3 + .4 * r));
    fom.atk = Math.round(D.enemies.fomor.atk * (.8 + .45 * r));
    if (G.debug) console.log(`  M55 party=${r.toFixed(2)} fomor hp=${fom.hp} atk=${fom.atk}`);
    ['drone1', 'drone2'].forEach(id => { const d = E(id); if (d.alive()) { d.present = false; d.hp = 0; } });
    B.phase = '5';
    G.track('fase', { fase: '5' });
    saveCheckpoint();
  }

  async function final() {
    B.abortRound = true;
    await S().finalValeria();
    E('fomor').hp = 0; E('fomor').alpha = 0;
    await S().uivoFinal(); // corte seco pro M73; o reconhecimento do Uktena acontece lá dentro
    B.result = 'victory';
  }

  // ---------- Telas de fim ----------
  async function endScreen(title, color, lines, button) {
    await G.CS.open('cs_mente');
    G.CS.addDraw(ctx => {
      G.text(ctx, title, G.W / 2, 60, color, 'center');
      lines.forEach((l, i) => G.text(ctx, l, G.W / 2, 90 + i * 14, '#c8d0ff', 'center'));
    });
    const i = await G.menu({ items: [{ label: button }], x: G.W / 2 - 70, y: 150, w: 140, canBack: false });
    await G.CS.close();
    return i;
  }

  // Revisão: ?cena=<nome> abre um cut-in direto (ex.: finalValeria, reconhecimento, fomor, chamasPurpuras, revive).
  G.previewScene = async (name) => {
    setup();
    const S_ = S();
    if (name === 'revive') {
      const who = P(G.params.get('quem') || 'jan');
      await S_.revive(who, D.forms[who.def.warForm].sprite);
    } else if (name === 'ameaca') {
      const who = P(G.params.get('quem') || 'jan');
      if (G.params.has('guerra')) setForm(who, who.def.warForm);
      await S_.ameaca(who);
    } else if (name === 'ataqueDupla') {
      await S_.ataqueDupla(P(G.params.get('a') || 'sangria'), P(G.params.get('b') || 'valeria'));
    } else if (name === 'retorno') await S_.retorno(['JAN', 'TINGA']);
    else if (name === 'drones') await S_.drones(true);
    else if (name === 'testeVontade') await S_.testeVontade([{ name: 'ESPELHO', ok: true, roll: 9 }, { name: 'SANGRIA', ok: false, roll: 4 }, { name: 'JAN', ok: false, catatonico: true, roll: 1 }, { name: 'TINGA', ok: true, roll: 7 }, { name: 'VALÉRIA', ok: true, roll: 8 }]);
    else await S_[name]();
  };

  // ---------- Loop principal ----------
  G.runBattle = async () => {
    setup();
    G.track('inicio');
    G.usedLines = new Set();
    await S().intro();
    G.music.start(1);
    saveCheckpoint();
    for (;;) {
      B.abortRound = false;
      if (G.debug) console.log(`[rodada ${B.round}] fase ${B.phase} flags=${JSON.stringify(B.flags)}`, G.actors.filter(a => a.present).map(a => `${a.id}:${a.hp}`).join(' '));
      const acts = await commandPhase();
      await resolvePhase(acts);
      if (!B.result && !B.abortRound) await endRound();
      if (!B.result && B.abortRound) await checkTriggers();
      if (B.result === 'defeat') {
        G.sfx('gameover');
        G.track('derrota', { fase: B.phase, rodadas: B.round });
        console.log('[resultado] derrota na fase', B.phase);
        if (G.auto) document.title = 'DERROTA fase ' + B.phase;
        await endScreen('GAME OVER', '#ff6060', ['A matilha caiu.'], 'Tentar de novo');
        loadCheckpoint();
        continue;
      }
      if (B.result === 'victory') {
        G.music.stop();
        G.sfx('victory');
        G.track('vitoria', { rodadas: B.round });
        console.log(`[resultado] vitória em ${B.round} rodadas`);
        if (G.auto) document.title = 'VITORIA ' + B.round;
        await endScreen('VITÓRIA', '#ffe070', [`Rodadas: ${B.round}`, `Dano causado: ${B.stats.dmg}`, 'Voz da Fúria, Galliard dos Algozes de Anhangá.'], 'Continuar');
        await S().posCreditos();
        return;
      }
    }
  };
})();
