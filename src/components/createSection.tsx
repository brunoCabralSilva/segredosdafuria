'use client'
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from "react";
import Nav from "@/components/nav";
import { FaArrowLeft } from "react-icons/fa6";
import { authenticate } from "@/firebase/authenticate";
import { createSession, getSessionByName } from '@/firebase/sessions';
import contexto from '@/context/context';

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
        const sessionList: any = await getSessionByName(nameSession.toLowerCase());
        if (sessionList) {
          setErrExists('Já existe uma Sala criada com esse nome');
          setLoading(false);
        } else {
          setErrExists('');
          const docRef: string = await createSession(
            nameSession.toLowerCase(),
            description,
            email,
            setShowMessage,
          );
          if (docRef) router.push(`/sessions/${docRef}`);
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
    <div className="bg-ritual bg-cover bg-top mb-2 w-full h-full">
      <div className="flex flex-col w-full overflow-y-auto justify-left items-center bg-black/90">
        <Nav />
        <div
          className="px-2 py-2 mb-1 flex z-30 justify-start items-center w-full fixed top-0 ml-2 mt-1"
        >
        </div>
        <div className="w-full overflow-y-auto flex flex-col justify-center items-center mt-2 px-5 pb-10">
          <div className="w-full text-white text-2xl pb-3 font-bold text-center mt-2 relative flex items-center justify-center">
            <button
              type="button"
              className="absolute left-0"
              onClick={ () => router.push('/sessions') }
            >
              <FaArrowLeft
                onClick={ () => setShowCreateSession(false) }
                className="text-3xl text-white"
              />
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