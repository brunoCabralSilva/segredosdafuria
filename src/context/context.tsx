'use client'
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
}

const contexto = createContext(initialValue);
export default contexto;