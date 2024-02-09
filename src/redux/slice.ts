import { IAtribute, IFeedback, IList, IMessage, IType } from "../interface";
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
  showMenuSession: '',
  sessionAuth: { show: false, id: '' },
  loginInTheSession: { name: '', logged: false },
  form: '',
  popupDeleteSession: false,
  popupDeleteUserFromSession: false,
  popupDeletePlayer: { show: false, player: {} },
  popupResetSheet: false,
  popupGift: { show: false, gift: {} },
  popupRitual: { show: false, ritual: {} },
  popupInfo: false,
  deleteHistoric: false,
  logoutUser: false,
  popupDelAdv: {show: false, name: '', desc: '', type: ''},
  sumOfAdv: { advantageSum: 0, flawSum: 0 },
  showAdvantage: { show: false, item: {} },
  showPopupGiftRoll: { show: false, gift: { session: '', data: '' } },
  popupCreateSheet: false,
  advantagesAndFlaws: [
    { name: "Caern", advantages: [], flaws: [] },
    { name: "Trabalho Diário", advantages: [], flaws: [] },
    { name: "Linguística", advantages: [], flaws: [] },
    { name: "Aparência", advantages: [], flaws: [] },
    { name: "Refúgio Seguro", advantages: [], flaws: [] },
    { name: "Situações Sobrenaturais", advantages: [], flaws: [] },
    { name: "Aliados - Efetividade", advantages: [], flaws: [] },
    { name: "Aliados - Confiabilidade", advantages: [], flaws: [] },
    { name: "Contatos", advantages: [], flaws: [] },
    { name: "Fama", advantages: [], flaws: [] },
    { name: "Máscara", advantages: [], flaws: [] },
    { name: "Mentor", advantages: [], flaws: [] },
    { name: "Recursos", advantages: [], flaws: [] },
    { name: "Pacto Espiritual", advantages: [], flaws: [] },
  ],
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
    actionShowMenuSession(state, { payload }: PayloadAction<IList>) {
      return { ...state, showMenuSession: payload };
    },
    actionForm(state, { payload }: PayloadAction<IList>) {
      return { ...state, form: payload };
    },
    actionSessionAuth(state, { payload }: PayloadAction<IList>) {
      return { ...state, sessionAuth: payload };
    },
    actionLoginInTheSession(state, { payload }: PayloadAction<IList>) {
      return { ...state, loginInTheSession: payload };
    },
    actionDeleteSession(state, { payload }: PayloadAction<IList>) {
      return { ...state, popupDeleteSession: payload };
    },
    actionDeletePlayer(state, { payload }: PayloadAction<IList>) {
      return { ...state, popupDeletePlayer: payload };
    },
    actionResetSheet(state, { payload }: PayloadAction<IList>) {
      return { ...state, popupResetSheet: payload };
    },
    actionPopupGift(state, { payload }: PayloadAction<IList>) {
      return { ...state, popupGift: payload };
    },
    actionPopupRitual(state, { payload }: PayloadAction<IList>) {
      return { ...state, popupRitual: payload };
    },
    actionDelHistoric(state, { payload }: PayloadAction<IList>) {
      return { ...state, deleteHistoric: payload };
    },
    actionUpdateAdvantage(state, { payload }: PayloadAction<IList>) {
      return { ...state, advantagesAndFlaws: payload };
    },
    actionLogoutUser(state, { payload }: PayloadAction<IList>) {
      return { ...state, logoutUser: payload };
    },
    actionPopupDelAdv(state, { payload }: PayloadAction<IList>) {
      return { ...state, popupDelAdv: payload };
    },
    actionSumOfAdv(state, { payload }: PayloadAction<IList>) {
      return { ...state, sumOfAdv: payload };
    },
    actionShowAdvantage(state, { payload }: PayloadAction<IList>) {
      return { ...state, showAdvantage: payload };
    },
    actionDeleteUserFromSession(state, { payload }: PayloadAction<IList>) {
      return { ...state, popupDeleteUserFromSession: payload };
    },
    actionInfoSessions(state, { payload }: PayloadAction<IList>) {
      return { ...state, popupInfo: payload };
    },
    actionPopupGiftRoll(state, { payload }: PayloadAction<IList>) {
      return { ...state, showPopupGiftRoll: payload };
    },
    actionPopupCreateSheet(state, { payload }: PayloadAction<IList>) {
      return { ...state, popupCreateSheet: payload };
    },
  },
});

export default slice.reducer;

export const {
  actionInfoSessions,
  actionDeleteUserFromSession,
  actionShowAdvantage,
  actionSumOfAdv,
  actionPopupDelAdv,
  actionLogoutUser,
  actionUpdateAdvantage,
  actionDeleteSession,
  actionDelHistoric,
  actionPopupGift,
  actionPopupRitual,
  actionDeletePlayer,
  actionResetSheet,
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
  actionShowMenuSession,
  actionForm,
  actionRegisterSession,
  actionSessionAuth,
  actionLoginInTheSession,
  actionPopupGiftRoll,
  actionPopupCreateSheet,
} = slice.actions;

export const useSlice = (state: any) => {
  return state.slice;
};
