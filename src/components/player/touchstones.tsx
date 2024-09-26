'use client'
import { FaRegEdit } from "react-icons/fa";
import { useContext, useState } from "react";
import contexto from "@/context/context";
import { MdDelete } from "react-icons/md";

export default function Touchstones() {
  const {
    dataSheet,
    setAddTouchstone,
    setShowDeleteTouchstone,
  } =  useContext(contexto);

  return(
    <div className="flex flex-col w-full overflow-y-auto h-full mb-3">
      <div className="w-full h-full mb-2 flex-col items-start justify-center font-bold">
        {
          dataSheet.touchstones.length < 3 &&
          <button
            type="button"
            onClick={() => setAddTouchstone({ show: true, data: {} }) }
            className="text-white bg-black border-2 border-white hover:border-red-800 transition-colors my-1 mb-3 cursor-pointer w-full p-2 font-bold"
          >
            Adicionar Pilares
          </button>
        }
        <div className="grid grid-cols-1 gap-3 pb-5">
          {
            dataSheet.touchstones
              .sort((a: { name: string; description: string },b: { name: string; description: string }) => {
                return a.name.localeCompare(b.name);
              })
              .map((item: any, index: number) => (
                <div key={index} className="pb-3 border-white border-2 p-4">
                  <div className="flex w-full justify-between items-center">
                    <div>{ item.name }</div>
                    <div className="flex items-center gap-1">
                      <FaRegEdit
                        onClick={(e: any) => {
                          setAddTouchstone({ show: true, data: item });
                          e.stopPropagation();
                        }}
                        className="text-2xl text-white cursor-pointer"
                      />
                      <MdDelete
                        onClick={(e: any) => {
                          setShowDeleteTouchstone({ show: true, name: item.name });
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