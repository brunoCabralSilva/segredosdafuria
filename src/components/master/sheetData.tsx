export default function SheetData(props: { player: any }) {
  const { player } = props;
  return(
    <div>
      { 
        player.data &&
        <div>
          <div className="pb-5 font-bold text-2xl">Dons</div>
            <div className="w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {
                player.data.gifts.map((gift: any, index: number) => (
                  <div key={ index } className="border border-white p-2 sm:p-5  text-sm">
                    <div className="px-3 pb-3">
                      <p className="font-bold text-center w-full p-3">{ gift.giftPtBr} ({ gift.gift })</p>
                      <hr className="mt-1 pb-5" />
                      {
                        gift.cost !== '' &&
                        <p className="">
                          <span className="pr-1 font-bold">Custo:</span>
                          { gift.cost } (Possíveis Testes de Fúria e gastos de Força de Vontade são feitos automaticamente).
                        </p>
                      }
                      {
                        gift.action !== '' &&
                        <p className="pt-2">
                          <span className="pr-1 font-bold">Ação:</span>
                          { gift.cost}.
                        </p>
                      }
                      {
                        gift.pool !== '' &&
                        <p className="pt-2">
                          <span className="pr-1 font-bold">Parada de Dados:</span>
                          { gift.pool === '' ? 'Nenhuma.' : gift.pool + '.' }
                        </p>
                      }
                      {
                        gift.duration !== '' &&
                        <p className="pt-2">
                          <span className="pr-1 font-bold">Duração:</span>
                          { gift.duration}.
                        </p>
                      }
                      <p className="pt-2">
                        <span className="pr-1 font-bold">Sistema:</span>
                        { gift.systemPtBr}
                      </p>
                    </div>
                  </div>
                ))
              }
            </div>
            <div className="pt-10 pb-5 font-bold text-2xl">Rituais</div>
            <div className="w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {
                player.data.rituals.map((ritual: any, index: number) => (
                  <div key={index} className="border border-white p-5 text-sm">
                    <div className="px-3 pb-3">
                      <p className="font-bold text-center w-full p-3">{ ritual.titlePtBr} ({ ritual.title })</p>
                      <hr className="mt-1 pb-5" />
                      {
                        ritual.pool !== '' &&
                        <p className="pt-2">
                          <span className="pr-1 font-bold">Parada de Dados:</span>
                          { ritual.pool === '' ? 'Nenhuma.' : ritual.pool + '.' }
                        </p>
                      }
                      <p className="pt-2">
                        <span className="pr-1 font-bold">Sistema:</span>
                        { ritual.systemPtBr}
                      </p>
                    </div>
                  </div>
                ))
              }
            </div>
            <div>
              { player.data.advantagesAndFlaws.advantages.length > 0 && <div className="pt-10 pb-5 font-bold text-2xl">Méritos e Backgrounds</div> }
              {
                player.data.advantagesAndFlaws.advantages.map((advantage: any, index: number) => (
                  <div
                    key={ index }
                    className="pt-3 sm:text-justify"
                    >
                    <p>{ advantage.name } - { advantage.cost } - { advantage.title }</p>
                    <p>{ advantage.description }</p>
                  </div>
                ))
              }
              { player.data.advantagesAndFlaws.flaws.length > 0 && <div className="pt-10 pb-5 font-bold text-2xl">Defeitos</div> }
              {
                player.data.advantagesAndFlaws.flaws.map((flaws: any, index: number) => (
                  <div
                    key={ index }
                    className="pt-3 sm:text-justify"
                    >
                    <p>{ flaws.name } - { flaws.cost } - { flaws.title }</p>
                    <p>{ flaws.description }</p>
                  </div>
                ))
              }
              { player.data.advantagesAndFlaws.talens.length > 0 && <div className="pt-10 pb-5 font-bold text-2xl">Talismãs</div> }
              {
                player.data.advantagesAndFlaws.talens.map((flaws: any, index: number) => (
                  <div
                    key={ index }
                    className="pt-3 sm:text-justify"
                    >
                    <p>{ flaws.name } - { flaws.description }</p>
                  </div>
                ))
              }
              { player.data.advantagesAndFlaws.loresheets.length > 0 && <div className="pt-10 pb-5 font-bold text-2xl">Loresheets</div> }
              {
                player.data.advantagesAndFlaws.loresheets.map((flaws: any, index: number) => (
                  <div
                    key={ index }
                    className="pt-3 sm:text-justify"
                    >
                    <p>{ flaws.name } - { flaws.skill }</p>
                  </div>
                ))
              }
            </div>
            { 
              player.data.background !== '' &&
              <div className="pt-10 pb-5 font-bold text-2xl">História</div>
            }
            <div className="pb-10 sm:text-justify">
              { player.data.background }
            </div>
        </div>
      }
    </div>
  );
}