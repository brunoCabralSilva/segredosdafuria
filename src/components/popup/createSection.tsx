'use client'
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from "react";
import { authenticate } from "@/firebase/authenticate";
import { createSession, getSessionByName } from '@/firebase/sessions';
import contexto from '@/context/context';
import { createConsentForm } from '@/firebase/consentForm';
import Image from 'next/image';
import { IoIosCloseCircleOutline } from 'react-icons/io';

export default function CreateSection() {
  const router = useRouter();
  const [nameSession, setNameSession] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [image, setImage] = useState<string>('');
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
    if (nameSession.length < 3) {
      setShowMessage({ show: true, text: 'Necessário preencher um Título com pelo menos 3 caracteres' });
    } else if (nameSession.length > 40) {
      setShowMessage({ show: true, text: 'Necessário preencher um Título com menos  de 40 caracteres'});
    } else if (description.length < 10) {
      setShowMessage({ show: true, text: 'Necessário preencher uma descrição com pelo menos 10 caracteres'});
    } else if (image === '') {
      setShowMessage({ show: true, text: 'Necessário selecionar uma imagem para a sua sessão'});
    } else {
      setLoading(true);
      try {
        const sessionList: any = await getSessionByName(nameSession.toLowerCase(), setShowMessage);
        if (sessionList) {
          setShowMessage({ show: true, text: 'Já existe uma Sala criada com esse nome' });
          setLoading(false);
        } else {
          const docRef: any = await createSession(
            nameSession.toLowerCase(),
            description,
            email,
            image,
            dataUser.displayName,
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
        setShowMessage({ show: true, text: error }); 
      }
    }
  };
  
  return (
    <div className="fixed top-0 left-0 h-screen bg-black bg-cover bg-top mb-2 w-full flex items-center justify-center">
      <div className="flex items-center justify-center flex-col w-full h-85vh bg-black">
        <div className="w-full overflow-y-auto flex flex-col justify-start items-center mt-2 px-5 pb-10">
          <div className="w-full text-white text-2xl pb-3 font-bold text-center mt-2 relative flex flex-col items-center justify-center">
            <div className="pt-4 sm:pt-2 px-2 w-full flex justify-end top-0 right-0">
              <IoIosCloseCircleOutline
                className="text-4xl text-white cursor-pointer"
                onClick={() => {
                  setShowCreateSession(false);
                  router.push('/sessions');
              }}
              />
            </div>
            Crie sua Sessão
          </div>
          <label htmlFor="nameSession" className="flex flex-col items-center w-full">
            <p className="text-white w-full pb-3">Título:</p>
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
          <label htmlFor="description" className="mt-4 flex flex-col items-center w-full">
            <p className="text-white w-full pb-3">Descrição:</p>
            <textarea
              id="description"
              value={ description }
              className="bg-white w-full p-3 cursor-pointer text-black text-justify"
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
                setDescription(sanitizedValue);
              }}
            />
          </label>
          <label className="flex flex-col items-center w-full mt-4">
            <p className="text-white w-full pb-3">Selecione uma imagem para sua Sessão:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
              {
                Array.from({ length: 30 }, (_, i) => (
                  <Image
                    key={i}
                    src={`/images/sessions/${String(i + 1).padStart(2, '0')}.png`}
                    onClick={ () => setImage(String(i + 1).padStart(2, '0')) }
                    alt="Glifo de um lobo"
                    className={`w-full h-32 relative object-cover object-center cursor-pointer border ${ String(i + 1).padStart(2, '0') === image ? 'border-white' : 'border-black'} ${image !== '' && image !== String(i + 1).padStart(2, '0') ? 'opacity-50' : 'opacity-1'} `}
                    width={1000}
                    height={1000}
                  />
                ))
              }
            </div>
          </label>
          <button
            className="text-white bg-black hover:border-red-800 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold"
            onClick={ registerSession }
          >
            { loading ? 'Criando Sessão...' : 'Criar Sessão'}
          </button>
        </div>
      </div>
    </div>
  );
}