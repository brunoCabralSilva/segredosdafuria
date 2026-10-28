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

  const characterSheet = new Image();
  characterSheet.src = '/gaming/assets/personagens.png';
  G.loadCharacterSheet = () => new Promise(resolve => {
    if (characterSheet.complete) { resolve(); return; }
    characterSheet.onload = resolve;
    characterSheet.onerror = resolve;
  });
  const animationSheet = new Image();
  animationSheet.src = '/gaming/assets/character-animations.png';
  G.loadAnimationSheet = () => new Promise(resolve => {
    if (animationSheet.complete) { resolve(); return; }
    animationSheet.onload = resolve;
    animationSheet.onerror = resolve;
  });
  const combatSheet = new Image();
  combatSheet.src = '/gaming/assets/combat-trio.png';
  G.loadCombatSheet = () => new Promise(resolve => {
    if (combatSheet.complete) { resolve(); return; }
    combatSheet.onload = resolve;
    combatSheet.onerror = resolve;
  });
  const selectionFiles = [
    { name: 'Agnes', path: '/gaming/assets/characters/Agnes.png', frames: [{ xStart: 0, xEnd: 400 }, { xStart: 450, xEnd: 800 }, { xStart: 900, xEnd: 1220 }, { xStart: 1250, xEnd: 1800 }, { xStart: 1800, xEnd: 2200 }, { xStart: 2250, xEnd: 2610 }, { xStart: 2700, xEnd: 3000 }, { xStart: 3100, xEnd: 3500 }] },
    { name: 'Aruana', path: '/gaming/assets/characters/Aruana.png', frames: [{ xStart: 0, xEnd: 400 }, { xStart: 450, xEnd: 800 }, { xStart: 900, xEnd: 1220 }, { xStart: 1250, xEnd: 1800 }, { xStart: 1800, xEnd: 2200 }, { xStart: 2250, xEnd: 2610 }, { xStart: 2700, xEnd: 3000 }, { xStart: 3100, xEnd: 3500 }] },
    { name: 'Caio Nogueira', path: '/gaming/assets/characters/Caio Nogueira.png', frames: [{ xStart: 0, xEnd: 400 }, { xStart: 450, xEnd: 800 }, { xStart: 900, xEnd: 1220 }, { xStart: 1250, xEnd: 1800 }, { xStart: 1800, xEnd: 2200 }, { xStart: 2250, xEnd: 2610 }, { xStart: 2700, xEnd: 3000 }, { xStart: 3100, xEnd: 3500 }] },
    { name: 'Luena', path: '/gaming/assets/characters/Luena.png', frames: [{ xStart: 30, xEnd: 280 }, { xStart: 280, xEnd: 550 }, { xStart: 550, xEnd: 790 }, { xStart: 790, xEnd: 1050 }, { xStart: 1050, xEnd: 1350 }, { xStart: 1360, xEnd: 1650 }, { xStart: 1660, xEnd: 1920 }, { xStart: 1920, xEnd: 2150 }] },
    { name: 'Roberto', path: '/gaming/assets/characters/Roberto.png', frames: [{ xStart: 50, xEnd: 400 }, { xStart: 450, xEnd: 800 }, { xStart: 920, xEnd: 1100 }, { xStart: 1280, xEnd: 1500 }, { xStart: 1600, xEnd: 1900 }, { xStart: 2100, xEnd: 2300 }, { xStart: 2500, xEnd: 2700 }, { xStart: 2900, xEnd: 3200 }] },
  ];
  const selectionRoleOverrides = {
    Agnes: { tribe: 'Fúria Negra', tribeDataName: 'Fúria Negra', auspice: 'Philodox', tribeSummary: 'As Fúrias Negras enfrentam opressores e quebram barreiras que mantêm pessoas em desvantagem.', auspiceSummary: 'O Philodox reúne fatos, interpreta a lei e busca decisões justas para conflitos difíceis.' },
    Aruana: { tribe: 'Presa de Prata', tribeDataName: 'Presa de Prata', auspice: 'Galliard', tribeSummary: 'As Presas de Prata lideram, unem a alcateia e inspiram feitos quando tudo parece perdido.', auspiceSummary: 'O Galliard guarda histórias, inspira a alcateia e transforma memória em coragem.' },
    'Caio Nogueira': { tribe: 'Espreitador do Vento', auspice: 'Ahroun', tribeSummary: 'Os Espreitadores do Vento observam, perseguem e atacam com mobilidade e precisão.', auspiceSummary: 'O Ahroun protege a alcateia e enfrenta ameaças com força, disciplina e fúria.' },
    Luena: { tribe: 'Conselho dos Fantasmas', tribeDataName: 'Conselho dos Fantasmas', auspice: 'Theurge', tribeSummary: 'O Conselho dos Fantasmas investiga mistérios, jornadas e caminhos que outras tribos evitam.', auspiceSummary: 'O Theurge interpreta espíritos, sinais e forças invisíveis que influenciam o mundo.' },
  };
  const characterStoryOverrides = {
    Agnes: { tribe: 'Fúria Negra', tribeDataName: 'Fúrias Negras', auspice: 'Philodox', story: 'Advogada criminalista e defensora de causas sociais, Agnes construiu sua reputação defendendo aqueles que a justiça preferia condenar, até descobrir que, às vezes, a lei protege os verdadeiros monstros e que sua fúria pode fazer aquilo que os tribunais jamais fizeram.', tribeSummary: 'Revolucionários que enfrentam a opressão, defendem os marginalizados e transformam sua fúria em justiça, lutando para destruir estruturas de poder e libertar aqueles que foram silenciados.', auspiceSummary: 'O juiz e inquisidor que interpreta a Litania, resolve conflitos e busca o equilíbrio entre justiça e tradição.' },
    Aruana: { tribe: 'Garras Vermelhas', auspice: 'Galliard', story: 'Um guardião das terras selvagens paraibanas que transforma a memória da destruição de Gaia em histórias capazes de despertar a fúria daqueles que ainda podem defendê-la.', tribeSummary: 'Os defensores ferozes da natureza selvagem que combatem a devastação humana e o domínio da Weaver, usando sua fúria primordial para destruir as ameaças a Gaia e restaurar o equilíbrio da Terra.', auspiceSummary: 'O contador de histórias que preserva as lendas, inspira com paixão os que o escutam e mantém viva a memória do povo Garou.' },
    'Caio Nogueira': { tribe: 'Espreitador do Vento', auspice: 'Ragabash', story: 'Um ex soldado que se infiltra nos lugares mais perigosos, seguindo rastros que ninguém mais consegue encontrar para desmascarar seus inimigos.', tribeSummary: 'Os caçadores incansáveis que rastreiam e perseguem a corrupção da Wyrm, enfrentando os perigos mais extremos com perseverança, astúcia e determinação inabalável.', auspiceSummary: 'Desafia tradições, questiona certezas e revela verdades por meio da astúcia e da irreverência, além de ser um ótimo infiltrador.' },
    Luena: { tribe: 'Conselho dos Fantasmas', tribeDataName: 'Conselho dos Fantasmas', auspice: 'Theurge', story: 'Fascinada pelos mistérios da Pedra do Ingá, Luena desafia os limites do mundo espiritual, indo além do esperado para alcançar segredos proibidos que podem salvar ou condenar sua alcateia.', tribeSummary: 'Os sábios que desvendam os mistérios do mundo natural e espiritual, explorando conhecimentos proibidos e segredos esquecidos para compreender o inimigo e enfrentar o Apocalipse.', auspiceSummary: 'O místico que compreende os espíritos, preserva os pactos ancestrais e conecta os Garous ao mundo espiritual.' },
    Roberto: { tribe: 'Presas de Prata', tribeDataName: 'Presas de Prata', auspice: 'Ahroun', story: 'Um guerreiro honrado que carrega o peso da liderança sobre os ombros, disposto a sacrificar a própria vida para proteger seus companheiros e manter viva a esperança dos Garou.', tribeSummary: 'Os líderes que carregam o fardo de unir, inspirar e proteger a sociedade Garou, guiando seu povo com honra, coragem e sacrifício diante do Apocalipse.', auspiceSummary: 'O guerreiro que enfrenta os inimigos de Gaia com coragem, ferocidade e força implacável.' },
  };
  const characterNarratives = {
    Agnes: `Agnes passou a manhã inteira tentando impedir a condenação de um rapaz acusado de um crime que não cometeu. Tinha provas, testemunhas e até uma gravação que poderia inocentá-lo. Nada disso importou. A juíza indeferiu seus pedidos, o promotor distorceu os depoimentos e, ao final da audiência, seu cliente foi condenado a quinze anos de prisão. Ela passou o restante da tarde preparando um recurso, telefonando para colegas e procurando alguma maneira de reverter a sentença. Quando finalmente deixou o escritório, já passava das dez da noite. Estava com fome, os pés doíam e sua cabeça parecia prestes a explodir. Sabia que ainda havia muito a fazer, mas nada daquilo poderia ser resolvido naquela noite. Pela primeira vez em anos, Agnes não tinha vontade de lutar contra mais nada. Queria apenas chegar em casa, tomar um banho e dormir, retomar as forças e acordar mais um dia para voltar para a Guerra.`,
    Aruana: `Aruana passou a manhã tentando impedir o avanço de máquinas sobre uma área de mata nativa. Havia semanas que acompanhava a situação, denunciando irregularidades, reunindo moradores e pressionando as autoridades para suspender o desmatamento. Naquele dia, entretanto, recebeu a notícia de que a autorização havia sido concedida e que as obras poderiam continuar. Quando chegou ao local, parte da vegetação já havia sido derrubada, e os trabalhadores não demonstravam qualquer intenção de interromper o serviço. Passou a tarde discutindo com engenheiros, procurando responsáveis e tentando salvar ao menos as árvores que ainda permaneciam de pé. Não conseguiu. Ao anoitecer, deixou o lugar coberto de barro, com a garganta dolorida de tanto gritar e uma sensação amarga de impotência. Sabia que poderia voltar no dia seguinte, reunir mais pessoas e encontrar outra maneira de resistir, mas naquele momento estava cansado demais para pensar em qualquer coisa. Tudo o que queria era chegar em casa, lavar a terra das roupas e dormir, mesmo sabendo que, quando acordasse, as máquinas provavelmente já estariam trabalhando outra vez.`,
    'Caio Nogueira': `Caio passou a manhã seguindo o rastro de um homem suspeito de transportar artefatos contaminados pela Wyrm. Havia dias que investigava suas movimentações, infiltrando-se em depósitos, enganando seguranças e reunindo informações sobre uma possível operação clandestina. Naquela tarde, finalmente conseguiu localizar o galpão onde a mercadoria seria entregue, mas, depois de horas observando o movimento, percebeu que havia seguido uma pista falsa. O carregamento já havia sido transferido para outro lugar, e os responsáveis pareciam saber que estavam sendo vigiados. Passou o restante do dia tentando recuperar o rastro, telefonando para contatos, investigando endereços e procurando alguma brecha que pudesse explorar. Não encontrou nada. Ao anoitecer, estava exausto, irritado e com a sensação de ter sido feito de idiota. Sabia que poderia recomeçar a investigação no dia seguinte, mas a ideia de passar mais uma noite perseguindo pistas que não levavam a lugar nenhum era insuportável. Tudo o que queria era chegar em casa, comer alguma coisa e dormir, afinal, um caçador fraco pode facilmente virar caça.`,
    Luena: `Luena passou a madrugada tentando estabelecer contato com um espírito que havia deixado de responder às suas invocações. Durante semanas, a entidade lhe oferecera informações valiosas sobre movimentações estranhas na Umbra, mas agora permanecia em silêncio. Ela dedicou a manhã à preparação de oferendas, à consulta de antigos registros e à repetição de rituais que antes funcionavam perfeitamente. Quando finalmente conseguiu alcançá-lo, descobriu que o espírito estava enfraquecido e que alguma coisa havia perturbado seu território. Tentou compreender o que estava acontecendo, mas a entidade se recusou a explicar, limitando-se a pedir que não voltasse a procurá-la. Luena passou o restante da tarde investigando possíveis causas, procurando outros espíritos e tentando encontrar uma maneira de ajudá-lo sem desrespeitar seu pedido. Não conseguiu descobrir nada. Ao anoitecer, estava com os olhos ardendo de sono, cercada de livros abertos e anotações que já não conseguia compreender.`,
    Roberto: `Roberto passou a manhã procurando emprego. Havia enviado currículos durante semanas, mas aquela era a primeira entrevista para a qual fora chamado. Precisava do dinheiro para pagar algumas contas atrasadas e estava confiante de que conseguiria a vaga. A entrevista, entretanto, durou menos de quinze minutos. O recrutador fez algumas perguntas, agradeceu sua presença e prometeu entrar em contato. Duas horas depois, recebeu um e-mail informando que não havia sido selecionado. Frustrado, passou a tarde procurando outras oportunidades, até receber uma ligação do proprietário do apartamento cobrando o aluguel atrasado. Roberto tentou negociar mais alguns dias, mas ouviu que já havia recebido tempo suficiente. Para piorar, quando finalmente decidiu voltar para casa, sua motocicleta não pegou. Passou quase uma hora tentando fazê-la funcionar antes de desistir e chamar um guincho, gastando parte do pouco dinheiro que ainda tinha. Chegou em casa depois das dez da noite, com fome, irritado e sem qualquer disposição para pensar em soluções. Sabia que precisava encontrar um emprego, pagar suas dívidas e resolver o problema da motocicleta, mas nada daquilo seria resolvido naquele momento. Tudo o que queria era tomar um banho, deitar na cama e dormir, na esperança de que o dia seguinte fosse um pouco menos miserável.`,
  };
  const selectionSheets = selectionFiles.map(file => {
    const image = new Image();
    image.src = file.path;
    return image;
  });
  const profileImages = selectionFiles.map(file => {
    const image = new Image();
    image.src = `/gaming/assets/characters/${file.name}-perfil.png`;
    return image;
  });
  const characterPhrases = {
    Agnes: 'A lei pode absolver os culpados, mas não espere que eu faça o mesmo. Lembre-se disso!',
    Aruana: 'A Terra se lembra de cada ferida, e eu farei questão de lembrar quem as causou e apontá-los para a degola.',
    'Caio Nogueira': 'Pode correr, pode se esconder, pode até rezar. Mas eu já sei onde você está e para onde irá.',
    Luena: 'A pedra guarda vozes antigas. Eu preciso aprender como escutá-las.',
    Roberto: 'Não preciso que me sigam até a vitória. Preciso que saibam que serei o último a cair.',
  };
  G.loadSelectionSheets = () => Promise.all([...selectionSheets, ...profileImages, dreamMonolith, dreamSpiritImage].map(image => new Promise(resolve => {
    if (image.complete) { resolve(); return; }
    image.onload = resolve;
    image.onerror = resolve;
  })));
  G.playCharacterIntro = async player => {
    G.scene = 'characterIntro';
    await G.say(player.name, characterPhrases[player.name] || 'A noite chamou. Eu estou pronto para responder.', {
      portrait: profileImages[selectionFiles.findIndex(file => file.name === player.name)],
      color: '#ffffff',
    });
  };
  G.drawCharacterIntroBackdrop = ctx => {
    drawTitleBackdrop(ctx);
    ctx.fillStyle = 'rgba(0, 0, 0, .58)';
    ctx.fillRect(0, 0, G.W, G.H);
  };
  G.drawDreamPromptBackdrop = ctx => {
    if (!pedraInga.naturalWidth) { drawBackdrop(ctx); return; }
    const scale = Math.max(G.W / pedraInga.naturalWidth, G.H / pedraInga.naturalHeight) * 1.12;
    const w = pedraInga.naturalWidth * scale, h = pedraInga.naturalHeight * scale;
    const pan = Math.sin(G.real / 4200) * Math.max(0, w - G.W) / 2;
    ctx.drawImage(pedraInga, Math.round((G.W - w) / 2 + pan), Math.round((G.H - h) / 2), w, h);
    ctx.fillStyle = 'rgba(0, 0, 0, .28)';
    ctx.fillRect(0, 0, G.W, G.H);
  };
  G.playDreamPrompt = async () => {
    G.scene = 'dreamPrompt';
    G.fx.fade.color = '#ffffff';
    G.fx.fade.alpha = 0;
    await G.fadeTo(1, 260);
    await G.wait(220);
    await G.fadeTo(0, 700);
    const player = G.playerCharacter;
    const narrative = characterNarratives[player.name] || '';
    await G.say(null, `Foi um dia difícil. ${narrative} De toda forma, esse dia acabou e você foi dormir.`, { box: 'bottom', linesPerPage: 4 });
    return G.menu({
      items: [
        { label: 'Sonhei com alguma coisa perturbadora' },
        { label: 'Tive uma boa noite de sono, digna do meu cansaço' },
      ],
      x: 8, y: 128, w: 368, rowH: 16, title: 'VOCÊ SONHOU?', canBack: false,
    });
  };
  const nightmare = { phase: 'stone', spiritX: 330, spiritY: 158, playerX: 92, flash: 0 };
  const drawNightmareBackdrop = ctx => {
    if (dreamMonolith.naturalWidth) {
      const scale = Math.max(G.W / dreamMonolith.naturalWidth, G.H / dreamMonolith.naturalHeight) * 1.18;
      const w = dreamMonolith.naturalWidth * scale, h = dreamMonolith.naturalHeight * scale;
      ctx.drawImage(dreamMonolith, Math.round((G.W - w) / 2), Math.round((G.H - h) / 2), w, h);
    } else drawBackdrop(ctx);
    ctx.fillStyle = 'rgba(20, 5, 38, .46)';
    ctx.fillRect(0, 0, G.W, G.H);
    ctx.strokeStyle = 'rgba(210, 160, 255, .7)';
    ctx.lineWidth = 2;
    const cracks = [
      [[240, 32], [226, 66], [244, 92], [226, 126], [242, 164]],
      [[226, 66], [202, 58], [186, 76]],
      [[244, 92], [272, 82], [291, 98]],
      [[226, 126], [197, 139], [180, 130]],
    ];
    cracks.forEach(points => {
      ctx.beginPath();
      points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
      ctx.stroke();
    });
    const glow = ctx.createRadialGradient(235, 104, 4, 235, 104, 130);
    glow.addColorStop(0, 'rgba(180, 80, 255, .28)');
    glow.addColorStop(1, 'rgba(20, 0, 45, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(90, 0, 290, 216);
  };
  const drawNightmarePlayer = (ctx, player) => {
    const index = selectionFiles.findIndex(file => file.name === player.name);
    const file = selectionFiles[index] || selectionFiles[0];
    const sheet = selectionSheets[index] || selectionSheets[0];
    const bounds = file.frames[Math.floor(G.real / 300) % 2] || file.frames[0];
    if (!sheet || !sheet.naturalWidth || !bounds) return;
    const sw = bounds.xEnd - bounds.xStart;
    const scale = Math.min(78 / sw, 132 / sheet.naturalHeight);
    const w = Math.round(sw * scale), h = Math.round(sheet.naturalHeight * scale);
    const groundY = 194;
    ctx.fillStyle = 'rgba(0, 0, 0, .5)';
    ctx.beginPath();
    ctx.ellipse(nightmare.playerX, groundY - 2, Math.max(10, w * .28), 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.drawImage(sheet, bounds.xStart, 0, sw, sheet.naturalHeight, nightmare.playerX - w / 2, groundY - h, w, h);
  };
  G.drawNightmare = ctx => {
    drawNightmareBackdrop(ctx);
    drawNightmarePlayer(ctx, G.playerCharacter);
    if ((nightmare.phase === 'spirit' || nightmare.phase === 'attack') && dreamSpiritImage.naturalWidth) {
      const targetHeight = nightmare.phase === 'attack' ? 142 : 92;
      const scale = targetHeight / dreamSpiritImage.naturalHeight;
      const width = dreamSpiritImage.naturalWidth * scale;
      ctx.drawImage(dreamSpiritImage, nightmare.spiritX - width / 2, nightmare.spiritY - targetHeight, width, targetHeight);
    }
    if (nightmare.flash > 0) {
      ctx.fillStyle = `rgba(255, 255, 255, ${nightmare.flash})`;
      ctx.fillRect(0, 0, G.W, G.H);
      nightmare.flash = Math.max(0, nightmare.flash - .08);
    }
  };
  G.playNightmare = async player => {
    Object.assign(nightmare, { phase: 'stone', spiritX: 330, spiritY: 158, flash: 0 });
    G.scene = 'nightmare';
    G.sfx('wind');
    nightmare.playerX = 62;
    await G.tween(nightmare, { playerX: 92 }, 900, G.ease.inOut);
    await G.wait(350);
    await G.say(player.name, 'O que está acontecendo aqui????', { color: '#f0d8ff', box: 'bottom' });
    nightmare.phase = 'spirit';
    G.sfx('growl');
    await G.wait(500);
    nightmare.phase = 'attack';
    G.sfx('roar');
    G.shake(3, 500);
    await G.tween(nightmare, { spiritX: 112, spiritY: 151 }, 520, G.ease.in);
    nightmare.flash = 1;
    await G.wait(300);
  };
  const pedraInga = new Image();
  pedraInga.src = '/gaming/assets/pedra-inga-title.png';
  const dreamMonolith = new Image();
  dreamMonolith.src = '/gaming/assets/Monólito Alienígena Sob o Céu Estrelado.png';
  const dreamSpiritImage = new Image();
  dreamSpiritImage.src = '/gaming/assets/espirito-sonho.png';
  G.loadTitleArt = () => new Promise(resolve => {
    if (pedraInga.complete) { resolve(); return; }
    pedraInga.onload = resolve;
    pedraInga.onerror = resolve;
  });

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

  function drawBackdrop(ctx) {
    O.cam.cx = 312; O.cam.cy = 108; O.cam.zoom = 1; O.moonPhase = 0; O.wolf = null;
    drawWorld(ctx);
    const v = ctx.createLinearGradient(0, 0, 0, G.H);
    v.addColorStop(0, 'rgba(0,0,0,.35)'); v.addColorStop(.5, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.62)');
    ctx.fillStyle = v; ctx.fillRect(0, 0, G.W, G.H);
  }

  function drawTitleBackdrop(ctx) {
    if (!pedraInga.naturalWidth) { drawBackdrop(ctx); return; }
    const targetRatio = G.W / G.H;
    const sourceRatio = pedraInga.naturalWidth / pedraInga.naturalHeight;
    let sx = 0, sy = 0, sw = pedraInga.naturalWidth, sh = pedraInga.naturalHeight;
    if (sourceRatio > targetRatio) {
      sw = pedraInga.naturalHeight * targetRatio;
      sx = (pedraInga.naturalWidth - sw) / 2;
    } else {
      sh = pedraInga.naturalWidth / targetRatio;
      sy = (pedraInga.naturalHeight - sh) / 2;
    }
    ctx.drawImage(pedraInga, sx, sy, sw, sh, 0, 0, G.W, G.H);
    const v = ctx.createLinearGradient(0, 0, 0, G.H);
    v.addColorStop(0, 'rgba(0,0,0,.42)'); v.addColorStop(.55, 'rgba(0,0,0,.08)'); v.addColorStop(1, 'rgba(0,0,0,.5)');
    ctx.fillStyle = v; ctx.fillRect(0, 0, G.W, G.H);
  }

  // ---------- Tela de título ----------
  G.drawTitleScreen = (ctx) => {
    drawTitleBackdrop(ctx);
    ctx.fillStyle = 'rgba(0, 0, 0, .64)';
    ctx.fillRect(0, 0, G.W, G.H);
    G.text(ctx, 'Segredos da Pedra Encantada', G.W / 2, 92, '#f4f7ff', 'center', 'bold 16px Arial, Helvetica, sans-serif');
    if (Math.floor(G.real / 450) % 2 === 0) {
      G.text(ctx, 'APERTE QUALQUER TECLA PARA INICIAR', G.W / 2, 122, '#8ff0ff', 'center', 'bold 10px Arial, Helvetica, sans-serif');
    }
  };

  G.drawMainMenu = (ctx) => {
    drawTitleBackdrop(ctx);
    ctx.fillStyle = 'rgba(0, 0, 0, .64)';
    ctx.fillRect(0, 0, G.W, G.H);
    G.text(ctx, 'Segredos da Pedra Encantada', G.W / 2, 58, '#f4f7ff', 'center', 'bold 16px Arial, Helvetica, sans-serif');
  };

  G.drawMainMenuOptions = (ctx, m) => {
    m.items.forEach((item, i) => {
      const y = 105 + i * 20;
      const selected = m.idx === i;
      if (selected) {
        ctx.fillStyle = 'rgba(0, 0, 0, .62)';
        ctx.fillRect(112, y - 4, 160, 18);
        G.text(ctx, '›', 124, y - 1, '#8ff0ff', 'center', 'bold 13px Arial');
        G.text(ctx, '‹', 260, y - 1, '#8ff0ff', 'center', 'bold 13px Arial');
      }
      G.text(ctx, item.label, G.W / 2, y, selected ? '#8ff0ff' : '#f4f7ff', 'center', 'bold 11px Arial, Helvetica, sans-serif');
      G.region(104, y - 5, 176, 18, () => m.pick(i), () => { if (m.idx !== i) { m.idx = i; G.sfx('cursor'); } });
    });
  };

  let TRIBE_DATA = [
    { name: 'Espreitador do Vento', summary: 'Os caçadores incansáveis que rastreiam e perseguem a corrupção da Wyrm, enfrentando os perigos mais extremos com perseverança, astúcia e determinação inabalável.' },
    { name: 'Fúria Negra', summary: 'Revolucionários que enfrentam a opressão, defendem os marginalizados e transformam sua fúria em justiça, lutando para destruir estruturas de poder e libertar aqueles que foram silenciados.' },
    { name: 'Presas de Prata', summary: 'Os líderes que carregam o fardo de unir, inspirar e proteger a sociedade Garou, guiando seu povo com honra, coragem e sacrifício diante do Apocalipse.' },
    { name: 'Conselho dos Fantasmas', summary: 'Os sábios que desvendam os mistérios do mundo natural e espiritual, explorando conhecimentos proibidos e segredos esquecidos para compreender o inimigo e enfrentar o Apocalipse.' },
    { name: 'Guardador do Galhado', summary: 'Os protetores da terra e de suas comunidades, que cultivam laços, preservam a memória ancestral e enfrentam com fúria aqueles que ameaçam o equilíbrio da natureza.' },
  ];
  let AUSPICE_DATA = [
    { name: 'Ragabash', summary: 'Desafia tradições, questiona certezas e revela verdades por meio da astúcia e da irreverência, além de ser um ótimo infiltrador.' },
    { name: 'Theurge', summary: 'O místico que compreende os espíritos, preserva os pactos ancestrais e conecta os Garous ao mundo espiritual.' },
    { name: 'Philodox', summary: 'O juiz e inquisidor que interpreta a Litania, resolve conflitos e busca o equilíbrio entre justiça e tradição.' },
    { name: 'Galliard', summary: 'O contador de histórias que preserva as lendas, inspira com paixão os que o escutam e mantém viva a memória do povo Garou.' },
    { name: 'Ahroun', summary: 'O guerreiro que enfrenta os inimigos de Gaia com coragem, ferocidade e força implacável.' },
  ];
  let TRIBES = TRIBE_DATA.map(item => item.name);
  let AUSPICES = AUSPICE_DATA.map(item => item.name);
  const selectionFrameSequence = [0, 1, 2, 3, 4, 5, 2, 6, 7, 6, 1];
  const selectionFrameDuration = 350;
  const resetCharacterAnimation = () => {
    character.animationStep = 0;
    character.animationStart = G.real;
  };
  const character = { field: 0, tribe: 0, auspice: 0, sprite: 0, name: '', detail: null, fixedIndex: 0, animationStep: 0, animationStart: 0 };

  G.loadCharacterData = async () => {
    try {
      const response = await fetch('/gaming/assets/character-data.json');
      if (!response.ok) return;
      const data = await response.json();
      if (Array.isArray(data.tribes) && data.tribes.length) { TRIBE_DATA = data.tribes; TRIBES = TRIBE_DATA.map(item => item.name); }
      if (Array.isArray(data.auspices) && data.auspices.length) { AUSPICE_DATA = data.auspices; AUSPICES = AUSPICE_DATA.map(item => item.name); }
      const savedCharacters = Array.isArray(data.characters) ? data.characters : [];
      FIXED_CHARACTERS = selectionFiles.map((file, index) => ({
        ...(savedCharacters[index] || {}),
        ...(selectionRoleOverrides[file.name] || {}),
        ...(characterStoryOverrides[file.name] || {}),
        story: characterStoryOverrides[file.name] ? characterStoryOverrides[file.name].story : '',
        name: file.name,
        image: file.path,
        sprite: index,
      }));
    } catch (e) { /* usa os dados de reserva se o JSON não carregar */ }
  };

  const changeCharacter = (field, delta) => {
    if (field === 1) character.tribe = (character.tribe + delta + TRIBES.length) % TRIBES.length;
    if (field === 2) character.auspice = (character.auspice + delta + AUSPICES.length) % AUSPICES.length;
    if (field === 3) character.sprite = (character.sprite + delta + 10) % 10;
  };

  const detailLines = (ctx, text, maxWidth, font = G.FONT_SMALL) => {
    ctx.font = font;
    const words = text.split(' '), lines = [''];
    words.forEach(word => {
      const candidate = `${lines[lines.length - 1]} ${word}`.trim();
      if (ctx.measureText(candidate).width > maxWidth && lines[lines.length - 1]) lines.push(word);
      else lines[lines.length - 1] = candidate;
    });
    return lines;
  };

  const characterOverlay = (ctx) => {
    drawTitleBackdrop(ctx);
    ctx.fillStyle = 'rgba(0, 0, 0, .64)';
    ctx.fillRect(0, 0, G.W, G.H);
  };

  const characterPanel = (ctx, x, y, w, h) => {
    ctx.fillStyle = 'rgba(0, 0, 0, .56)';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = 'rgba(143, 240, 255, .42)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + .5, y + .5, w - 1, h - 1);
  };

  const drawCharacterDetail = (ctx) => {
    characterOverlay(ctx);
    const isTribe = character.detail === 'tribe';
    const item = isTribe ? TRIBE_DATA[character.tribe] : AUSPICE_DATA[character.auspice];
    G.text(ctx, isTribe ? 'DETALHES DA TRIBO' : 'DETALHES DO AUGÚRIO', G.W / 2, 8, '#f4f7ff', 'center', 'bold 13px Arial, Helvetica, sans-serif');
    characterPanel(ctx, 8, 28, 368, 148);
    G.text(ctx, item.name, 20, 38, '#8ff0ff', 'left', 'bold 12px Arial, Helvetica, sans-serif');
    const lines = detailLines(ctx, item.detail || item.summary, 340).slice(0, 10);
    lines.forEach((line, i) => G.text(ctx, line, 20, 57 + i * 11, '#ffffff', 'left', G.FONT_SMALL));
    G.text(ctx, '←/→ troca a opção   ESC volta para a criação', G.W / 2, 187, '#c8d0ff', 'center', G.FONT_SMALL);
    characterPanel(ctx, 116, 199, 152, 14);
    G.text(ctx, 'VOLTAR', G.W / 2, 201, '#8ff0ff', 'center', G.FONT_SMALL);
    G.region(116, 199, 152, 14, () => { character.detail = null; G.sfx('back'); });
  };

  G.drawCharacterCreation = (ctx) => {
    if (character.detail) { drawCharacterDetail(ctx); return; }
    characterOverlay(ctx);
    G.text(ctx, 'CRIAR PERSONAGEM', G.W / 2, 8, '#f4f7ff', 'center', 'bold 13px Arial, Helvetica, sans-serif');
    characterPanel(ctx, 8, 28, 188, 152);
    G.text(ctx, 'Escolha seu personagem', 18, 36, '#c8d0ff');
    const rows = [
      ['NOME', character.name || 'Digite seu nome'],
      ['TRIBO', TRIBE_DATA[character.tribe].name],
      ['AUGÚRIO', AUSPICE_DATA[character.auspice].name],
      ['IMAGEM', character.sprite < 5 ? `Homem ${character.sprite + 1}` : `Mulher ${character.sprite - 4}`],
      ['CONFIRMAR', ''],
      ['VOLTAR', ''],
    ];
    rows.forEach(([label, value], i) => {
      const y = 54 + i * 19;
      if (character.field === i) { ctx.fillStyle = 'rgba(143,240,255,.18)'; ctx.fillRect(14, y - 2, 176, 16); }
      G.text(ctx, label, 20, y, character.field === i ? '#8ff0ff' : '#f4f7ff', 'left', G.FONT_SMALL);
      if (value) G.text(ctx, value, 84, y, character.field === i ? '#ffffff' : '#9da8dc', 'left', G.FONT_SMALL);
      G.region(14, y - 3, 176, 16, () => {
        character.field = i; G.sfx('cursor');
        if (i === 0) {
          const typed = window.prompt('Nome do personagem', character.name);
          if (typed !== null) character.name = typed.slice(0, 16);
        }
        if (i === 4 && G.characterCommit) G.characterCommit();
        if (i === 5 && G.characterCancel) G.characterCancel();
      });
      if (i === 1 || i === 2 || i === 3) {
        G.text(ctx, '‹', 166, y - 1, '#ffe070', 'center', 'bold 13px Arial');
        G.text(ctx, '›', 184, y - 1, '#ffe070', 'center', 'bold 13px Arial');
        G.region(158, y - 4, 16, 18, () => { character.field = i; changeCharacter(i, -1); G.sfx('cursor'); });
        G.region(176, y - 4, 16, 18, () => { character.field = i; changeCharacter(i, 1); G.sfx('cursor'); });
      }
    });
    characterPanel(ctx, 204, 28, 172, 152);
    const col = character.sprite % 5, row = character.sprite < 5 ? 0 : 1;
    const sw = characterSheet.naturalWidth / 5, sh = characterSheet.naturalHeight / 2;
    if (characterSheet.naturalWidth) {
      const dw = 120, dh = 150, sx = col * sw, sy = row * sh;
      ctx.drawImage(characterSheet, sx, sy, sw, sh, 290 - dw / 2, 29, dw, dh);
    }
    characterPanel(ctx, 204, 182, 172, 29);
    G.text(ctx, 'INFO TRIBO', 246, 187, '#f4f7ff', 'center', G.FONT_SMALL);
    G.text(ctx, 'INFO AUGÚRIO', 334, 200, '#8ff0ff', 'center', G.FONT_SMALL);
    G.region(208, 183, 78, 25, () => { character.detail = 'tribe'; G.sfx('ok'); });
    G.region(290, 183, 82, 25, () => { character.detail = 'auspice'; G.sfx('ok'); });

    // Controle direcional clicável: cima/baixo navegam pelos campos; esquerda/direita alteram o campo.
    const navButton = (x, y, label, action) => {
      characterPanel(ctx, x, y, 14, 13);
      G.text(ctx, label, x + 7, y + 1, '#8ff0ff', 'center', 'bold 11px Arial');
      G.region(x, y, 14, 13, action);
    };
    navButton(75, 163, '↑', () => { character.field = (character.field + 5) % 6; G.sfx('cursor'); });
    navButton(60, 177, '←', () => { changeCharacter(character.field, -1); G.sfx('cursor'); });
    navButton(75, 177, '↓', () => { character.field = (character.field + 1) % 6; G.sfx('cursor'); });
    navButton(90, 177, '→', () => { changeCharacter(character.field, 1); G.sfx('cursor'); });
  };

  G.handleCharacterKey = (e) => {
    if (character.detail) {
      if (e.key === 'Escape' || e.key === 'Backspace') { character.detail = null; return true; }
      if (e.key === 'ArrowLeft') { if (character.detail === 'tribe') changeCharacter(1, -1); else changeCharacter(2, -1); return true; }
      if (e.key === 'ArrowRight') { if (character.detail === 'tribe') changeCharacter(1, 1); else changeCharacter(2, 1); return true; }
      return true;
    }
    if (e.key === 't' || e.key === 'T') { character.detail = 'tribe'; return true; }
    if (e.key === 'u' || e.key === 'U') { character.detail = 'auspice'; return true; }
    if (e.key === 'ArrowUp') { character.field = (character.field + 5) % 6; return true; }
    if (e.key === 'ArrowDown') { character.field = (character.field + 1) % 6; return true; }
    if (e.key === 'ArrowLeft') { changeCharacter(character.field, -1); return true; }
    if (e.key === 'ArrowRight') { changeCharacter(character.field, 1); return true; }
    if (character.field === 0 && e.key === 'Backspace') { character.name = character.name.slice(0, -1); return true; }
    if (character.field === 0 && e.key.length === 1 && character.name.length < 16) { character.name += e.key; return true; }
    if (e.key === 'Escape') { G.emitAction('back'); return true; }
    if (e.key === 'Enter' || e.key === ' ') { G.emitAction('ok'); return true; }
    return false;
  };

  G.characterCreation = () => new Promise(resolve => {
    character.field = 0; character.tribe = 0; character.auspice = 0; character.sprite = 0; character.name = ''; character.detail = null;
    const finish = value => {
      off(); G.ui.character = null; G.characterCommit = null; G.characterCancel = null;
      resolve(value);
    };
    G.characterCommit = () => finish({ ...character, tribe: TRIBES[character.tribe], auspice: AUSPICES[character.auspice] });
    G.characterCancel = () => finish(null);
    const off = G.onAction(action => {
      if (action === 'left' || action === 'right') changeCharacter(character.field, action === 'right' ? 1 : -1);
      if (action === 'up') character.field = (character.field + 5) % 6;
      if (action === 'down') character.field = (character.field + 1) % 6;
      if (action === 'selectField') character.field = action.value;
      if (action === 'back') finish(null);
      if (action === 'ok') {
        if (character.field === 4) G.characterCommit();
        else if (character.field === 5) G.characterCancel();
        else if (character.field !== 0) changeCharacter(character.field, 1);
      }
    });
    G.ui.character = character;
  });

  const drawFixedCharacterCreation = (ctx) => {
    characterOverlay(ctx);
    const selectedIndex = Number.isInteger(character.fixedIndex) ? character.fixedIndex : 0;
    const selected = FIXED_CHARACTERS[selectedIndex] || FIXED_CHARACTERS[0];
    G.text(ctx, 'ESCOLHA SEU PERSONAGEM', G.W / 2, 8, '#f4f7ff', 'center', 'bold 13px Arial, Helvetica, sans-serif');
    characterPanel(ctx, 8, 22, 122, 190);
    characterPanel(ctx, 136, 22, 240, 190);

    const selectedFile = selectionFiles[selectedIndex] || selectionFiles[0];
    const sheet = selectionSheets[selectedIndex] || selectionSheets[0];
    if (sheet && sheet.naturalWidth) {
      const elapsed = Math.max(0, G.real - (character.animationStart || G.real));
      const sequencePosition = Math.floor(elapsed / selectionFrameDuration) % selectionFrameSequence.length;
      const frame = selectionFrameSequence[sequencePosition];
      const bounds = selectedFile && selectedFile.frames ? (selectedFile.frames[frame] || selectedFile.frames[0]) : null;
      const frameWidth = bounds ? bounds.xEnd - bounds.xStart : 0;
      if (bounds && frameWidth > 0) {
        const ratio = Math.min(108 / frameWidth, 170 / sheet.naturalHeight);
        const dw = Math.round(frameWidth * ratio), dh = Math.round(sheet.naturalHeight * ratio);
        const dx = 69 - dw / 2, dy = 112 - dh / 2;
        ctx.save();
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(sheet, bounds.xStart, 0, frameWidth, sheet.naturalHeight, dx, dy, dw, dh);
        ctx.restore();
      }
    }
    G.text(ctx, selected.name, 148, 38, '#8ff0ff', 'left', 'bold 11px Arial, Helvetica, sans-serif');
    G.text(ctx, `${selected.tribe} ${selected.auspice}`, 148, 50, '#f4f7ff', 'left', '7px Arial, Helvetica, sans-serif');

    const drawSelectionSection = (label, value, y, color = '#8ff0ff') => {
      const textFont = '5px Arial, Helvetica, sans-serif';
      G.text(ctx, label, 148, y, color, 'left', 'bold 7px Arial, Helvetica, sans-serif');
      const lines = detailLines(ctx, value || '', 216, textFont);
      lines.forEach((line, i) => G.text(ctx, line, 148, y + 7 + i * 6, '#ffffff', 'left', textFont));
      return y + 7 + lines.length * 6 + 2;
    };
    let detailY = drawSelectionSection('HISTÓRIA', selected.story, 62);
    detailY = drawSelectionSection('TRIBO', selected.tribeSummary, detailY);
    drawSelectionSection('AUGÚRIO', selected.auspiceSummary, detailY);

    const navButton = (x, y, label, action) => {
      characterPanel(ctx, x, y, 24, 15);
      G.text(ctx, label, x + 12, y + 1, '#8ff0ff', 'center', 'bold 12px Arial');
      G.region(x, y, 24, 15, action);
    };
    const total = FIXED_CHARACTERS.length;
    G.text(ctx, '<', 18, 112, '#8ff0ff', 'center', 'bold 15px Arial, Helvetica, sans-serif');
    G.region(8, 102, 24, 30, () => { character.fixedIndex = (character.fixedIndex + total - 1) % total; resetCharacterAnimation(); G.sfx('cursor'); });
    G.text(ctx, '>', 122, 112, '#8ff0ff', 'center', 'bold 15px Arial, Helvetica, sans-serif');
    G.region(106, 102, 24, 30, () => { character.fixedIndex = (character.fixedIndex + 1) % total; resetCharacterAnimation(); G.sfx('cursor'); });
    characterPanel(ctx, 236, 190, 132, 15);
    G.text(ctx, 'SELECIONAR PERSONAGEM', 302, 193, '#8ff0ff', 'center', '6px Arial, Helvetica, sans-serif');
    G.region(236, 190, 132, 15, () => G.emitAction('ok'));
  };

  G.drawCharacterCreation = drawFixedCharacterCreation;
  G.handleCharacterKey = (e) => {
    const total = FIXED_CHARACTERS.length;
    if (e.key === 'ArrowLeft') { character.fixedIndex = (character.fixedIndex + total - 1) % total; resetCharacterAnimation(); return true; }
    if (e.key === 'ArrowRight') { character.fixedIndex = (character.fixedIndex + 1) % total; resetCharacterAnimation(); return true; }
    if (e.key === 'ArrowUp') { character.animationStep = (character.animationStep + selectionFrameSequence.length - 1) % selectionFrameSequence.length; return true; }
    if (e.key === 'ArrowDown') { character.animationStep = (character.animationStep + 1) % selectionFrameSequence.length; return true; }
    if (e.key === 'Escape') { G.emitAction('back'); return true; }
    if (e.key === 'Enter' || e.key === ' ') { G.emitAction('ok'); return true; }
    return true;
  };
  G.characterCreation = () => new Promise(resolve => {
    character.fixedIndex = 0;
    resetCharacterAnimation();
    const finish = value => { off(); G.ui.character = null; resolve(value); };
    const off = G.onAction(action => {
      const total = FIXED_CHARACTERS.length;
      if (action === 'left') { character.fixedIndex = (character.fixedIndex + total - 1) % total; resetCharacterAnimation(); }
      if (action === 'right') { character.fixedIndex = (character.fixedIndex + 1) % total; resetCharacterAnimation(); }
      if (action === 'up') character.animationStep = (character.animationStep + selectionFrameSequence.length - 1) % selectionFrameSequence.length;
      if (action === 'down') character.animationStep = (character.animationStep + 1) % selectionFrameSequence.length;
      if (action === 'back') finish(null);
      if (action === 'ok') finish({ ...FIXED_CHARACTERS[character.fixedIndex] });
    });
    G.ui.character = character;
  });

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
