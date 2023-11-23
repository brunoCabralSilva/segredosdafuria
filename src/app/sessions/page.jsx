'use client'
import { collection, orderBy, limit, getFirestore, query, serverTimestamp, addDoc } from 'firebase/firestore';
import firestoreConfig from '../../firebase/connection';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { actionLogin, useSlice } from '@/redux/slice';
import { useRouter } from 'next/navigation';
import { verify } from '../../firebase/user';
import { jwtDecode } from 'jwt-decode';

export default function Chat() {
  const slice = useAppSelector(useSlice);
  const dispatch = useAppDispatch();
  const [text, setText] = useState('');
  const router = useRouter();
  const db = getFirestore(firestoreConfig);
  const messageRef = collection(db, "chatbot");
  const queryMessages = query(messageRef, orderBy("date"), limit(25));
  const [messages] = useCollectionData(queryMessages, { idField: "id" });
  const [showData, setShowData] = useState(true);

  useEffect(() => {
    setShowData(false);
    window.scrollTo(0, 0);
    const token = localStorage.getItem('Segredos Da Fúria');
    if (token) {
      try {
        const decodedToken = verify(JSON.parse(token));
        if (decodedToken) {
          setShowData(true);
          const { firstName, lastName, email } = jwtDecode(token);
          dispatch(actionLogin({ firstName, lastName, email }));
        }
        else {
          setShowData(false);
          dispatch(actionLogin({ firstName: '', lastName: '', email: '' }));
          router.push('/sessions/login');
        }
      } catch(error) {
        console.log(error);
        dispatch(actionLogin({ firstName: '', lastName: '', email: '' }));
        // router.push('/sessions/login');
        setShowData(true);
      }
    } else {
        setShowData(false);
        dispatch(actionLogin({ firstName: '', lastName: '', email: '' }));
        router.push('/sessions/login');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const typeText = (e) => {
    const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
    setText(sanitizedValue);
  };

  const sendMessage = async () => {
    const { user } = slice;
    if (text !== '' && text !== ' ') {
      await addDoc(
        messageRef,
        {
          message: text,
          user: user.firstName + ' ' + user.lastName,
          date: serverTimestamp(),
        }
      );
      setText('');
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    const messagesContainer = document.getElementById('messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  };

  return (
    showData && (
      <div className="h-screen overflow-y-auto">
        <div id="messages-container" className="h-90vh overflow-y-auto p-2">
          {messages && messages.map((msg, index) => (
            <div key={index} className="p-2 bg-gray-500 my-2">
              <div>
                {msg.user} {msg.date && msg.date.toDate().toLocaleString()}{' '}
              </div>
              <div>{msg.message}</div>
            </div>
          ))}
        </div>
        <div className="fixed bottom-0 w-full bg-black p-2 flex gap-3">
          <input
            type="text"
            className="w-9/12 p-2 text-black"
            value={text}
            onChange={(e) => typeText(e)}
          />
          <div className="grid grid-cols-4 w-3/12 gap-3">
            <button
              className="border border-white text-white h-full p-2"
              onClick={sendMessage}
            >
              Enviar
            </button>
            <button className="border border-white text-white h-full p-2">
              Dice
            </button>
            <button className="border border-white text-white h-full p-2">
              Ficha
            </button>
            <button
              className="border border-white text-white h-full p-2"
              onClick={ scrollToBottom }
            >
              Fim
            </button>
          </div>
        </div>
      </div>
    )
  );
}
