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
    <div className="">
      <div
        className={`font-bold my-1 py-2 px-5 text-base flex justify-between items-center cursor-pointer ${slice.simplify ? 'bg-white text-black' : 'bg-black text-white'}`}
      >
        <p className="w-full text-center sm:text-left">{ `Selecione um ou mais ${title}`}</p>
      </div>
      { 
      // grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6
        <div className="grid grid-cols-1 mobile:grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-1 mb-2 w-full">
          {
            list.length > 0 && list.map((item: string | number, index: number) => (
              <motion.div
                whileHover={{ scale: 0.98 }}
                key={ index }
                className={`w-full flex items-center justify-center ${slice.simplify ? `py-4 font-bold border-white ${selectTA.includes(item) ?'bg-white text-black'  : 'bg-black text-white' }` : `bg-black px-2 ${selectTA.includes(item) ? 'border-white' : 'border-transparent '}`} cursor-pointer border-2 `}
                onClick={ () => dispatch(actionFilterGift(item)) }
              >
                { typeof item !== 'number' && !slice.simplify &&
                  <Image
                    src={ `/images/${type}/${item}.png` }
                    alt={`Glifo respectivo de ${item}`}
                    className={`${type === 'auspices' ? 'w-14' : 'w-10'}`}
                    width={2000}
                    height={1000}
                  />
                }
                <span className="leading-2 text-sm py-1 w-full text-center">
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