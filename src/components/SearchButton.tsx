'use client'
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  useSlice,
  actionFilterGift,
  actionTotalRenown,
  actionGlobal,
  actionMessage,
  actionList,
  actionType,
} from "@/redux/slice";
import jsonTalismans from '../data/talismans.json';
import jsonRituals from '../data/rituals.json';
import jsonGifts from '../data/gifts.json';
import jsonTrybes from '../data/trybes.json';
import { IGift, IRitual, ITalisman } from "../interface";

export default function SearchButton(props: { type: String }) {
  const { type } = props;
  const slice = useAppSelector(useSlice);
  const dispatch: any = useAppDispatch();

  const returnFilterPhrase = (): string => {
    let phrase = '';
    const data = slice.selectTA.filter((element: string) => element !== '');
    if (slice.global) data.push('Dons Nativos');
    if (slice.type.gift !== '' && slice.type.gift !== ' ') data.push(
      `Dons contendo o trecho "${slice.type.gift}"`
    );
    for (let i = 0; i < data.length; i += 1) {
      if (i !== data.length - 1) phrase += (`${data[i]}, `);
      else phrase += (`${data[i]} ${slice.totalRenown !== 0 ? `e Renome Total até ${slice.totalRenown}` : ''}`);
    }
    if (data.length === 0 && slice.totalRenown > 0) phrase = (`Renome Total até ${slice.totalRenown}`);
    return phrase;
  };

  const sortList = (listG: IGift[]): IGift[] => {
    const sorteredList = listG.sort((a, b) => {
      if (a && a.belonging && b && b.belonging) {
        const aMinTotalRenown = Math.min(...a.belonging.map(item => item.totalRenown));
        const bMinTotalRenown = Math.min(...b.belonging.map(item => item.totalRenown));
        if (aMinTotalRenown === bMinTotalRenown) {
          const aMinType = a.belonging.find(item => item.totalRenown === aMinTotalRenown)?.type;
          const bMinType = b.belonging.find(item => item.totalRenown === bMinTotalRenown)?.type;
          if (aMinType && bMinType) return aMinType.localeCompare(bMinType);
        } else return aMinTotalRenown - bMinTotalRenown;
      }
      return 0;
    });
    return sorteredList;
  };

  const search = (): void => {
    dispatch(actionType({ show: false, ritual: '', talisman: '', gift: '' }));
    dispatch(actionList({ ritual: [], talisman:[], gift:[] }));
    let filterByText: ITalisman[] | IRitual[] | IGift[] = [];
    if (type === 'rituals') {
      filterByText = jsonRituals;
      if (slice.type.ritual !== '' && slice.type.ritual !== ' ') {
        filterByText = jsonRituals.filter((item: IRitual) => 
          item.title.toLowerCase().includes(slice.type.ritual.toLowerCase())
          || item.titlePtBr.toLowerCase().includes(slice.type.ritual.toLowerCase())
        );
      }
      dispatch(actionMessage({ type: 'ritual', show: true, message: '' }));
      dispatch(actionList({ ritual: filterByText, talisman: [], gift: [] }));
    } else if (type === 'talismans') {
      filterByText = jsonTalismans;
      if (slice.type.talisman !== '' && slice.type.talisman !== ' ') {
        filterByText = jsonTalismans.filter((item: ITalisman) => 
          item.title.toLowerCase().includes(slice.type.talisman.toLowerCase())
          || item.titlePtBr.toLowerCase().includes(slice.type.talisman.toLowerCase())
        );
      }
      dispatch(actionMessage({ type: 'talisman', show: true, message: '' }));
      dispatch(actionList({ ritual: [], talisman: filterByText, gift: [] }));
    } else {
      filterByText = jsonGifts;
      const filters = slice.selectTA.map((item: string) => {
        const trybe = jsonTrybes.find((element) => item === element.namePtBr);
        if (trybe) return trybe?.nameEn;
        return item.toLowerCase();
      });
      if(slice.global) filters.push('global');
      const filterItem: IGift[] = [];
      for (let i = 0; i < jsonGifts.length; i += 1) {
        const giftItem = jsonGifts[i];
        const matchesType = filters.length === 0 || giftItem.belonging.some((belonging) => filters.includes(belonging.type));
        const matchesRenown = slice.totalRenown === 0 || giftItem.belonging.some((belonging) => belonging.totalRenown <= slice.totalRenown);
        if (matchesType && matchesRenown) {
          filterItem.push(giftItem);
        }
      };
      filterByText = filterItem;
      if (slice.type.gift !== '' && slice.type.gift !== ' ') {
        filterByText = filterItem.filter((item) => 
          item.gift.toLowerCase().includes(slice.type.gift.toLowerCase())
          || item.giftPtBr.toLowerCase().includes(slice.type.gift.toLowerCase())
        );
      }
      dispatch(actionMessage(
        { 
          type: 'gift',
          show: true,
          message: '',
        }
      ));
      const editionSelect: any = document.getElementById('renown');
      if (editionSelect) editionSelect.selectedIndex = 0;
      const finalList = sortList(filterByText);
      dispatch(actionList({ ritual: [], talisman: [], gift: finalList }));
      dispatch(actionTotalRenown(0));
      dispatch(actionFilterGift('reset'));
      dispatch(actionGlobal(false));
      dispatch(actionMessage({ type: 'gift', text: returnFilterPhrase(), show: true  }))
    }
    dispatch(actionType({ show: false, ritual: '', talisman: '', gift: '' }));
  };

  return(
    <motion.div
      whileHover={{ scale: 0.98 }}
      onClick={ search }
      className="font-bold py-4 px-5 text-lg bg-white my-2 cursor-pointer"
    >
      <p className="w-full text-center text-black">
        Buscar
      </p>
      { 
        <p className="w-full text-sm text-center text-black">
        {
          slice.type.talisman !== '' && slice.type.show &&
          `Talismãs contendo o trecho "${slice.type.talisman}"`
        }
        {
          slice.type.ritual !== '' && slice.type.show &&
          `Rituais contendo o trecho "${slice.type.ritual}"`
        }
        {
          returnFilterPhrase() !== '' &&
          <p className="w-full text-sm text-center text-black">({ returnFilterPhrase() })</p>
        }
        </p>
      }
    </motion.div>
  );
}