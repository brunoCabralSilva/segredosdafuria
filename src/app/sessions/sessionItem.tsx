'use client'
import contexto from "@/context/context";
import Image from "next/image";
import { useContext } from "react";

export default function SessionItem(props: { session: any }) {
  const { session } = props;
  const { setDataSession } = useContext(contexto);

  const resumeSinopse = (text: string) => {
    const totalLength = 220;
    if (text.length > totalLength) return text.slice(0, totalLength) + '...';
    return text.slice(0, totalLength);
  }

  return(
    <button
      type="button"
      onClick={ () => setDataSession({ show: true, id: session.id })}
      className="border border-white text-white cursor-pointer bg-ritual bg-cover rounded-xl"
    >
      <div className="w-full h-full bg-black/90 font-bold rounded-xl">
        <div className="flex items-center justify-center w-full">
          <Image
            src={`/images/sessions/${ session.imageName}.png` }
            alt="Glifo de um lobo"
            className="w-full h-32 relative object-cover object-center mb-2 rounded-t-xl"
            width={1000}
            height={1000}
          />
        </div>
        <div className="w-full pb-8 px-8 pt-4">
          <p className="text-left capitalize">{ session.name }</p>
          <div className="w-full pt-1 pb-2">
            <hr />
          </div>
          <p className="text-sm font-normal text-justify capitalize">
            Narrador: { session.nameMaster }
          </p>
          <p className="text-sm font-normal text-justify">
            Jogadores: { session.players.length }
          </p>
          <p className="text-sm font-normal text-justify">
            Data de Criação: { session.creationDate.toString() }
          </p>
          <p className="text-sm font-normal text-justify">
            Sinopse: { resumeSinopse(session.description) }
          </p>
        </div>
      </div>
    </button>
  )
}