'use client'
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionDeleteUserFromSession, useSlice } from "@/redux/slice";
import { useRouter } from 'next/navigation';
import { IoIosCloseCircleOutline } from "react-icons/io";
import { leaveFromSession } from "@/firebase/sessions";

export default function PopupDelUserFromSession() {
  const dispatch = useAppDispatch();
  const slice = useAppSelector(useSlice);
  const router = useRouter();

  return(
    <div className="z-50 fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black/80 px-3 sm:px-0">
      <div className="w-full sm:w-2/3 md:w-1/2 overflow-y-auto flex flex-col justify-center items-center bg-black relative border-white border-2 pb-5">
        <div className="pt-4 sm:pt-2 px-2 w-full flex justify-end top-0 right-0">
          <IoIosCloseCircleOutline
            className="text-4xl text-white cursor-pointer"
            onClick={() => dispatch(actionDeleteUserFromSession(false))}
          />
        </div>
        <div className="pb-5 px-5 w-full">
          <label htmlFor="palavra-passe" className="flex flex-col items-center w-full">
            <p className="text-white w-full text-center pb-3">
              Ao escolher sair de uma Sessão, todos os dados que você tem registrados aqui, como fichas e anotações, serão removidos permanentemente. Você tem certeza que de fato quer fazer isto?
            </p>
          </label>
          <div className="flex w-full gap-2">
            <button
              type="button"
              onClick={() => dispatch(actionDeleteUserFromSession(false))}
              className={`text-white bg-red-800 hover:border-red-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold`}
            >
              Não
            </button>
            <button
              type="button"
              onClick={ async () => await leaveFromSession(slice, dispatch, router) }
              className={`text-white bg-green-whats hover:border-green-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold`}
            >
              Sim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}