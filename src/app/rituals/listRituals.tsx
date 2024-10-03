'use client'
import { useContext } from "react";
import { IRitual } from "../../interface";
import Link from 'next/link';
import contexto from "@/context/context";

export default function ListRituals() {
  const { listOfRituals } = useContext(contexto);
  return (
    <section className="mb-2 text-white">
      <div className="font-bold py-4 px-5 text-lg bg-black mt-2 mb-1 text-white">
        <p className="w-full text-center">
          Total de Rituais Encontrados: { listOfRituals.length }
        </p>
      </div>
      <div className={`grid grid-cols-1 ${listOfRituals.length > 1 ? 'mobile:grid-cols-2' : ''} gap-3 mt-2`}>
        {
          listOfRituals.map((item: IRitual, index: number) => (
            <Link
              href={`/rituals/${item.id}`}
              className="p-3 border-white border-2 flex items-center justify-center flex-col bg-cover bg-center bg-filters relative cursor-pointer"
              key={ index }
            >
              <div className="absolute w-full h-full bg-black/80" />
              <div className="relative text-white flex w-full justify-center items-center">
              </div>
              <p className="text-center w-full p-2 relative font-bold">
                { `${item.titlePtBr} (${item.title})` }
                { ` - ` }
                { item.type }
              </p>
            </Link>
          ))
        }
      </div>
    </section>
  )
}