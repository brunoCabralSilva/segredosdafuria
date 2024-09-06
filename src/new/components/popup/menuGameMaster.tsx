import contexto from "@/context/context";
import { useContext } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function MenuGameMaster() {
  const { setShowMenuSession } = useContext(contexto);
  return(
    <div className="w-8/10 px-5 sm:px-8 pb-8 pt-3 sm-p-10 bg-black flex flex-col items-center h-screen z-50 top-0 right-0 overflow-y-auto text-white">
      <div className="w-full flex justify-end my-3">
        <IoIosCloseCircleOutline
          className="text-4xl text-white cursor-pointer mb-2"
          onClick={ () => setShowMenuSession('') }
        />
      </div>
      MenuGameMaster
    </div>
  );
}