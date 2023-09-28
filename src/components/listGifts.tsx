'use client'

import { useAppSelector } from "@/redux/hooks";
import { useSlice } from "@/redux/slice";
import Gift from "../app/gifts/gift";
import { IGift, ITypeGift } from "../../interface";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import Image from "next/image";

export default function ListGifts() {
  const slice = useAppSelector(useSlice);
  const [isToggled, setToggle] = useState(false);
  const [object, setObject] = useState<any>(null);

  function capitalizeFirstLetter(str: string): String {
    switch(str) {
      case 'global': return 'Dons Nativos';
      case 'silent striders': return 'Peregrinos Silenciosos';
      case 'black furies': return 'Fúrias Negras';
      case 'silver fangs': return 'Presas de Prata';
      case 'hart wardens': return 'Guarda do Cervo';
      case 'ghost council': return 'Conselho Fantasma';
      case 'galestalkers': return 'Perseguidores da Tempestade';
      case 'glass walkers': return 'Andarilhos do Asfalto';
      case 'bone gnawers': return 'Roedores de Ossos';
      case 'shadow lords': return 'Senhores das Sombras';
      case 'children of gaia': return 'Filhos de Gaia';
      case 'red talons': return 'Garras Vermelhas';
      default: return str.charAt(0).toUpperCase() + str.slice(1);
    }
  };

  return (
    <section className="mb-2">
      { 
        slice.message.type === 'gift' && slice.message.show &&
        <div className="font-bold py-4 px-5 text-lg bg-black mt-2 mb-1 text-white">
          <p className="w-full text-center">
            Total de Dons Encontrados: { slice.list.gift.length }
          </p>
          {
            slice.message.text !== '' &&
            <p className="w-full text-center">
              Filtros Selecionados: { slice.message.text }
            </p>
          }
        </div>
      }
      <div className={`grid grid-cols-1 ${slice.list.gift.length > 1 ? 'mobile:grid-cols-2' : ''} gap-3 mt-2`}>
        {
          slice.list.gift.map((item: IGift, index: number) => (
            <motion.div
              whileHover={{ scale: 0.98 }}
              className="border-white border-2 p-3 flex items-center justify-center flex-col bg-cover bg-center bg-filters relative cursor-pointer"
              key={ index }
              onClick={() => {
                setToggle(prevValue => !prevValue );
                setObject(item);
              }}
            >
              <div className={`absolute w-full h-full ${slice.simplify ? 'bg-black' : 'bg-black/90'}`} />
              <div className="relative text-white flex w-full justify-center items-center">
                { 
                  item.belonging.map((trybe: ITypeGift, index: number) => (
                    <Image
                      key={ index }
                      src={ `/images/glifs/${capitalizeFirstLetter(trybe.type)}.png` }
                      alt={`Glifo ${capitalizeFirstLetter(trybe.type)}`}
                      className={`${trybe.type !== 'global' ? 'h-8' : ''} w-10 object-cover object-center`}
                      width={ 1200 }
                      height={ 800 }
                    />
                  ))
                }
              </div>
              <p className="text-center w-full p-2 relative font-bold">
                { `${item.giftPtBr} (${item.gift})` }
                { ` - ` }
                { 
                  item.belonging.map((trybe: ITypeGift, index: number) => (
                    <span key={ index }>
                      { capitalizeFirstLetter(trybe.type) } ({ trybe.totalRenown })
                      { index === item.belonging.length -1 ? '' : ', ' }
                    </span>
                  ))
                }
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
                <Gift item={ object } />
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