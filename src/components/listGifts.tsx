'use client'

import { useAppSelector } from "@/redux/hooks";
import { useSlice } from "@/redux/slice";
import Gift from "./gift";
import { IGift } from "@/interfaces/Gift";

export default function ListGifts(props : { describe: any }) {
  const slice = useAppSelector(useSlice);
  return (
    <section>
      { 
        slice.giftMessage.show &&
        <div className="font-bold py-4 px-5 text-lg bg-black mt-2 mb-1 text-white">
          <p className="w-full text-center">
            Total de Dons Encontrados: { slice.filteredList.length }
          </p>
          {
            slice.giftMessage.message !== '' &&
            <p className="w-full text-center">
              Filtros Selecionados: { slice.giftMessage.message }
            </p>
          }
        </div>
      }
      {
        slice.filteredList.map((item: IGift, index: number) => (
          <Gift
            key={ index }
            describe={ props.describe }
            item={ item }
          />
        ))
      }
    </section>
  )
}