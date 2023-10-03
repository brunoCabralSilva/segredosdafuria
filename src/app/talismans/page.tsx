'use client'
import Nav from '@/components/nav';
import Footer from '@/components/footer';
import { actionFeedback, actionList, actionType, useSlice } from '@/redux/slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import Simplify from '@/components/simplify';
import Image from 'next/image';
import { ChangeEvent, useEffect } from 'react';
import ListTalismans from './listTalismans';
import jsonTalismans from '../../data/talismans.json';
import SearchButton from '@/components/SearchButton';
import Feedback from '@/components/feedback';

export default function Talismans() {
  const slice = useAppSelector(useSlice);
  const dispatch: any = useAppDispatch();

  const typeText = (e: ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
    dispatch(actionType({ show: true, talisman: sanitizedValue, gift: '', ritual: '' }));
  };

  useEffect(() => {
    dispatch(actionList({ ritual:[], gift: [], talisman: jsonTalismans}));
    dispatch(actionType({ talisman: '', gift: '', ritual: '' }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full bg-ritual bg-cover bg-top relative">
      <div className={`absolute w-full h-full ${slice.simplify ? 'bg-black' : 'bg-black/80'}`} />
      <Simplify />
      <Nav />
      <section className="mb-2 relative px-2">
        {
          !slice.simplify &&
          <div className="h-40vh relative flex bg-white items-end text-black">
          <Image
            src={ "/images/25.jpg" }
            alt="Matilha contemplando o fim do mundo diante de um espírito maldito"
            className="absolute w-full h-40vh object-cover object-center"
            width={ 1200 }
            height={ 800 }
          />
          </div>
        }
        <div className="py-6 px-5 bg-black/90 text-white mt-2 flex flex-col items-center sm:items-start text-justify">
          <h1 className="text-4xl relative">Talismãs</h1>
          <hr className="w-10/12 my-6" />
          <p className="pb-2">
            Alguns Garou possuem um talismã - um objeto especial, frequentemente habitado por um espírito, embora nem sempre. Um talismã de Garou tem sua própria função única, muitas vezes relacionada à perspectiva animista dos lobisomens. Os talismãs podem ser armas, ferramentas ou objetos que ajudam o lobisomem a se concentrar; eles podem ter propósitos espirituais ou físicos. Seja qual for o caso, são objetos especiais que têm a capacidade de realizar alguma função sobrenatural ou auxiliar em uma função mundana com poder espiritual. Garou pertencentes a culturas específicas com tradições mágicas ou ocultas muitas vezes têm seus próprios nomes para talismãs.
          </p>
          <p className="pb-2">
            Se os jogadores escolheram o Antecedente Talismã, as descrições a seguir também incluem quanto poderia custar um desses itens durante a criação de personagens. Os Contadores de Histórias são incentivados a criar os seus próprios, e os jogadores a sugerirem, para melhor demonstrar os valores da sociedade Garou em suas crônicas específicas. A maioria dos talismãs tem versões de &quot;uso único&quot;, conhecidas como talens. Um talen apanhador de espíritos se desfaz após o uso único, incapaz de capturar outro espírito, enquanto um talen klave se estilhaça após um ataque bem-sucedido, causando seu dano e quebrando na ferida como uma garra esfacelada. Se escolhido como um Antecedente, presume-se que o personagem tenha uma maneira de adquirir os talens, e o personagem recebe um novo no início de uma história se o anterior tiver sido usado.
          </p>
        </div>
        <section
          className="bg-black font-bold mt-1 py-2 px-5 text-base flex flex-col pt-5 pb-2 justify-between items-center"
        >
          <p className="w-full text-xl text-center sm:text-left pb-2 text-white mb-4">
            Digite o nome ou um trecho do nome do Talismã, ou mantenha o campo vazio e todos os Talismãs serão retornados
          </p>
          <input
            className={`shadow shadow-white text-center sm:text-left w-full px-4 py-2 ${slice.type.talisman === '' || slice.type.talisman === ' ' && slice.type.type === 'talismans'
            ? 'bg-black text-white' : 'bg-white text-black'} rounded-full mb-3`}
            value={ slice.type.text }
            placeholder="Digite aqui"
            onChange={ (e) => typeText(e) }
          />
        </section>
        <SearchButton type="talismans" />
        <ListTalismans />
        <button
          type="button"
          className={`pb-3 ${!slice.simplify ? 'text-orange-300 hover:text-orange-600 transition-colors duration-300 mt-5 cursor-pointer underline' : 'bg-white text-black p-2 font-bold mt-3'}`}
          onClick={() => dispatch(actionFeedback({ show: true, message: '' })) }
        >
          Enviar Feedback
        </button>
        {
          slice.feedback.show && <Feedback title={ 'Página "Talismans"' } /> 
        }
      </section>
      <Footer />
    </div>
  );
}