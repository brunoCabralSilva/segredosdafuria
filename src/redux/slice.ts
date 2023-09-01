import { IFeedback } from "@/interfaces/Gift";
import { PayloadAction, Slice, createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  feedback: {
    show: false,
    message: '',
  },
  selectTA: [],
  totalRenown: 0,
  simplify: false,
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
          message: payload.message,
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
    actionSimplify(state, { payload }: PayloadAction<boolean>) {
      return {
        ...state,
        simplify: payload,
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
} = slice.actions;

export const useSlice = (state: any) => {
  return state.slice;
};
