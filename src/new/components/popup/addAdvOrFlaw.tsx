'use client'
import { useContext, useEffect, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import dataAdvAndFlaws from '../../../data/advantagesAndFlaws.json';
import dataLoresheets from '../../../data/loresheets.json';
import dataTalens from '../../../data/talismans.json';
import contexto from "@/context/context";

export default function AddAdvOrFlaw(props: { type: string }) {
  const { type } = props;
  const { sessionId, email, returnSheetValues, dataSheet, setShowAllAdvantages, showAllAdvantages, setShowAllFlaws } =  useContext(contexto);
  // const [text, setText] = useState<string>('');

  return(
    <div className="fixed top-0 left-0 w-full h-screen flex flex-col overflow-y-auto bg-black/70 p-5 pb-3">
      <div className="bg-black w-full h-full relative">
        <div className="flex justify-between">
          <p className="text-white text-2xl">{ type === 'advantage' ? 'Vantagens' : 'Defeitos' }</p>
          <button
            type="button"
            className="p-1 right-3 h-10"
            onClick={ () => {
              setShowAllAdvantages(false);
              setShowAllFlaws(false);
            }}
          >
            <IoIosCloseCircleOutline
              className="text-4xl text-white cursor-pointer"
              onClick={ () => {
                setShowAllAdvantages(false);
                setShowAllFlaws(false);
              }}
            />
          </button>
        </div>
        <div className="bg-black p-3 text-justify">
          <div>Méritos e Backgrounds</div>
          {
            type === 'advantage' &&
            dataAdvAndFlaws &&
            dataAdvAndFlaws.map((item: any, index: number) => (
              <div key={index} className="my-5">
                <p className="capitalize">{ item.name }</p>
                <p>{ item.description }</p>
                {
                  item.advantages.map((adv: any, index2: number) => (
                    <div key={index2}>
                      <p>Custo: { adv.cost } - { adv.type }</p>
                      <p>{ adv.description }</p>
                    </div>
                  ))
                }
              </div>
            ))
          }
          {
            type === 'advantage' &&
            dataTalens &&
            dataTalens.map((item: any, index: number) => (
              <div key={index} className="my-5">
                <p className="capitalize">{ item.titlePtBr }</p>
                <p>{ item.descriptionPtBr }</p>
                <p>{ item.systemPtBr }</p>
                <p>{ item.backgroundCostPtBr }</p>
                {
                  item.cost.map((adv: any, index2: number) => (
                    <div key={index2}>
                      <p>Tipo { adv.type }</p>
                      <p>Valor: { adv.value }</p>
                    </div>
                  ))
                }
              </div>
            ))
          }
          {
            type === 'advantage' &&
            dataLoresheets &&
            dataLoresheets.map((item: any, index: number) => (
              <div key={index} className="my-5">
                <p className="capitalize">{ item.titlePtBr }</p>
                <p>{ item.descriptionPtBr }</p>
                {
                  item.habilities.map((adv: any, index2: number) => (
                    <div key={index2}>
                      <p>{ adv.skillPtBr }</p>
                    </div>
                  ))
                }
              </div>
            ))
          }
          {
            type === 'flaw' &&
            dataAdvAndFlaws &&
            dataAdvAndFlaws
              .filter((dataItem) => dataItem.flaws.length > 0)
              .map((item: any, index: number) => (
              <div key={index} className="my-5">
                <p className="capitalize">{ item.name }</p>
                <p>{ item.description }</p>
                {
                  item.flaws.map((adv: any, index2: number) => (
                    <div key={index2}>
                      <p>Custo: { adv.cost } - { adv.type }</p>
                      <p>{ adv.description }</p>
                    </div>
                  ))
                }
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}