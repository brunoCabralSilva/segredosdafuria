'use client'
import { useRef, useState } from 'react';
import { 
  actionFilterGift,
  actionGlobal,
  actionSearchByText,
  actionTotalRenown,
  useSlice
} from '@/redux/slice';
import { motion } from 'framer-motion';
import { useAppDispatch } from '@/redux/hooks';
import { useAppSelector } from '@/redux/hooks';

import list from '../../data/gifts.json';

import { IGift } from '@/interfaces/Gift';

import Nav from '@/components/nav';
import Footer from '@/components/footer';
import Gift from '@/components/gift';
import Feedback from '@/components/feedback';
import DataGifts from '@/components/dataGifts';
import FilterGifts from '@/components/filterGifts';
import Simplify from '@/components/simplify';

export default function Gifts() {
  const describe = useRef<HTMLDivElement | null>(null);
  const [message, setMessage] = useState({ show: false, message: ''});
  const [listGifts, setListGifts] = useState<IGift[]>([]);
  const slice = useAppSelector(useSlice);
  const dispatch: any = useAppDispatch();

  const returnFilterPhrase = (): string => {
    let phrase = '';
    const data = slice.selectTA.filter((element: string) => element !== '');
    if (slice.global) data.push('Dons Nativos');
    if (slice.searchByText !== '' && slice.searchByText !== ' ') data.push(
      `Dons contendo o trecho "${slice.searchByText}"`
    );
    for (let i = 0; i < data.length; i += 1) {
      if (i !== data.length - 1) {
        phrase += (`${data[i]}, `);
      } else {
        phrase += (`${data[i]} ${slice.totalRenown !== 0 ? `e Renome Total até ${slice.totalRenown}` : ''}`);
      }
    }
    if (data.length === 0 && slice.totalRenown > 0) phrase = (`Renome Total até ${slice.totalRenown}`);

    return phrase;
  };

  const search = (): void => {
    setListGifts([]);
    const filters = slice.selectTA.map((item: string) => {
      switch(item) {
        case 'Peregrinos Silenciosos':
          return 'silent striders';
        case 'Fúrias Negras':
          return 'black furies';
        case 'Presas de Prata':
          return 'silver fangs';
        case 'Guarda do Cervo':
          return 'hart wardens';
        case 'Conselho Fantasma':
          return 'ghost council';
        case 'Perseguidores da Tempestade':
          return 'galestalkers';
        case 'Andarilhos do Asfalto':
          return 'glass walkers';
        case 'Roedores de Ossos':
          return 'bone gnawers';
        case 'Senhores das Sombras':
          return 'shadow lords';
        case 'Filhos de Gaia':
          return 'children of gaia';
        case 'Garras Vermelhas':
          return 'red talons';
        default:
          return item.toLowerCase();
      }
    });

    if(slice.global) filters.push('global');
  
    const filterItem: IGift[] = [];
  
    for (let i = 0; i < list.length; i += 1) {
      const giftItem = list[i];
  
      const matchesType = filters.length === 0 || giftItem.belonging.some((belonging) => filters.includes(belonging.type));
  
      const matchesRenown = slice.totalRenown === 0 || giftItem.belonging.some((belonging) => belonging.totalRenown <= slice.totalRenown);
  
      if (matchesType && matchesRenown) {
        filterItem.push(giftItem);
      }
    }

    let filterByText = filterItem;

    if (slice.searchByText !== '' && slice.searchByText !== ' ') {
      filterByText = filterItem.filter((item) => 
        item.gift.toLowerCase().includes(slice.searchByText.toLowerCase())
        || item.giftPtBr.toLowerCase().includes(slice.searchByText.toLowerCase())
      );
    }

    setMessage({
      show: true,
      message: returnFilterPhrase(),
    });

    const editionSelect: any = document.getElementById('renown');
    if (editionSelect) editionSelect.selectedIndex = 0; 

    setListGifts(filterByText);
    dispatch(actionTotalRenown(0));
    dispatch(actionFilterGift('reset'));
    dispatch(actionGlobal(false));
    dispatch(actionSearchByText(''));
  };

  return (
    <div className={`${slice.simplify ? 'bg-black' : 'bg-ritual'} text-white relative`}>
      <div className="bg-black/60 absolute w-full h-full" />
      <div className="px-2 z-10 relative">
        <Simplify />
        <Nav />
        <DataGifts />
        <div ref={ describe } />
        <FilterGifts title="Tribos"  />
        <FilterGifts title="Augúrios" />
        <FilterGifts title="Renome e/ou Dons Nativos"  />
        <FilterGifts title="text" />
        <motion.div
          whileHover={{ scale: 0.98 }}
          onClick={ search }
          className="font-bold py-4 px-5 text-lg bg-white my-2 cursor-pointer"
        >
          <p className="w-full text-center text-black">
            Buscar
          </p>
          { 
            returnFilterPhrase() !== '' &&
            <p className="w-full text-sm text-center text-black">({ returnFilterPhrase() })</p>
          }
        </motion.div>
        <div className="">
          { 
            message.show &&
            <div className="font-bold py-4 px-5 text-lg bg-black mt-2 mb-1 text-white">
              <p className="w-full text-center">
                Total de Dons Encontrados: { listGifts.length }
              </p>
              {
                message.message !== '' &&
                <p className="w-full text-center">
                  Filtros Selecionados: { message.message }
                </p>
              }
            </div>
          }
          {
            listGifts.map((item: IGift, index: number) => (
              <Gift
                key={ index }
                describe={ describe }
                item={ item }
              />
            ))
          }
          { slice.feedback.show && <Feedback gift={ slice.feedback.gift } /> }
        </div>
      </div>
      <Footer />
    </div>
  );
}