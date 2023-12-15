'use client'
import { BsCheckSquare } from "react-icons/bs";
import { collection, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { FaRegEdit } from "react-icons/fa";
import { useEffect, useState } from "react";
import firebaseConfig from "@/firebase/connection";
import { authenticate, signIn } from "@/firebase/login";
import { useRouter } from "next/navigation";

export default function Background(props: { session: string, type: string }) {
  const { session, type } = props;
  const [textArea, setTextArea] = useState<boolean>(false);
  const [text, setText] = useState<string>('');
  const router = useRouter();

  const typeText = (e: any) => {
    const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
    setText(sanitizedValue);
  };

  useEffect(() => {
    returnValue();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const returnValue = async () => {
    const db = getFirestore(firebaseConfig);
    const authData: { email: string, name: string } | null = await authenticate();
    try {
      if (authData && authData.email && authData.name) {
        const { email } = authData;
        const userQuery = query(collection(db, 'sessions'), where('name', '==', session));
        const userQuerySnapshot = await getDocs(userQuery);
        const players: any = [];
        userQuerySnapshot.forEach((doc: any) => players.push(...doc.data().players));
        const player: any = players.find((gp: any) => gp.email === email);
        setText(player.data[type]);
      } else {
        const sign = await signIn();
        if (!sign) {
          window.alert('Houve um erro ao realizar a autenticação. Por favor, faça login novamente.');
          router.push('/');
        }
      }
    } catch (error) {
      window.alert('Erro ao obter valor da Anotação: ' + error);
    }
  };

  const updateValue = async () => {
    const db = getFirestore(firebaseConfig);
    const authData: { email: string, name: string } | null = await authenticate();
    try {
      if (authData && authData.email && authData.name) {
        const { email } = authData;
        const userQuery = query(collection(db, 'sessions'), where('name', '==', session));
        const userQuerySnapshot = await getDocs(userQuery);
        const players: any = [];
        userQuerySnapshot.forEach((doc: any) => players.push(...doc.data().players));
        const player: any = players.find((gp: any) => gp.email === email);
        player.data[type] = text;
        const docRef = userQuerySnapshot.docs[0].ref;
        const playersFiltered = players.filter((gp: any) => gp.email !== email);
        await updateDoc(docRef, { players: [...playersFiltered, player] });
      } else {
        const sign = await signIn();
        if (!sign) {
          window.alert('Houve um erro ao realizar a autenticação. Por favor, faça login novamente.');
          router.push('/');
        }
      }
    } catch (error) {
      window.alert('Erro ao obter valor da Anotação: ' + error);
    }
    returnValue();
  };

  return(
    <div className="flex flex-col w-full overflow-y-auto pr-2 h-full mb-3">
      <div className="w-full h-full mb-2 flex-col items-start justify-center font-bold">
        <div className="mt-1 p-2 flex justify-between items-center">
          <div
            className="text-white mt-2 pb-2 w-full cursor-pointer flex-col items-center justify-center"
            onClick={
              () => {
                setTextArea(true);
              }
            }
          >
            { type === 'background' ? 'História do Personagem' : 'Anotações do Personagem' }
          </div>
            { 
              textArea
                ? <BsCheckSquare
                    onClick={(e: any) => {
                      updateValue();
                      setTextArea(false);
                      e.stopPropagation();
                    }}
                    className="text-3xl text-white cursor-pointer"
                  />
                : <FaRegEdit
                    onClick={(e: any) => {
                      setTextArea(true);
                      e.stopPropagation();
                    }}
                    className="text-3xl text-white cursor-pointer" />
            }
        </div>
        { 
          textArea ?
          <textarea
            className="text-white bg-black font-normal p-2 border-2 border-white w-full mr-1 mt-1 h-full"
            value={ text }
            onChange={(e) => typeText(e)}
          />
          : <div
              className="text-white font-normal p-2 border-2 border-white w-full mr-1 mt-1 h-full cursor-pointer"
              onClick={() => setTextArea(true)} 
            >
            { text }
          </div>
        }
      </div>
    </div>
  );
}