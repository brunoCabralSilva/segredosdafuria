'use client'
import { useState } from 'react';
import { actionFilterGift, actionTotalRenown, useSlice } from '@/redux/slice';
import { useAppDispatch } from '@/redux/hooks';
import { useAppSelector } from '@/redux/hooks';
import { motion } from 'framer-motion';
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
  const [searchByText, setSearchByText] = useState('');
  const [message, setMessage] = useState({ show: false, message: ''});
  const [global, setGlobal] = useState(false);
  const [listGifts, setListGifts] = useState<IGift[]>([]);
  const slice = useAppSelector(useSlice);
  const dispatch: any = useAppDispatch();

  const returnFilterPhrase = (): string => {
    let phrase = '';
    const data = slice.selectTA.filter((element: string) => element !== '');
    if (global) data.push('Dons Nativos');
    if (searchByText !== '') data.push(
      `Dons contendo o trecho "${searchByText}"`
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

    if(global) filters.push('global');
  
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

    if (searchByText !== '') {
      filterByText = filterItem.filter((item) =>
        item.gift.toLowerCase().includes(searchByText.toLowerCase())
        || item.giftPtBr.toLowerCase().includes(searchByText.toLowerCase())
      );
    }
    setMessage({
      show: true,
      message: returnFilterPhrase(),
    });

    const editionSelect: any = document.getElementById('renown');
    if (editionSelect) {
      editionSelect.selectedIndex = 0;
    }
    setListGifts(filterByText);
    dispatch(actionTotalRenown(0));
    dispatch(actionFilterGift('reset'));
    setGlobal(false);
    setSearchByText('');
  };

  return (
    <div className={`${slice.simplify ? 'bg-black' : 'bg-ritual'} text-white relative`}>
      <div className="bg-black/60 absolute w-full h-full" />
      <div className="px-2 z-10 relative">
        <Simplify />
        <Nav />
        <DataGifts />
        <FilterGifts type="trybes" title="Tribos" />
        <FilterGifts type="auspices" title="Augúrios" />
        <div
          className="bg-black font-bold mt-1 py-2 px-5 text-base flex flex-col pt-5 pb-2 justify-between items-center"
        >
          <p className="w-full text-xl text-center sm:text-left pb-2">Selecione um Renome e/ou Dons Nativos</p>
          <div className="flex flex-col sm:flex-row sm:flex-wrap justify-start gap-2 w-full py-1">
            <motion.div
              whileHover={{ scale: 0.98 }}
              className={`rounded-full font-bold shadow shadow-white px-4 py-2 flex items-center justify-center ${slice.totalRenown <= 0 ? 'bg-black text-white' : 'bg-white text-black'} cursor-pointer`}
            >
              <select
                id="renown"
                className={`outline-none ${slice.totalRenown <= 0 ? 'bg-black text-white' : 'bg-white text-black'}`}
                onChange={(e) =>dispatch(actionTotalRenown(e.target.value))}
              >
                <option className="w-full text-center sm:text-left" value={0} selected disabled>
                  Selecione um Renome Total
                </option>
                <option className="text-center sm:text-left" value={0}>Sem filtro de Renome</option>
                <option className="text-center sm:text-left" value={1}>Renome Total 1</option>
                <option className="text-center sm:text-left" value={2}>Renome Total 2</option>
                <option className="text-center sm:text-left" value={3}>Renome Total 3</option>
                <option className="text-center sm:text-left" value={4}>Renome Total 4</option>
                <option className="text-center sm:text-left" value={5}>Renome Total 5</option>
                <option className="text-center sm:text-left" value={6}>Renome Total 6</option>
                <option className="text-center sm:text-left" value={7}>Renome Total 7</option>
                <option className="text-center sm:text-left" value={8}>Renome Total 8</option>
                <option className="text-center sm:text-left" value={9}>Renome Total 9</option>
              </select>
            </motion.div>
            <motion.div
              whileHover={{ scale: 0.98 }}
              className={`rounded-full font-bold shadow shadow-white px-4 py-2 flex items-center justify-center ${global ? 'bg-white text-black' : 'bg-black text-white'} cursor-pointer`}
              onClick={ () => setGlobal(!global) }
            >
              <p className="w-full text-center sm:text-left">
                { `Clique aqui para ${!global ? 'incluir' : 'remover'} Dons Nativos na Busca` }
              </p>
            </motion.div>
          </div>
        </div>
        <div
          className="bg-black font-bold mt-1 py-2 px-5 text-base flex flex-col pt-5 pb-2 justify-between items-center"
        >
          <p className="w-full text-xl text-center sm:text-left pb-2">Digite o nome ou um trecho do nome do Dom</p>
          <input
            className="text-center sm:text-left w-full px-4 py-2 text-black rounded-full mb-3"
            value={ searchByText }
            placeholder="Digite aqui"
            onChange={ (e) => setSearchByText(e.target.value) }
          />
        </div>
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
          { message.show &&
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
              <Gift item={ item } key={ index } />
          ))
        }
        { 
          slice.feedback.show && <Feedback gift={ slice.feedback.gift } />
        }
        </div>
      </div>
      <Footer />
    </div>
  );
}