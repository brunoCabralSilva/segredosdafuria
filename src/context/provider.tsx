'use client'
import { ReactNode, useState } from 'react';
import contexto from './context';
import { playerSheet } from '@/firebase/utilities';
import { getPlayerByEmail } from '@/firebase/players';
import { authenticate } from '@/firebase/authenticate';

interface IProvider { children: ReactNode }

export default function Provider({children }: IProvider) {
  //user
  const [dataUser, setDataUser] = useState({ email: '', displayName: '' });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  //Gifts
  const [globalGifts, setGlobalGifts] = useState(false);
  const [totalRenown, setTotalRenown] = useState(0);
  const [textGift, setTextGift] = useState('');
  const [listOfGiftsSelected, setListOfGiftsSelected] = useState([]);
  const [textRitual, setTextRitual] = useState('');
  const [listOfRituals, setListOfRituais] = useState([]);
  const [textTalisman, setTextTalisman] = useState('');
  const [listOfTalismans, setListOfTalismans] = useState([]);
  const [listOfGift, setListOfGift] = useState([]);
  //pages
  const [showFeedback, setShowFeedback] = useState(false);
  //navigation
  const [logoutUser, setLogoutUser] = useState(false);
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
  const [showAllFlaws, setShowAllFlaws] = useState(false);
  const [showAllAdvantages, setShowAllAdvantages] = useState(false);
  const [showGiftsToAdd, setShowGiftsToAdd] = useState(false);
  const [showRitualsToAdd, setShowRitualsToAdd] = useState(false);
  const [showHarano, setShowHarano] = useState(false);
  const [showHauglosk, setShowHauglosk] = useState(false);
  const [showGiftRoll, setShowGiftRoll] = useState({ show: false, gift: {} });
  const [showRitualRoll, setShowRitualRoll] = useState({ show: false, ritual: {} });

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
        //pages
        showFeedback, setShowFeedback,
        //Gifts
        globalGifts, setGlobalGifts,
        totalRenown, setTotalRenown,
        textGift, setTextGift,
        listOfGiftsSelected, setListOfGiftsSelected,
        textRitual, setTextRitual,
        listOfRituals, setListOfRituais,
        textTalisman, setTextTalisman,
        listOfTalismans, setListOfTalismans,
        listOfGift, setListOfGift,
        //navigation
        logoutUser, setLogoutUser,
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
        showDelFromSession, setShowDelFromSession,
        showResetSheet, setShowResetSheet,
        deleteAdvOrFlaw, setDeleteAdvOrFlaw,
        showAllFlaws, setShowAllFlaws,
        showAllAdvantages, setShowAllAdvantages,
        showGiftsToAdd, setShowGiftsToAdd,
        showRitualsToAdd, setShowRitualsToAdd,
        showHarano, setShowHarano,
        showHauglosk, setShowHauglosk,
        showGiftRoll, setShowGiftRoll,
        showRitualRoll, setShowRitualRoll,
      }}
    >
      {children}
    </contexto.Provider>
  );
}