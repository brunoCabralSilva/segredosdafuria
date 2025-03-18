'use client'
import { ChangeEvent, useContext, useEffect, useState } from "react";
import jsonTrybes from '../../data/trybes.json';
import jsonAuspices from '../../data/auspices.json';
import contexto from "@/context/context";

export default function FilterGifts(props: { title: string }) {
  const [list, setList] = useState<string[] | number[]>([]);
  const { title } = props;
  const { 
    globalGifts, setGlobalGifts,
    totalRenown, setTotalRenown,
    textGift, setTextGift,
    listOfGiftsSelected, setListOfGiftsSelected,
  } = useContext(contexto);
  
  useEffect(() => {
    if (title === 'Tribos') setList(jsonTrybes.map((element) => element.namePtBr));
    else if (title === 'Augúrios') {
      setList(jsonAuspices.map(auspice => auspice.name));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addGift = (gift: any) => {
    const findItem = listOfGiftsSelected.find((item: any) => gift === item);
    if (!findItem) setListOfGiftsSelected([...listOfGiftsSelected, gift]);
    else setListOfGiftsSelected(listOfGiftsSelected.filter((item: any) => gift !== item));
  }

  const typeText = (e: ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
    setTextGift(sanitizedValue);
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
          <div className="sm:flex sm:flex-wrap grid grid-cols-2 mobile:grid-cols-2 sm:justify-start gap-2 w-full py-1">
            {
              list.length > 0 && list.map((item: string | number, index: number) => (
                <div
                  key={ index }
                  className={`shadow shadow-white rounded-full font-bold px-4 py-1 flex items-center justify-center ${listOfGiftsSelected.includes(item) ? 'bg-white text-black' : 'bg-black text-white'} cursor-pointer `}
                  onClick={ () => addGift(item) }
                >
                  <span className="leading-2 text-sm sm:text-base py-1 w-full text-center">
                    { item }
                  </span>
                </div>
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
            className={`outline-none ${totalRenown <= 0 ? 'bg-black text-white' : 'bg-white text-black'} rounded-full font-bold shadow shadow-white px-4 py-2 flex items-center justify-center ${totalRenown <= 0 ? 'bg-black text-white' : 'bg-white text-black'} cursor-pointer`}
            onChange={ (e) => setTotalRenown(Number(e.target.value)) }
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
          <div
            className={`rounded-full font-bold shadow shadow-white px-4 py-2 flex items-center justify-center ${globalGifts ? 'bg-white text-black' : 'bg-black text-white'} cursor-pointer`}
            onClick={ () => setGlobalGifts(!globalGifts) }
          >
            <p className="w-full text-center sm:text-left">
              { `Clique aqui para ${!globalGifts ? 'incluir' : 'remover'} Dons Nativos na Busca` }
            </p>
          </div>
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
        className={`shadow shadow-white text-center sm:text-left w-full px-4 py-2 ${textGift === '' || textGift === ' '
        ? 'bg-black text-white' : 'bg-white text-black'} rounded-full mb-3`}
        value={ textGift }
        placeholder="Digite aqui"
        onChange={ (e) => typeText(e) }
      />
    </section>
  );
}