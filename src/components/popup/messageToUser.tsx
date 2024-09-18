'use client'
import contexto from '@/context/context';
import Image from 'next/image';
import { useContext } from 'react';
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function MessageToUser() {
  const { showMessage, setShowMessage } = useContext(contexto);
  return(
    <div className="z-80 fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black/80 px-3 sm:px-0">
      <div className="w-full sm:w-2/3 md:w-1/2 h-1/2 overflow-y-auto flex flex-col justify-center items-center bg-ritual bg-cover relative border-white border-2 ">
        <div className="bg-black/90 h-full w-full pb-5 flex flex-col items-center justify-center relative">
          <div className="pt-4 sm:pt-2 px-2 w-full flex justify-end absolute top-0 right-0">
            <IoIosCloseCircleOutline
              className="text-4xl text-white cursor-pointer"
              onClick={() => setShowMessage({ show: false, text: '' })}
            />
          </div>
          <div className="px-5 w-full flex flex-col items-center justify-center">
              <Image
                src="/images/gifts/Dons Nativos.png"
                alt="Glifo de um lobo"
                className="w-12 relative object-contain mb-5"
                width={35}
                height={400}
              />
            <label htmlFor="palavra-passe" className="flex flex-col items-center w-full">
              <p className="text-white w-full text-center font-bold">
                { showMessage.text }
              </p>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}