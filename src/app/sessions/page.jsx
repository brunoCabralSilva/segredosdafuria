'use client'
import { collection, orderBy, limit, getFirestore, query, serverTimestamp, addDoc } from 'firebase/firestore';
import firestoreConfig from '../../firebase/connection';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useState } from 'react';

export default function Chat() {
  const [text, setText] = useState('');
  const db = getFirestore(firestoreConfig);
  const messageRef = collection(db, "chatbot");
  const queryMessages = query(messageRef, orderBy("date"), limit(25));
  const [messages] = useCollectionData(queryMessages, { idField: "id" });
  const [showData, setShowData] = useState(true);

  const typeText = (e) => {
    const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
    setText(sanitizedValue);
  };

  const sendMessage = async () => {
    if (text.trim() !== '') {
      await addDoc(
        messageRef,
        {
          message: text,
          user: "bruno",
          date: serverTimestamp()
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
            className="w-9/12 p-2"
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
