'use client'
import { useAppSelector } from "@/redux/hooks";
import { useSlice } from "@/redux/slice";
import { ITalisman } from "../../interface";
import Link from 'next/link';

export default function ListTalismans() {
  const slice = useAppSelector(useSlice);

  return (
    <section className="mb-2 text-white">
      { 
        slice.message.type === 'talisman' && slice.message.show &&
        <div className="font-bold py-4 px-5 text-lg bg-black mt-2 mb-1 text-white">
          <p className="w-full text-center">
            Total de Talismãs Encontrados: { slice.list.talisman.length }
          </p>
        </div>
      }
      <div className={`grid grid-cols-1 ${slice.list.talisman.length > 1 ? 'mobile:grid-cols-2' : ''} gap-3 mt-2`}>
        {
          slice.list.talisman.map((item: ITalisman, index: number) => (
            <Link
              href={`/talismans/${item.title.toLowerCase().replace(/ /g, '-')}`}
              className="border-white border-2 p-3 flex items-center justify-center flex-col bg-cover bg-center bg-filters relative cursor-pointer"
              key={ index }
            >
              <div className={`absolute w-full h-full ${slice.simplify ? 'bg-black' : 'bg-black/80'}`} />
              <div className="relative text-white flex w-full justify-center items-center">
              </div>
              <p className="text-center w-full p-2 relative font-bold">
                { `${item.titlePtBr} (${item.title})` }
              </p>
            </Link>
          ))
        }
      </div>
    </section>
  )
}