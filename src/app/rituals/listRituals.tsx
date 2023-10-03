'use client'

import { useAppSelector } from "@/redux/hooks";
import { useSlice } from "@/redux/slice";
import { IRitual } from "../../../interface";
import Link from "next/link";

export default function ListRituals() {
  const slice = useAppSelector(useSlice);

  return (
    <section className="mb-2 text-white">
      { 
        slice.message.type === 'ritual' && slice.message.show &&
        <div className="font-bold py-4 px-5 text-lg bg-black mt-2 mb-1 text-white">
          <p className="w-full text-center">
            Total de Rituais Encontrados: { slice.list.ritual.length }
          </p>
        </div>
      }
      <div className={`grid grid-cols-1 ${slice.list.ritual.length > 1 ? 'mobile:grid-cols-2' : ''} gap-3 mt-2`}>
        {
          slice.message.type === 'ritual' && slice.list.ritual.map((item: IRitual, index: number) => (
            <Link
              href={`/rituals/${item.title.toLowerCase().replace(/ /g, '-')}`}
              className="p-3 border-white border-2 flex items-center justify-center flex-col bg-cover bg-center bg-filters relative cursor-pointer"
              key={ index }
            >
              <div className={`absolute w-full h-full ${slice.simplify ? 'bg-black' : 'bg-black/80'}`} />
              <div className="relative text-white flex w-full justify-center items-center">
              </div>
              <p className="text-center w-full p-2 relative font-bold">
                { `${item.titlePtBr} (${item.title})` }
                { ` - ` }
                { item.type === 'social' ? "Social" : 'Comum' }
              </p>
            </Link>
          ))
        }
      </div>
    </section>
  )
}