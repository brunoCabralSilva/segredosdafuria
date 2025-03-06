'use client'
import { ReactNode, useState } from 'react';
import contexto from './context';
import { playerSheet } from '@/firebase/utilities';

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
  const [showMessage, setShowMessage] = useState({ show: false, text: '' });
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
  const [showDeleteHistoric, setShowDeleteHistoric] = useState(false);
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
  const [addTouchstone, setAddTouchstone] = useState({show: false, data: {}});
  const [showDeleteTouchstone, setShowDeleteTouchstone] = useState({ show: false, name: '' });
  const [addPrinciple, setAddPrinciple] = useState({show: false, data: {}});
  const [showDeletePrinciple, setShowDeletePrinciple] = useState({ show: false, name: '' });
  const [addFavorAndBan, setAddFavorAndBan] = useState({show: false, data: {}, type: ''});
  const [showDeleteFavorAndBan, setShowDeleteFavorAndBan] = useState({ show: false, name: '', type: '' });
  const [showEvaluateSheet, setShowEvaluateSheet] = useState({ show: false, data: '' });
  const [showDownloadPdf, setShowDownloadPdf] = useState({ show: false, email: '' });
  const [showRelationship, setShowRelationship] = useState(false);
  const [sheetId, setSheetId] = useState('');
  //gameMaster
  const [showChangeGameMaster, setShowChangeGameMaster] = useState({ show: false, data: {} });
  const [showDelGMFromSession, setShowDelGMFromSession] = useState(false);
  const [session, setSession] = useState({});
  const [players, setPlayers] = useState([]);
  const [showPlayer, setShowPlayer] = useState({ show: false, email: {} });
  const [showCreateSheet, setShowCreateSheet] = useState(false);
  const [showResetPlayer, setShowResetPlayer] = useState({ show: false, email: '' });
  const [showRemovePlayer, setShowRemovePlayer] = useState({ show: false, email: '' });

  const scrollToBottom = () => {
    const messagesContainer = document.getElementById('messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };

  const resetPopups = () => {
    setShowForgotPassword(false);
    setShowFeedback(false);
    setLogoutUser(false);
    setDataSession({ show: false, id: '' });
    setShowInfoSessions(false);
    setShowCreateSession(false);
    setShowOptions(false);
    setShowMenuSession('');
    setShowDelFromSession(false);
    setShowDelGMFromSession(false);
    setShowResetSheet(false);
    setDeleteAdvOrFlaw({ show: false });
    setShowAllFlaws(false);
    setShowAllAdvantages(false);
    setShowGiftsToAdd(false);
    setShowRitualsToAdd(false);
    setShowHarano(false);
    setShowHauglosk(false);
    setShowGiftRoll({ show: false, gift: {} });
    setShowRitualRoll({ show: false, ritual: {} });
    setShowChangeGameMaster({ show: false, data: {} });
    setShowPlayer({ show: false, email: {} });
    setShowCreateSheet(false);
    setShowResetPlayer({ show: false, email: '' });
    setShowRemovePlayer({ show: false, email: '' });
    setAddTouchstone({ show: false, data: {} });
    setShowDeleteTouchstone({ show: false, name: '' });
    setShowEvaluateSheet({show: false, data: '' });
    setShowDownloadPdf({ show: false, email: '' });
    setAddPrinciple({show: false, data: {}});
    setShowDeletePrinciple({ show: false, name: '' });
    setAddFavorAndBan({show: false, data: {}, type: ''});
    setShowDeleteFavorAndBan({ show: false, name: '', type: '' });
  }

  return (
    <contexto.Provider
      value={{
        //user
        dataUser, setDataUser,
        showForgotPassword, setShowForgotPassword,
        //pages
        showFeedback, setShowFeedback,
        showMessage, setShowMessage,
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
        showDeleteHistoric, setShowDeleteHistoric,
        //notification
        listNotification,
        setListNotification,
        //sheet
        email, setEmail,
        name, setName,
        dataSheet, setDataSheet,
        resetPopups,
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
        addTouchstone, setAddTouchstone,
        showDeleteTouchstone, setShowDeleteTouchstone,
        showEvaluateSheet, setShowEvaluateSheet,
        showDownloadPdf, setShowDownloadPdf,
        addPrinciple, setAddPrinciple,
        showDeletePrinciple, setShowDeletePrinciple,
        addFavorAndBan, setAddFavorAndBan,
        showDeleteFavorAndBan, setShowDeleteFavorAndBan,
        showRelationship, setShowRelationship,
        sheetId, setSheetId,
        //gameMaster
        showChangeGameMaster, setShowChangeGameMaster,
        showDelGMFromSession, setShowDelGMFromSession,
        showPlayer, setShowPlayer,
        session, setSession,
        players, setPlayers,
        showCreateSheet, setShowCreateSheet,
        showResetPlayer, setShowResetPlayer,
        showRemovePlayer, setShowRemovePlayer,
      }}
    >
      {children}
    </contexto.Provider>
  );
}

