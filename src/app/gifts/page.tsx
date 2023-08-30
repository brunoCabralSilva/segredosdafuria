import list from '../../data/gifts.json';

interface type {
  type: string;
  totalRenown: number
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

export default function Gifts() {
  function capitalizeFirstLetter(str: string): String {
    switch(str) {
      case 'global': return 'Dons Nativos';
      case 'silent striders': return 'Peregrinos Silenciosos';
      case 'black furies': return 'Fúrias Negras';
      case 'silver fangs': return 'Presas de Prata';
      case 'hart wardens': return 'Guardiões do Cervo';
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
    <div className="bg-white">
      {
        list.map((item: gift, index) => (
          <div key={ index } className="border m-1 py-6 px-5 border-3 bg-black/80 text-white">
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