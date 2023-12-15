'use client'
import { useEffect, useState } from 'react';
import data from '../../data/advantagesAndFlaws.json';
import dataLoresheets from '../../data/loresheets.json';
import dataTalismans from '../../data/talismans.json';
import Advantage from './itemAdvangate';
import { IoAdd, IoClose } from 'react-icons/io5';
import ItensAdvantagesAdded from './itemAdvantagedAdded';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import firebaseConfig from '@/firebase/connection';
import { useRouter } from 'next/navigation';
import { authenticate, signIn } from '@/firebase/login';
import AdvantageLoresheets from './itemAdvangateLoresheet';
import AdvantageTalismans from './itemAdvangateTalismans';

export default function AdvantagesAndFlaws(props: any) {
  const { session } = props;
  const [allAdvantages, showAllAdvantages] = useState(false);
  const router = useRouter();
  const [adv, setAdv] = useState<any>([]);

  useEffect(() => {
    getAllAdvantages();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAllAdvantages = async () => {
    const authData: { email: string, name: string } | null = await authenticate();
    if (authData && authData.email && authData.name) {
      const { email } = authData;
      const db = getFirestore(firebaseConfig);
      const userQuery = query(collection(db, 'sessions'), where('name', '==', session));
      const userQuerySnapshot = await getDocs(userQuery);
      const userDocument = userQuerySnapshot.docs[0];
      const advAndflw = userDocument.data();
      const playerFound = advAndflw.players.find((player: any) => player.email === email);
      const listOfAdvantages = playerFound.data.advantagesAndFlaws.filter((item: any) => item.flaws.length > 0 || item.advantages.length > 0);
      setAdv(listOfAdvantages);
    } else {
      const sign = await signIn();
      if (!sign) {
        window.alert('Houve um erro ao realizar a autenticação. Por favor, faça login novamente.');
        router.push('/');
      }
    }
  }

  const sumAllAdvantagesAndFlaws = () => {
    let advantageSum = 0;
    let flawSum = 0;
    adv.forEach((item: any) => {
      console.log(item);
      if (item.flaws.length > 0) {
        item.flaws.forEach((it: any) => flawSum += it.value)
      }
      if (item.advantages.length > 0) {
        item.advantages.forEach((it: any) => advantageSum += it.value)
      }
    });
    return (
    <div className="flex flex-col border-2 border-white p-4 text-white justify-center items-center">
      <div className={
        `${advantageSum > 7 && 'text-red-800'}
         ${advantageSum === 7 && 'text-green-500'}
      `}>
        Total em Vantagens: {advantageSum} {advantageSum !== 7 && <span>/ 7</span>}</div>
      <div className={`
        ${flawSum > 2 && 'text-red-800'}
        ${flawSum === 2 && 'text-green-500'}
      `}>
        Total em Defeitos: {flawSum} {flawSum !== 2 && <span>/ 2</span>}</div>
    </div>
    );
  }

  return(
    <div className="flex flex-col w-full overflow-y-auto pr-2 h-full mb-3">
      <div className="w-full h-full mb-2 cursor-pointer flex-col items-start justify-center font-bold">
      <div className="mt-1 p-2 flex justify-between items-center mb-2 border-white border-2 bg-black relative">
        <div
          className="text-white mt-2 pb-2 w-full flex-col items-center justify-center sm:text-center"
        >
          {
          !allAdvantages
          ? <p className="text-sm w-full text-center">Minhas Vantagens e Defeitos</p>
          : <p className="text-sm w-full text-center">Adicionar Vantagens e Defeitos</p>
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
      <div className="mb-3">{sumAllAdvantagesAndFlaws()}</div>
      {
        allAdvantages ?
        <div className="h-full text-white ">
          {
            data.map((item: any, index: number) => (
              <Advantage
                key={index}
                item={item}
                index={index}
                session={session}
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
                session={session}
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
                session={session}
                setAdv={setAdv}
              />
            ))
          }
        </div>
        : <ItensAdvantagesAdded
            session={session}
            adv={adv}
            setAdv={setAdv}
          />
      }
      </div>
    </div>
  );
}