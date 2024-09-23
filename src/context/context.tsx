'use client'
import { playerSheet } from '@/firebase/utilities';
import { createContext } from 'react';

interface RecipesContext {
  //users
  dataUser: { email: string, displayName: string },
  setDataUser: (state: { email: string, displayName: string }) => void,
  showForgotPassword: boolean,
  setShowForgotPassword: (state: boolean) => void,
  //navigation
  logoutUser: boolean,
  setLogoutUser: (state: boolean) => void,
  //Gifts
  globalGifts: boolean,
  setGlobalGifts: (state: boolean) => void,
  totalRenown: number,
  setTotalRenown: (state: number) => void,
  textGift: string,
  setTextGift: (state: string) => void,
  listOfGiftsSelected: any,
  setListOfGiftsSelected: (state: any) => void,
  textRitual: string,
  setTextRitual: (state: string) => void,
  listOfRituals: any,
  setListOfRituais: (state: any) => void,
  textTalisman: string,
  setTextTalisman: (state: string) => void,
  listOfTalismans: any,
  setListOfTalismans: (state: any) => void,
  listOfGift: any,
  setListOfGift: (state: any) => void,
  //pages
  showFeedback: boolean,
  setShowFeedback: (state: boolean) => void,
  showMessage: { show: boolean, text: string },
  setShowMessage: (state: { show: boolean, text: string }) => void,
  //sessions
  sessionId: string,
  setSessionId: (state: string) => void,
  dataSession: { show: boolean, id: string },
  setDataSession: (state: { show: boolean, id: string }) => void,
  showInfoSessions: boolean,
  setShowInfoSessions: (state: boolean) => void,
  showCreateSession: boolean,
  setShowCreateSession: (state: boolean) => void,
  //Session Bar
  showOptions: boolean,
  setShowOptions: (state: boolean) => void,
  showMenuSession: string,
  setShowMenuSession: (state: string) => void,
  scrollToBottom: () => void,
  showDeleteHistoric: boolean,
  setShowDeleteHistoric: (state: boolean) => void,
  //notifications
  listNotification: any[];
  setListNotification: (state: any[]) => void,
  //sheet
  showResetSheet: boolean,
  setShowResetSheet: (state: boolean) => void,
  showDelFromSession: boolean,
  setShowDelFromSession: (state: boolean) => void,
  email: string,
  setEmail: (state: string) => void,
  name: string,
  setName: (state: string) => void,
  dataSheet: any,
  setDataSheet: (state: any) => void,
  returnSheetValues: () => void,
  deleteAdvOrFlaw: any,
  setDeleteAdvOrFlaw: (state: any) => void,
  showAllFlaws: boolean,
  setShowAllFlaws: (state: boolean) => void,
  showAllAdvantages: boolean,
  setShowAllAdvantages: (state: boolean) => void,
  showGiftsToAdd: boolean,
  setShowGiftsToAdd: (state: boolean) => void,
  showRitualsToAdd: boolean,
  setShowRitualsToAdd: (state: boolean) => void,
  showHarano: boolean,
  setShowHarano: (state: boolean) => void,
  showHauglosk: boolean,
  setShowHauglosk: (state: boolean) => void,
  showGiftRoll: { show: boolean, gift: any },
  setShowGiftRoll: (state: { show: boolean, gift: any }) => void,
  showRitualRoll: { show: boolean, ritual: any },
  setShowRitualRoll: (state: { show: boolean, ritual: any }) => void,
  resetPopups: () => void,
  //gameMaster
  session: any,
  setSession: (state: any) => void,
  showChangeGameMaster: { show: boolean, data: any },
  setShowChangeGameMaster: (state: { show: boolean, data: any }) => void,
  showDelGMFromSession: boolean,
  setShowDelGMFromSession: (state: boolean) => void,
  players: any,
  setPlayers: (state: any) => void,
  returnSessionValues: () => void,
  viewPlayer: { show: boolean, data: any },
  setViewPlayer: (state: any) => void,
  returnDataPlayer: (email: string, id: string, type: string | null) => void,
}

const initialValue: RecipesContext = {
  //users
  dataUser: { email: '', displayName: '' },
  setDataUser: () => {},
  showForgotPassword: false,
  setShowForgotPassword: () => {},
  //navigation
  logoutUser: false,
  setLogoutUser: () => {},
  //Gifts
  globalGifts: false,
  setGlobalGifts: () => {},
  totalRenown: 1,
  setTotalRenown: () => {},
  textGift: '',
  setTextGift: () => {},
  listOfGiftsSelected: [],
  setListOfGiftsSelected: () => {},
  textRitual: '',
  setTextRitual: () => {},
  listOfRituals: [],
  setListOfRituais: () => {},
  textTalisman: '',
  setTextTalisman: () => {},
  listOfTalismans: [],
  setListOfTalismans: () => {},
  listOfGift: [],
  setListOfGift: () => {},
  //pages
  showFeedback: false,
  setShowFeedback: () => {},
  showMessage: { show: false, text: '' },
  setShowMessage: () => {},
  //sessions
  sessionId: '',
  setSessionId: () => {},
  dataSession: { show: false, id: '' },
  setDataSession: () => {},
  showInfoSessions: false,
  setShowInfoSessions: () => {},
  showCreateSession: false,
  setShowCreateSession: () => {},
  //Session Bar
  showOptions: false,
  setShowOptions: () => {},
  showMenuSession: '',
  setShowMenuSession: () => {},
  scrollToBottom: () => {},
  showDeleteHistoric: false,
  setShowDeleteHistoric: () => {},
  //notifications
  listNotification: [],
  setListNotification: () => {},
  //sheet
  showResetSheet: false,
  setShowResetSheet: () => {},
  showDelFromSession: false,
  setShowDelFromSession: () => {},
  email: '',
  setEmail: () => {},
  name: '',
  setName: () => {},
  dataSheet: playerSheet,
  setDataSheet: () => {},
  returnSheetValues: () => {},
  deleteAdvOrFlaw: { show: false},
  setDeleteAdvOrFlaw: () => {},
  showAllFlaws: false,
  setShowAllFlaws: () => {},
  showAllAdvantages: false,
  setShowAllAdvantages: () => {},
  showGiftsToAdd: false,
  setShowGiftsToAdd: () => {},
  showRitualsToAdd: false,
  setShowRitualsToAdd: () => {},
  showHarano: false,
  setShowHarano: () => {},
  showHauglosk: false,
  setShowHauglosk: () => {},
  showGiftRoll: { show: false, gift: {} },
  setShowGiftRoll: () => {},
  showRitualRoll: { show: false, ritual: {} },
  setShowRitualRoll: () => {},
  resetPopups: () => {},
  //gameMaster
  session: {},
  setSession: () => {},
  showChangeGameMaster: { show: false, data: {} },
  setShowChangeGameMaster: () => {},
  showDelGMFromSession: false,
  setShowDelGMFromSession: () => {},
  players: [],
  setPlayers: () => {},
  returnSessionValues: () => {},
  viewPlayer: { show: false, data: {} },
  setViewPlayer: () => {},
  returnDataPlayer: () => {},
}

const contexto = createContext(initialValue);
export default contexto;