'use client'
import { IGift, ITypeGift } from "../../interface";
import Image from 'next/image';
import Link from 'next/link';
import { capitalizeFirstLetter } from "@/firebase/utilities";
import { useContext } from "react";
import contexto from "@/context/context";

export default function ListGifts() {
  const { listOfGift } = useContext(contexto);
  return (
    <section className="mb-2">
      { 
        <div className="font-bold py-4 px-5 text-lg bg-black mt-2 mb-1 text-white">
          <p className="w-full text-center">
            Total de Dons Encontrados: { listOfGift.length }
          </p>
        </div>
      }
      <div className={`grid grid-cols-1 ${listOfGift.length > 1 ? 'mobile:grid-cols-2' : ''} gap-3 mt-2`}>
        {
          listOfGift.map((item: IGift, index: number) => (
            <Link
              href={`/gifts/${item.id}`}
              className="border-white border-2 p-3 flex items-center justify-center flex-col bg-cover bg-center bg-filters relative cursor-pointer"
              key={ index }
            >
              <div className="absolute w-full h-full bg-black/90" />
              <div className="relative text-white flex w-full justify-center items-center">
                { 
                  item.belonging.map((trybe: ITypeGift, index: number) => (
                    <Image
                      key={ index }
                      src={ `/images/gifts/${capitalizeFirstLetter(trybe.type)}.png` }
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
            </Link>
          ))
        }
      </div>
    </section>
  )
}