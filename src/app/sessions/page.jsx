'use client'
import { collection, orderBy, limit, getFirestore, query, serverTimestamp, addDoc } from 'firebase/firestore';
import firestoreConfig from '../../firebase/connection';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useState } from 'react';

export default function Chat() {
  const [text, setText] = useState('');

  const ChatRoom = () => {
    const db = getFirestore(firestoreConfig);
    const messageRef = collection(db, "chatbot");
    const queryMessages = query(messageRef, orderBy("date"), limit(25));
    const [messages] = useCollectionData(queryMessages, { idField: "id" });

    const sendMessage = async (e) => {
      e.preventDefault();
      await addDoc(
        messageRef,
        {
          message: text,
          user:"bruno",
          date: serverTimestamp()
        }
      );
      setText('');
    };

    return (
      <div>
        <div>
          {messages && messages.map((msg, index) => <ChatMessage key={index} message={ msg }/>)}
        </div>
        <form onSubmit={ sendMessage }>
          <input type="text" value={text} onChange={ (e) => setText(e.target.value) } />
          <button type="submit">Enviar</button>
        </form>
      </div>
    );
  };

  const ChatMessage = (props) => {
    const { text, date, message,  } = props.message;

    return(
      <div>
        { message && <div>{ message }</div> }
      </div>
    );

  };

  return(
    <div>
      <ChatRoom />
    </div>
  );
}


// import { useRouter } from 'next/navigation';
// import { useState, useEffect } from 'react';
// import { verify } from '../../firebase/user';

// import {
//   collection,
//   onSnapshot,
//   addDoc,
//   getDocs,
//   query,
//   orderBy,
//   serverTimestamp,
// } from 'firebase/firestore/lite'; // Importações específicas para o Firestore Lite

// import { getFirestore } from 'firebase/firestore/lite';
// import firebaseConfig from '@/firebase/connection';

// export default function Sessions() {
//   const router = useRouter();
//   const [showData, setShowData] = useState(false);
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);

//   const db = getFirestore(firebaseConfig);
//   const chatbotRef = collection(db, 'chatbot');
//   const chatbotQuery = query(chatbotRef, orderBy('date', 'asc'));

//   useEffect(() => {
//     setShowData(false);
//     window.scrollTo(0, 0);
//     const token = localStorage.getItem('Segredos Da Fúria');
//     if (token) {
//       const decodedToken = verify(JSON.parse(token));
//       if (!decodedToken) {
//         router.push('/sessions/login');
//       } else {
//         setShowData(true);
//       }
//     } else {
//       router.push('/sessions/login');
//     }
//   }, [router]);

//   useEffect(() => {
//     const chatBot = async () => {
//       const querySnapshot = await getDocs(chatbotRef);
//       const obj = [];
//       querySnapshot.forEach((doc) => {
//         obj.push({
//           id: doc.id,
//           message: doc.data().message,
//           user: doc.data().user,
//           date: doc.data().date,
//         });
//       });

//       setMessages(obj);
//     };

//     chatBot();
//   }, [chatbotRef]);

//   useEffect(() => {
//     // Adiciona um listener para atualizações em tempo real
//     const unsubscribe = onSnapshot(chatbotQuery, (snapshot) => {
//       const updatedMessages = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setMessages(updatedMessages);
//     });

//     // Limpa o listener quando o componente é desmontado
//     return () => unsubscribe();
//   }, [chatbotQuery]);

//   const sendMessage = async () => {
//     const timestamp = serverTimestamp();

//     await addDoc(chatbotRef, {
//       message: message,
//       user: 'bruno',
//       date: timestamp,
//     });

//     setMessage('');
//   };

//   return (
//     showData && (
//       <div className="h-screen overflow-y-auto">
//         <div className="h-90vh overflow-y-auto p-2">
//           {messages.map((msg, index) => (
//             <div key={index} className="p-2 bg-gray-500 my-2">
//               <div>
//                 {msg.user} {msg.date && msg.date.toDate().toLocaleString()}{' '}
//               </div>
//               <div>{msg.message}</div>
//             </div>
//           ))}
//         </div>
//         <div className="fixed bottom-0 w-full bg-black p-2 flex gap-3">
//           <input
//             type="text"
//             className="w-9/12 p-2"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//           />
//           <div className="grid grid-cols-3 w-3/12 gap-3">
//             <button
//               className="border border-white text-white h-full p-2"
//               onClick={sendMessage}
//             >
//               Enviar
//             </button>
//             <button className="border border-white text-white h-full p-2">
//               Dice
//             </button>
//             <button className="border border-white text-white h-full p-2">
//               Ficha
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   );
// }
