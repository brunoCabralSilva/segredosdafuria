// Efeitos sonoros chiptune sintetizados (onda quadrada, triangular e ruído), sem arquivos.
(() => {
  let ac = null, master = null;
  G.audioUnlock = () => {
    if (ac) return;
    try {
      ac = new (window.AudioContext || window.webkitAudioContext)();
      master = ac.createGain();
      master.gain.value = 0.35;
      master.connect(ac.destination);
    } catch (e) { ac = null; }
  };

  function tone(freq, dur, { type = 'square', vol = .3, slide = null, delay = 0 } = {}) {
    if (!ac) return;
    const t0 = ac.currentTime + delay;
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t0);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, slide), t0 + dur);
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    o.connect(g); g.connect(master);
    o.start(t0); o.stop(t0 + dur + .02);
  }

  let noiseBuf = null;
  function getNoise() {
    if (!noiseBuf) {
      noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    return noiseBuf;
  }
  function noise(dur, { vol = .3, freq = 1200, q = 1, delay = 0, sweep = null } = {}) {
    if (!ac) return;
    getNoise();
    const t0 = ac.currentTime + delay;
    const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
    s.buffer = noiseBuf;
    f.type = 'bandpass'; f.Q.value = q;
    f.frequency.setValueAtTime(freq, t0);
    if (sweep) f.frequency.exponentialRampToValueAtTime(sweep, t0 + dur);
    g.gain.setValueAtTime(vol, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    s.connect(f); f.connect(g); g.connect(master);
    s.start(t0); s.stop(t0 + dur + .02);
  }

  const SFX = {
    cursor: () => tone(880, .04, { vol: .12 }),
    ok: () => { tone(660, .05, { vol: .15 }); tone(990, .07, { vol: .15, delay: .05 }); },
    back: () => tone(440, .08, { vol: .15, slide: 220 }),
    dash: () => noise(.18, { vol: .25, freq: 600, sweep: 3000, q: .7 }),
    hit: () => { noise(.12, { vol: .5, freq: 900, q: .8 }); tone(160, .1, { vol: .3, slide: 60 }); },
    heavy: () => { noise(.3, { vol: .6, freq: 300, q: .6 }); tone(110, .3, { vol: .45, slide: 35, type: 'triangle' }); },
    slash: () => { noise(.14, { vol: .4, freq: 3500, sweep: 900, q: 1.2 }); },
    // folhagem mexendo: rajadas curtas de ruído agudo, irregulares
    rustle: () => { for (let i = 0; i < 5; i++) noise(.08 + Math.random() * .06, { vol: .18, freq: 2500 + Math.random() * 2500, q: .6, delay: i * .07 + Math.random() * .04 }); },
    // corda puxada/apertada
    rope: () => { noise(.22, { vol: .22, freq: 700, sweep: 1800, q: 1.5 }); tone(90, .12, { vol: .15, type: 'triangle' }); },
    miss: () => tone(1200, .08, { vol: .1, slide: 1800, type: 'triangle' }),
    heal: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, .12, { vol: .12, type: 'triangle', delay: i * .06 })),
    magic: () => [400, 600, 500, 800, 700, 1100].forEach((f, i) => tone(f, .09, { vol: .1, delay: i * .045 })),
    roar: () => { noise(.7, { vol: .5, freq: 250, sweep: 120, q: .5 }); tone(90, .6, { vol: .3, slide: 60, type: 'sawtooth' }); },
    laugh: () => [0, .14, .28, .42].forEach(d => tone(330 - d * 200, .1, { vol: .14, slide: 250, type: 'sawtooth', delay: d })),
    explode: () => { noise(.9, { vol: .7, freq: 400, sweep: 60, q: .4 }); tone(70, .8, { vol: .5, slide: 30, type: 'triangle' }); },
    dice: () => [0, .05, .1, .15, .2].forEach(d => noise(.03, { vol: .3, freq: 2500, q: 3, delay: d })),
    fire: () => { noise(1.2, { vol: .5, freq: 700, sweep: 2500, q: .4 }); tone(200, 1, { vol: .2, slide: 500, type: 'sawtooth' }); },
    transform: () => { tone(110, .6, { vol: .3, slide: 440, type: 'sawtooth' }); noise(.6, { vol: .3, freq: 300, sweep: 2000, q: .6 }); },
    charge: () => tone(200, .5, { vol: .15, slide: 900, type: 'triangle' }),
    whoosh: () => noise(.35, { vol: .35, freq: 2000, sweep: 400, q: .6 }),
    thud: () => tone(90, .2, { vol: .4, slide: 40, type: 'triangle' }),
    buzz: () => tone(70, .5, { vol: .25, type: 'sawtooth' }),
    engine: () => { tone(60, 1.2, { vol: .3, slide: 180, type: 'sawtooth' }); noise(1.2, { vol: .25, freq: 200, sweep: 900, q: .5 }); },
    shot: () => { noise(.12, { vol: .6, freq: 2500, sweep: 400, q: .7 }); tone(180, .08, { vol: .3, slide: 60 }); },
    rocket: () => { noise(.5, { vol: .4, freq: 800, sweep: 3000, q: .5 }); },
    snap: () => { noise(.06, { vol: .6, freq: 3000, q: 2 }); tone(300, .1, { vol: .2, slide: 120, type: 'triangle' }); },
    // uivo longo: sobe, sustenta com vibrato e cai, com sopro de fundo
    howl: () => {
      if (!ac) return;
      const t0 = ac.currentTime, o = ac.createOscillator(), g = ac.createGain(), lfo = ac.createOscillator(), lg = ac.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(280, t0); o.frequency.linearRampToValueAtTime(560, t0 + .7);
      o.frequency.setValueAtTime(560, t0 + 2.2); o.frequency.linearRampToValueAtTime(420, t0 + 3.2);
      lfo.frequency.value = 5.5; lg.gain.value = 9; lfo.connect(lg); lg.connect(o.frequency);
      g.gain.setValueAtTime(.001, t0); g.gain.linearRampToValueAtTime(.3, t0 + .4); g.gain.setValueAtTime(.3, t0 + 2.4); g.gain.linearRampToValueAtTime(.001, t0 + 3.3);
      o.connect(g); g.connect(master); o.start(t0); lfo.start(t0); o.stop(t0 + 3.4); lfo.stop(t0 + 3.4);
      noise(3.2, { vol: .08, freq: 900, q: .5 });
    },
    wind: () => noise(4, { vol: .12, freq: 500, sweep: 1400, q: .3 }),
    // rosnado grave de transformação: tremolo, estalos de osso
    growl: () => {
      if (!ac) return;
      const t0 = ac.currentTime, o = ac.createOscillator(), g = ac.createGain(), f = ac.createBiquadFilter(), lfo = ac.createOscillator(), lg = ac.createGain();
      o.type = 'sawtooth'; o.frequency.setValueAtTime(70, t0); o.frequency.linearRampToValueAtTime(95, t0 + .8); o.frequency.linearRampToValueAtTime(60, t0 + 1.3);
      f.type = 'lowpass'; f.frequency.value = 500;
      lfo.frequency.value = 22; lg.gain.value = .12; lfo.connect(lg); lg.connect(g.gain);
      g.gain.setValueAtTime(.001, t0); g.gain.linearRampToValueAtTime(.28, t0 + .15); g.gain.setValueAtTime(.28, t0 + 1); g.gain.linearRampToValueAtTime(.001, t0 + 1.4);
      o.connect(f); f.connect(g); g.connect(master); o.start(t0); lfo.start(t0); o.stop(t0 + 1.5); lfo.stop(t0 + 1.5);
      [.2, .55, .9].forEach(d => noise(.05, { vol: .35, freq: 2200, q: 3, delay: d }));
    },
    howlFury: () => {
      if (!ac) return;
      const t0 = ac.currentTime, o = ac.createOscillator(), o2 = ac.createOscillator(), g = ac.createGain(), lfo = ac.createOscillator(), lg = ac.createGain();
      o.type = 'sawtooth'; o2.type = 'sine';
      [o, o2].forEach((x, i) => { x.frequency.setValueAtTime(220 + i * 3, t0); x.frequency.linearRampToValueAtTime(520 + i * 5, t0 + .5); x.frequency.setValueAtTime(520, t0 + 1.6); x.frequency.linearRampToValueAtTime(300, t0 + 2.3); });
      lfo.frequency.value = 7; lg.gain.value = 14; lfo.connect(lg); lg.connect(o.frequency); lg.connect(o2.frequency);
      const f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 1800;
      g.gain.setValueAtTime(.001, t0); g.gain.linearRampToValueAtTime(.22, t0 + .2); g.gain.setValueAtTime(.22, t0 + 1.8); g.gain.linearRampToValueAtTime(.001, t0 + 2.4);
      o.connect(f); o2.connect(f); f.connect(g); g.connect(master); [o, o2, lfo].forEach(x => { x.start(t0); x.stop(t0 + 2.5); });
      noise(2.2, { vol: .12, freq: 700, q: .5 });
    },
    // vários uivos sobrepostos, em alturas diferentes (o coro da matilha)
    howlChorus: () => [0, .5, 1.1, 1.6].forEach((d, i) => setTimeout(() => SFX.howl(), d * 1000 + i)),
    crit: () => { tone(880, .06, { vol: .2 }); tone(1320, .12, { vol: .2, delay: .06 }); noise(.25, { vol: .6, freq: 1200, q: .6, delay: .05 }); },
    victory: () => [523, 523, 523, 523, 415, 466, 523, 466, 523].forEach((f, i) =>
      tone(f, i === 8 ? .6 : .13, { vol: .14, delay: [0, .13, .26, .39, .6, .8, 1, 1.2, 1.3][i] })),
    gameover: () => [392, 370, 349, 330].forEach((f, i) => tone(f, .4, { vol: .14, type: 'triangle', delay: i * .35 })),
  };

  G.sfx = (name) => { try { SFX[name] && SFX[name](); } catch (e) { /* áudio é opcional */ } };

  // ---------- Trilha: música eletrônica tensa com estrutura (seções A, B, ponte) ----------
  // Cada seção = 4 compassos de 16 passos, com progressão, baixo, pad, melodia e bateria próprios.
  // Nível 1: A B A C. Nível 2 (fomor): mais rápido, bumbo reto, arpejo contínuo e melodia dobrada.
  const NOTE = (n) => 440 * Math.pow(2, (n - 69) / 12);
  const _ = 0;
  const CH = { Am: [57, 60, 64], F: [53, 57, 60], C: [55, 60, 64], G: [55, 59, 62], Dm: [57, 62, 65], E: [56, 59, 64], Bb: [58, 62, 65] };
  const ROOT = { Am: 45, F: 41, C: 48, G: 43, Dm: 50, E: 40, Bb: 46 };
  // baixo: 0 = tônica, 12 = oitava, 7 = quinta, null = pausa
  const BASSPAT = {
    groove: [0, null, null, 12, null, 0, null, 0, 0, null, 12, null, 0, null, 7, null],
    drive: [0, 0, 12, 0, 0, 12, 0, 7, 0, 0, 12, 0, 0, 12, 7, 12],
    dread: [0, null, 0, null, 0, null, 0, null, 0, null, 0, null, 0, 0, 0, 0],
  };
  const SECTIONS = {
    A: { chords: ['Am', 'F', 'C', 'G'], bass: 'groove', kick: [0, 6, 10], lead: [
      [69, _, _, 72, _, _, 76, _, 74, _, 72, _, 69, _, _, _],
      [65, _, _, 69, _, _, 72, _, 71, _, 69, _, 65, _, _, _],
      [67, _, _, 72, _, _, 76, _, 79, _, 76, _, 72, _, _, _],
      [71, _, 74, _, 79, _, 78, _, 74, _, 71, _, 67, _, _, _]] },
    B: { chords: ['Dm', 'Am', 'E', 'E'], bass: 'drive', kick: [0, 4, 8, 12], lead: [
      [74, 74, _, 77, _, 74, _, 72, _, 69, _, 72, 74, _, _, _],
      [72, 72, _, 76, _, 72, _, 69, _, 67, _, 69, 72, _, _, _],
      [71, _, 68, _, 71, _, 76, _, 75, _, 76, _, 80, _, _, _],
      [76, _, _, _, 75, _, _, _, 71, _, 68, _, 64, _, _, _]] },
    C: { chords: ['Am', 'Bb', 'Am', 'Bb'], bass: 'dread', kick: [0, 8], lead: null },
  };
  const ORDER = { 1: ['A', 'B', 'A', 'C'], 2: ['A', 'B', 'C', 'B'] };
  const music = { on: false, level: 1, step: 0, next: 0, gain: null, timer: null, ducked: false };

  function mTone(freq, t, dur, { type = 'sawtooth', vol = .1, cutoff = 900, dest }) {
    const o = ac.createOscillator(), g = ac.createGain(), f = ac.createBiquadFilter();
    o.type = type; o.frequency.value = freq;
    f.type = 'lowpass'; f.frequency.value = cutoff;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + dur);
    o.connect(f); f.connect(g); g.connect(dest);
    o.start(t); o.stop(t + dur + .02);
  }
  function mNoise(t, dur, vol, freq, dest) {
    getNoise();
    const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
    s.buffer = noiseBuf; f.type = 'highpass'; f.frequency.value = freq;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + dur);
    s.connect(f); f.connect(g); g.connect(dest);
    s.start(t, Math.random() * .5); s.stop(t + dur + .02);
  }
  function kick(t, dest) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(40, t + .15);
    g.gain.setValueAtTime(.5, t); g.gain.exponentialRampToValueAtTime(.001, t + .2);
    o.connect(g); g.connect(dest); o.start(t); o.stop(t + .22);
  }

  function schedule() {
    const L2 = music.level === 2;
    const bpm = L2 ? 136 : 112;
    const stepDur = 60 / bpm / 4;
    while (music.next < ac.currentTime + .15) {
      const t = music.next, d = music.gain;
      const st = music.step % 16, barAbs = Math.floor(music.step / 16);
      const order = ORDER[L2 ? 2 : 1];
      const sec = SECTIONS[order[Math.floor(barAbs / 4) % order.length]];
      const bar = barAbs % 4, chord = sec.chords[bar], root = ROOT[chord];
      const lastBar = bar === 3;
      // baixo
      const bo = BASSPAT[sec.bass][st];
      if (bo !== null) mTone(NOTE(root + bo - 12), t, stepDur * 1.6, { vol: .15, cutoff: L2 ? 1500 : 800, dest: d });
      // pad (acorde sustentado; reataca na metade do compasso)
      if (st === 0 || st === 8) CH[chord].forEach(n => mTone(NOTE(n - 12), t, stepDur * 8, { type: 'triangle', vol: .03, cutoff: 1800, dest: d }));
      // melodia (motivo da seção); no nível 2, dobrada uma oitava acima
      if (sec.lead) {
        const n = sec.lead[bar][st];
        if (n) {
          mTone(NOTE(n), t, stepDur * 2.2, { type: 'square', vol: .045, cutoff: 2600, dest: d });
          if (L2) mTone(NOTE(n + 12), t, stepDur * 1.5, { type: 'square', vol: .018, cutoff: 4000, dest: d });
        }
      } else {
        // ponte: arpejo sombrio no lugar da melodia
        const arp = CH[chord][st % 3] + (st >= 8 ? 12 : 0);
        mTone(NOTE(arp), t, stepDur * .9, { type: 'square', vol: .03, cutoff: 2200, dest: d });
      }
      // contracanto na segunda passada da seção A
      if (sec === SECTIONS.A && Math.floor(barAbs / 4) % order.length === 2 && st % 4 === 2) mTone(NOTE(CH[chord][2] + 12), t, stepDur * 1.2, { type: 'triangle', vol: .03, cutoff: 3000, dest: d });
      // arpejo contínuo no nível 2
      if (L2) mTone(NOTE(CH[chord][st % 3] + 12 + (st % 6 >= 3 ? 12 : 0)), t, stepDur * .7, { type: 'square', vol: .02, cutoff: 3500, dest: d });
      // bateria
      if ((L2 ? [0, 4, 8, 12] : sec.kick).includes(st)) kick(t, d);
      if (st % 2 === 0 || L2) mNoise(t, .03, st % 4 === 2 ? .06 : .03, 7000, d);
      if (st === 4 || st === 12) mNoise(t, .12, L2 ? .13 : .08, 1500, d);
      // virada no fim de cada seção
      if (lastBar && st >= 12) mNoise(t, .08, .07 + (st - 12) * .02, 1200 + (st - 12) * 400, d);
      music.next += stepDur;
      music.step++;
    }
  }

  // Trilha procedural (reserva, caso os arquivos não carreguem)
  const synth = {
    start(level) {
      if (!ac || music.on) { music.level = level; return; }
      music.gain = ac.createGain();
      music.gain.gain.value = .9;
      music.gain.connect(master);
      music.on = true; music.level = level; music.step = 0; music.next = ac.currentTime + .05;
      music.timer = setInterval(schedule, 40);
    },
    duck(on) {
      if (!music.on || music.ducked === on) return;
      music.ducked = on;
      music.gain.gain.setTargetAtTime(on ? .3 : .9, ac.currentTime, .15);
    },
    stop() {
      if (!music.on) return;
      clearInterval(music.timer); music.on = false;
      music.gain.gain.setTargetAtTime(0, ac.currentTime, .3);
    },
  };

  // ---------- Trilha gravada (tema do chefe) ----------
  // Nível 1: início do combate. Nível 2: quando a ação acelera (Schneider vira fomor). Crossfade entre as duas.
  const TRACKS = { 1: 'assets/musica/tema_boss_vapor_pesado_longo_loop.ogg', 2: 'assets/musica/tema_boss_vapor_pesado_longo_105bpm_loop.ogg' };
  const VOL = .55, DUCK = .2;
  const rec = { players: {}, level: 0, on: false, ducked: false, failed: false, fades: {} };
  const player = (lvl) => {
    if (!rec.players[lvl]) {
      const a = new Audio(TRACKS[lvl]);
      a.loop = true; a.preload = 'auto'; a.volume = 0;
      a.addEventListener('error', () => { rec.failed = true; });
      rec.players[lvl] = a;
    }
    return rec.players[lvl];
  };
  const target = () => (rec.ducked ? DUCK : VOL);
  // desliza o volume de um player até v em ms
  const fade = (lvl, v, ms, then) => {
    const a = rec.players[lvl]; if (!a) return;
    clearInterval(rec.fades[lvl]);
    const from = a.volume, t0 = performance.now();
    rec.fades[lvl] = setInterval(() => {
      const k = Math.min(1, (performance.now() - t0) / ms);
      a.volume = Math.max(0, Math.min(1, from + (v - from) * k));
      if (k >= 1) { clearInterval(rec.fades[lvl]); if (then) then(); }
    }, 40);
  };
  const play = (lvl) => {
    const a = player(lvl);
    const p = a.play();
    if (p && p.catch) p.catch(() => { rec.failed = true; synth.start(lvl); });
    fade(lvl, target(), 1500);
  };

  G.music = {
    start(level = 1) {
      if (G.params && G.params.has('nomusic')) return;
      if (rec.failed) { synth.start(level); return; }
      if (rec.on && rec.level === level) return;
      rec.on = true;
      if (rec.level && rec.level !== level) G.music.setLevel(level);
      else { rec.level = level; play(level); }
    },
    setLevel(level) {
      music.level = level;
      if (rec.failed || !rec.on) return synth.start(level);
      if (rec.level === level) return;
      const old = rec.level;
      rec.level = level;
      fade(old, 0, 2000, () => rec.players[old].pause());
      player(level).currentTime = 0;
      play(level);
    },
    duck(on) {
      synth.duck(on);
      if (!rec.on || rec.ducked === on) return;
      rec.ducked = on;
      fade(rec.level, target(), 300);
    },
    // Abertura: trilha própria (versão vapor, mais atmosférica), entra suave e some no branco da lua.
    intro(on) {
      if (G.params && G.params.has('nomusic')) return;
      if (!rec.intro) { rec.intro = new Audio('assets/musica/tema_abertura_soturna_loop.ogg'); rec.intro.loop = true; rec.intro.volume = 0; }
      const a = rec.intro;
      clearInterval(rec.introFade);
      if (on) { a.currentTime = 0; const p = a.play(); if (p && p.catch) p.catch(() => {}); }
      const from = a.volume, to = on ? .6 : 0, ms = on ? 2500 : 1800, t0 = performance.now();
      rec.introFade = setInterval(() => {
        const k = Math.min(1, (performance.now() - t0) / ms);
        a.volume = from + (to - from) * k;
        if (k >= 1) { clearInterval(rec.introFade); if (!on) a.pause(); }
      }, 40);
    },
    stop() {
      synth.stop();
      if (!rec.on) return;
      rec.on = false;
      const lvl = rec.level;
      fade(lvl, 0, 1500, () => { rec.players[lvl].pause(); rec.players[lvl].currentTime = 0; });
      rec.level = 0;
    },
  };
})();
