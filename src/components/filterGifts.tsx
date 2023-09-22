'use client'
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionFilterGift, useSlice } from "@/redux/slice";
import { motion } from "framer-motion";
import Image from "next/image";

export default function FilterGifts(props: { type: string, title: string }) {
  const [list, setList] = useState<string[] | number[]>([]);
  const slice = useAppSelector(useSlice);
  const dispatch: any = useAppDispatch();
  const { type, title } = props;
  const { selectTA } = slice;

  const trybes: string[] = ['Peregrinos Silenciosos', 'Fúrias Negras', 'Presas de Prata', 'Guarda do Cervo', 'Conselho Fantasma', 'Perseguidores da Tempestade', 'Andarilhos do Asfalto', 'Roedores de Ossos', 'Senhores das Sombras', 'Filhos de Gaia','Garras Vermelhas'];

  const auspices: string[] = ['Ragabash', 'Theurge', 'Philodox', 'Galliard', 'Ahroun'];

  const totalRenown: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  useEffect(() => {
    if (type === 'trybes') setList(trybes);
    else if (type === 'auspices') setList(auspices);
    else setList(totalRenown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-black mt-1 py-3 px-5">
      <div
        className="font-bold pb-2 text-base flex flex-col justify-between items-center"
      >
        <p className="w-full text-xl text-center sm:text-left">
          { `Selecione um${title === 'Tribos' ? 'a' : ''} ou mais ${title}` }
        </p>
      </div>
      { 
      // grid grid-cols-1 mobile:grid-cols-2 sm:grid-cols-4 lg:grid-cols-4
        <div className="flex flex-wrap justify-start gap-2 w-full py-1">
          {
            list.length > 0 && list.map((item: string | number, index: number) => (
              <motion.div
                whileHover={{ scale: 0.98 }}
                key={ index }
                className={`shadow shadow-white rounded-full font-bold px-4 py-1 flex items-center justify-center ${selectTA.includes(item) ? 'bg-white text-black' : 'bg-black text-white'} cursor-pointer `}
                onClick={ () => dispatch(actionFilterGift(item)) }
              >
                <span className="leading-2 text-sm sm:text-base py-1 w-full text-center">
                  { item }
                </span>
              </motion.div>
            ))
          }
        </div>
      }
    </div>
  )
}