'use client'
import contexto from '@/context/context';
import { signOutFirebase } from '@/firebase/authenticate';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function Logout() {
  const router = useRouter();
  const { setShowMenuSession, setLogoutUser } = useContext(contexto);

  const logout = async () => {
    signOutFirebase();
    setLogoutUser(false);
    setShowMenuSession('');
    router.push('/');
  };

  return(
    <div className="z-50 fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black/80 px-3 sm:px-0">
      <div className="w-full sm:w-2/3 md:w-1/2 overflow-y-auto flex flex-col justify-center items-center bg-black relative border-white border-2 pb-5">
        <div className="pt-4 sm:pt-2 px-2 w-full flex justify-end top-0 right-0">
          <IoIosCloseCircleOutline
            className="text-4xl text-white cursor-pointer"
            onClick={() => setLogoutUser(false)}
          />
        </div>
        <div className="pb-5 px-5 w-full">
          <label htmlFor="palavra-passe" className="flex flex-col items-center w-full">
            <p className="text-white w-full text-center pb-3">
              Tem certeza de deseja deslogar? Assim, você terá acesso limitado aos Segredos da Lua!
            </p>
          </label>
          <div className="flex w-full gap-2">
            <button
              type="button"
              onClick={() => {
                setLogoutUser(false);
                setShowMenuSession('');
              }}
              className={`text-white  transition-colors bg-green-whats hover:border-green-900 cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold`}

            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={ logout }
              className={`text-white bg-red-800 hover:border-red-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold`}
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}