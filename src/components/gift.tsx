import { IGift, ITypeGift } from "@/interfaces/Gift";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionFeedback, useSlice } from "@/redux/slice";

export default function Gift(props: { item: IGift, describe: any } ) {
  const scrollToComponent = () => {
    if (props.describe.current) {
      props.describe.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
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
    <article className="border mb-1 py-6 px-5 border-3 bg-black/70 text-white">
      <span className="font-bold text-lg">
        { item.giftPtBr } ({ item.gift }) - { item.renown }
      </span>
      <hr className="w-10/12 my-2" />
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
      <button
        type="button"
        className={ !slice.simplify ? 'text-orange-300 hover:text-orange-600 transition-colors duration-300 mt-3 cursor-pointer underline' : 'bg-white text-black py-3 px-2 font-bold mt-3'}
        onClick={() => dispatch(actionFeedback({ show: true, message: item.gift })) }
      >
        Enviar Feedback
      </button>
      <button
        type="button"
        className="text-white transition-colors duration-300 mt-3 cursor-pointer underline"
        onClick={scrollToComponent}
      >
        Retornar para a seleção de filtros
      </button>
      </div>
    </article>
  );
}