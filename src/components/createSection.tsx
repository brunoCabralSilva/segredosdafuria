'use client'
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { authenticate } from "@/firebase/authenticate";
import { createSession, getSessionByName } from '@/firebase/sessions';
import contexto from '@/context/context';
import { createConsentForm } from '@/firebase/consentForm';

export default function CreateSection() {
  const router = useRouter();
  const [nameSession, setNameSession] = useState<string>('');
  const [errNameSession, setErrNameSession] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [errDescription, setErrDescription] = useState<string>('');
  const [errExists, setErrExists] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const { dataUser, setShowCreateSession, setShowMessage } = useContext(contexto);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (dataUser.email !== '' && dataUser.displayName !== '') {
          setEmail(dataUser.email);
        } else {
          const authData: any = await authenticate(setShowMessage);
          if (authData && authData.email && authData.displayName) {
            setEmail(authData.email);
          } else router.push('/login');
        }
      } catch (error) {
        setShowMessage({ show: true, text: 'Ocorreu um erro com a validação de dados: ' + error });
        router.push('/login');
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const registerSession = async () => {
    setLoading(true);
    setErrExists('');

    if (nameSession.length < 3) {
      setErrNameSession('Necessário preencher um nome com pelo menos 3 caracteres');
      setLoading(false);
    } else if (nameSession.length > 40) {
      setErrNameSession('Necessário preencher um nome com menos  de 40 caracteres');
      setLoading(false);
    } else setErrNameSession('');
  
    if (description.length < 10) {
      setErrDescription('Necessário preencher uma descrição com pelo menos 10 caracteres');
      setLoading(false);
    } else setErrDescription('');

    if (nameSession.length > 3 && nameSession.length < 40 && description.length > 10) {
      try {
        const sessionList: any = await getSessionByName(nameSession.toLowerCase(), setShowMessage);
        if (sessionList) {
          setErrExists('Já existe uma Sala criada com esse nome');
          setLoading(false);
        } else {
          setErrExists('');
          const docRef: any = await createSession(
            nameSession.toLowerCase(),
            description,
            email,
            setShowMessage,
          );
          if (docRef) {
            router.push(`/sessions/${docRef}`);
            await createConsentForm(docRef, email, setShowMessage);
          }
          else {
            setShowMessage({ show: true, text: 'Ocorreu um erro ao tentar criar uma nova Sessão. Por favor, atualize a página e tente novamente.' });
          }
        }
      } catch (error: any) {
      setErrExists(error); 
      }
    }
  };
  
  return (
    <div className="fixed top-0 left-0 h-screen bg-ritual bg-cover bg-top mb-2 w-full">
      <div className="flex items-center justify-center flex-col w-full h-full bg-black/90">
        <div className="w-full overflow-y-auto flex flex-col justify-center items-center mt-2 px-5 pb-10">
          <div className="w-full text-white text-2xl pb-3 font-bold text-center mt-2 relative flex items-center justify-center">
            <button
              type="button"
              className="absolute left-0"
              onClick={ () => {
                setShowCreateSession(false);
                router.push('/sessions');
              }}
            >
              <FaArrowLeft className="text-3xl text-white" />
            </button>
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
          <button
            className="text-white bg-black hover:border-red-800 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold"
            onClick={ registerSession }
          >
            { loading ? 'Criando...' : 'Criar'}
          </button>
          {
            errExists !== '' && <div className="text-white pt-4 pb-3 text-center">{ errExists }</div>
          }
        </div>
        {
          loading && <div className="bg-black/80 text-white flex items-center justify-center flex-col">
            <span className="loader z-50" />
          </div>
        }
      </div>
    </div>
  );
}