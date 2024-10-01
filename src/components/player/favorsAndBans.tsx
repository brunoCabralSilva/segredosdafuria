'use client'
import { FaRegEdit } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import contexto from "@/context/context";
import { MdDelete } from "react-icons/md";
import dataTrybes from '../../data/trybes.json';

export default function FavorsAndBans() {
  const [favorTrybe, setFavorTrybe] = useState('');
  const [banTrybe, setBanTrybe] = useState('');
  const {
    setAddFavorAndBan,
    setShowDeleteFavorAndBan,
    session,
    dataSheet,
    setShowMessage,
  } =  useContext(contexto);

  useEffect(() => {
    if (dataSheet.trybe !== '') {
      const dataTrybe: any = dataTrybes.find((trybe: any) => trybe.nameEn === dataSheet.trybe);
      setFavorTrybe(dataTrybe.favor);
      setBanTrybe(dataTrybe.ban)
    } else setShowMessage({ show: true, text: 'Necessário definir uma Tribo para que possa ser listado o Favor e a Proibição do Patrono Relacionado.'});
  }, []);

  return(
    <div className="flex flex-col w-full overflow-y-auto h-full mb-3">
      <div className="w-full h-full mb-2 flex-col items-start justify-center font-bold">
        <button
          type="button"
          onClick={() => setAddFavorAndBan({ show: true, data: {} }) }
          className="text-white bg-black border-2 border-white hover:border-red-800 transition-colors my-1 mb-3 cursor-pointer w-full p-2 font-bold"
        >
          Adicionar Novo Favor ou Proibição
        </button>
        <div className="grid grid-cols-1 gap-3 pb-5">
          <div className="pb-3 border-white border-2 p-4">
            <div className="flex w-full justify-between items-center">
              <div>Favor do Patrono da Tribo</div>
            </div>
            <div className="text-justify pt-2 font-normal">
              { favorTrybe }
            </div>
          </div>
          <div className="pb-3 border-white border-2 p-4">
            <div className="flex w-full justify-between items-center">
              <div>Proibição do Patrono da Tribo</div>
            </div>
            <div className="text-justify pt-2 font-normal">
              { banTrybe }
            </div>
          </div>
          {
            session.favorsAndBans
              .map((item: any, index: number) => (
                <div key={index} className="pb-3 border-white border-2 p-4">
                  <div className="flex w-full justify-between items-center">
                    <div>Favor / Proibição imposta pelo Narrador</div>
                  </div>
                  <div className="text-justify pt-2">
                    { item }
                  </div>
                </div>
              ))
          }
          {
            dataSheet.favorsAndBans
              .map((item: any, index: number) => (
                <div key={index} className="pb-3 border-white border-2 p-4">
                  <div className="flex w-full justify-between items-center">
                    <div>Princípio imposto pelo Jogador ({ item.order })</div>
                    <div className="flex items-center gap-1">
                      <FaRegEdit
                        onClick={(e: any) => {
                          setAddFavorAndBan({ show: true, data: item });
                          e.stopPropagation();
                        }}
                        className="text-2xl text-white cursor-pointer"
                      />
                      <MdDelete
                        onClick={(e: any) => {
                          setShowDeleteFavorAndBan({ show: true, name: item.order });
                          e.stopPropagation();
                        }}
                        className="text-2xl text-white cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="text-justify pt-2">
                    { item.description }
                  </div>
                </div>
              ))
          }
        </div>
      </div>
    </div>
  );
}