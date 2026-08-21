const renownOptions = [
  { label: 'Glória', key: 'glory' },
  { label: 'Honra', key: 'honor' },
  { label: 'Sabedoria', key: 'wisdom' },
] as const;

const termMap: Record<string, { type: 'attribute' | 'skill' | 'renown'; key: string }> = {
  gloria: { type: 'renown', key: 'glory' },
  honra: { type: 'renown', key: 'honor' },
  sabedoria: { type: 'renown', key: 'wisdom' },
  forca: { type: 'attribute', key: 'strength' },
  destreza: { type: 'attribute', key: 'dexterity' },
  vigor: { type: 'attribute', key: 'stamina' },
  carisma: { type: 'attribute', key: 'charisma' },
  manipulacao: { type: 'attribute', key: 'manipulation' },
  autocontrole: { type: 'attribute', key: 'composure' },
  inteligencia: { type: 'attribute', key: 'intelligence' },
  raciocinio: { type: 'attribute', key: 'wits' },
  determinacao: { type: 'attribute', key: 'resolve' },
  atletismo: { type: 'skill', key: 'athletics' },
  briga: { type: 'skill', key: 'brawl' },
  etiqueta: { type: 'skill', key: 'etiquette' },
  ocultismo: { type: 'skill', key: 'occult' },
  sobrevivencia: { type: 'skill', key: 'survival' },
  lideranca: { type: 'skill', key: 'leadership' },
  persuasao: { type: 'skill', key: 'persuasion' },
  politica: { type: 'skill', key: 'politics' },
  medicina: { type: 'skill', key: 'medicine' },
  percepcao: { type: 'skill', key: 'awareness' },
  investigacao: { type: 'skill', key: 'investigation' },
  oficios: { type: 'skill', key: 'craft' },
  artesanato: { type: 'skill', key: 'craft' },
  performance: { type: 'skill', key: 'performance' },
  intimidacao: { type: 'skill', key: 'intimidation' },
  sagacidade: { type: 'skill', key: 'insight' },
  subterfugio: { type: 'skill', key: 'subterfuge' },
  labia: { type: 'skill', key: 'subterfuge' },
  manha: { type: 'skill', key: 'streetwise' },
  'empatia com animais': { type: 'skill', key: 'animalKen' },
  conducao: { type: 'skill', key: 'driving' },
  ciencia: { type: 'skill', key: 'science' },
  tecnologia: { type: 'skill', key: 'technology' },
  financas: { type: 'skill', key: 'finance' },
  academicos: { type: 'skill', key: 'academics' },
  erudicao: { type: 'skill', key: 'academics' },
  furtividade: { type: 'skill', key: 'stealth' },
  'armas brancas': { type: 'skill', key: 'melee' },
  'armas de fogo': { type: 'skill', key: 'firearms' },
};

type PoolSummaryItem = {
  label: string;
  total: number;
};

const normalizeText = (value: string) => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[“”"'`]/g, '')
  .replace(/\s+/g, ' ')
  .trim()
  .toLowerCase();

const formatDiceLabel = (value: number) => `${value} ${value === 1 ? 'dado' : 'dados'}`;

const getPhysicalBonus = (formValue: string, attributeKey: string) => {
  const normalizedForm = normalizeText(formValue);
  const isPhysical = attributeKey === 'strength' || attributeKey === 'dexterity' || attributeKey === 'stamina';

  if (!isPhysical) return 0;
  if (normalizedForm.includes('crinos')) return 4;
  if (normalizedForm.includes('hispo') || normalizedForm.includes('glabro')) return 2;
  return 0;
};

const getHighestRenown = (sheetData: any) => Math.max(
  Number(sheetData?.glory || 0),
  Number(sheetData?.honor || 0),
  Number(sheetData?.wisdom || 0),
);

const getTermValue = (sheetData: any, termLabel: string) => {
  const normalizedTerm = normalizeText(termLabel).replace(/[().:;]+$/g, '');
  const mappedTerm = termMap[normalizedTerm];
  if (!mappedTerm) return null;

  if (mappedTerm.type === 'renown') {
    return Number(sheetData?.[mappedTerm.key] || 0);
  }

  if (mappedTerm.type === 'attribute') {
    const baseValue = Number(sheetData?.attributes?.[mappedTerm.key] || 0);
    return baseValue + getPhysicalBonus(String(sheetData?.form || ''), mappedTerm.key);
  }

  return Number(sheetData?.skills?.[mappedTerm.key]?.value || 0);
};

const splitRelevantExpressions = (poolText: string) => {
  const sourceText = String(poolText || '').trim();
  if (sourceText === '') return [];

  const optionalMatch = sourceText.match(/Nenhuma\s*\((.+)\)/i);
  const relevantText = optionalMatch ? optionalMatch[1] : sourceText;
  const [userSide] = relevantText.split(/\bvs\.?\b/i);

  return String(userSide || '')
    .split(/\s*,\s*/)
    .map((item) => item.trim())
    .filter((item) => item !== '');
};

const buildSummariesForExpression = (expression: string, sheetData: any): PoolSummaryItem[] => {
  const normalizedExpression = normalizeText(expression);

  if (normalizedExpression.startsWith('renome ') && expression.includes('+')) {
    const expressionParts = expression.split('+');
    const remainderLabel = expressionParts.slice(1).join('+').trim();
    const remainderValue = getTermValue(sheetData, remainderLabel);
    if (remainderValue === null) return [];

    if (normalizedExpression.includes('mais alto do alvo')) {
      return [{
        label: `Maior Renome + ${remainderLabel}`,
        total: getHighestRenown(sheetData) + remainderValue,
      }];
    }

    return renownOptions.map((renown) => ({
      label: `${renown.label} + ${remainderLabel}`,
      total: Number(sheetData?.[renown.key] || 0) + remainderValue,
    }));
  }

  const terms = expression
    .split('+')
    .map((item) => item.trim())
    .filter((item) => item !== '');

  if (terms.length === 0) return [];

  let total = 0;
  for (const term of terms) {
    const value = getTermValue(sheetData, term);
    if (value === null) return [];
    total += value;
  }

  return [{ label: expression.trim(), total }];
};

export const getCurrentPoolSummary = (poolText: string, sheetData: any) => {
  if (!poolText || !sheetData) return '';

  const expressions = splitRelevantExpressions(poolText);
  const summaries = expressions.flatMap((expression) => buildSummariesForExpression(expression, sheetData));

  if (summaries.length === 0) return '';
  if (summaries.length === 1) return formatDiceLabel(summaries[0].total);

  return summaries
    .map((item) => `${item.label}: ${formatDiceLabel(item.total)}`)
    .join(' | ');
};