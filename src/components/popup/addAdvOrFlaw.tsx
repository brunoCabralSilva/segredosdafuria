'use client'
import { useContext, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import contexto from "@/context/context";
import dataAdvAndFlaws from '../../data/advantagesAndFlaws.json';
import AdvOrFlawAdded from "../advantagesAndFlaws/advOrFlawAdded";
import dataTalens from '../../data/talismans.json';
import dataLoresheets from '../../data/loresheets.json';
import ItemLoresheet from "../sheetItems/itemLoresheets";
import ItemTalisman from "../sheetItems/itemTalisman";
import ItemAdvantage from "../sheetItems/itemAdvantage";
import { ILoresheet } from "@/interface";

export default function AddAdvOrFlaw(props: { type: string }) {
  const [ selectOption, setSelectOption ] = useState('merits');
  const { type } = props;
  const { setShowAllAdvantages, setShowAllFlaws } =  useContext(contexto);
  return(
    <div className="fixed top-0 left-0 w-full h-screen flex flex-col bg-black/70  p-2 pb-3">
      <div className="bg-black border-2 border-white w-full h-full p-2 sm:p-5">
        <div className="flex justify-between">
          <p className="text-white font-bold text-2xl py-3 pt-2">{ type === 'advantage' ? 'Vantagens' : 'Defeitos' }</p>
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
        {
          type === 'advantage' &&
          <div className="flex gap-1 mb-2">
            <button
              type="button"
              className={`${selectOption === 'merits' ? 'border-red-500 bg-black' : 'border-white bg-gray-whats-dark'} px-3 py-1 border-2 rounded-full text-white`}
              onClick={ (e) => setSelectOption('merits') }
            >
              Méritos e Backgrounds
            </button>
            <button
              type="button"
              className={`${selectOption === 'talens' ? 'border-red-500 bg-black' : 'border-white bg-gray-whats-dark'} px-3 py-1 border-2 rounded-full text-white`}
              onClick={ (e) => setSelectOption('talens') }
            >
              Talismãs
            </button>
            <button
              type="button"
              className={`${selectOption === 'loresheets' ? 'border-red-500 bg-black' : 'border-white bg-gray-whats-dark'} border-2 px-3 py-1 rounded-full text-white`}
              onClick={ (e) => setSelectOption('loresheets') }
            >
              Loresheets
            </button>
          </div>
        }
        
        <div className="custom-grid">
          {
            type === 'advantage'
            ? <div className={`flex-1 pt-3 pb-2 text-justify overflow-y-auto ${ type === 'advantage' ? 'col1': 'col1-73' }`}>
              { 
                selectOption === 'merits' &&
                <div>{
                  dataAdvAndFlaws
                  .filter((adv: any) => adv.advantages?.length > 0)
                  .map((item: any, index: number) => (
                    <div key={index} className="pb-2">
                      <ItemAdvantage type="advantage" item={item} />
                    </div>
                  ))
                }</div>
              }
              { 
                selectOption === 'talens' &&
                <div>{
                  dataTalens
                  .map((item: any, index: number) => (
                    <div key={index} className="pb-2">
                      <ItemTalisman item={item} />
                    </div>
                  ))
                }</div>
              }
              {
                selectOption === 'loresheets' &&
                <div>
                  {
                    dataLoresheets
                    .filter((loresheet: ILoresheet) => !loresheet.custom)
                    .map((item: any, index: number) => (
                      <div key={index} className="pb-2">
                        <ItemLoresheet item={item} />
                      </div>
                    ))
                  }
                  <div className="pt-3 pb-5 text-center sm:text-left text-lg">Loresheets não oficiais (Criadas pela comunidade)</div>
                  {
                    dataLoresheets
                      .filter((loresheet: ILoresheet) => loresheet.custom)
                      .map((item: any, index: number) => (
                      <div key={index} className="pb-2">
                        <ItemLoresheet item={item} />
                      </div>
                    ))
                  }
                </div>
              }
              
            </div>
            : <div className={`flex-1 pt-3 pb-2 text-justify overflow-y-auto ${ type === 'advantage' ? 'col1': 'col1-73' }`}>
              { 
                type === 'flaw' &&
                <div>{
                  dataAdvAndFlaws
                  .filter((adv: any) => adv.flaws?.length > 0)
                  .map((item: any, index: number) => (
                    <div key={index} className="pb-2">
                      <ItemAdvantage type="flaw" item={item} />
                    </div>
                  ))
                }</div>
              }
            </div>
          }
          <div className={`${ type === 'advantage' ? 'col2': 'col2-73'} hidden sm:flex w-full pl-2 pt-3`}>
            <AdvOrFlawAdded type={type} />
          </div>
        </div>
      </div>
    </div>
  );
}