'use client'
import { collection, orderBy, limit, getFirestore, query, serverTimestamp, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import firestoreConfig from '../../firebase/connection';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { actionLogin, useSlice } from '@/redux/slice';
import { useRouter } from 'next/navigation';
import { verify } from '../../firebase/user';
import { jwtDecode } from 'jwt-decode';
import { FaDiceD20 } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { FaFile } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";
import { FaEraser } from "react-icons/fa";
import firebaseConfig from '../../firebase/connection';
import Nav from '@/components/nav';

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
          const { firstName, lastName, email, role } = jwtDecode(token);
          dispatch(actionLogin({ firstName, lastName, email, role }));
        }
        else {
          setShowData(false);
          dispatch(actionLogin({ firstName: '', lastName: '', email: '', role: '' }));
          router.push('/sessions/login');
        }
      } catch(error) {
        console.log(error);
        dispatch(actionLogin({ firstName: '', lastName: '', email: '', role: '' }));
        // router.push('/sessions/login');
        setShowData(true);
      }
    } else {
        setShowData(false);
        dispatch(actionLogin({ firstName: '', lastName: '', email: '', role: '' }));
        router.push('/sessions/login');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const typeText = (e) => {
    const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
    setText(sanitizedValue);
  };

  const clearMessages = async () => {
    const db = getFirestore(firebaseConfig);
    const messagesRef = collection(db, 'chatbot');
    try {
      const querySnapshot = await getDocs(messagesRef);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
    } catch (error) {
      window.alert('Erro ao remover dados da coleção:', error);
    }
  };

  const sendMessage = async () => {
    const { user } = slice;
    if (text !== '' && text !== ' ') {
      await addDoc(
        messageRef,
        {
          message: text,
          user: user.firstName + ' ' + user.lastName,
          email: user.email,
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
      <div className="h-screen overflow-y-auto bg-ritual">
        <Nav />
        <div id="messages-container" className="h-90vh overflow-y-auto p-2">
          {
            messages && messages.map((msg, index) => {
              const token = localStorage.getItem('Segredos Da Fúria');
              const decode = jwtDecode(token);
              if (token && decode.email === msg.email) {
                return(
                  <div key={index} className="w-full flex justify-end  text-black">
                    <div  className="rounded-xl w-1/2 p-2 bg-green-400 my-2">
                      <div>{msg.message}</div>
                      <div className="flex justify-end pt-2">
                        <span>
                          {msg.date && msg.date.toDate().toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ) 
              }
              return (
                <div key={index} className="rounded-xl w-1/2 p-2 bg-blue-400 my-2 text-black">
                  <div className="font-bold mb-2">
                    {msg.user}
                  </div>
                  <div>{msg.message}</div>
                  <div className="flex justify-end pt-2">
                    <span>
                      {msg.date && msg.date.toDate().toLocaleString()}
                    </span>
                  </div>
                </div>
              )
            })
          }
        </div>
        <div className="fixed bottom-0 w-full bg-black p-2 flex gap-3 items-center">
          <input
            type="text"
            className="w-full p-2 text-black"
            value={text}
            onChange={(e) => typeText(e)}
          />
          <div className={`w-3/12 gap-3 grid ${slice.user.role === 'admin' ? 'grid-cols-5': 'grid-cols-4'}`}>
            <div className="flex justify-center">
              <button
                className="border border-white text-white rounded-full p-2 hover:text-black hover:bg-white transition-colors"
                title="Enviar uma mensagem"
                onClick={sendMessage}
              >
                <IoIosSend />
              </button>
            </div>
            <div className="flex justify-center">
              <button
                className="border border-white text-white rounded-full p-2 hover:text-black hover:bg-white transition-colors"
                title="Realizar um teste com dados"
              >
                <FaDiceD20 />
              </button>
            </div>
            <div className="flex justify-center">
              <button
                className="border border-white text-white rounded-full p-2 hover:text-black hover:bg-white transition-colors"
                title="Acessar a sua ficha"
              >
                <FaFile />
              </button>
            </div>
            <div className="flex justify-center">
              <button
                className="border border-white text-white rounded-full p-2 hover:text-black hover:bg-white transition-colors"
                onClick={ scrollToBottom }
                title="Ir para a mensagem mais recente"
              >
                <FaArrowDown />
              </button>
            </div>
            { 
              slice.user.role === 'admin'&&
                <div className="flex justify-center">
                  <button
                    className="border border-white text-white rounded-full p-2 hover:text-black hover:bg-white transition-colors"
                    title="Apagar o histórico de conversas"
                    onClick={clearMessages}
                  >
                    <FaEraser />
                  </button>
                </div>
            }
          </div>
        </div>
      </div>
    )
  );
}
