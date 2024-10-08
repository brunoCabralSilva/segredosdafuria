'use client'
import contexto from "@/context/context";
import { addNewSheet } from "@/firebase/players";
import { getOfficialTimeBrazil, sheetStructure } from "@/firebase/utilities";
import { useRouter } from 'next/navigation';
import { useContext, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function CreateSheet() {
  const { setShowCreateSheet, setShowMessage, session } = useContext(contexto);
  const router = useRouter();
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [emailPlayer, setEmailPlayer] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  const registerPlayer = async () => {
    setLoading(true);
    setError('');
    const validateEmail = /\S+@\S+\.\S+/;
    if(name1.length < 2) {
      setError('Necessário inserir um Nome com pelo menos 2 caracteres');
    } else if(name2.length < 2) {
      setError('Necessário inserir um Sobrenome com pelo menos 2 caracteres');
    } else if (!validateEmail.test(emailPlayer)) {
      setError('Necessário preencher um e-mail válido');
    } else {
      try {
        const dateMessage = await getOfficialTimeBrazil();
        const sheet = sheetStructure(emailPlayer, `${name1} ${name2}`, dateMessage);
        await addNewSheet(session.id, sheet, setShowMessage);
        setName1('');
        setName2('');
        setEmailPlayer('');
        setShowMessage({ show: true, text: 'Ficha Criada com sucesso!' });
        setShowCreateSheet(false);
      } catch (error) {
        setError('Ocorreu um erro inesperado: ' + error);
      }
    }
    setLoading(false);
  };

  return (
    <div className="z-60 fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black/80 px-3 sm:px-0">
      <div className="w-full sm:w-2/3 md:w-1/2 overflow-y-auto flex flex-col justify-center items-center bg-black relative border-white border-2 pb-5">
        <div className="pt-4 sm:pt-2 px-2 w-full flex justify-end top-0 right-0">
          <IoIosCloseCircleOutline
            className="text-4xl text-white cursor-pointer"
            onClick={ () => setShowCreateSheet(false) }
          />
        </div>
        <div className="px-6 sm:px-10 w-full">
          <div
            className="px-2 py-2 mb-1 flex z-30 justify-start items-center w-full fixed top-0 ml-2 mt-1"
          >
            <button
              type="button"
              className=""
              onClick={ () => router.push('/sessions') }
            >
              <FaArrowLeft className="text-3xl text-white" />
            </button>
          </div>
          <div className="w-full overflow-y-auto flex flex-col justify-center items-center mt-2 mb-10">
            <div className="w-full text-white text-2xl pb-3 font-bold text-center mt-2 mb-2">
              Crie um novo Personagem
            </div>
            <label htmlFor="nameSession" className="mb-4 flex flex-col items-center w-full">
              <input
                type="text"
                id="nameSession"
                value={ name1 }
                placeholder="Nome"
                className="bg-white w-full p-3 cursor-pointer text-black text-center"
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setName1(e.target.value)
                }
              />
            </label>
            <label htmlFor="nameSession" className="mb-4 flex flex-col items-center w-full">
              <input
                type="text"
                id="nameSession"
                value={ name2 }
                className="bg-white w-full p-3 cursor-pointer text-black text-center"
                placeholder="Sobrenome"
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setName2(e.target.value)
                }
              />
            </label>
            <label htmlFor="nameSession" className="mb-4 flex flex-col items-center w-full">
              <input
                type="text"
                id="nameSession"
                value={ emailPlayer }
                className="bg-white w-full p-3 cursor-pointer text-black text-center"
                placeholder="Email"
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setEmailPlayer(e.target.value)
                }
              />
            </label>
            <button
              className={`text-white bg-black hover:border-red-800 transition-colors cursor-pointer' } border-2 border-white w-full p-2 mt-6 font-bold`}
              onClick={ registerPlayer }
            >
              { loading ? 'Criando...' : 'Criar'}
            </button>
            {
              error !== '' && <div className="text-white pt-4 pb-3 text-center">{ error }</div>
            }
          </div>
          {
            loading
            && <div className="bg-black/80 text-white flex items-center justify-center flex-col my-5">
              <span className="loader z-50" />
            </div>
          }
        </div>    
      </div>
    </div>
  );
}