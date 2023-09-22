import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IGift } from "@/interfaces/Gift";
import { 
  actionFilterGift,
  actionFilteredList,
  actionGiftMessage,
  actionGlobal,
  actionSearchByText,
  actionTotalRenown,
  useSlice
} from "@/redux/slice";
import list from '../data/gifts.json';
import trybesList from '../data/trybes.json';

export default function SearchButton() {
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

  const sortList = (listG: IGift[]): IGift[] => {
    const sorteredList = listG.sort((a, b) => {
      if (a && a.belonging && b && b.belonging) {
        const aMinTotalRenown = Math.min(...a.belonging.map(item => item.totalRenown));
        const bMinTotalRenown = Math.min(...b.belonging.map(item => item.totalRenown));
  
        if (aMinTotalRenown === bMinTotalRenown) {
          const aMinType = a.belonging.find(item => item.totalRenown === aMinTotalRenown)?.type;
          const bMinType = b.belonging.find(item => item.totalRenown === bMinTotalRenown)?.type;
  
          if (aMinType && bMinType) {
            return aMinType.localeCompare(bMinType);
          }
        } else {
          return aMinTotalRenown - bMinTotalRenown;
        }
      }
      return 0;
    });
    return sorteredList;
  }
  const search = (): void => {
    dispatch(actionFilterGift([]));
    const filters = slice.selectTA.map((item: string) => {
      const trybe = trybesList.find((element) => item === element.namePtBr);
      if (trybe) {
        return trybe?.nameEn;
      } return item.toLowerCase();
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

    dispatch(actionGiftMessage({show: true, message: returnFilterPhrase()}));

    const editionSelect: any = document.getElementById('renown');
    if (editionSelect) editionSelect.selectedIndex = 0;
    
    const finalList = sortList(filterByText);

    dispatch(actionFilteredList(finalList));
    dispatch(actionTotalRenown(0));
    dispatch(actionFilterGift('reset'));
    dispatch(actionGlobal(false));
    dispatch(actionSearchByText(''));
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
        returnFilterPhrase() !== '' &&
        <p className="w-full text-sm text-center text-black">({ returnFilterPhrase() })</p>
      }
    </motion.div>
  );
}