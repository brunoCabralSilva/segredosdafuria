'use client'
import { useContext, useEffect, useRef } from 'react';
import Nav from '@/components/nav';
import Footer from '@/components/footer';
import DataGifts from '../../components/dataGifts';
import FilterGifts from '../../components/filterGifts';
import ListGifts from '../../components/listGifts';
import Feedback from '@/components/feedback';
import contexto from '@/context/context';
import jsonGifts from '../../data/gifts.json';
import jsonTrybes from '../../data/trybes.json';

export default function Gifts() {
  const describe = useRef<HTMLDivElement | null>(null);
  const {
    showFeedback, setShowFeedback,
    listOfGiftsSelected, setListOfGiftsSelected,
    globalGifts, setGlobalGifts,
    textGift, setTextGift,
    totalRenown, setTotalRenown,
    setListOfGift, resetPopups
  } = useContext(contexto);

  useEffect(() => resetPopups(), []);

  const returnFilterPhrase = (): string => {
    let phrase = '';
    const data = listOfGiftsSelected.filter((element: string) => element !== '');
    if (globalGifts) data.push('Dons Nativos');
    if (textGift !== '' && textGift !== ' ') data.push(
      `Dons contendo o trecho "${textGift}"`
    );
    for (let i = 0; i < data.length; i += 1) {
      if (i !== data.length - 1) phrase += (`${data[i]}, `);
      else phrase += (`${data[i]} ${totalRenown !== 0 ? `e Renome Total até ${totalRenown}` : ''}`);
    }
    if (data.length === 0 && totalRenown > 0) phrase = (`Renome Total até ${totalRenown}`);
    return phrase;
  };

  const sortList = (listG: any) => {
    const sorteredList = listG.sort((a: any, b: any) => {
      if (a && a.belonging && b && b.belonging) {
        const aMinTotalRenown = Math.min(...a.belonging.map((item: any) => item.totalRenown));
        const bMinTotalRenown = Math.min(...b.belonging.map((item: any) => item.totalRenown));
        if (aMinTotalRenown === bMinTotalRenown) {
          const aMinType = a.belonging.find((item: any) => item.totalRenown === aMinTotalRenown)?.type;
          const bMinType = b.belonging.find((item: any) => item.totalRenown === bMinTotalRenown)?.type;
          if (aMinType && bMinType) return aMinType.localeCompare(bMinType);
        } else return aMinTotalRenown - bMinTotalRenown;
      }
      return 0;
    });
    return sorteredList;
  };

  const search = (): void => {
    let filterByText = jsonGifts;
    const filters = listOfGiftsSelected.map((item: string) => {
      const trybe = jsonTrybes.find((element) => item === element.namePtBr);
      if (trybe) return trybe?.nameEn;
      return item.toLowerCase();
    });
    if(globalGifts) filters.push('global');
    const filterItem = [];
    for (let i = 0; i < jsonGifts.length; i += 1) {
      const giftItem = jsonGifts[i];
      const matchesType = filters.length === 0 || giftItem.belonging.some((belonging) => filters.includes(belonging.type));
      const matchesRenown = totalRenown === 0 || giftItem.belonging.some((belonging) => belonging.totalRenown <= totalRenown);
      if (matchesType && matchesRenown) filterItem.push(giftItem);
    };
    filterByText = filterItem;
    if (textGift !== '' && textGift !== ' ') {
      filterByText = filterItem.filter((item) => 
        item.gift.toLowerCase().includes(textGift.toLowerCase())
        || item.giftPtBr.toLowerCase().includes(textGift.toLowerCase())
      );
    }
    const editionSelect: any = document.getElementById('renown');
    if (editionSelect) editionSelect.selectedIndex = 0;
    setListOfGift(sortList(filterByText));
    setTextGift('');
    setListOfGiftsSelected([]);
    setGlobalGifts(false);
    setTotalRenown(0);
  };

  return (
    <div className="bg-ritual text-white relative">
      <div className="bg-black/60 absolute w-full h-full" />
      <div className="px-2 z-10 relative">
        <Nav />
        <DataGifts />
        <div ref={ describe } />
        <FilterGifts title="Tribos"  />
        <FilterGifts title="Augúrios" />
        <FilterGifts title="Renome e/ou Dons Nativos"  />
        <FilterGifts title="text" />
        <div
          onClick={ search }
          className="font-bold py-4 px-5 text-lg bg-white my-2 cursor-pointer"
        >
          <p className="w-full text-center text-black">
            Buscar
          </p>
          { 
            <div className="w-full text-sm text-center text-black">
            {
              returnFilterPhrase() !== '' &&
              <p className="w-full text-sm text-center text-black">({ returnFilterPhrase() })</p>
            }
            </div>
          }
        </div>
        <ListGifts />
        <button
          type="button"
          className="pb-3 text-orange-300 hover:text-orange-600 transition-colors duration-300 mt-5 cursor-pointer underline"
          onClick={() => setShowFeedback(true) }
        >
          Enviar Feedback
        </button>
        {
          showFeedback && <Feedback title={ 'Página "Dons"' } /> 
        }
      </div>
      <Footer />
    </div>
  );
}