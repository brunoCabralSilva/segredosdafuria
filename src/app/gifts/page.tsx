'use client'
import Nav from '@/components/nav';
import ListGifts from '@/components/listGifts';
import Footer from '@/components/footer';
import Image from 'next/image';
import { useState } from 'react';

export default function Gifts() {
  const [trybe, setTrybe] = useState(false);
  const [auspice, setAuspice] = useState(false);
  const [renown, setRenown] = useState(false);
  const [valorRenown, setValorRenown] = useState(0);
  const [selectedTrybe, setSelectTrybe] = useState(['']);

  const tribos: string[] = ['Peregrinos Silenciosos', 'Fúrias Negras', 'Presas de Prata', 'Guarda do Cervo', 'Conselho Fantasma', 'Perseguidores da Tempestade', 'Andarilhos do Asfalto', 'Roedores de Ossos', 'Senhores das Sombras', 'Filhos de Gaia','Garras Vermelhas'];

  const augurios: string[] = ['Ragabash', 'Theurge', 'Philodox', 'Galliard', 'Ahroun'];

  const renomeTotal: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  
  function search(): void {

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

  { console.log(selectedTrybe) }
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
            Não selecionar nenhum filtro retornará uma lista com todos os dons.
          </p>
        </div>
        <div
          onClick={ () => setTrybe(!trybe) }
          className="font-bold mt-2 mb-1 py-4 px-5 text-lg bg-black/90 cursor-pointer"
        >
          <p>Tribos</p>
        </div>
        { trybe && 
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
            {
              tribos.map((tribo: string, index: number) => (
                <div
                  key={ index }
                  className={`flex flex-col items-center justify-between bg-black/80 px-2 cursor-pointer border-2 ${selectedTrybe.includes(tribo) ? 'border-white': 'border-transparent'}`}
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
          className="font-bold py-4 px-5 text-lg bg-black/90"
        >
          <p>Augúrios</p>
        </div>
        {
          auspice && <div className="grid grid-cols-3 gap-2 mt-1">
            {
              augurios.map((augurio: string, index: number) => (
                <div
                  key={ index }
                  className={`flex flex-col items-center bg-black/80 border-2 ${selectedTrybe.includes(augurio) ? 'border-white' : 'border-transparent'}`}
                  onClick={ () => insertSelector(augurio) }
                >
                  <Image
                    src={ `/images/auspices/${augurio}.png` }
                    alt=""
                    width={2000}
                    height={1000}
                  />
                  <span className="text-lg py-3">{ augurio }</span>
                </div>
                )
              )
            }
          </div>
        }
        <div
          onClick={ () => setRenown(!renown) }
          className="font-bold mt-1 py-4 px-5 text-lg bg-black/90 cursor-pointer"
        >
          <p>Renome Total</p>
        </div>
        {
          renown && <div className="grid grid-cols-3 gap-2 mt-1">
            {
              renomeTotal.map((renome: number, index: number) => (
                <div
                  key={ index }
                  className={`flex flex-col items-center border-2 bg-black ${renome <= valorRenown ? 'border-white' : 'border-transparent'} cursor-pointer`}
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
        onClick={ search }
        className="font-bold py-4 px-5 text-lg bg-white my-2 mx-2 cursor-pointer"
      >
        <p className="w-full text-center">Buscar</p>
      </div>
      {/* <ListGifts /> */}
    <Footer />
    </div>
  );
}