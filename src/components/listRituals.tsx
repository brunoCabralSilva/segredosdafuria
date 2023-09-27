'use client'

import { useAppSelector } from "@/redux/hooks";
import { useSlice } from "@/redux/slice";
import Gift from "./gift";
import { IGift, ITypeGift } from "@/interfaces/Gift";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import Ritual from "./ritual";

interface IRitual {
  titlePtBr: String;
  title:String;
  type: String;
  descriptionPtBr: String;
  description: String;
  pool: String;
  systemPtBr: String;
  system: String;
  book: String;
  page: number;
}

export default function ListRituals() {
  const slice = useAppSelector(useSlice);
  const [isToggled, setToggle] = useState(false);
  const [object, setObject] = useState<any>(null);

  return (
    <section className="mb-2 text-white">
      { 
        slice.giftMessage.show &&
        <div className="font-bold py-4 px-5 text-lg bg-black mt-2 mb-1 text-white">
          <p className="w-full text-center">
            Total de Rituais Encontrados: { slice.filteredList.length }
          </p>
          {
            slice.giftMessage.message !== '' &&
            <p className="w-full text-center">
              Filtros Selecionados: { slice.giftMessage.message }
            </p>
          }
        </div>
      }
      <div className={`grid grid-cols-1 ${slice.ritualList.length > 1 ? 'mobile:grid-cols-2' : ''} gap-3 mt-2`}>
        {
          slice.ritualList.map((item: IRitual, index: number) => (
            <motion.div
              whileHover={{ scale: 0.98 }}
              className="border-white border-2 p-3 flex items-center justify-center flex-col bg-trybes-background bg-center bg-opacity-10 relative cursor-pointer"
              key={ index }
              onClick={() => {
                setToggle(prevValue => !prevValue );
                setObject(item);
              }}
            >
              <div className={`absolute w-full h-full ${slice.simplify ? 'bg-black' : 'bg-black/90'}`} />
              <div className="relative text-white flex w-full justify-center items-center">
              </div>
              <p className="text-center w-full p-2 relative font-bold">
                { `${item.titlePtBr} (${item.title})` }
                { ` - ` }
                { item.type === 'social' ? "Social" : 'Comum' }
              </p>
            </motion.div>
          ))
        }
      </div>
      <AnimatePresence>
        {
          object &&
          <motion.div
            initial={{opacity:0}}
            animate={{opacity:1}}
            exit={{opacity:0}}
            className="p-3 sm:p-8 fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/80 z-50"
          >
            <div
              className="relative bg-ritual bg-top bg-cover w-full h-full"
            >
              <div className={`absolute w-full h-full ${slice.simplify ? 'bg-black' : 'bg-black/80'}`} />
              <div className="w-full h-full flex flex-col items-center relative">
                <Ritual item={ object } />
                <button className="text-4xl sm:text-5xl fixed top-4 right-5 sm:top-10 sm:right-14 color-white z-50 text-white"
                  onClick={ () => setObject(null)}
                >
                  <AiFillCloseCircle className="bg-black rounded-full p-2" />
                </button>
              </div>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </section>
  )
}