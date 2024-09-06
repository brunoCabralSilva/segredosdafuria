'use client'
import { ReactNode, useState } from 'react';
import contexto from './context';
// import { getAllVideos } from '@/firebase/video';
// import { categories } from '@/categories';
// import { getChatsByEmail } from '@/firebase/chat';
// import { getNotificationsByEmail } from '@/firebase/notifications';
// import { getUserByEmail } from '@/firebase/user';

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

  const scrollToBottom = () => {
    const messagesContainer = document.getElementById('messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
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
      }}
    >
      {children}
    </contexto.Provider>
  );
}