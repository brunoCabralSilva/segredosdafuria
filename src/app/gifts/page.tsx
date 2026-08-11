'use client';

import { useContext, useEffect, useState } from 'react';
import Nav from '@/components/nav';
import Footer from '@/components/footer';
import FilterGifts from '../../components/gifts/filterGifts';
import ListGifts from '../../components/gifts/listGifts';
import contexto from '@/context/context';
import jsonGifts from '../../data/gifts.json';
import jsonTrybes from '../../data/trybes.json';
import Simplify from '@/components/simplify';

export default function Gifts() {
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const {
    listOfGiftsSelected,
    setListOfGiftsSelected,
    globalGifts,
    setGlobalGifts,
    textGift,
    setTextGift,
    totalRenown,
    setTotalRenown,
    setListOfGift,
    resetPopups,
    simplify,
  } = useContext(contexto);

  const sortList = (listG: any[]) => {
    const orderedList = [...listG].sort((a: any, b: any) => {
      if (a?.belonging && b?.belonging) {
        const aMinTotalRenown = Math.min(...a.belonging.map((item: any) => item.totalRenown));
        const bMinTotalRenown = Math.min(...b.belonging.map((item: any) => item.totalRenown));

        if (aMinTotalRenown === bMinTotalRenown) {
          const aMinType = a.belonging.find((item: any) => item.totalRenown === aMinTotalRenown)?.type;
          const bMinType = b.belonging.find((item: any) => item.totalRenown === bMinTotalRenown)?.type;
          if (aMinType && bMinType) return aMinType.localeCompare(bMinType);
        }

        return aMinTotalRenown - bMinTotalRenown;
      }

      return 0;
    });

    return orderedList;
  };

  useEffect(() => {
    resetPopups();
    setListOfGift(sortList(jsonGifts));
    setTextGift('');
    setListOfGiftsSelected([]);
    setGlobalGifts(false);
    setTotalRenown(0);
    setSelectedBooks([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const returnFilterPhrase = () => {
    let phrase = '';
    const data = listOfGiftsSelected.filter((element: string) => element !== '');

    if (globalGifts) data.push('Dons Nativos');
    if (selectedBooks.length > 0) data.push(...selectedBooks);
    if (textGift !== '' && textGift !== ' ') {
      data.push(`Dons contendo o trecho "${textGift}"`);
    }

    for (let i = 0; i < data.length; i += 1) {
      if (i !== data.length - 1) phrase += `${data[i]}, `;
      else phrase += `${data[i]} ${totalRenown !== 0 ? `e Renome Total até ${totalRenown}` : ''}`;
    }

    if (data.length === 0 && totalRenown > 0) phrase = `Renome Total até ${totalRenown}`;
    return phrase;
  };

  const search = () => {
    let filterByText = jsonGifts;
    const filters = listOfGiftsSelected.map((item: string) => {
      const trybe = jsonTrybes.find((element) => item === element.namePtBr);
      if (trybe) return trybe.nameEn;
      return item.toLowerCase();
    });

    if (globalGifts) filters.push('global');

    const filteredItems = [];
    for (let i = 0; i < jsonGifts.length; i += 1) {
      const giftItem = jsonGifts[i];
      const matchesType = filters.length === 0 || giftItem.belonging.some((belonging) => filters.includes(belonging.type));
      const matchesRenown = totalRenown === 0 || giftItem.belonging.some((belonging) => belonging.totalRenown <= totalRenown);
      const matchesBook = selectedBooks.length === 0 || selectedBooks.includes(giftItem.book);

      if (matchesType && matchesRenown && matchesBook) filteredItems.push(giftItem);
    }

    filterByText = filteredItems;
    if (textGift !== '' && textGift !== ' ') {
      filterByText = filteredItems.filter(
        (item) => item.gift.toLowerCase().includes(textGift.toLowerCase())
          || item.giftPtBr.toLowerCase().includes(textGift.toLowerCase())
      );
    }

    setListOfGift(sortList(filterByText));
    setTextGift('');
    setListOfGiftsSelected([]);
    setGlobalGifts(false);
    setTotalRenown(0);
    setSelectedBooks([]);
  };

  return (
    <div className={`relative min-h-screen w-full ${simplify ? 'bg-black' : 'bg-ritual'} bg-cover bg-top`}>
      <div className="w-full h-full bg-black/80">
        <Simplify />
        <div className="absolute inset-0 bg-black/85" />
        <Nav />
        <main className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-col px-4 pb-10 pt-4 sm:px-8 sm:pb-14">
          <section className="relative overflow-hidden text-white">
            <div className="relative pb-8 sm:px-8">
              <div className="grid gap-8">
                <div>
                  <h1 className="font-kingthings text-3xl sm:text-4xl lg:text-5xl">Dons</h1>
                  <hr className="mt-5" />

                  <div className="mt-6 space-y-4 text-justify text-sm leading-7 text-white/82 sm:text-[15px]">
                    <p>
                      Um Dom e seus efeitos são a expressão de um pacto entre um lobisomem e um espírito. Os Garou ativos durante a era do Apocalipse passam grande parte do seu tempo buscando e estabelecendo relacionamentos com espíritos, além de manter aqueles que já possuem.
                    </p>
                    <p>
                      Quando os Dons se manifestam, cada um é diferente, e até o mesmo Dom parece diferente quando utilizado por diferentes Garou. Alguns envolvem uma prece sussurrada, outros o toque de uma marca que simboliza o pacto espiritual, e ainda outros começam com um uivo arrepiante. A menos que seja declarado o contrário, o uso de um Dom é sempre evidente, e outros Garou reconhecem que um Dom está sendo usado, mesmo que sua natureza não seja imediatamente óbvia. Os humanos têm menos probabilidade de perceber o uso dos Dons, e se o fazem, tendem a interpretar o ato como um juramento, gesto ou maldição religiosa ou cultural.
                    </p>
                  </div>

                  <div className="mt-8 border border-zinc-500/30 bg-black/80 p-5 text-white text-justify sm:p-6">
                    <h2 className="font-kingthings text-2xl leading-none text-white sm:text-3xl">Como utilizar o filtro de busca</h2>
                    <hr className="mt-4 border-white/10" />

                    <ol className="mt-5 list-decimal space-y-3 pl-5 font-geist-mono text-[11px] leading-7 text-white/72 sm:text-xs">
                      <li>
                        Não selecionar nenhum filtro retornará uma lista com todos os dons existentes.
                      </li>
                      <li>
                        Os Filtros Tribos, Augúrios e Dons Nativos retornarão qualquer dom que inclua uma das seleções.
                      </li>
                    </ol>

                    <div className="mt-3 space-y-3 font-geist-mono text-[11px] leading-7 text-white/72 sm:text-xs">
                      <p>
                        Exemplo - Bruno selecionou a tribo dos Roedores de ossos e o augúrio Ahroun. Desta forma, a busca retornará qualquer dom que pertença aos Roedores de ossos OU aos Ahroun, sem necessariamente precisar pertencer aos dois filtros selecionados ao mesmo tempo.
                      </p>
                    </div>

                    <ol start={3} className="mt-3 list-decimal space-y-3 pl-5 font-geist-mono text-[11px] leading-7 text-white/72 sm:text-xs">
                      <li>
                        Filtros de Renome Total só retornarão os dons que tiverem um valor igual ou menor que o valor cedido. Além disso, escolher um Renome Total filtra os dons de Tribos, Augúrios e Dons Nativos.
                      </li>
                    </ol>

                    <div className="mt-3 space-y-3 font-geist-mono text-[11px] leading-7 text-white/72 sm:text-xs">
                      <p>
                        Exemplo - Jocélio selecionou o valor de Renome Total 6, então só aparecerão dons que possuem Renomes Totais iguais ou abaixo de 6. Da mesma forma, Audeam selecionou os filtros de augúrio Ahroun, tribo dos Presas de Prata e Renome total 7. Sendo assim, serão retornados todos os dons de Renome total 3 que pertençam ao Augúrio dos Ahroun ou a tribo dos Presas de Prata.
                      </p>
                    </div>

                    <ol start={4} className="mt-3 list-decimal space-y-3 pl-5 font-geist-mono text-[11px] leading-7 text-white/72 sm:text-xs">
                      <li>
                        Marcar a opção &quot;Clique aqui para incluir Dons Nativos na Busca&quot; implica dizer que serão retornados todos os Dons nativos que correspondam ao Renome Selecionado. Caso o(s) filtro(s) selecionado(s) seja(m) de Augúrios ou Tribos ao invés de Renome, a busca retornará todos os dons que pertencam a pelo menos uma das seleções, seja Augúrio, Tribo ou Dom Nativo. Caso não haja nenhum outro filtro além do de &quot;Incluir Dons Nativos na busca&quot;, só serão retornados Dons Nativos (mantenha a opção desmarcada para retornar todos os dons).
                      </li>
                    </ol>

                    <div className="mt-3 space-y-3 font-geist-mono text-[11px] leading-7 text-white/72 sm:text-xs">
                      <p>
                        Exemplo: Felipe selecionou a opção &quot;Clique aqui para incluir Dons Nativos na Busca&quot; e escolheu a seleção de Renome total 8. Serão retornados para ele todos os Dons Nativos que tenham um Renome Total igual ou abaixo de 8. Depois, Felipe selecionou a opção &quot;Clique aqui para incluir Dons Nativos na Busca&quot; e também a Tribo dos Andarilhos do Asfalto. Desta forma, serão retornados todos os dons que pertençam aos Dons Nativos ou aos Andarilhos do Asfalto.
                      </p>
                    </div>

                    <ol start={5} className="mt-3 list-decimal space-y-3 pl-5 font-geist-mono text-[11px] leading-7 text-white/72 sm:text-xs">
                      <li>
                        Caso você digite algum trecho no campo &quot;Digite aqui&quot;, (localizado logo abaixo do título &quot;Digite o nome ou um trecho do nome do Dom&quot;), o método de busca retornará todos os dons que possuírem o trecho digitado em seu nome, seja em inglês ou português, aplicando os demais filtros antes de fazer esta filtragem.
                      </li>
                    </ol>

                    <div className="mt-3 space-y-3 font-geist-mono text-[11px] leading-7 text-white/72 sm:text-xs">
                      <p>
                        Exemplo - Jess digitou o trecho &quot;beyond&quot; e não escolheu nenhuma outra seleção. Assim, o método de busca retornará todos os dons existentes que possuem &quot;beyond&quot; no seu nome. Depois, ela digitou novamente o trecho &quot;beyond&quot; e também clicou na seleção de Augúrio &quot;Theurge&quot;. Desta forma, só serão retornados os dons pertencentes aos Theurge que possuem o trecho digitado.
                      </p>
                    </div>

                    <ol start={6} className="mt-3 list-decimal space-y-3 pl-5 font-geist-mono text-[11px] leading-7 text-white/72 sm:text-xs">
                      <li>
                        Ao selecionar algum filtro, ele aparecerá dentro do botão de busca.
                      </li>
                    </ol>

                    <p className="mt-4 font-geist-mono text-[11px] leading-7 text-white/72 sm:text-xs">
                      OBS - Você notará que, ao fim de cada Dom, haverá uma opção de &quot;Enviar Feedback&quot;. Você poderá usá-lo, caso encontre algum ponto de melhoria no dom em questão (seja uma tradução que pode melhorar, ou um erro de digitação, ou ausência de informações ou informações em locais errados). Desta forma, será possível encaminhar para o administrador da página a melhoria para que ela seja avaliada. Assim, melhoramos a qualidade dos dados que estamos cedendo por meio desta aplicação!
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <FilterGifts title="Tribos" />
                <FilterGifts title="Augúrios" />
                <FilterGifts
                  title="Livros"
                  selectedBooks={selectedBooks}
                  setSelectedBooks={setSelectedBooks}
                />
                <FilterGifts title="Renome e/ou Dons Nativos" />
                <FilterGifts title="Texto" />

                <div className="border border-zinc-500/30 bg-black/80 p-5 text-white">
                  <button
                    type="button"
                    onClick={search}
                    className="inline-flex border border-red-700 bg-[#7a0000] px-5 py-3 font-geist-mono text-[11px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#930000]"
                  >
                    Buscar Dons
                  </button>

                  {returnFilterPhrase() !== '' && (
                    <p className="mt-4 font-geist-mono text-[11px] leading-6 text-white/70 sm:text-xs">
                      Filtros atuais: {returnFilterPhrase()}
                    </p>
                  )}
                </div>

                <ListGifts />
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
