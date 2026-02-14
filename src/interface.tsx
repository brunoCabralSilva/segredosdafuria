export interface ITypeGift {
  type: string;
  totalRenown: number;
}

export interface ISessions {
  id: string;
  name: string;
  description: string;
  dm: string;
  creationDate: Date;
  anotations: string;
  chat: any[],
  image: string;
};

export interface ISession {
  anotations: string,
  creationDate: '',
  description: string,
  favorsAndBans: string[],
  gameMaster: string,
  nameMaster: string,
  id: string,
  imageName: string,
  name: string,
  players: string[],
  principles: { description: string, email: string, order: number }[],
}

export interface IItem {
  name: string;
  namePtBr: string;
  quant?: number;
}

export interface IAdOrFlaws {
  id: string;
  advantages?: {
    title: string,
    description: string,
    cost: number,
    type: string,
    font: string,
    page: string,
  }[];
  flaws?: {
    title: string,
    description: string,
    cost: number,
    type: string,
    font: string,
    page: string,
  }[];
  name: string;
  type: string;
  description: string;
}

export interface IAdvantageAndFlaw {
  advantage?: string;
  flaw?: string;
  value: number;
  name: string;
  type: string;
  item: string;
}

export interface IGift {
  id: string;
  gift: string;
  giftPtBr: string;
  belonging: ITypeGift[];
  description: string;
  descriptionPtBr: string;
  renown: string;
  cost: string;
  action: string;
  pool: string;
  system: string;
  systemPtBr: string;
  duration: string;
  book: string;
  page: number;
}

interface IBelonging {
  type: string;
  totalRenown: number;
}

export interface IRitual {
  id: string;
  titlePtBr: String;
  title: string;
  type: String;
  descriptionPtBr: String;
  description: String;
  pool: String;
  systemPtBr: String;
  system: String;
  book: String;
  page: number;
}

export interface ITalisman {
  id: string;
  title :string;
  titlePtBr :String;
  description :String;
  descriptionPtBr :String;
  system :String;
  systemPtBr :String;
  backgroundCost :String;
  backgroundCostPtBr :String;
  book: String;
  page: number;
}

export interface IAuspice {
  name: string;
  phrase: string;
  description: String[];
}

export interface IForm {
  name: string;
  subtitle: String;
  description: String;
  cost: String;
  skills: String;
  list: String[];
}

export interface ILoresheet {
  id: number,
  custom?: boolean,
  titlePtBr: String,
  title: string,
  descriptionPtBr: String,
  description: String,
  habilities: IHabilities[];
  book: String,
  page: number
}

export interface IHabilities {
  skill: String;
  skillPtBr: String;
}

export interface IProps {
  valorRenown: number;
  selectedTrybe: string[];
}

export interface IFeedback {
  show: boolean,
  title: String,
}

export interface IMessage {
  type: String;
  show?: boolean;
  text?: String;
  rollDices: IGenerateDataRolls;
  msn: IMsn;
}

export interface IType {
  text: String;
  type: String;
}

export interface IList {
  type: String;
  items: IGift[] | ITalisman[] | IRitual[];
}

export interface IArchetypes {
  title: String;
  description: String;
}

export interface ITrybe {
  namePtBr: String;
  nameEn: string;
  phrase: String;
  description: String[];
  whoAre: String[];
  patron: String;
  favor: String;
  ban: String;
  archetypes: IArchetypes[];
  alternativeTitle: string;
  alternativePhrases: string[];
  alternativeDescription: string[];
  alternativeCustoms: string[];
  alternativeIdeology: string[];
  alternativeAuspices: {
    ragabash: string[],
    theurge: string[],
    phillodox: string[],
    galliard: string[],
    ahroun: string[]
  }
};

export interface IAtribute {
  name: string,
  namePtBr: string,
  quant: number,
};

export interface IMsn {
  rollOfRage: number[],
  rollOfMargin: number[],
  dificulty: number[],
  cause?: String;
  success?: number;
  date: any;
  rage?: number; 
}

export interface IGenerateDataRolls {
  falhaBrutal: boolean,
  success: number,
  fail: number,
  brutal: number,
  critical: number,
  sucessosParaDano: number,
  paresBrutais: number,
  paresCriticals: number,
}

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

export interface IDataValues {
  renown: number,
  rage: number,
  skill: number,
  attribute: number,
};