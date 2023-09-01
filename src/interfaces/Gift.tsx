export interface ITypeGift {
  type: string;
  totalRenown: number;
}

export interface IGift {
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

export interface IProps {
  valorRenown: number;
  selectedTrybe: string[];
}

export interface IFeedback {
  show: boolean;
  message: string;
}