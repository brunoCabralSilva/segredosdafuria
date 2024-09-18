'use client'
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IAdvantageAndFlaw } from "@/interface";
import { getPlayerByEmail, updateDataPlayer } from "@/firebase/players";
import { useContext } from "react";
import contexto from "@/context/context";

function limitCaracteres(texto: string) {
  return texto.slice(0, 300);
}

export default function DelAdvantageOrFlaw(props: any) {
  const { adv, setAdv } = props;
  const { sessionId, email, deleteAdvOrFlaw, setDeleteAdvOrFlaw, setShowMessage } = useContext(contexto);

  const removeAdv = async () => {
    const searchPlayer = await getPlayerByEmail(sessionId, email, setShowMessage);
    const foundAdvantage = searchPlayer.data.advantagesAndFlaws.find((item: IAdvantageAndFlaw) => item.name === deleteAdvOrFlaw.name);
    const otherAdvantages = searchPlayer.data.advantagesAndFlaws.filter((item: IAdvantageAndFlaw) => item.name !== deleteAdvOrFlaw.name);

    if (deleteAdvOrFlaw.type === 'advantage') {
      const remoteItemAdv = foundAdvantage.advantages.filter((ad: any) => ad.advantage !== deleteAdvOrFlaw.desc);

      const restOfAdvantage = adv.filter((ad: any) => ad.name !== deleteAdvOrFlaw.name);

      const updatedAdvantage = {
        name: deleteAdvOrFlaw.name, 
        advantages: remoteItemAdv,
        flaws: foundAdvantage.flaws,
      }

      if (updatedAdvantage.advantages.length === 0 && updatedAdvantage.flaws.length === 0) {
        setAdv(restOfAdvantage);
      } else {
        setAdv([...restOfAdvantage, updatedAdvantage]);
      }
      searchPlayer.data.advantagesAndFlaws = [...otherAdvantages, updatedAdvantage];
    }
    
    if (deleteAdvOrFlaw.type === 'flaw') {
      const remoteItemflw = foundAdvantage.flaws.filter((ad: any) => ad.flaw !== deleteAdvOrFlaw.desc);

      const restOfAdvantage = adv.filter((ad: any) => ad.name !== deleteAdvOrFlaw.name);

      const updatedAdvantage = {
        name: deleteAdvOrFlaw.name, 
        advantages: foundAdvantage.advantages,
        flaws: remoteItemflw,
      }

      if (updatedAdvantage.advantages.length === 0 && updatedAdvantage.flaws.length === 0) {
        setAdv(restOfAdvantage);
      } else {
        setAdv([...restOfAdvantage, updatedAdvantage]);
      }
      searchPlayer.data.advantagesAndFlaws = [...otherAdvantages, updatedAdvantage];
    }

    await updateDataPlayer(sessionId, email, searchPlayer, setShowMessage);
    setDeleteAdvOrFlaw({show: false, adv: {}, type:'' });
  };

  return(
    <div className="z-50 fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black/80 px-3 sm:px-0">
      <div className="w-full sm:w-2/3 md:w-1/2 overflow-y-auto flex flex-col justify-center items-center bg-black relative border-white border-2 pb-5">
        <div className="pt-4 sm:pt-2 px-2 w-full flex justify-end top-0 right-0">
          <IoIosCloseCircleOutline
            className="text-4xl text-white cursor-pointer"
            onClick={() => setDeleteAdvOrFlaw({show: false, adv: {}, type:'' })}
          />
        </div>
        <div className="pb-5 px-5 w-full">
          <label htmlFor="palavra-passe" className="flex flex-col items-center w-full">
            <p className="text-white w-full text-center pb-3">
              Tem certeza de que quer Remover este item da sua ficha?
            </p>
            <p className="text-white w-full text-center pb-3">
              { limitCaracteres(deleteAdvOrFlaw.desc) }
              { deleteAdvOrFlaw.desc.length > 498 ? <span className="text-white">...</span> : ''}
            </p>
          </label>
          <div className="flex w-full gap-2">
            <button
              type="button"
              onClick={() => setDeleteAdvOrFlaw({show: false, adv: {}, type:'' })}
              className={`text-white bg-green-whats hover:border-green-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold`}
            >
              Não
            </button>
            <button
              type="button"
              onClick={ removeAdv }
              className={`text-white bg-red-800 hover:border-red-900  transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold`}
            >
              Sim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}