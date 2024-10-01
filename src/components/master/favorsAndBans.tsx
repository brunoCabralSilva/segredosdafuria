'use client'
import { useContext } from "react";
import contexto from "@/context/context";
import dataTrybes from '../../data/trybes.json';
import { capitalize } from "@/firebase/utilities";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export default function FavorsAndBans() {
  const {
    setAddFavorAndBan,
    setShowDeleteFavorAndBan,
    session,
    players,
  } =  useContext(contexto);

  return(
    <div className="flex flex-col w-full h-75vh overflow-y-auto text-white">
      <div className="w-full h-full flex-col items-start justify-center font-bold">
        <button
          type="button"
          onClick={() => setAddFavorAndBan({ show: true, data: {}, type: 'master' }) }
          className="text-white bg-black border-2 border-white hover:border-red-800 transition-colors my-1 mb-3 cursor-pointer w-full p-2 font-bold"
        >
          Adicionar Novo Favor ou Proibição
        </button>
        <div className="grid grid-cols-1 gap-3 pb-5">
          <div className="pb-3 border-white border-2 p-4">
            {
              session.favorsAndBans.map((item: any, index: number) => (
                <div key={index} className="pb-3 border-white border-2 p-4 mt-1">
                  <div className="flex w-full justify-between items-center">
                    <div className="flex w-full justify-between items-center">
                      <div>Favor / Proibição imposto pelo Narrador ({ item.order })</div>
                      <div className="flex items-center gap-1">
                        <FaRegEdit
                          onClick={(e: any) => {
                            setAddFavorAndBan({ show: true, data: item, type: 'master' });
                            e.stopPropagation();
                          }}
                          className="text-2xl text-white cursor-pointer"
                        />
                        <MdDelete
                          onClick={(e: any) => {
                            setShowDeleteFavorAndBan({ show: true, name: item.order, type: 'master' });
                            e.stopPropagation();
                          }}
                          className="text-2xl text-white cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-justify pt-2 font-normal">
                    { item.description }
                  </div>
                </div>
              ))
            }
            {
              players.map((player: any, index: number) => (
                <div className="pt-5" key={index}>
                  <div className="pb-3">
                    { player.data.name !== '' ? `${ player.data.name } (${ capitalize(player.user) })`: capitalize(player.user) }
                  </div>
                  <div className="pb-3 border-white border-2 p-4">
                    <div className="flex w-full justify-between items-center">
                      <div className="text-white">Favor do Patrono da Tribo</div>
                    </div>
                    <div className="text-justify pt-2 font-normal">
                      { dataTrybes.filter((trybe: any) => trybe.nameEn === player.data.trybe)[0].favor }
                    </div>
                  </div>
                  <div className="pb-3 border-white border-2 p-4 mt-2">
                    <div className="flex w-full justify-between items-center">
                      <div className="text-white">Proibição do Patrono da Tribo</div>
                    </div>
                    <div className="text-justify pt-2 font-normal">
                      <div className="text-justify pt-2 font-normal">
                        { dataTrybes.filter((trybe: any) => trybe.nameEn === player.data.trybe)[0].ban }
                      </div>
                    </div>
                  </div>
                  {
                    player.data.favorsAndBans.map(( item: any, index: number) => (
                      <div key={index} className="pb-3 border-white border-2 p-4 mt-2">
                        <div className="flex w-full justify-between items-center">
                          <div className="text-white">Favor / Proibição imposto pelo Jogador ({item.order})</div>
                        </div>
                        <div className="text-justify pt-2 font-normal">
                          { item.description }
                        </div>
                      </div>
                    ))
                  }
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}