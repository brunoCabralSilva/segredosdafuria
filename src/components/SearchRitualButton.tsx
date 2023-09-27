import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  actionRitualList,
  actionRitual,
  useSlice,
  actionRitualMessage
} from "@/redux/slice";
import listRitual from '../data/rituals.json';

interface IRitual {
  titlePtBr: String;
  title:String;
  type: String;
  descriptionPtBr: String;
  description: String;
  pool: String;
  systemPtBr: String;
  system: String;
}

export default function SearchRitualButton() {
  const slice = useAppSelector(useSlice);
  const dispatch: any = useAppDispatch();

  const search = (): void => {
    let filterByText = listRitual;
    if (slice.searchRitual !== '' && slice.searchRitual !== ' ') {
      filterByText = listRitual.filter((item: IRitual) => 
        item.title.toLowerCase().includes(slice.searchRitual.toLowerCase())
        || item.titlePtBr.toLowerCase().includes(slice.searchRitual.toLowerCase())
      );
    }
    dispatch(actionRitualMessage({ show: true }))
    dispatch(actionRitualList(filterByText));
    dispatch(actionRitual(''));
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
          slice.searchRitual !== '' &&
          `Rituais contendo o trecho "${slice.searchRitual}"`
        }
        </p>
      }
    </motion.div>
  );
}