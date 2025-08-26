'use client'
import { useContext, useEffect, useRef } from 'react';
import Nav from '@/components/nav';
import Footer from '@/components/footer';
import Feedback from '@/components/feedback';
import contexto from '@/context/context';
import jsonAdvantages from '../../data/advantagesAndFlaws.json';
import Image from 'next/image';
import AdvantageOrFlaw from './AdvantageOrFlaw';

export default function Gifts() {
  const describe = useRef<HTMLDivElement | null>(null);
  const {
    showFeedback, setShowFeedback, resetPopups
  } = useContext(contexto);

  useEffect(() => resetPopups(), []);

  return (
    <div className="bg-ritual text-white relative">
      <div className="bg-black/60 absolute w-full h-full" />
      <div className="px-2 z-10 relative">
        <Nav />
        <div className="py-6 px-5 bg-black/90 mt-2 flex flex-col items-center sm:items-start text-justify">
          <h1 className="text-4xl relative">Vantagens e Defeitos</h1>
          <hr className="w-10/12 my-6" />
          <p className="pb-2">
            Além dos Atríbutos exclusivos e das Habilidades diferenciadas, os personagens garous , recém-criados têm várias Vantagens, seja uma facilidade com idiomas ou uma tropa de arruaceiros armados com tacos de beisebol sempre à disposição. Como tudo o mais, medimos as Vantagens com pontos, geralmente variando de um a cinco. Não há penalidade por se ter zero ponto em uma Vantagem - esse é o padrão.
          </p>
          <p className="pb-2">
            Poucas rolagens envolvem Vantagens, se bem que o Narrador poderia pedir Inteligência + Linguística para decifrar os diários de couro esfarrapados de um ancião garou já falecido, ou Subterfúgio + Contatos para plantar um boato a respeito daquela maldita Presa de Prata na zona do baixo meretrício. As Vantagens são divididas em Qualidades e Antecedentes. O outro lado das Vantagens, os Defeitos causam problemas contínuos aos personagens. Observe que o Narrador pode proibir ou limitar as Vantagens que entram em conflito com o cenário da crônica
          </p>
        </div>
        <div ref={ describe } />
        {
          jsonAdvantages.length > 0 && jsonAdvantages.map((item: any, index: number) => (
            <AdvantageOrFlaw key={ index } item={ item }/>
          ))
        }
        <button
          type="button"
          className="pb-3 text-orange-300 hover:text-orange-600 transition-colors duration-300 mt-5 cursor-pointer underline"
          onClick={() => setShowFeedback(true) }
        >
          Enviar Feedback
        </button>
        {
          showFeedback && <Feedback title={ 'Página "Vantagens e Defeitos"' } /> 
        }
      </div>
      <Footer />
    </div>
  );
}