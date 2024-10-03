'use client'
import { useContext, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import contexto from "@/context/context";
import dataAdvAndFlaws from '../../data/advantagesAndFlaws.json';
import AdvOrFlawAdded from "../player/advOrFlawAdded";
import dataTalens from '../../data/talismans.json';
import dataLoresheets from '../../data/loresheets.json';
import ItemLoresheet from "../player/loresheets";
import ItemTalisman from "../player/talisman";
import ItemAdvantage from "../player/itemAdvantage";

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
          <select
            value={selectOption}
            onChange={(e) => setSelectOption(e.target.value) }
            className="border-2 cursor-pointer border-white p-2 mt-2 bg-black w-full text-white font-bold"
          >
            <option value="merits">Méritos e Backgrounds</option>
            <option value="talens">Talismãs</option>
            <option value="loresheets">Loresheets</option>
          </select>
        }
        <div className="custom-grid">
          {
            type === 'advantage'
            ? <div className={`flex-1 pt-3 pb-2 text-justify overflow-y-auto ${ type === 'advantage' ? 'col1': 'col1-73' }`}>
              { 
                selectOption === 'merits' &&
                <div>{
                  dataAdvAndFlaws.map((item: any, index: number) => (
                    <div key={index} className="pb-2">
                      <ItemAdvantage type="advantage" item={item} />
                    </div>
                  ))
                }</div>
              }
              { 
                selectOption === 'talens' &&
                <div>{
                  dataTalens.map((item: any, index: number) => (
                    <div key={index} className="pb-2">
                      <ItemTalisman item={item} />
                    </div>
                  ))
                }</div>
              }
              {
                selectOption === 'loresheets' &&
                <div>{
                  dataLoresheets.map((item: any, index: number) => (
                    <div key={index} className="pb-2">
                      <ItemLoresheet item={item} />
                    </div>
                  ))
                }</div>
              }
              
            </div>
            : <div className={`flex-1 pt-3 pb-2 text-justify overflow-y-auto ${ type === 'advantage' ? 'col1': 'col1-73' }`}>
              { 
                type === 'flaw' &&
                <div>{
                  dataAdvAndFlaws.map((item: any, index: number) => (
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