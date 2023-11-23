import { IFeedback, IList, IMessage, IType } from "../../interface";
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
} = slice.actions;

export const useSlice = (state: any) => {
  return state.slice;
};
