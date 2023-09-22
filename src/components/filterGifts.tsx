'use client'
import { ChangeEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionFilterGift, actionGlobal, actionSearchByText, actionTotalRenown, useSlice } from "@/redux/slice";
import { motion } from "framer-motion";
import trybes from '../data/trybes.json';

export default function FilterGifts(props: { title: string }) {
  const [list, setList] = useState<string[] | number[]>([]);
  const slice = useAppSelector(useSlice);
  const dispatch: any = useAppDispatch();
  const { title } = props;
  const { selectTA } = slice;
  
  useEffect(() => {
    const trybesList = trybes.map((element) => element.namePtBr);
    if (title === 'Tribos') setList(trybesList);
    else if (title === 'Augúrios') setList(slice.auspices);
    else setList(slice.totalRenown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const typeText = (e: ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
    dispatch(actionSearchByText(sanitizedValue));
  };

  if (title === 'Tribos' || title === 'Augúrios') {
    return(
      <div className="bg-black mt-1 py-3 px-5">
        <div
          className="font-bold pb-2 text-base flex flex-col justify-between items-center"
        >
          <p className="w-full text-xl text-center sm:text-left">
            { `Selecione um${title === 'Tribos' ? 'a' : ''} ou mais ${title}` }
          </p>
        </div>
        { 
          <div className="sm:flex sm:flex-wrap grid grid-cols-1 mobile:grid-cols-2 sm:justify-start gap-2 w-full py-1">
            {
              list.length > 0 && list.map((item: string | number, index: number) => (
                <motion.div
                  whileHover={{ scale: 0.98 }}
                  key={ index }
                  className={`shadow shadow-white rounded-full font-bold px-4 py-1 flex items-center justify-center ${selectTA.includes(item) ? 'bg-white text-black' : 'bg-black text-white'} cursor-pointer `}
                  onClick={ () => dispatch(actionFilterGift(item)) }
                >
                  <span className="leading-2 text-sm sm:text-base py-1 w-full text-center">
                    { item }
                  </span>
                </motion.div>
              ))
            }
          </div>
        }
      </div>
    );
  } else if (title === 'Renome e/ou Dons Nativos') {
    return(
      <div
        className="bg-black font-bold mt-1 py-2 px-5 text-base flex flex-col pt-5 pb-2 justify-between items-center"
      >
        <p className="w-full text-xl text-center sm:text-left pb-2">Selecione um Renome e/ou Dons Nativos</p>
        <div className="flex flex-col sm:flex-row sm:flex-wrap justify-start gap-2 w-full py-1">
          <select
            id="renown"            
            className={`outline-none ${slice.totalRenown <= 0 ? 'bg-black text-white' : 'bg-white text-black'} rounded-full font-bold shadow shadow-white px-4 py-2 flex items-center justify-center ${slice.totalRenown <= 0 ? 'bg-black text-white' : 'bg-white text-black'} cursor-pointer`}
            onChange={(e) =>dispatch(actionTotalRenown(e.target.value))}
          >
            <option className="w-full text-center sm:text-left" value={0} selected disabled>
              Selecione um Renome Total
            </option>
            <option className="text-center sm:text-left" value={0}>Sem filtro de Renome</option>
            {
              Array.from(
                { length: 9 },
                (_, index) => (
                  <option key={index + 1} className="text-center sm:text-left" value={index + 1}>
                    Renome Total {index + 1}
                  </option>
                )
              )
            }
          </select>
          <motion.div
            whileHover={{ scale: 0.98 }}
            className={`rounded-full font-bold shadow shadow-white px-4 py-2 flex items-center justify-center ${slice.global ? 'bg-white text-black' : 'bg-black text-white'} cursor-pointer`}
            onClick={ () => dispatch(actionGlobal(!slice.global)) }
          >
            <p className="w-full text-center sm:text-left">
              { `Clique aqui para ${!slice.global ? 'incluir' : 'remover'} Dons Nativos na Busca` }
            </p>
          </motion.div>
        </div>
      </div>
    );
  } return(
    <section
      className="bg-black font-bold mt-1 py-2 px-5 text-base flex flex-col pt-5 pb-2 justify-between items-center"
    >
      <p className="w-full text-xl text-center sm:text-left pb-2">
        Digite o nome ou um trecho do nome do Dom
      </p>
      <input
        className={`shadow shadow-white text-center sm:text-left w-full px-4 py-2 ${slice.searchByText === '' || slice.searchByText === ' '
        ? 'bg-black text-white' : 'bg-white text-black'} rounded-full mb-3`}
        value={ slice.searchByText }
        placeholder="Digite aqui"
        onChange={ (e) => typeText(e) }
      />
    </section>
  );
}