import { IGift, ITypeGift } from "@/interfaces/Gift";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionFeedback, useSlice } from "@/redux/slice";
import Feedback from "./feedback";
import Image from "next/image";

export default function Gift(props: { item: IGift, describe: any } ) {
  const dispatch: any = useAppDispatch();
  const slice = useAppSelector(useSlice);
  const { item } = props;

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
    <article className="border w-full h-full px-4 pb-4 pt-10 sm:p-10 border-3 bg-black/70 text-white overflow-y-auto">
      <div className="flex flex-col justify-center items-center sm:items-start">
        <div className="relative text-white flex sm:hidden w-full justify-center pb-5">
          { 
            item.belonging.map((trybe: ITypeGift, index) => (
              <Image
                key={ index }
                src={ `/images/glifs/${capitalizeFirstLetter(trybe.type)}.png` }
                alt={`Glifo ${capitalizeFirstLetter(trybe.type)}`}
                className={`${trybe.type !== 'global' ? 'h-8' : ''} w-10 object-cover object-center`}
                width={ 1200 }
                height={ 800 }
              />
            ))
          }
        </div>
        <h1 className="font-bold text-lg text-center sm:text-left w-full">
          {`${ item.giftPtBr } (${ item.gift }) - ${ item.renown }`}
        </h1>
        <hr className="w-10/12 my-4 sm:my-2" />
      </div>
      <p>
        <span className="font-bold pr-1">Pertencente a:</span>
        { 
          item.belonging.map((trybe: ITypeGift, index) => (
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
      <p className="pt-1 text-justify">
        <span className="font-bold pr-1">Descrição:</span>
        { item.descriptionPtBr }
      </p>
      <p className="pt-1 text-justify">
        <span className="font-bold pr-1">Sistema:</span>
        { item.systemPtBr }
      </p>
      <p className="pt-1 text-justify">
        <span className="font-bold pr-1">Description (original):</span>
        { item.description }
      </p>
      <p className="pt-1 text-justify">
        <span className="font-bold pr-1">System (original):</span>
        { item.system }
      </p>
      <div className="flex flex-col sm:flex-row sm:justify-between">
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between">
      <button
        type="button"
        className={ !slice.simplify ? 'text-orange-300 hover:text-orange-600 transition-colors duration-300 mt-5 cursor-pointer underline' : 'bg-white text-black p-2 font-bold mt-3'}
        onClick={() => dispatch(actionFeedback({ show: true, message: item.gift })) }
      >
        Enviar Feedback
      </button>
      </div>
      { slice.feedback.show && <Feedback gift={ slice.feedback.gift } /> }
    </article>
  );
}