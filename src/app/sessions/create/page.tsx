'use client'
import { addDoc, collection, getDocs, getFirestore, serverTimestamp } from "firebase/firestore";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import firestoreConfig from '../../../firebase/connection';
import Footer from "@/components/footer";
import Nav from "@/components/nav";
import { FaArrowLeft } from "react-icons/fa6";
import { testToken } from "@/firebase/token";

export default function Create() {
  const router = useRouter();
  const [nameSession, setNameSession] = useState<string>('');
  const [errNameSession, setErrNameSession] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [errDescription, setErrDescription] = useState<string>('');
  const [errExists, setErrExists] = useState<string>('');
  const [errPalavraPasse, setErrPalavraPasse] = useState<string>('');
  const [palavraPasse, setPalavraPasse] = useState<string>('');
  const [showData, setShowData] = useState(false);

  useEffect(() => {
    setShowData(false);
    window.scrollTo(0, 0);
    const verification = testToken();
    if (!verification) router.push('/user/login');
    setShowData(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const registerSession = async () => {
    if (nameSession.length < 3) {
      setErrNameSession('Necessário preencher um nome com pelo menos 3 caracteres');
    } else setErrNameSession('');

    if (nameSession.length > 40) {
      setErrNameSession('Necessário preencher um nome com menos  de 40 caracteres');
    } else setErrNameSession('');
  
    if (description.length < 10) {
      setErrDescription('Necessário preencher uma descrição com pelo menos 10 caracteres');
    } else setErrDescription('');

    if (palavraPasse.length < 8) {
      setErrPalavraPasse('Necessário preencher uma Palavra-passe com pelo menos 8 caracteres (Sugestão: Insira Números e caracteres especiais');
    } else setErrPalavraPasse('');

    try {
      const db = getFirestore(firestoreConfig);
      const sessionsCollection = collection(db, 'sessions');
      const querySnapshot = await getDocs(sessionsCollection);
      const sessionList = querySnapshot.docs.find((doc) => doc.data().name === nameSession
      );

      if (sessionList) {
        setErrExists('Já existe uma Sala criada com esse nome');
      } else setErrExists('');
    
      if (nameSession.length > 3 && nameSession.length < 20 && description.length > 10 && palavraPasse.length >= 8 && !sessionList) {
        const token = localStorage.getItem('Segredos Da Fúria');
        if (token) {
          const data: { email: string } = jwtDecode(JSON.parse(token));
          await addDoc(sessionsCollection, {
            name: nameSession.replace(/_/g, '-').toLowerCase(),
            description,
            dm: data.email,
            creationDate: serverTimestamp(),
            anotations: '',
            chat: [],
            players: [],
            palavraPasse,
          });
          router.push(`/sessions/${nameSession}`);
        } else {
          router.push('/user/login');
          window.alert('Não foi possível validar seu Token. Por favor, faça login novamente');
        }
      }
    } catch (error) {
      setErrExists('Ocorreu um erro inesperado: ' + error);
    }
  };
  
  {
    showData
    ? <div className="bg-ritual bg-cover bg-top min-h-screen">
      <div className="flex flex-col w-full overflow-y-auto justify-center items-center bg-black/90">
        <Nav />
        <div
          className="px-2 py-2 mb-1 cursor-pointer flex z-30 justify-start items-center w-full bg-black"
        >
          <button
            type="button"
            onClick={ () => router.push('/sessions') }
          >
            <FaArrowLeft className="text-3xl text-white" />
          </button>
        </div>
        <div className="w-full sm:w-2/3 md:w-7/12 overflow-y-auto flex flex-col justify-center items-center mt-2 mb-10">
          <div className="w-full text-white text-2xl pb-3 font-bold text-center mt-2">
            Crie sua Sessão
          </div>
          <label htmlFor="nameSession" className={`${errNameSession !== '' ? 'mb-2' : 'mb-4'} flex flex-col items-center w-full`}>
            <p className="text-white w-full pb-3">Name</p>
            <input
              type="text"
              id="nameSession"
              value={ nameSession }
              className="bg-white w-full p-3 cursor-pointer text-black text-center"
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
              className="bg-white w-full p-3 cursor-pointer text-black text-center"
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
                setDescription(sanitizedValue);
              }}
            />
          </label>
          {
            errDescription !== '' && <div className="text-white pb-3 text-center">{ errDescription }</div>
          }
          <label htmlFor="nameSession" className={`${errPalavraPasse !== '' ? 'mb-2' : 'mb-4'} flex flex-col items-center w-full`}>
            <p className="text-white w-full pb-3">Palavra-passe</p>
            <input
              type="text"
              id="nameSession"
              value={ palavraPasse }
              className="bg-white w-full p-3 cursor-pointer text-black text-center"
              onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
                setPalavraPasse(sanitizedValue);
              }}
            />
          {
            errPalavraPasse !== '' && <div className="text-white pb-3 text-center">{ errPalavraPasse }</div>
          }
          </label>
          {
            errExists !== '' && <div className="text-white pb-3 text-center">{ errExists }</div>
          }
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
    : <div className="bg-ritual bg-cover bg-top h-screen w-full" />
  }
}