'use client'
import { useEffect, useState } from 'react';
import list from '../data/gifts.json';

interface type {
  type: string;
  totalRenown: number;
}

interface gift {
  gift: string;
  giftPtBr: string;
  belonging: type[];
  description: string;
  descriptionPtBr: string;
  renown: string;
  cost: string;
  action: string;
  pool: string;
  system: string;
  systemPtBr: string;
  duration: string;
  book: string;
  page: number;
}

interface IProps {
  valorRenown: number;
  selectedTrybe: string[];
}

export default function ListGifts(props: IProps) {
  const [listGifts, setListGifts] = useState([
    {
      gift: "",
      giftPtBr: "",
      belonging: [
        {
          type: "",
          totalRenown: 0
        }
      ],
      description: "",
      descriptionPtBr: "",
      renown: "",
      cost: "",
      action: "",
      pool: "",
      system: "",
      systemPtBr: "",
      duration: "",
      book: "",
      page: 0,
    }
  ]);
  const { valorRenown, selectedTrybe } = props;
  
  useEffect(() => {
    const filters = selectedTrybe.map((item) => {
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
    }).filter((element) => element !== '');

    if (valorRenown === 0 && filters.length === 0) {
      setListGifts(list);
    } else {
      let filterItem: gift[] = list;
      if (valorRenown > 0) {
        filterItem = [];
        for (let i = 0; i <= filters.length - 1; i += 1) {
          for (let j = 0; j <= list.length - 1; j += 1) {
            const filterType = list[j].belonging.filter((type) => type.type === filters[i] && type.totalRenown <= valorRenown);
            if(filterType.length > 0) filterItem.push(list[j]);
          }
          if (i === 0) setListGifts(filterItem);
          else setListGifts([...listGifts, ...filterItem]);
        }
      } else {
        filterItem = [];
        for (let i = 0; i <= filters.length - 1; i += 1) {
          for (let j = 0; j <= list.length - 1; j += 1) {
            const filterType = list[j].belonging.filter((type) => type.type === filters[i]);
            if(filterType.length > 0) {
              const testeDeRepeticao = filterItem.filter((element => element.gift ===  list[j].gift));
              if (testeDeRepeticao.length === 0) filterItem.push(list[j]);
            }
          }
          if (i === 0) setListGifts(filterItem);
          else setListGifts([...listGifts, ...filterItem]);
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function capitalizeFirstLetter(str: string): String {
    switch(str) {
      case 'global': return 'Dons Nativos';
      case 'silent striders': return 'Peregrinos Silenciosos';
      case 'black furies': return 'Fúrias Negras';
      case 'silver fangs': return 'Presas de Prata';
      case 'hart wardens': return 'Guarda do Cervo';
      case 'ghost council': return 'Conselho Fantasma';
      case 'galestalkers': return 'Perseguidores da Tempestade';
      case 'glass walkers': return 'Andarilhos do Asfalto';
      case 'bone gnawers': return 'Roedores de Ossos';
      case 'shadow lords': return 'Senhores das Sombras';
      case 'children of gaia': return 'Filhos de Gaia';
      case 'red talons': return 'Garras Vermelhas';
      default: return str.charAt(0).toUpperCase() + str.slice(1);;
    }
  };

  return(
    <div className="px-2 pt-2">
      <div className="font-bold py-4 px-5 text-lg bg-black mt-2 mb-1 text-white cursor-pointer">
        <p className="w-full text-center">Total de Dons Encontrados: { listGifts.length }</p>
      </div>
      {
        listGifts
          .filter((item) => item.gift !== '')
          .map((item: gift, index: number) => (
          <div key={ index } className="border mb-1 py-6 px-5 border-3 bg-black/90 text-white">
            <span className="font-bold text-lg">
              { item.giftPtBr } ({ item.gift }) - { item.renown }
            </span>
            <hr className="w-10/12 my-2" />
            <p>
              <span className="font-bold pr-1">Pertencente a:</span>
              { 
                item.belonging.map((trybe: type, index) => (
                  <span key={ index }>
                    { capitalizeFirstLetter(trybe.type) } ({ trybe.totalRenown })
                    { index === item.belonging.length -1 ? '.' : ', ' }
                  </span>
                ))
              }
            </p>
            <p className="pt-1">
              <span className="font-bold pr-1">Fonte:</span>
              { item.book }, pg. { item.page }.
            </p>
            <p className="pt-1">
              <span className="font-bold pr-1">Custo:</span>
              { item.cost }.
            </p>
            <p className="pt-1">
              <span className="font-bold pr-1">Ação:</span>
              { item.action }.
            </p>
            { item.pool !== "" &&
              <p className="pt-1">
                <span className="font-bold pr-1">Parada de Dados:</span>
                { item.pool }.
              </p>
            }
            { item.duration !== "" &&
              <p className="pt-1">
                <span className="font-bold pr-1">Duração:</span>
                { item.duration }.
              </p>
            }
            <p className="pt-1">
              <span className="font-bold pr-1">Descrição:</span>
              { item.descriptionPtBr }
            </p>
            <p className="pt-1">
              <span className="font-bold pr-1">Sistema:</span>
              { item.systemPtBr }
            </p>
            <p className="pt-1">
              <span className="font-bold pr-1">Descrição:</span>
              { item.description }
            </p>
            <p className="pt-1">
              <span className="font-bold pr-1">System:</span>
              { item.system }
            </p>
          </div>
        ))
      }
    </div>
  );
}