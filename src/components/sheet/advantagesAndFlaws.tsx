'use client'
import { useEffect, useState } from 'react';
import data from '../../data/advantagesAndFlaws.json';
import Advantage from './itemAdvangate';
import { IoAdd, IoClose } from 'react-icons/io5';
import ItensAdvantagesAdded from './itemAdvantagedAdded';

export default function AdvantagesAndFlaws(props: any) {
  const { session } = props;
  const [allAdvantages, showAllAdvantages] = useState(false);

  return(
    <div className="flex flex-col w-full overflow-y-auto pr-2 h-full mb-3">
      <div className="w-full h-full mb-2 cursor-pointer flex-col items-start justify-center font-bold">
      <div className="mt-1 p-2 flex justify-between items-center mb-2 border-white border-2 bg-black relative">
        <div
          className="text-white mt-2 pb-2 w-full flex-col items-center justify-center sm:text-center"
        >
          {
          !allAdvantages
          ? <span className="text-sm">Minhas Vantagens e Defeitos</span>
          : <span className="text-sm">Adicionar Vantagens e Defeitos</span>
          }
        </div>
        <button
          type="button"
          className="p-1 border-2 border-white bg-white sm:absolute right-3"
          onClick={ () => {
            showAllAdvantages(!allAdvantages);
          }}
        >
          { 
            !allAdvantages
            ? <IoAdd
                className="text-black text-xl"
              />
            : <IoClose className="text-black text-xl" />
          }
        </button>
      </div>
      {
        allAdvantages ?
        <div className="h-full text-white ">
          {
            data.map((item: any, index: number) => (
              <Advantage key={index} item={item} session={session} />
            ))
          }
        </div>
        : <ItensAdvantagesAdded session={session} />
      }
      </div>
    </div>
  );
}