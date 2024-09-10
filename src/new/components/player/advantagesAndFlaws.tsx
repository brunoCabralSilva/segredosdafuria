'use client'
import { useContext, useEffect, useState } from 'react';
import { getPlayerByEmail } from '@/new/firebase/players';
import contexto from '@/context/context';
import { IoAdd } from 'react-icons/io5';
import AdvantageLoresheets from './itemAdvLst';
import AdvantageTalismans from './itemAdvTlms';
import ItensAdvantagesAdded from './itemAdvAdd';
import Advantage from './itemAdv';
import data from '../../../data/advantagesAndFlaws.json';
import dataTalismans from '../../../data/talismans.json';
import dataLoresheets from '../../../data/loresheets.json';
import AddAdvOrFlaw from '../popup/addAdvOrFlaw';

export default function AdvantagesAndFlaws() {
  const [adv, setAdv] = useState<any>([]);
  const {
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
    adv.forEach((item: any) => {
      if (item.flaws.length > 0) item.flaws.forEach((it: any) => flawSum += it.value)
      if (item.advantages.length > 0) item.advantages.forEach((it: any) => advantageSum += it.value)
    });
    return (
    <div className="flex flex-col border-2 border-white p-4 text-white justify-center bg-black items-between w-full gap-2">
      <div className={
        `${advantageSum > 7 && 'text-red-800'}
         ${advantageSum === 7 && 'text-green-500'}
         flex justify-between
      `}>
        <p>
          <span>Total em Vantagens: {advantageSum}</span>
          { advantageSum !== 7 && <span>/ 7</span> }
        </p>
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
        <p>
          <span>Total em Defeitos: {flawSum}</span>
          { flawSum !== 2 && <span>/ 7</span> }
        </p>
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
      {/* {
        allAdvantages ?
        <div className="h-full text-white ">
          <div className="w-full text-center my-6">Vantagens e Defeitos</div>
          {
            data.map((item: any, index: number) => (
              <Advantage
                key={index}
                item={item}
                index={index}
                adv={adv}
                setAdv={setAdv}
              />
            ))
          }
          <div className="w-full text-center my-6">Loresheets</div>
          {
            dataLoresheets.map((item: any, index: number) => (
              <AdvantageLoresheets
                key={index}
                item={item}
                index={index}
                adv={adv}
                setAdv={setAdv}
              />
            ))
          }
          <div className="w-full text-center my-6">Talismãs</div>
          {
            dataTalismans.map((item: any, index: number) => (
              <AdvantageTalismans
                key={index}
                item={item}
                index={index}
                adv={adv}
                setAdv={setAdv}
              />
            ))
          }
        </div>
        : <ItensAdvantagesAdded
            adv={adv}
            setAdv={setAdv}
          />
      } */}
      </div>
      { showAllAdvantages && <AddAdvOrFlaw type="advantage" />}
      { showAllFlaws && <AddAdvOrFlaw type="flaw" />}
    </div>
  );
}