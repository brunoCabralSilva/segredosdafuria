'use client'
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useSlice } from "@/redux/slice";
import { addDoc, collection, getDocs, getFirestore, serverTimestamp } from "firebase/firestore";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import firestoreConfig from '../../../firebase/connection';
import { MdDelete } from "react-icons/md";
import Footer from "@/components/footer";
import Nav from "@/components/nav";
import { getStorage, ref, uploadBytes } from "firebase/storage";

interface IUsersOfSession {
  email: string;
  character: string;
};

interface ISessions {
  name: string;
  description: string;
  image: string;
  dm: string;
  creationDate: Date;
  anotations: string;
  chat: any[],
  users: IUsersOfSession[],
};

export default function RegisterSession() {
  const router = useRouter();
  const [nameSession, setNameSession] = useState<string>('');
  const [errNameSession, setErrNameSession] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [errDescription, setErrDescription] = useState<string>('');
  const [palavraPasse, setPalavraPasse] = useState<string>('');

  const registerSession = async () => {
    if (nameSession.length < 3) {
      setErrNameSession('Necessário preencher um nome com pelo menos 3 caracteres');
    } else setErrNameSession('');
  
    if (description.length < 10) {
      setErrDescription('Necessário preencher uma descrição com pelo menos 10 caracteres');
    } else setErrDescription('');
  
    if (nameSession.length > 3 && description.length > 10) {
      const token = localStorage.getItem('Segredos Da Fúria');
      console.log('token', token);
      
      if (token) {
        const data: { email: string } = jwtDecode(JSON.parse(token));
        const db = getFirestore(firestoreConfig);
        const sessionsCollection = collection(db, 'sessions');
        await addDoc(sessionsCollection, {
          name: nameSession,
          description,
          dm: data.email,
          creationDate: serverTimestamp(),
          anotations: '',
          chat: [],
          players: [],
          palavraPasse,
        });
  
        console.log('Sessão registrada com sucesso.');
      } else {
        router.push('/sessions/login');
        window.alert('Não foi possível validar seu Token. Por favor, faça login novamente');
      }
    }
  };
  

  return(
    <div className="bg-ritual bg-cover bg-top">
      <div className="flex flex-col w-full h-full overflow-y-auto justify-center items-center bg-black/90 p-5">
        <Nav />
        <div className="w-full sm:w-2/3 md:w-7/12 ">
          <div className="w-full text-white text-2xl pb-3 font-bold text-center mt-4">
            Crie sua Sessão
          </div>
          <label htmlFor="nameSession" className={`${errNameSession !== '' ? 'mb-2' : 'mb-4'} flex flex-col items-center w-full`}>
            <p className="text-white w-full pb-3">Name</p>
            <input
              type="text"
              id="nameSession"
              value={ nameSession }
              className="bg-white w-full p-3 capitalize cursor-pointer text-black text-center"
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
                setNameSession(sanitizedValue);
              }}
            />
          </label>
          {
            errNameSession !== '' && <div className="text-white pb-3 text-center">{ errNameSession }</div>
          }
          <label htmlFor="description" className={`${errDescription !== '' ? 'mb-2' : 'mb-4'} flex flex-col items-center w-full`}>
            <p className="text-white w-full pb-3">Descrição</p>
            <textarea
              id="description"
              value={ description }
              className="bg-white w-full p-3 capitalize cursor-pointer text-black text-center"
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
                setDescription(sanitizedValue);
              }}
            />
          </label>
          {
            errDescription !== '' && <div className="text-white pb-3 text-center">{ errDescription }</div>
          }
          <label htmlFor="nameSession" className={`${errNameSession !== '' ? 'mb-2' : 'mb-4'} flex flex-col items-center w-full`}>
            <p className="text-white w-full pb-3">Palavra-passe</p>
            <input
              type="text"
              id="nameSession"
              value={ palavraPasse }
              className="bg-white w-full p-3 capitalize cursor-pointer text-black text-center"
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
                setPalavraPasse(sanitizedValue);
              }}
            />
          </label>
          <label
            htmlFor="description"
            className="mb-4 flex flex-col items-center w-full"
          >
            <p className="text-white w-full pb-3">Imagem</p>
            <input
              type="file"
              className="w-full
              text-white"
              id="fileInput"
            />
          </label>
          <button
            className={`text-white bg-black hover:border-red-800 transition-colors cursor-pointer' } border-2 border-white w-full p-2 mt-6 font-bold`}
            onClick={ registerSession }
          >
            Criar
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}