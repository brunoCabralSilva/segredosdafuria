'use client'
import { playerSheet } from '@/new/firebase/utilities';
import { createContext } from 'react';

interface RecipesContext {
  //users
  dataUser: { email: string, displayName: string },
  setDataUser: (state: { email: string, displayName: string }) => void,
  showForgotPassword: boolean,
  setShowForgotPassword: (state: boolean) => void,
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
}

const initialValue: RecipesContext = {
  //users
  dataUser: { email: '', displayName: '' },
  setDataUser: () => {},
  showForgotPassword: false,
  setShowForgotPassword: () => {},
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
}

const contexto = createContext(initialValue);
export default contexto;