import { IFeedback } from "@/interfaces/Gift";
import { PayloadAction, Slice, createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  feedback: { show: false, message: '' },
  giftMessage: { show: false, message: '' },
  filteredList: [],
  ritualList: [],
  selectTA: [],
  totalRenown: 0,
  simplify: false,
  global: false,
  searchByText: '',
  searchRitual: '',
  auspices: ['Ragabash', 'Theurge', 'Philodox', 'Galliard', 'Ahroun'],
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
    actionGlobal(state, { payload }: PayloadAction<boolean>) {
      return {
        ...state,
        global: payload,
      };
    },
    actionSearchByText(state, { payload }: PayloadAction<boolean>) {
      return {
        ...state,
        searchByText: payload,
      };
    },
    actionRitual(state, { payload }: PayloadAction<boolean>) {
      return {
        ...state,
        searchRitual: payload,
      };
    },
    actionRitualList(state, { payload }: PayloadAction<boolean>) {
      return {
        ...state,
        ritualList: payload,
      };
    },
    actionGiftMessage(state, { payload }: PayloadAction<boolean>) {
      return {
        ...state,
        giftMessage: payload,
      };
    },
    actionFilteredList(state, { payload }: PayloadAction<boolean>) {
      return {
        ...state,
        filteredList: payload,
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
  actionSearchByText,
  actionGiftMessage,
  actionFilteredList,
  actionRitual,
  actionRitualList,
} = slice.actions;

export const useSlice = (state: any) => {
  return state.slice;
};
