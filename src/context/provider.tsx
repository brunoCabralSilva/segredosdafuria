'use client'
import { ReactNode, useState } from 'react';
import contexto from './context';
import { playerSheet } from '@/new/firebase/utilities';
import { getPlayerByEmail } from '@/new/firebase/players';
import { authenticate } from '@/new/firebase/authenticate';

interface IProvider { children: ReactNode }

export default function Provider({children }: IProvider) {
  //user
  const [dataUser, setDataUser] = useState({ email: '', displayName: '' });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  //sessions
  const [sessionId, setSessionId] = useState('');
  const [dataSession, setDataSession] = useState({ show: false, id: '' });
  const [showInfoSessions, setShowInfoSessions] = useState(false);
  const [showCreateSession, setShowCreateSession] = useState(false);
  //session bar
  const [showOptions, setShowOptions] = useState(false);
  const [showMenuSession, setShowMenuSession] = useState('');
  //notification
  const [listNotification, setListNotification] = useState([0]);
  //sheet
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [dataSheet, setDataSheet] = useState(playerSheet);
  const [showDelFromSession, setShowDelFromSession] = useState(false);
  const [showResetSheet, setShowResetSheet] = useState(false);
  const [deleteAdvOrFlaw, setDeleteAdvOrFlaw] = useState({ show: false });

  const scrollToBottom = () => {
    const messagesContainer = document.getElementById('messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };

  const returnSheetValues = async (): Promise<void> => {
		const auth: any = await authenticate();
		if (auth && auth.email && auth.displayName) {
			setEmail(auth.email);
      setName(auth.displayName);
			const player = await getPlayerByEmail(sessionId, auth.email);
			if (player) setDataSheet(player.data);
			else window.alert('Jogador não encontrado! Por favor, atualize a página e tente novamente');
		}
  };

  return (
    <contexto.Provider
      value={{
        //user
        dataUser, setDataUser,
        showForgotPassword, setShowForgotPassword,
        //session
        sessionId, setSessionId,
        dataSession, setDataSession,
        showInfoSessions, setShowInfoSessions,
        showCreateSession, setShowCreateSession,
        //session bar
        showOptions, setShowOptions,
        showMenuSession, setShowMenuSession,
        scrollToBottom,
        //notification
        listNotification,
        setListNotification,
        //sheet
        email, setEmail,
        name, setName,
        dataSheet, setDataSheet,
        returnSheetValues,
        showDelFromSession,
        setShowDelFromSession,
        showResetSheet,
        setShowResetSheet,
        deleteAdvOrFlaw,
        setDeleteAdvOrFlaw,
      }}
    >
      {children}
    </contexto.Provider>
  );
}