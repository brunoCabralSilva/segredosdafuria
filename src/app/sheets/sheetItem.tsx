'use client'
import { getSessionById } from "@/firebase/sessions";
import { capitalizeFirstLetter } from "@/firebase/utilities";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SheetItem(props: { sheet: any }) {
  const { sheet } = props;
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  const resumeBackground = (text: string) => {
    const totalLength = 220;
    if (text.length > totalLength) return text.slice(0, totalLength) + '...';
    return text.slice(0, totalLength);
  }

  useEffect(() => {
    const getSession = async() => {
      const session = await getSessionById(sheet.sessionId);
      if (session) setSession(session);
    }
    getSession();
  }, []);

  return(
    <button
      type="button"
      onClick={ () => router.push('/sheets/' + sheet.id) }
      className="border border-white text-white cursor-pointer bg-ritual bg-cover rounded-xl"
    >
      <div className="w-full h-full bg-black/90 font-bold rounded-xl">
        <div className="flex items-center justify-end w-full px-5 pt-5">
          {
            sheet.data.auspice !== '' &&
            <Image
              src={`/images/gifts/${sheet.data.auspice}.png` }
              alt="Glifo de um lobo"
              className="w-20 h-12 relative object-contain object-center mb-2 rounded-t-xl"
              width={500}
              height={500}
            />
          }
          {
            sheet.data.trybe !== '' &&
            <Image
              src={`/images/gifts/${capitalizeFirstLetter(sheet.data.trybe)}.png` }
              alt="Glifo de um lobo"
              className="w-12 h-12 relative object-contain object-center mb-2 rounded-t-xl"
              width={500}
              height={500}
            />
          }
        </div>
        <div className="w-full pb-8 px-8">
          <p className="text-left capitalize">{ sheet.data.name }</p>
          <div className="w-full pt-1 pb-1">
            <hr />
          </div>
          <p className="text-sm font-normal text-justify capitalize pb-2">
            {`${sheet.data.auspice ? sheet.data.auspice : ''} ${sheet.data.auspice ? 'dos' : '' } ${sheet.data.trybe ? capitalizeFirstLetter(sheet.data.trybe) : ''}`}
          </p>
          <p className="text-sm font-normal text-justify capitalize">
            {
              !session
                ? `Não vinculada à nenhuma Sessão`
                : `Vinculada à Sessão: ${session.name}`
            }
          </p>
          {/* <p className="text-sm font-normal text-justify">
            Jogadores: { sheet.players.length }
          </p> */}
          <p className="text-sm font-normal text-justify">
            Data de Criação: { sheet.creationDate.toString() }
          </p>
          <p className="text-sm font-normal text-justify">
            História: { resumeBackground(sheet.data.background) }
          </p>
        </div>
      </div>
    </button>
  )
}