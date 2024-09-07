import React, { useContext, useEffect, useState } from 'react';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import General from '../master/general';
import Notifications from '../master/notifications';
import Players from '../master/players';
import Anotations from '../master/anotations';
import { collection, query, where, getFirestore } from 'firebase/firestore';
import firebaseConfig from '@/new/firebase/connection';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import contexto from '@/context/context';

export default function MenuGameMaster() {
  const [optionSelect, setOptionSelect] = useState('general');
  const { sessionId, setShowMenuSession, listNotification, setListNotification } = useContext(contexto);
  
  const db = getFirestore(firebaseConfig);
  const sessionRef = collection(db, 'notifications');
  const querySession = query(sessionRef, where('sessionId', '==', sessionId));
  const [notifications] = useCollectionData(querySession, { idField: 'id' } as any);

  useEffect(() => {
    if (notifications) {
      const allLists = notifications.flatMap(notification => notification.list || []);
      setListNotification(allLists);
    }
  }, [notifications, setListNotification]);

  return (
    <div className="bg-gray-whats-dark overflow-y-auto flex flex-col items-center justify-start h-screen px-4">
      <div className="w-full flex justify-end my-3">
        <IoIosCloseCircleOutline
          className="text-4xl text-white cursor-pointer mb-2"
          onClick={() => setShowMenuSession('')}
        />
      </div>
      <select
        onChange={(e) => setOptionSelect(e.target.value)}
        className="w-full mb-2 border border-white p-3 cursor-pointer bg-black text-white flex items-center justify-center font-bold text-center"
      >
        <option value={'general'}>Geral</option>
        <option value={'notifications'}>
          Notificações {listNotification && listNotification.length > 0 && `(${listNotification.length})`}
        </option>
        <option value={'players'}>Personagens</option>
        <option value={'anotations'}>Anotações</option>
      </select>
      {optionSelect === 'general' && <General />}
      {optionSelect === 'notifications' && <Notifications />}
      {optionSelect === 'players' && <Players />}
      {optionSelect === 'anotations' && <Anotations />}
    </div>
  );
}
