export const tribeQuizTrybeIds = [
  'silent striders',
  'black furies',
  'silver fangs',
  'ghost council',
  'hart wardens',
  'galestalkers',
  'glass walkers',
  'bone gnawers',
  'shadow lords',
  'children of gaia',
  'red talons',
] as const;

export type TribeQuizResultId = (typeof tribeQuizTrybeIds)[number];

export type TribeQuizOption = {
  id: string;
  description: string;
  scores: Partial<Record<TribeQuizResultId, number>>;
};

export type TribeQuizQuestion = {
  id: string;
  title: string;
  situation: string;
  options: [
    TribeQuizOption,
    TribeQuizOption,
    TribeQuizOption,
    TribeQuizOption,
    TribeQuizOption,
  ];
};

export type TribeQuizAnswers = Record<string, string>;

export type TribeQuizRankingItem = {
  trybeId: TribeQuizResultId;
  total: number;
  primaryHits: number;
  weightedPrimaryHits: number;
  minorHits: number;
};

export const tribeQuizQuestions: TribeQuizQuestion[] = [
  {
    id: 'group-in-crisis',
    title: 'Uma crise come?a',
    situation: 'Tudo sai do controle ao seu redor. O que você faz primeiro?',
    options: [
      {
        id: 'find-a-way-through',
        description: 'Prefiro agir e encontrar um caminho.',
        scores: { 'silent striders': 3 },
      },
      {
        id: 'protect-the-target',
        description: 'Fico ao lado de quem está vulnerável.',
        scores: { 'black furies': 3 },
      },
      {
        id: 'understand-first',
        description: 'Procuro descobrir o que realmente aconteceu.',
        scores: { 'ghost council': 3 },
      },
      {
        id: 'make-the-place-safe',
        description: 'Crio segurança e estabilidade.',
        scores: { 'hart wardens': 3 },
      },
      {
        id: 'face-the-danger',
        description: 'Enfrento a origem da ameaça.',
        scores: { galestalkers: 3 },
      },
    ],
  },

  {
    id: 'unfair-situation',
    title: 'Uma injusti?a',
    situation: 'Você vê alguém sendo tratado injustamente. Como reage?',
    options: [
      {
        id: 'confront-injustice',
        description: 'Enfrento a injustiça diretamente.',
        scores: { 'black furies': 3 },
      },
      {
        id: 'take-responsibility',
        description: 'Organizo a situação e tomo uma decisão.',
        scores: { 'silver fangs': 3 },
      },
      {
        id: 'build-lasting-support',
        description: 'Quero impedir que aconteça de novo.',
        scores: { 'hart wardens': 3 },
      },
      {
        id: 'watch-the-aggressor',
        description: 'Procuro o melhor momento para agir.',
        scores: { galestalkers: 3 },
      },
      {
        id: 'use-the-system',
        description: 'Viro o sistema contra o abuso.',
        scores: { 'glass walkers': 3 },
      },
    ],
  },

  {
    id: 'important-mission',
    title: 'Uma tarefa dif?cil',
    situation: 'Algo importante depende de você. Qual é sua abordagem?',
    options: [
      {
        id: 'coordinate-everyone',
        description: 'Divido funções e mostro o caminho.',
        scores: { 'silver fangs': 3 },
      },
      {
        id: 'research-everything',
        description: 'Quero entender todos os riscos.',
        scores: { 'ghost council': 3 },
      },
      {
        id: 'follow-the-trail',
        description: 'Continuo até encontrar o que procuro.',
        scores: { galestalkers: 3 },
      },
      {
        id: 'build-a-better-method',
        description: 'Busco um jeito mais eficiente.',
        scores: { 'glass walkers': 3 },
      },
      {
        id: 'make-do-with-what-exists',
        description: 'Faço funcionar com o que tenho.',
        scores: { 'bone gnawers': 3 },
      },
    ],
  },

  {
    id: 'abandoned-place',
    title: 'Um lugar abandonado',
    situation: 'Você pode transformar um lugar esquecido. O que faria?',
    options: [
      {
        id: 'preserve-its-stories',
        description: 'Quero entender o que aconteceu ali.',
        scores: { 'ghost council': 3 },
      },
      {
        id: 'restore-the-place',
        description: 'Transformo o lugar em algo acolhedor.',
        scores: { 'hart wardens': 3 },
      },
      {
        id: 'modernize-it',
        description: 'Uso tecnologia para renovar o espaço.',
        scores: { 'glass walkers': 3 },
      },
      {
        id: 'open-it-to-people',
        description: 'Faço do lugar um ponto de apoio.',
        scores: { 'bone gnawers': 3 },
      },
      {
        id: 'control-the-position',
        description: 'Penso no valor estratégico do lugar.',
        scores: { 'shadow lords': 3 },
      },
    ],
  },

  {
    id: 'group-needs-direction',
    title: 'O grupo est? perdido',
    situation: 'Seu grupo está cansado e sem direção. O que você faz?',
    options: [
      {
        id: 'rebuild-foundation',
        description: 'Cuido primeiro do que sustenta todos.',
        scores: { 'hart wardens': 3 },
      },
      {
        id: 'identify-the-real-obstacle',
        description: 'Ataco o principal problema.',
        scores: { galestalkers: 3 },
      },
      {
        id: 'keep-everyone-going',
        description: 'Improviso para ninguém ficar para trás.',
        scores: { 'bone gnawers': 3 },
      },
      {
        id: 'change-the-balance',
        description: 'Reorganizo forças e influências.',
        scores: { 'shadow lords': 3 },
      },
      {
        id: 'bring-people-together',
        description: 'Tento recuperar diálogo e confiança.',
        scores: { 'children of gaia': 3 },
      },
    ],
  },

  {
    id: 'recurring-threat',
    title: 'Um problema recorrente',
    situation: 'O mesmo problema sempre volta. O que você tenta agora?',
    options: [
      {
        id: 'study-its-pattern',
        description: 'Aprendo a prever o próximo movimento.',
        scores: { galestalkers: 3 },
      },
      {
        id: 'redesign-the-solution',
        description: 'Tento uma solução completamente nova.',
        scores: { 'glass walkers': 3 },
      },
      {
        id: 'attack-the-source',
        description: 'Vou atrás de quem sustenta o problema.',
        scores: { 'shadow lords': 3 },
      },
      {
        id: 'repair-the-conflict',
        description: 'Procuro resolver o conflito por trás disso.',
        scores: { 'children of gaia': 3 },
      },
      {
        id: 'remove-the-threat',
        description: 'Prefiro uma solução direta e definitiva.',
        scores: { 'red talons': 3 },
      },
    ],
  },

  {
    id: 'new-environment',
    title: 'Um lugar novo',
    situation: 'Você chega onde não conhece ninguém. O que faz primeiro?',
    options: [
      {
        id: 'understand-how-it-works',
        description: 'Aprendo rapidamente como tudo funciona.',
        scores: { 'glass walkers': 3 },
      },
      {
        id: 'find-real-people',
        description: 'Procuro quem conhece a realidade local.',
        scores: { 'bone gnawers': 3 },
      },
      {
        id: 'create-connections',
        description: 'Busco confiança antes de tomar partido.',
        scores: { 'children of gaia': 3 },
      },
      {
        id: 'find-wild-space',
        description: 'Prefiro um espaço longe da agitação.',
        scores: { 'red talons': 3 },
      },
      {
        id: 'walk-and-learn',
        description: 'Conheço o lugar enquanto caminho.',
        scores: { 'silent striders': 3 },
      },
    ],
  },

  {
    id: 'power-abuse',
    title: 'Abuso de poder',
    situation: 'Alguém poderoso está prejudicando outras pessoas. O que você faz?',
    options: [
      {
        id: 'support-people-below',
        description: 'Dou apoio a quem tem menos poder.',
        scores: { 'bone gnawers': 3 },
      },
      {
        id: 'find-pressure-point',
        description: 'Procuro onde esse poder pode ser pressionado.',
        scores: { 'shadow lords': 3 },
      },
      {
        id: 'refuse-coexistence',
        description: 'Não aceito que o dano continue.',
        scores: { 'red talons': 3 },
      },
      {
        id: 'carry-the-truth',
        description: 'Faço a informação chegar às pessoas.',
        scores: { 'silent striders': 3 },
      },
      {
        id: 'stand-with-victims',
        description: 'Me posiciono ao lado de quem sofreu.',
        scores: { 'black furies': 3 },
      },
    ],
  },

  {
    id: 'group-conflict',
    title: 'Um conflito s?rio',
    situation: 'Duas pessoas estão dividindo o grupo. Como você reage?',
    options: [
      {
        id: 'read-the-power-game',
        description: 'Observo interesses e relações de poder.',
        scores: { 'shadow lords': 3 },
      },
      {
        id: 'mediate',
        description: 'Busco uma solução que permita seguir juntos.',
        scores: { 'children of gaia': 3 },
      },
      {
        id: 'create-distance',
        description: 'Prefiro enxergar tudo de fora.',
        scores: { 'silent striders': 3 },
      },
      {
        id: 'defend-the-harmed',
        description: 'Não trato abuso como simples desentendimento.',
        scores: { 'black furies': 3 },
      },
      {
        id: 'make-the-call',
        description: 'Assumo a responsabilidade pelo rumo.',
        scores: { 'silver fangs': 3 },
      },
    ],
  },

  {
    id: 'what-must-be-protected',
    title: 'O que voc? protegeria?',
    situation: 'Qual dessas coisas mais merece sua dedicação?',
    options: [
      {
        id: 'peaceful-community',
        description: 'Quero aproximar pessoas diferentes.',
        scores: { 'children of gaia': 3 },
      },
      {
        id: 'wild-nature',
        description: 'Quero preservar lugares intocados.',
        scores: { 'red talons': 3 },
      },
      {
        id: 'people-facing-abuse',
        description: 'Quero proteger quem precisa reagir.',
        scores: { 'black furies': 3 },
      },
      {
        id: 'shared-legacy',
        description: 'Quero preservar algo que une gerações.',
        scores: { 'silver fangs': 3 },
      },
      {
        id: 'knowledge-and-memory',
        description: 'Quero preservar histórias e respostas.',
        scores: { 'ghost council': 3 },
      },
    ],
  },

  {
    id: 'legacy',
    title: 'Seu legado',
    situation: 'Como você gostaria de ser lembrado?',
    options: [
      {
        id: 'protected-the-wild',
        description: 'Defendi aquilo que não podia se defender.',
        scores: { 'red talons': 3 },
      },
      {
        id: 'opened-paths',
        description: 'Conectei pessoas, lugares e histórias.',
        scores: { 'silent striders': 3 },
      },
      {
        id: 'led-with-responsibility',
        description: 'Assumi responsabilidades quando foi preciso.',
        scores: { 'silver fangs': 3 },
      },
      {
        id: 'understood-the-hidden',
        description: 'Descobri aquilo que outros não enxergaram.',
        scores: { 'ghost council': 3 },
      },
      {
        id: 'built-a-home',
        description: 'Deixei algo seguro e duradouro.',
        scores: { 'hart wardens': 3 },
      },
    ],
  },
];

export const tribeQuizQuestionCount = tribeQuizQuestions.length;

function shuffle<T>(items: T[], random: () => number): T[] {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const targetIndex = Math.floor(random() * (index + 1));
    [result[index], result[targetIndex]] = [result[targetIndex], result[index]];
  }

  return result;
}

export function calculateTrybeQuizResult(
  answers: TribeQuizAnswers,
  random: () => number = Math.random,
): TribeQuizRankingItem[] {
  const ranking = tribeQuizTrybeIds.map((trybeId) => ({
    trybeId,
    total: 0,
    primaryHits: 0,
    weightedPrimaryHits: 0,
    minorHits: 0,
  }));

  const rankingMap = Object.fromEntries(
    ranking.map((item) => [item.trybeId, item]),
  ) as Record<TribeQuizResultId, TribeQuizRankingItem>;

  tribeQuizQuestions.forEach((question) => {
    const selectedOptionId = answers[question.id];
    const option = question.options.find((item) => item.id === selectedOptionId);

    if (!option) return;

    (Object.entries(option.scores) as [TribeQuizResultId, number][]).forEach(
      ([trybeId, score]) => {
        const target = rankingMap[trybeId];

        if (!target) return;

        target.total += score;
        target.primaryHits += 1;
        target.minorHits += 1;
      },
    );
  });

  const sortedByScore = [...ranking].sort((a, b) => b.total - a.total);
  const result: TribeQuizRankingItem[] = [];

  let startIndex = 0;

  while (startIndex < sortedByScore.length) {
    const score = sortedByScore[startIndex].total;
    let endIndex = startIndex + 1;

    while (
      endIndex < sortedByScore.length &&
      sortedByScore[endIndex].total === score
    ) {
      endIndex += 1;
    }

    result.push(...shuffle(sortedByScore.slice(startIndex, endIndex), random));
    startIndex = endIndex;
  }

  return result;
}

export function getTrybeQuizBalance() {
  const primaryAppearances = Object.fromEntries(
    tribeQuizTrybeIds.map((trybeId) => [trybeId, 0]),
  ) as Record<TribeQuizResultId, number>;

  tribeQuizQuestions.forEach((question) => {
    question.options.forEach((option) => {
      const primaryTrybe = (
        Object.entries(option.scores) as [TribeQuizResultId, number][]
      ).sort((a, b) => b[1] - a[1])[0]?.[0];

      if (primaryTrybe) {
        primaryAppearances[primaryTrybe] += 1;
      }
    });
  });

  return primaryAppearances;
}