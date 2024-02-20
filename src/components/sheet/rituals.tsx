'use client'
import { useEffect, useState } from "react";
import { IoAdd, IoClose } from "react-icons/io5";
import { getUserByIdSession } from "@/firebase/sessions";
import { useAppSelector } from "@/redux/hooks";
import { useSlice } from "@/redux/slice";
import dataRituals from '../../data/rituals.json';
import ItemRituals from "./itemRituals";

export default function RitualSheet() {
  const [showAllRituals, setShowAllRituals] = useState<boolean>(false);
  const [ritualsAdded, setRitualsAdded] = useState<any[]>([]);
  const slice = useAppSelector(useSlice);

  useEffect(() => {
    generateDataForRituals();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateDataForRituals = async (): Promise<void> => {
    const player = await getUserByIdSession(
      slice.sessionId,
      slice.userData.email,
    );
    if (player) {
      setRitualsAdded(player.data.rituals);
    } else window.alert('Jogador não encontrado! Por favor, atualize a página e tente novamente');
  };

  return(
    <div className="flex flex-col w-full">
      <div className="w-full mb-2 cursor-pointer flex-col items-start justify-center font-bold">
        <div className="flex flex-col w-full">
          <div className="w-full mb-2 cursor-pointer flex-col items-start justify-center font-bold">
            <div className="relative border-2 border-white mt-1 p-2 flex justify-between items-center mb-2 bg-black">
              <div
                className="mt-2 pb-2 text-white w-full cursor-pointer flex items-center justify-center"
              >
                {
                !showAllRituals
                ? <span className="text-center w-full text-sm">Meus Rituais</span>
                : <span className="text-center w-full text-sm">Adicionar Novos Rituais</span>
                }
              </div>
              <button
                type="button"
                className="absolute right-3 p-1 border-2 border-white bg-white text-black"
                onClick={ () => {
                  setShowAllRituals(!showAllRituals);
                  generateDataForRituals();
                }}
              >
                { 
                  !showAllRituals
                  ? <IoAdd
                      className="text-black text-xl"
                    />
                  : <IoClose className="text-black text-xl" />
                }
              </button>
            </div>
            <div className="">
              {
                !showAllRituals 
                ? <div className="">
                    { 
                      ritualsAdded.length > 0 && ritualsAdded.map((item, index) => (
                        <ItemRituals
                          key={ index }
                          index={ index }
                          ritual={ item }
                          remove={true}
                          generateDataForRituals={generateDataForRituals}
                        />
                      ))
                    }
                  </div>
                : <div>
                    {
                      dataRituals.map((ritual, index) => (
                        <ItemRituals
                          key={ index }
                          index={ index }
                          ritual={ ritual }
                          remove={false}
                        />
                      ))
                    }
                  </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}