'use client'
import { useAppDispatch } from "@/redux/hooks";
import { useAppSelector } from "@/redux/hooks";
import { actionSimplify, useSlice } from "@/redux/slice";
import { useState } from "react";

export default function Simplify() {
  const [message, setMessage] = useState<boolean>(false);
  const slice = useAppSelector(useSlice);
  const dispatch = useAppDispatch();

  return (
    <div className="z-30 w-full relative">
      <p
        className={`px-12 py-2 bg-black font-bold cursor-pointer hover:underline w-full text-center text-white ${slice.simplify && 'border-b-2 border-white'}`}
        onClick={ () => {
          dispatch(actionSimplify(!slice.simplify));
          setMessage(true);
        }}
      >
        <span className="text-sm">Clique aqui para ter acesso à versão</span>
        {
          slice.simplify
            ? ' completa deste site'
            : ' simplificada deste site'
        }
      </p>
      {
        message &&
        <div className="fixed left-0 top-0 w-full h-screen bg-black/80 flex items-center justify-center">
          <div className={`w-10/12 sm:w-1/2 md:w-1/3 h-1/2 flex flex-col items-center justify-center border-2 border-white ${slice.simplify ? 'bg-black' : 'bg-ritual bg-cover'} relative`}>
            { !slice.simplify && <div className="bg-black/70 w-full h-full absolute" /> }
            <p className="py-2 text-center px-4 font-bold text-white relative z-10">
                Alternamos a versão deste site para a versão
                { slice.simplify ? ' simplificada.' : ' completa.' }
            </p>
            <p className="px-4 pt-1 text-center font-bold text-white relative z-10">
              Desejamos uma ótima experiência durante seu uso!
            </p>
            <button
              type="submit"
              value="Submit"
              className="text-black border-white w-3/4 mt-4 mb-2 py-3 border-2 bg-white hover:border-white font-bold hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer relative z-10"
              onClick={() => setMessage(false) }
            >
              Tudo certo!
            </button>
          </div>
        </div>
      }
    </div>
  );
}