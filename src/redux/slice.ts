import { IAtribute, IFeedback, IList, IMessage, IType } from "../../interface";
import { PayloadAction, Slice, createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  selectTA: [],
  global: false,
  totalRenown: 0,
  simplify: false,
  user: { firstName: '', lastName: '', email: ''  },
  type: { show: false, talisman: '', gift: '', ritual: '' },
  list: { talisman: [], gift: [], ritual: [] },
  feedback: { show: false, title: '' },
  message: { type: '', show: false, text: '' },
  showRollDice: false,
  showSheet: false,
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
    athletics: 0,
    animalKen: 0,
    academics: 0,
    brawl: 0,
    etiquette: 0,
    awareness: 0,
    craft: 0,
    insight: 0,
    finance: 0,
    driving: 0,
    intimidation: 0,
    investigation: 0,
    firearms: 0,
    leadership: 0,
    medicine: 0,
    larceny: 0,
    performance: 0,
    occult: 0,
    melee: 0,
    persuasion: 0,
    politics: 0,
    stealth: 0,
    streetwise: 0,
    science: 0,
    survival: 0,
    subterfuge: 0,
    technology: 0,
  },
};

const slice: Slice = createSlice({
  name: 'segredosDaLua',
  initialState: INITIAL_STATE,
  reducers: {
    actionFeedback(state, { payload }: PayloadAction<IFeedback>) {
      return {
        ...state,
        feedback: {
          show: payload.show,
          title: payload.title,
        }
      };
    },
    actionFilterGift(state, { payload }: PayloadAction<string>) {
      if (payload === 'reset') {
        return {
          ...state,
          selectTA: [],
        };
      }
      if (state.selectTA.length === 0) {
        return {
          ...state,
          selectTA: [payload],
        };
      } 
      const listContains = state.selectTA.filter((element: string) => element === payload);
      if (listContains.length > 0) {
        const list = state.selectTA.filter((element: string) => element !== payload);
        return {
          ...state,
          selectTA: list,
        };
      } return {
        ...state,
        selectTA: [...state.selectTA, payload],
      }
    },
    actionTotalRenown(state, { payload }: PayloadAction<string>) {
      return {
        ...state,
        totalRenown: parseInt(payload),
      };
    },
    actionLogin(state, { payload }: PayloadAction<string>) {
      return {
        ...state,
        user: payload,
      };
    },
    actionSimplify(state, { payload }: PayloadAction<boolean>) {
      return {
        ...state,
        simplify: payload,
      };
    },
    actionGlobal(state, { payload }: PayloadAction<boolean>) {
      return {
        ...state,
        global: payload,
      };
    },
    actionType(state, { payload }: PayloadAction<IType>) {
      return { ...state, type: payload };
    },
    actionMessage(state, { payload }: PayloadAction<IMessage>) {
      return {
        ...state,
        message: {
          type: payload.type,
          show: payload.show,
          text: payload.text
        },
      };
    },
    actionList(state, { payload }: PayloadAction<IList>) {
      return { ...state, list: payload };
    },
    actionRollDice(state, { payload }: PayloadAction<IList>) {
      return { ...state, showRollDice: payload };
    },
    actionShowSheet(state, { payload }: PayloadAction<IList>) {
      return { ...state, showSheet: payload };
    },
    actionAttribute(state, { payload }: PayloadAction<IAtribute>) {
      return {
        ...state,
        attributes: {
          ...state.attributes,
          [payload.name]: payload.quant,
        },
      };
    },
  },
});

export default slice.reducer;

export const {
  actionFeedback,
  actionFilterGift,
  actionTotalRenown,
  actionSimplify,
  actionGlobal,
  actionType,
  actionClnSearchs,
  actionMessage,
  actionList,
  actionLogin,
  actionRollDice,
  actionShowSheet,
  actionAttribute,
} = slice.actions;

export const useSlice = (state: any) => {
  return state.slice;
};
