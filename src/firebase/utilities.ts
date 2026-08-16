import dataGifts from '../data/gifts.json';
import dataRituals from '../data/rituals.json';

export const getOfficialTimeBrazil = async () => {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'America/Sao_Paulo',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  };
  const brazilTime = new Intl.DateTimeFormat('pt-BR', options).format(date);
  return brazilTime;
};

export const parseDate = (dateStr: string): Date => {
  const [datePart, timePart] = dateStr.split(', ');
  const [day, month, year] = datePart.split('/').map(Number);
  const [hours, minutes, seconds] = timePart.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes, seconds);
};

const sortTrackByValue = (track: any[] = []) => {
  return [...track].sort((first, second) => Number(first?.value || 0) - Number(second?.value || 0));
};

export const cycleTrackMarker = (
  track: any[] = [],
  name: 'health' | 'willpower',
  value: number,
) => {
  const currentTrack = Array.isArray(track) ? track : [];
  const currentMarker = currentTrack.find((item: any) => Number(item?.value) === value);
  const restOfList = currentTrack.filter((item: any) => Number(item?.value) !== value);

  if (!currentMarker) {
    return sortTrackByValue([...restOfList, { value, agravated: false }]);
  }

  if (name === 'health') {
    if (currentMarker?.silver) return sortTrackByValue(restOfList);
    if (currentMarker?.agravated) {
      return sortTrackByValue([...restOfList, { value, agravated: true, silver: true }]);
    }
    return sortTrackByValue([...restOfList, { value, agravated: true }]);
  }

  if (currentMarker?.agravated) return sortTrackByValue(restOfList);
  return sortTrackByValue([...restOfList, { value, agravated: true }]);
};

export const getTrackDamageSummary = (
  track: any[] = [],
  name: 'health' | 'willpower',
) => {
  const currentTrack = Array.isArray(track) ? track : [];

  return currentTrack.reduce((acc: any, item: any) => {
    if (name === 'health' && item?.silver) {
      acc.silver += 1;
      return acc;
    }

    if (item?.agravated) acc.agravated += 1;
    else acc.superficial += 1;
    return acc;
  }, { agravated: 0, silver: 0, superficial: 0 });
};

export const formatTrackDamageSummary = (
  track: any[] = [],
  name: 'health' | 'willpower',
) => {
  const summary = getTrackDamageSummary(track, name);

  if (name === 'health') {
    return `Dano de Prata(${summary.silver}), Dano Agravado(${summary.agravated}) e Dano Superficial(${summary.superficial})`;
  }

  return `Dano Agravado(${summary.agravated}) e Dano Superficial(${summary.superficial})`;
};

const giftCatalog = Array.isArray(dataGifts) ? dataGifts : [];
const giftCatalogById = new Map(giftCatalog.map((gift: any) => [String(gift.id), gift]));
const ritualCatalog = Array.isArray(dataRituals) ? dataRituals : [];
const ritualCatalogById = new Map(ritualCatalog.map((ritual: any) => [String(ritual.id), ritual]));

export const normalizeGiftId = (gift: any): string => {
  if (typeof gift === 'string' || typeof gift === 'number') return String(gift);
  if (gift && typeof gift === 'object' && gift.id !== undefined && gift.id !== null) {
    return String(gift.id);
  }
  return '';
};

export const serializeGiftEntries = (gifts: any[] = []) => {
  const seen = new Set<string>();

  return gifts
    .map((gift) => normalizeGiftId(gift))
    .filter((giftId) => giftId !== '')
    .filter((giftId) => {
      if (seen.has(giftId)) return false;
      seen.add(giftId);
      return true;
    });
};

export const resolveGiftEntries = (gifts: any[] = []) => {
  return serializeGiftEntries(gifts)
    .map((giftId) => giftCatalogById.get(giftId))
    .filter(Boolean);
};

export const normalizeRitualId = (ritual: any): string => {
  if (typeof ritual === 'string' || typeof ritual === 'number') return String(ritual);
  if (ritual && typeof ritual === 'object' && ritual.id !== undefined && ritual.id !== null) {
    return String(ritual.id);
  }
  return '';
};

export const serializeRitualEntries = (rituals: any[] = []) => {
  const seen = new Set<string>();

  return rituals
    .map((ritual) => normalizeRitualId(ritual))
    .filter((ritualId) => ritualId !== '')
    .filter((ritualId) => {
      if (seen.has(ritualId)) return false;
      seen.add(ritualId);
      return true;
    });
};

export const resolveRitualEntries = (rituals: any[] = []) => {
  return serializeRitualEntries(rituals)
    .map((ritualId) => ritualCatalogById.get(ritualId))
    .filter(Boolean);
};

export const normalizePlayerSheetForStorage = <T>(playerData: T): T => {
  if (!playerData || typeof playerData !== 'object') return playerData;

  const normalizedData = JSON.parse(JSON.stringify(playerData));

  if (Array.isArray(normalizedData?.data?.gifts)) {
    normalizedData.data.gifts = serializeGiftEntries(normalizedData.data.gifts);
  }

  if (Array.isArray(normalizedData?.data?.rituals)) {
    normalizedData.data.rituals = serializeRitualEntries(normalizedData.data.rituals);
  }

  if (Array.isArray(normalizedData?.list)) {
    normalizedData.list = normalizedData.list.map((item: any) => {
      if (!item || typeof item !== 'object') return item;

      const nextItem = { ...item };
      if (Array.isArray(nextItem?.data?.gifts) || Array.isArray(nextItem?.data?.rituals)) {
        nextItem.data = {
          ...nextItem.data,
          ...(Array.isArray(nextItem?.data?.gifts) ? { gifts: serializeGiftEntries(nextItem.data.gifts) } : {}),
          ...(Array.isArray(nextItem?.data?.rituals) ? { rituals: serializeRitualEntries(nextItem.data.rituals) } : {}),
        };
      }
      return nextItem;
    });
  }

  return normalizedData;
};

export const playerSheet = {
  xp: '0',
  advantagesAndFlaws: {
    flaws: [],
    advantages: [],
    talens: [],
    loresheets: [],
  },
  favorsAndBans: [],
  touchstones: [],
  harano: 0,
  hauglosk: 0,
  trybe: '',
  auspice: '',
  name: '',
  portraitUrl: '',
  glory: 0,
  honor: 0,
  wisdom: 0,
  health: [],
  rage: 0,
  willpower: [],
  gifts: [],
  rituals: [],
  form: 'Hominí­deo',
  background: '',
  notes: '',
  attributes: {
    strength: 1,
    dexterity: 1,
    stamina: 1,
    charisma: 1,
    manipulation: 1,
    composure: 1,
    intelligence: 1,
    wits: 1,
    resolve: 1,
  },
  skills: {
    type: '',
    athletics: { value: 0, specialty: '' },
    animalKen: { value: 0, specialty: '' },
    academics: { value: 0, specialty: '' },
    brawl: { value: 0, specialty: '' },
    etiquette: { value: 0, specialty: '' },
    awareness: { value: 0, specialty: '' },
    craft: { value: 0, specialty: '' },
    insight: { value: 0, specialty: '' },
    finance: { value: 0, specialty: '' },
    driving: { value: 0, specialty: '' },
    intimidation: { value: 0, specialty: '' },
    investigation: { value: 0, specialty: '' },
    firearms: { value: 0, specialty: '' },
    leadership: { value: 0, specialty: '' },
    medicine: { value: 0, specialty: '' },
    larceny: { value: 0, specialty: '' },
    performance: { value: 0, specialty: '' },
    occult: { value: 0, specialty: '' },
    melee: { value: 0, specialty: '' },
    persuasion: { value: 0, specialty: '' },
    politics: { value: 0, specialty: '' },
    stealth: { value: 0, specialty: '' },
    streetwise: { value: 0, specialty: '' },
    science: { value: 0, specialty: '' },
    survival: { value: 0, specialty: '' },
    subterfuge: { value: 0, specialty: '' },
    technology: { value: 0, specialty: '' },
  },
};

export const sheetStructure = (email: string, user: string, message: any) => {
  const sheet = {
    email: email,
    user: user,
    creationDate: message,
    data: {
      xp: '0',
      advantagesAndFlaws: {
        flaws: [],
        advantages: [],
        talens: [],
        loresheets: [],
      },
      favorsAndBans: [],
      touchstones: [],
      harano: 0,
      hauglosk: 0,
      trybe: '',
      auspice: '',
      name: '',
      portraitUrl: '',
      glory: 0,
      honor: 0,
      wisdom: 0,
      health: [],
      rage: 0,
      willpower: [],
      gifts: [],
      rituals: [],
      form: 'Hominí­deo',
      background: '',
      notes: '',
      attributes: {
        strength: 1,
        dexterity: 1,
        stamina: 1,
        charisma: 1,
        manipulation: 1,
        composure: 1,
        intelligence: 1,
        wits: 1,
        resolve: 1,
      },
      skills: {
        type: '',
        athletics: { value: 0, specialty: '' },
        animalKen: { value: 0, specialty: '' },
        academics: { value: 0, specialty: '' },
        brawl: { value: 0, specialty: '' },
        etiquette: { value: 0, specialty: '' },
        awareness: { value: 0, specialty: '' },
        craft: { value: 0, specialty: '' },
        insight: { value: 0, specialty: '' },
        finance: { value: 0, specialty: '' },
        driving: { value: 0, specialty: '' },
        intimidation: { value: 0, specialty: '' },
        investigation: { value: 0, specialty: '' },
        firearms: { value: 0, specialty: '' },
        leadership: { value: 0, specialty: '' },
        medicine: { value: 0, specialty: '' },
        larceny: { value: 0, specialty: '' },
        performance: { value: 0, specialty: '' },
        occult: { value: 0, specialty: '' },
        melee: { value: 0, specialty: '' },
        persuasion: { value: 0, specialty: '' },
        politics: { value: 0, specialty: '' },
        stealth: { value: 0, specialty: '' },
        streetwise: { value: 0, specialty: '' },
        science: { value: 0, specialty: '' },
        survival: { value: 0, specialty: '' },
        subterfuge: { value: 0, specialty: '' },
        technology: { value: 0, specialty: '' },
      },
    },
  };
  return sheet;
};

export const capitalizeFirstLetter = (str: string): String => {
  switch(str) {
    case 'global': return 'Dons Nativos';
    case 'silent striders': return 'Peregrinos Silenciosos';
    case 'black furies': return 'Fúrias Negras';
    case 'silver fangs': return 'Presas de Prata';
    case 'hart wardens': return 'Guardadores do Galhado';
    case 'ghost council': return 'Conselho dos Fantasmas';
    case 'galestalkers': return 'Espreitadores do Vento';
    case 'glass walkers': return 'Andarilhos do Asfalto';
    case 'bone gnawers': return 'Roedores de Ossos';
    case 'shadow lords': return 'Senhores das Sombras';
    case 'children of gaia': return 'Filhos de Gaia';
    case 'red talons': return 'Garras Vermelhas';
    default: return str?.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  }
};

export const translate = (str: string): string => {
  switch(str) {
    case 'honor': return 'Honra';
    case 'glory': return 'Glória';
    case 'wisdom': return 'Sabedoria';
    case 'strength': return 'Força';
    case 'dexterity': return 'Destreza';
    case 'stamina': return 'Vigor';
    case 'manipulation': return 'Manipulação';
    case 'charisma': return 'Carisma';
    case 'composure': return 'Autocontrole';
    case 'intelligence': return 'Inteligência';
    case 'wits': return 'Raciocínio';
    case 'resolve': return 'Determinação';
    case 'athletics': return 'Atletismo';
    case 'brawl': return 'Briga';
    case 'craft': return 'Ofícios';
    case 'driving': return 'Condução';
    case 'firearms': return 'Armas de Fogo';
    case 'larceny': return 'Ladroagem';
    case 'melee': return 'Armas Brancas';
    case 'stealth': return 'Furtividade';
    case 'survival': return 'Sobrevivência';
    case 'animalKen': return 'Empatia com Animais';
    case 'etiquette': return 'Etiqueta';
    case 'insight': return 'Sagacidade';
    case 'intimidation': return 'Intimidação';
    case 'leadership': return 'Liderança';
    case 'performance': return 'Performance';
    case 'persuasion': return 'Persuasão';
    case 'streetwise': return 'Manha';
    case 'subterfuge': return 'Subterfúgio';
    case 'academics': return 'Erudição';
    case 'awareness': return 'Percepção';
    case 'finance': return 'Finanças';
    case 'investigation': return 'Investigação';
    case 'medicine': return 'Medicina';
    case 'occult': return 'Ocultismo';
    case 'politics': return 'Política';
    case 'science': return 'Ciência';
    case 'technology': return 'Tecnologia';
    default: return str;
  }
}


