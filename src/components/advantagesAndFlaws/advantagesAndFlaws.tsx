'use client'
import { useContext } from 'react';
import contexto from '@/context/context';
import { IoAdd } from 'react-icons/io5';
import AddAdvOrFlaw from '../popup/addAdvOrFlaw';
import AdvAdded from './advAdded';
import AdvTalensAdded from './advTalensAdded';
import AdvLoresheetsAdded from './advLoresheetsAdded';

export default function AdvantagesAndFlaws() {
  const {
    dataSheet,
    showAllFlaws, setShowAllFlaws,
    showAllAdvantages, setShowAllAdvantages,
  } = useContext(contexto);

  const sumAllAdvantagesAndFlaws = () => {
    let advantageSum = 0;
    let flawSum = 0;
    dataSheet.data.advantagesAndFlaws.advantages.forEach((item: any) => advantageSum += item.cost);
    dataSheet.data.advantagesAndFlaws.talens.forEach((item: any) => advantageSum += item.value);
    dataSheet.data.advantagesAndFlaws.loresheets.forEach((item: any) => advantageSum += item.cost);
    dataSheet.data.advantagesAndFlaws.flaws.forEach((item: any) => flawSum += item.cost);
    let textAdvantage = advantageSum + ' / 7 ';
    let textFlaw = flawSum + ' / 2 ';
    return (
    <div className="flex flex-col border-2 border-white p-4 text-white justify-center bg-black items-between w-full gap-2">
      <div className={
        `${advantageSum > 7 && 'text-red-800'}
         ${advantageSum === 7 && 'text-green-500'}
         flex justify-between
      `}>
        <p><span>Total em Vantagens: {textAdvantage}</span></p>
        <button
          type="button"
          className="p-1 border-2 border-white bg-white right-3"
          onClick={ () => setShowAllAdvantages(true) }
        >
          <IoAdd className="text-black text-xl" />
        </button>
      </div>
      <div className={
        `${flawSum > 2 && 'text-red-800'}
         ${flawSum === 2 && 'text-green-500'}
         flex justify-between
      `}>
        <p><span>Total em Defeitos: {textFlaw}</span></p>
        <button
          type="button"
          className="p-1 border-2 border-white bg-white right-3"
          onClick={ () => setShowAllFlaws(true) }
        >
          <IoAdd className="text-black text-xl" />
        </button>
      </div>
    </div>
    );
  }

  return(
    <div className="flex flex-col w-full h-75vh overflow-y-auto">
      <div className="w-full h-full mb-2 flex-col items-start justify-center font-bold">
        { sumAllAdvantagesAndFlaws() }
        {
          dataSheet && dataSheet.data && dataSheet.data.advantagesAndFlaws && dataSheet.data.advantagesAndFlaws.advantages && dataSheet.data.advantagesAndFlaws.advantages.length > 0 &&
          <div>
            <div className="w-full mt-5 mb-3">Méritos e Backgrounds</div>
            {
              dataSheet.data.advantagesAndFlaws.advantages.map((item: any, index: number) => (
                <AdvAdded key={index} item={item} />
              ))
            }
          </div>
        }
        {
          dataSheet && dataSheet.data && dataSheet.data.advantagesAndFlaws && dataSheet.data.advantagesAndFlaws.talens && dataSheet.data.advantagesAndFlaws.talens.length > 0 &&
          <div>
            <div className="w-full mt-5 mb-3">Talismãs</div>
            {
              dataSheet.data.advantagesAndFlaws.talens.map((item: any, index: number) => (
                <AdvTalensAdded key={index} item={item} />
              ))
            }
          </div>
        }
        {
          dataSheet && dataSheet.data && dataSheet.data.advantagesAndFlaws && dataSheet.data.advantagesAndFlaws.loresheets && dataSheet.data.advantagesAndFlaws.loresheets.length > 0 &&
          <div>
            <div className="w-full mt-5 mb-3">Loresheets</div>
            {
              dataSheet.data.advantagesAndFlaws.loresheets.map((item: any, index: number) => (
                <AdvLoresheetsAdded key={index} item={item} />
              ))
            }
          </div>
        }
        {
          dataSheet && dataSheet.data && dataSheet.data.advantagesAndFlaws && dataSheet.data.advantagesAndFlaws.flaws && dataSheet.data.advantagesAndFlaws.flaws.length > 0 &&
          <div>
            <div className="w-full mt-5 mb-3">Defeitos</div>
            {
              dataSheet.data.advantagesAndFlaws.flaws.map((item: any, index: number) => (
                <AdvAdded key={index} item={item} />
              ))
            }
          </div>
        }
      </div>
      { showAllAdvantages && <AddAdvOrFlaw type="advantage" />}
      { showAllFlaws && <AddAdvOrFlaw type="flaw" />}
    </div>
  );
}