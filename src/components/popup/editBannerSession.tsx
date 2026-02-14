'use client'
import { useContext, useState } from "react";
import contexto from '@/context/context';
import Image from 'next/image';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { updateBannerSession } from "@/firebase/sessions";

export default function EditBannerSession() {
  const [image, setImage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { showBannerSession, setShowBannerSession, setShowMessage } = useContext(contexto);

  const updtSession = async () => {
    if (image === '') {
      setShowMessage({ show: true, text: 'Necessário selecionar uma imagem para a sua sessão'});
    } else {
      setLoading(true);
      await updateBannerSession(
        showBannerSession.sessionId,
        image,
        setShowMessage,
      );
      setLoading(false);
      setShowBannerSession({ show: false, sessionId: '' });
    }
  };
  
  return (
    <div className="fixed top-0 left-0 h-screen bg-black bg-cover bg-top mb-2 w-full flex items-center justify-center z-50">
      <div className="flex items-center justify-center flex-col w-full h-85vh bg-black">
        <div className="w-full overflow-y-auto flex flex-col justify-start items-center mt-2 px-5 pb-10">
          <div className="w-full text-white text-2xl pb-3 font-bold text-center mt-2 relative flex flex-col items-center justify-center">
            <div className="pt-4 sm:pt-2 px-2 w-full flex justify-end top-0 right-0">
              <IoIosCloseCircleOutline
                className="text-4xl text-white cursor-pointer"
                onClick={() => {
                  setShowBannerSession({ show: false, sessionId: '' });
              }}
              />
            </div>
            <p className="text-white w-full pb-3">Selecione uma imagem para sua Sessão:</p>
          </div>
          <label className="flex flex-col items-center w-full mt-4">           
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
            onClick={ updtSession }
          >
            { loading ? 'Atualizando Imagem...' : 'Atualizar Imagem'}
          </button>
        </div>
      </div>
    </div>
  );
}