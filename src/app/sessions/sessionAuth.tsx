import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionSessionAuth, useSlice } from "@/redux/slice";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";
import firestoreConfig from '../../firebase/connection';

export default function SessionAuth() {
  const slice = useAppSelector(useSlice);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [palavraPasseOrig, setPalavraPasseOrig] = useState('');
  const [palavraPasseDig, setPalavraPasseDig] = useState('');
  const [errSession, setErrSession] = useState('');

  useEffect(() => {
    const requestSession = async () => {
      try {
        const db = getFirestore(firestoreConfig);
        const collectionRef = collection(db, 'sessions');
        const querySnapshot = await getDocs(collectionRef);
        const session = querySnapshot.docs.find((doc) => doc.data().name === slice.sessionAuth.name);
        if (!session) router.push('/sessions');
        else setPalavraPasseOrig(session.data().palavraPasse);
      } catch(error) {
        window.alert("Ocorreu um erro: " + error);
      }
    }
    requestSession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const accessSession = () => {
    if (palavraPasseDig === '' || palavraPasseOrig === '' || palavraPasseDig !== palavraPasseOrig) {
      setErrSession('Não foi possível acessar a Sessão: a palavra-passe não confere')
      setTimeout(() => {
        setErrSession('');
      }, 5000)
      setPalavraPasseDig('');
    } else {
      const endpointSpace = slice.sessionAuth.name.trim();
      const endpoint = endpointSpace
        .replace(/-/g, '_')
        .replace(/\s+/g, '-')
        .toLowerCase();
      dispatch(actionSessionAuth({ show: false, name: slice.sessionAuth.name }))
      router.push(`/sessions/${endpoint}`);
    }
  };

  return(
    <div className="z-50 fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black/80 px-3 sm:px-0">
      <div className="w-full sm:w-2/3 md:w-1/2 overflow-y-auto flex flex-col justify-center items-center bg-black relative border-white border-2 pb-5">
        <div className="pt-4 sm:pt-2 px-2 w-full flex justify-end top-0 right-0">
          <IoIosCloseCircleOutline
            className="text-4xl text-white cursor-pointer"
            onClick={() => dispatch(actionSessionAuth({ show: false, name: '' }))}
          />
        </div>
        <div className="pb-5 px-5 w-full">
          <h1 className="text-white text-2xl w-full text-center pb-10">{ slice.sessionAuth.name }</h1>
          <label htmlFor="palavra-passe" className={`${errSession !== '' ? 'mb-2' : 'mb-4'} flex flex-col items-center w-full`}>
            <p className="text-white w-full text-center pb-3">Insira a palavra-passe</p>
            <input
              type="text"
              id="palavra-passe"
              value={ palavraPasseDig }
              className="bg-white w-full p-3 cursor-pointer text-black text-center"
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
                setPalavraPasseDig(sanitizedValue);
              }}
            />
          </label>
          {
            errSession !== '' && <div className="text-white pb-3 text-center">{ errSession }</div>
          }
          <button
            type="button"
            onClick={ accessSession }
            className={`text-white bg-black hover:border-red-800 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold`}

          >
            Aventurar-se
          </button>
        </div>
      </div>
    </div>
  );
}