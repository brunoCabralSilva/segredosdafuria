import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  actionTalismanList,
  actionTalisman,
  actionTalismanMessage,
  useSlice,
} from "@/redux/slice";
import listTalisman from '../data/talismans.json';

interface ITalisman {
  title :String;
  titlePtBr :String;
  description :String;
  descriptionPtBr :String;
  system :String;
  systemPtBr :String;
  backgroundCost :String;
  backgroundCostPtBr :String;
  book: String;
  page: number;
}

export default function SearchTalismanButton() {
  const slice = useAppSelector(useSlice);
  const dispatch: any = useAppDispatch();

  const search = (): void => {
    let filterByText = listTalisman;
    if (slice.searchTalisman !== '' && slice.searchTalisman !== ' ') {
      filterByText = listTalisman.filter((item: ITalisman) => 
        item.title.toLowerCase().includes(slice.searchTalisman.toLowerCase())
        || item.titlePtBr.toLowerCase().includes(slice.searchTalisman.toLowerCase())
      );
    }
    dispatch(actionTalismanMessage(true))
    dispatch(actionTalismanList(filterByText));
    dispatch(actionTalisman(''));
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
          slice.searchTalisman !== '' &&
          `Talismãs contendo o trecho "${slice.searchTalisman}"`
        }
        </p>
      }
    </motion.div>
  );
}