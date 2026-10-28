// Dados: personagens, formas, ataques, inimigos e dons. Números de balanceamento ficam todos aqui.
// fx do ataque: bite | claw | peck | blade | stab (define a animação do golpe)
// Recursos: GNOSE paga os Dons, FÚRIA paga os ataques fortes (cost). Os dois recuperam +1 por turno.
// Toda forma tem pelo menos um ataque de custo 0, pra ninguém ficar sem ação.
G.DATA = {
  party: [
    { id: 'espelho', natural: 'espelho_humano', name: 'ESPELHO', sprite: 'espelho', hp: 170, atk: 15, def: 7, agi: 16, eva: 35, minEva: 35,
      garou: false, warForm: 'espelho_guerra', skills: ['penas_navalha'],
      attacks: [{ name: 'Garradas', mult: .55, hits: 2, fx: 'claw', cost: 0 }, { name: 'Bicar', mult: 1.9, fx: 'peck', cost: 2 }] },
    { id: 'sangria', natural: 'sangria', name: 'SANGRIA', sprite: 'sangria', hp: 300, atk: 26, def: 10, agi: 14, eva: 12,
      garou: true, warForm: 'sangria_crinos', skills: ['presas_ahroun'],
      attacks: [{ name: 'Garrada', mult: .6, hits: 2, fx: 'claw', cost: 0 }, { name: 'Mordida', mult: 2, fx: 'bite', acc: -10, cost: 2 }] },
    { id: 'jan', natural: 'jan', name: 'JAN', sprite: 'jan', hp: 280, atk: 20, def: 9, agi: 11, eva: 8,
      garou: true, human: true, warForm: 'jan_crinos', skills: ['golpe_klaive'],
      attacks: [{ name: 'Klaive', mult: 1.1, fx: 'blade', cost: 0 }] },
    { id: 'tinga', natural: 'tinga', name: 'TINGA', sprite: 'tinga', hp: 320, atk: 22, def: 10, agi: 9, eva: 6,
      garou: false, human: true, warForm: 'archid', skills: ['giro_morte'],
      attacks: [{ name: 'Facada', mult: 1, fx: 'stab', cost: 0 }] },
    { id: 'valeria', natural: 'valeria', name: 'VALÉRIA', sprite: 'valeria', hp: 220, atk: 17, def: 7, agi: 13, eva: 15,
      garou: true, human: true, warForm: 'valeria_crinos', skills: ['cancao_furia'],
      attacks: [{ name: 'Adaga', mult: 1, fx: 'stab', cost: 0 }] },
  ],

  // Formas de guerra: Mudança de forma (3 Fúria, só depois de ser atingido) ou ao voltar da morte.
  // Bônus de cada forma (bonus): Corvo +20% HP +10% força +10% agilidade; Mokolé +40% HP +30% força;
  // Garou +25% HP +20% força +10% agilidade.
  forms: {
    espelho_guerra: { name: 'Pássaro de Guerra', sprite: 'espelho_guerra', bonus: { hp: .2, atk: .1, agi: .1 },
      attacks: [{ name: 'Garradas', mult: .55, hits: 2, fx: 'claw', cost: 0 }, { name: 'Bicar', mult: 1.9, fx: 'peck', cost: 2 }] },
    sangria_crinos: { name: 'Crinos', sprite: 'sangria_crinos', bonus: { hp: .25, atk: .2, agi: .1 },
      attacks: [{ name: 'Garrada', mult: .6, hits: 2, fx: 'claw', cost: 0 }, { name: 'Mordida', mult: 2, fx: 'bite', acc: -10, cost: 2 }] },
    jan_crinos: { name: 'Crinos', sprite: 'jan_crinos', bonus: { hp: .25, atk: .2, agi: .1 },
      attacks: [{ name: 'Klaive', mult: 1.1, fx: 'blade', cost: 0 }, { name: 'Mordida', mult: 2, fx: 'bite', acc: -10, cost: 2 }] },
    archid: { name: 'Archid', sprite: 'tinga_archid', bonus: { hp: .4, atk: .3 },
      attacks: [{ name: 'Garrada', mult: .6, hits: 2, fx: 'claw', cost: 0 }, { name: 'Mordida', mult: 2, fx: 'bite', acc: -10, cost: 2 }] },
    valeria_crinos: { name: 'Crinos', sprite: 'valeria_crinos', bonus: { hp: .25, atk: .2, agi: .1 },
      attacks: [{ name: 'Garrada', mult: .6, hits: 2, fx: 'claw', cost: 0 }, { name: 'Mordida', mult: 2, fx: 'bite', acc: -10, cost: 2 }] },
  },

  enemies: {
    schneider: { name: 'SCHNEIDER', sprite: 'schneider', hp: 480, atk: 28, def: 14, agi: 15, eva: 20,
      attacks: [{ name: 'Soco', mult: 1 }, { name: 'Esmagar', mult: 1.3, heavy: true }] },
    ciborgue: { name: 'CIBORGUE', sprite: 'ciborgue', hp: 560, atk: 34, def: 18, agi: 6, eva: 20,
      attacks: [{ name: 'Canhões de Plasma', mult: 1.1, heavy: true, fx: 'plasma', ranged: true }, { name: 'Rajada', mult: .9, fx: 'plasma', ranged: true }] },
    agente: { name: 'AGENTE', sprite: 'agente', hp: 170, atk: 20, def: 4, agi: 22, eva: 35, silver: true, actions: 2,
      attacks: [{ name: 'Faca de Prata', mult: 1, fx: 'stab' }, { name: 'Tiro de Prata', mult: .9, fx: 'shot', ranged: true }] },
    fomor: { name: 'FOMOR', sprite: 'fomor', hp: 950, atk: 36, def: 10, agi: 12, eva: 8,
      attacks: [{ name: 'Garra Palmada', mult: 1.1, heavy: true }, { name: 'Vômito Ácido', mult: .55, area: true },
        { name: 'Língua', mult: 1 }] },
    drone: { name: 'DRONE', sprite: 'drone', hp: 90, atk: 22, def: 6, agi: 18, eva: 25, flying: true,
      attacks: [{ name: 'Foguete', mult: 1, fx: 'rocket', ranged: true }] },
  },
  // Ciborgue depois de soltar os braços
  ciborgueSemBracos: { sprite: 'ciborgue_sb', atk: 24,
    attacks: [{ name: 'Cabeçada', mult: 1.15, heavy: true }] }, // sem braços: só cabeçada

  // cost: gasto de GNOSE. target: 'enemy' | 'self' | 'party'
  skills: {
    penas_navalha: { name: 'Penas Navalha', cost: 2, target: 'enemy', desc: 'Penas viram lâminas: 3 golpes rápidos.' },
    presas_ahroun: { name: 'Presas do Ahroun', cost: 2, target: 'enemy', desc: 'Mordida devastadora (×2,2).' },
    golpe_klaive: { name: 'Golpe de Klaive', cost: 2, target: 'enemy', desc: 'Prata na Wyrm (×2, ×2,6 no fomor).' },
    giro_morte: { name: 'Giro da Morte', cost: 2, target: 'enemy', desc: 'Só na Archid. ×2,4 e pode atordoar.', needsForm: 'archid' },
    cancao_furia: { name: 'Canção de Fúria', cost: 2, target: 'party', desc: 'Galliard: party +30% de ataque por 3 rodadas.' },
  },

  glock: { name: 'Glock', ammo: 8, perTurn: 2, dmg: 26 },

  uktena: {
    cooldown: 2,
    chamas: { name: 'Chamas Púrpuras', pct: .18, burn: 3, burnPct: .04, desc: 'O Uktena queima um inimigo por dentro.' },
    curar: { name: 'Cura do Uktena', pct: .35, desc: 'O Uktena cura toda a matilha.' },
  },

  crit: { chance: .45, mult: 2 }, // 25% + 20 pontos,

  resources: { max: 5, gnoseStart: 3, furiaStart: 3, perTurn: 1, transformCost: 3, transformNeed: 5, warHp: 1.35, warAtk: 1.2, domCooldown: 2 },

  // Fetiches: ação especial de quem tem o objeto. Custo em Gnose.
  fetish: {
    valeria: { name: 'Estacas de Sombra', cost: 4, desc: 'Estacas de sombra brotam do chão sob todos os inimigos: dano dobrado e podem prendê-los.' },
    espelho: { name: 'Reflexo do Corvo', cost: 4, desc: 'Copia o Dom de um aliado e usa com dano dobrado.' },
    jan: { name: 'Klaive de Gelo', cost: 4, desc: 'O klaive de prata se cobre de gelo: golpe com dano dobrado que pode congelar o alvo.' },
  },
};
