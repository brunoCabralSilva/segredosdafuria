'use client'
import Nav from '@/components/nav';
import list from '../../data/gifts.json';
import Footer from '@/components/footer';
import Image from 'next/image';
import { useState } from 'react';
import Feedback from '@/components/feedback';
import { useAppDispatch } from '@/redux/hooks';
import { useAppSelector } from '@/redux/hooks';
import { actionFeedback, useSlice } from '@/redux/slice';

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

export default function Gifts() {
  const [message, setMessage] = useState({ show: false, message: ''});
  const [trybe, setTrybe] = useState(false);
  const [auspice, setAuspice] = useState(false);
  const [renown, setRenown] = useState(false);
  const [valorRenown, setValorRenown] = useState(0);
  const [selectedTrybe, setSelectTrybe] = useState(['']);
  const [checked, setChecked] = useState(false);
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
  const slice = useAppSelector(useSlice);
  const dispatch: any = useAppDispatch();

  const tribos: string[] = ['Peregrinos Silenciosos', 'Fúrias Negras', 'Presas de Prata', 'Guarda do Cervo', 'Conselho Fantasma', 'Perseguidores da Tempestade', 'Andarilhos do Asfalto', 'Roedores de Ossos', 'Senhores das Sombras', 'Filhos de Gaia','Garras Vermelhas'];

  const augurios: string[] = ['Ragabash', 'Theurge', 'Philodox', 'Galliard', 'Ahroun'];

  const renomeTotal: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const toggleCheckbox = () => {
    setChecked(!checked);
  };

  const search = (): void => {
    setListGifts([]);
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

    if(checked) {
      filters.push('global');
    };
  
    const filterItem: gift[] = [];
  
    for (let i = 0; i < list.length; i += 1) {
      const giftItem = list[i];
      const belongingTypes = giftItem.belonging.map((type) => type.type);
      const totalRenown = giftItem.belonging.map((type) => type.totalRenown).reduce((a, b) => a + b, 0);
  
      const matchesType = filters.length === 0 || giftItem.belonging.some((belonging) => filters.includes(belonging.type));
  
      const matchesRenown = valorRenown === 0 || giftItem.belonging.some((belonging) => belonging.totalRenown <= valorRenown);
  
      if (matchesType && matchesRenown) {
        filterItem.push(giftItem);
      }
    }

    let phrase = '';
    const data = selectedTrybe.filter((element) => element !== '');
    if (checked) data.push('Dons Nativos');
    for (let i = 0; i < data.length; i += 1) {
      if (i !== data.length - 1) {
        phrase += (`${data[i]}, `);
      } else {
        phrase += (`${data[i]} ${valorRenown !== 0 ? `e Renome Total até ${valorRenown}` : ''}`);
      }
    }
    if (data.length === 0 && valorRenown > 0) phrase = (`Renome Total até ${valorRenown}`);
  
    setMessage({
      show: true,
      message: phrase,
    });

    setListGifts(filterItem);
    setTrybe(false);
    setAuspice(false);
    setRenown(false);
    setChecked(false);
    setValorRenown(0);
    setSelectTrybe(['']);
  };
  
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

  function insertSelector(newTrybe: string): void {
    if (selectedTrybe.length === 0) {
      setSelectTrybe([newTrybe]);
    } else {
      for (let i = 0; i < selectedTrybe.length; i += 1){
        const listContains = selectedTrybe.filter((element) => element === newTrybe);
        if (listContains.length > 0) {
          const list = selectedTrybe.filter((element) => element !== newTrybe);
          setSelectTrybe(list);
        } else {
          setSelectTrybe([...selectedTrybe, newTrybe]);
        }
      }
    }
  };
  return (
    <div className="bg-ritual pt-2">
      <Nav />
      <div className="mx-2 text-white">
        <div className="h-40vh relative flex bg-black items-end text-black">
          <Image
            src={ "/images/32.jpg" }
            alt=""
            className="absolute w-full h-40vh object-cover object-top"
            width={ 1200 }
            height={ 800 }
          />
        </div>
        <div className="py-6 px-5 bg-black/90 mt-2 flex flex-col items-center sm:items-start text-center sm:text-left">
          <h1 className="text-4xl z-10 relative text-center sm:text-left">Dons</h1>
          <hr className="w-10/12 my-6" />
          <p className="pb-2">
            Um Dom e seus efeitos são a expressão de um pacto entre um lobisomem e um espírito. Os Garou ativos durante a era do Apocalipse passam grande parte do seu tempo buscando e estabelecendo relacionamentos com espíritos, além de manter aqueles que já possuem.
          </p>
          <p className="pb-2">
            Quando os Dons se manifestam, cada um é diferente, e até o mesmo Dom parece diferente quando utilizado por diferentes Garou. Alguns envolvem uma prece sussurrada, outros o toque de uma marca que simboliza o pacto espiritual, e ainda outros começam com um uivo arrepiante. A menos que seja declarado o contrário, o uso de um Dom é sempre evidente, e outros Garou reconhecem que um Dom está sendo usado, mesmo que sua natureza não seja imediatamente óbvia. Os humanos têm menos probabilidade de perceber o uso dos Dons, e se o fazem, tendem a interpretar o ato como um juramento, gesto ou maldição religiosa ou cultural.
          </p>
          <h1 className="text-2xl pt-7">Como utilizar o filtro de busca</h1>
          <hr className="w-10/12 my-4" />
          <p className="py-2">
            Filtros Tribos, Augúrios e Dons Nativos retornarão qualquer dom que inclua um dos selecionados:
          </p>
          <p className="py-2">
            Exemplo - Ao selecionar A tribo dos roedores de ossos e o augúrio Ahroun, a busca retornará qualquer dom que pertença aos aos roedores de ossos ou aos Ahroun, sem necessariamente precisar pertencer aos dois filtros selecionados;
          </p>
          <p className="py-2">
            Filtros de Renome Total só retornarão os dons que tiverem um valor igual ou menor que o valor cedido:
          </p>
          <p className="py-2">
            Exemplo - Se selecionar o valor de Renome Total 6, só aparecerão dons que possuem Renomes Totais de 6 abaixo;
          </p>
          <p className="py-2">
            Mesclando as duas categorias de filtros acima citados, você pode achar qualquer dom que desejar:
          </p>
          <p className="py-2">
            Exemplo - ao selecionar os filtros de augúrio Ahroun, tribo dos Presas de Prata e Renome total 7, serão retornados todos os dons de Renome total 3 que pertençam ao augúrio Ahroun ou a tribo dos Presas de Prata;
          </p>

          <p className="py-2">
            Ao selecionar algum filtro, o item selecionado aparecerá em um pop-up no canto inferior direito, onde você poderá acompanhar todos os filtros escolhidos e também removê-los caso deseje;
          </p>
          <p className="py-2">
            Marcar a opção &quot;Adicionar Dons Nativos à Busca&quot; implica dizer que todos os Dons nativos que correspondam ao filtro de busca será retornado. Caso seja o único filtro, só serão retornados Dons Nativos (mantenha a opção desmarcada para retornar todos os dons).
          </p>
          <p className="py-2">
            Não selecionar nenhum filtro retornará uma lista com todos os dons.
          </p>
        </div>
        <div
          onClick={ () => setTrybe(!trybe) }
          className="font-bold mt-2 mb-1 py-4 px-5 text-lg bg-black/90 flex justify-between items-center cursor-pointer"
        >
          <p>Tribos</p>
          <Image
            src={`/images/logos/${trybe ? 'arrow-up.png' : 'arrow-down.png'}`}
            alt=""
            className="w-8 object-contain animate-pulse cursor-pointer"
            width={2000}
            height={800}
          />
        </div>
        { trybe && 
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-2">
            {
              tribos.map((tribo: string, index: number) => (
                <div
                  key={ index }
                  className={`flex flex-col items-center justify-between  px-2 cursor-pointer border-2 ${selectedTrybe.includes(tribo) ? 'border-white bg-black' : 'border-transparent bg-black/80'}`}
                  onClick={ () => insertSelector(tribo) }
                >
                  <Image
                    src={ `/images/trybes/${tribo} Branco.png` }
                    alt=""
                    className="w-20 mt-2"
                    width={2000}
                    height={1000}
                  />
                  <span className="leading-2 text-sm sm:text-base py-3 w-full text-center">{ tribo }</span>
                </div>
                )
              )
            }
          </div>

        }
        <div
          onClick={ () => setAuspice(!auspice) }
          className="font-bold py-4 px-5 text-lg bg-black/90 flex justify-between items-center cursor-pointer"
        >
          <p>Augúrios</p>
          <Image
            src={`/images/logos/${auspice ? 'arrow-up.png' : 'arrow-down.png'}`}
            alt=""
            className="w-8 object-contain animate-pulse cursor-pointer"
            width={2000}
            height={800}
          />
        </div>
        {
          auspice && <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mt-1">
            {
              augurios.map((augurio: string, index: number) => (
                <div
                  key={ index }
                  className={`flex flex-col items-center border-2 ${selectedTrybe.includes(augurio) ? 'border-white bg-black' : 'border-transparent bg-black/80'}`}
                  onClick={ () => insertSelector(augurio) }
                >
                  <Image
                    src={ `/images/auspices/${augurio}.png` }
                    alt=""
                    className="w-24 mt-2"
                    width={2000}
                    height={1000}
                  />
                  <span className="leading-2 text-sm sm:text-base py-3">{ augurio }</span>
                </div>
                )
              )
            }
          </div>
        }
        <div
          onClick={ () => setRenown(!renown) }
          className="font-bold mt-1 py-4 px-5 text-lg bg-black/90 cursor-pointer flex justify-between items-center"
        >
          <p>Renome Total</p>
          <Image
            src={`/images/logos/${renown ? 'arrow-up.png' : 'arrow-down.png'}`}
            alt=""
            className="w-8 object-contain animate-pulse cursor-pointer"
            width={2000}
            height={800}
          />
        </div>
        {
          renown && <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mt-1">
            {
              renomeTotal.map((renome: number, index: number) => (
                <div
                  key={ index }
                  className={`flex flex-col items-center border-2 ${renome <= valorRenown ? 'border-white bg-black' : 'border-transparent bg-black/80'} cursor-pointer`}
                  onClick={ () => {
                    if (renome === valorRenown) setValorRenown(0);
                    else setValorRenown(renome);
                  }}
                >
                  <span className="py-3 text-xl font-bold">{ renome }</span>
                </div>
                )
              )
            }
          </div>
        }
      </div>
      <div
        className="font-bold mx-2 text-white mt-1 py-4 px-5 text-lg bg-black/90 cursor-pointer flex sm:items-center items-start"
      >
        <input
          type="checkbox"
          className="mr-2 mt-check sm:mt-0"
          checked={checked}
          onChange={toggleCheckbox}
        />
        <p onClick={toggleCheckbox}>Adicionar Dons Nativos à Busca</p>
      </div>
      <div
        onClick={ search }
        className="font-bold py-4 px-5 text-lg bg-white my-2 mx-2 cursor-pointer"
      >
        <p className="w-full text-center text-black">Buscar</p>
      </div>
      <div className="px-2">
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
            <p
              className="text-orange-300 hover:text-orange-600 mt-3 cursor-pointer"
              onClick={() => dispatch(actionFeedback({ show: true, message: item.gift })) }
            >
              Feedback
            </p>
          </div>
        ))
      }
      { 
        slice.feedback.show && <Feedback gift={ slice.feedback.gift } />
      }
    </div>
    <Footer />
    </div>
  );
}