import { PayloadAction, Slice, createSlice } from "@reduxjs/toolkit";

interface IFeedback {
  show: boolean;
  message: string;
}

const INITIAL_STATE = {
  feedback: {
    show: false,
    message: '',
  }
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
  },
});

export default slice.reducer;

export const {
  actionFeedback,
} = slice.actions;

export const useSlice = (state: any) => {
  return state.slice;
};
