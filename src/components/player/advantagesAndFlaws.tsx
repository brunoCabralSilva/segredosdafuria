'use client'
import { useContext, useEffect, useState } from 'react';
import { getPlayerByEmail } from '@/firebase/players';
import contexto from '@/context/context';
import { IoAdd } from 'react-icons/io5';
import { CiCircleChevDown } from "react-icons/ci";
// import dataTalismans from '../../../data/talismans.json';
// import dataLoresheets from '../../../data/loresheets.json';
import AddAdvOrFlaw from '../popup/addAdvOrFlaw';
import AdvAdded from './advAdded';
import AdvTalensAdded from './advTalensAdded';
import AdvLoresheetsAdded from './advLoresheetsAdded';

export default function AdvantagesAndFlaws() {
  const [adv, setAdv] = useState<any>([]);
  const {
    dataSheet,
    sessionId, email,
    showAllFlaws, setShowAllFlaws,
    showAllAdvantages, setShowAllAdvantages,
  } = useContext(contexto);

  useEffect(() => {
    const getAllAdvantages = async () => {
      const player = await getPlayerByEmail(sessionId, email);
      if (player) setAdv(player.data.advantagesAndFlaws);
      else window.alert('Jogador não encontrado! Por favor, atualize a página e tente novamente');
    }
    getAllAdvantages();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sumAllAdvantagesAndFlaws = () => {
    let advantageSum = 0;
    let flawSum = 0;
    dataSheet.advantagesAndFlaws.advantages.forEach((item: any) => advantageSum += item.cost);
    dataSheet.advantagesAndFlaws.talens.forEach((item: any) => advantageSum += item.value);
    dataSheet.advantagesAndFlaws.loresheets.forEach((item: any) => advantageSum += item.cost);
    dataSheet.advantagesAndFlaws.flaws.forEach((item: any) => flawSum += item.cost);
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
    <div className="flex flex-col w-full overflow-y-auto h-full mb-3">
      <div className="w-full h-full mb-2 flex-col items-start justify-center font-bold">
        { sumAllAdvantagesAndFlaws() }
        <div className="w-full mt-5 mb-3">Méritos e Backgrounds</div>
        {
          dataSheet.advantagesAndFlaws.advantages.map((item: any, index: number) => (
            <AdvAdded key={index} item={item} />
          ))
        }
        <div className="w-full mt-5 mb-3">Defeitos</div>
        {
          dataSheet.advantagesAndFlaws.flaws.map((item: any, index: number) => (
            <AdvAdded key={index} item={item} />
          ))
        }
        <div className="w-full mt-5 mb-3">Talismãs</div>
        {
          dataSheet.advantagesAndFlaws.talens.map((item: any, index: number) => (
            <AdvTalensAdded key={index} item={item} />
          ))
        }
        <div className="w-full mt-5 mb-3">Loresheets</div>
        {
          dataSheet.advantagesAndFlaws.loresheets.map((item: any, index: number) => (
            <AdvLoresheetsAdded key={index} item={item} />
          ))
        }
      </div>
      { showAllAdvantages && <AddAdvOrFlaw type="advantage" />}
      { showAllFlaws && <AddAdvOrFlaw type="flaw" />}
    </div>
  );
}