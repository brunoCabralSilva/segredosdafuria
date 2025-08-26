'use client'
import Nav from '@/components/nav';
import Footer from '@/components/footer';
import Image from "next/image";
import { ChangeEvent, useContext, useEffect } from 'react';
import ListRituals from './listRituals';
import jsonRituals from '../../data/rituals.json';
import Feedback from '@/components/feedback';
import contexto from '@/context/context';

export default function Rituals() {
  const {
    showFeedback, setShowFeedback,
    textRitual, setTextRitual,
    setListOfRituais,
    resetPopups,
  } = useContext(contexto);

  useEffect(() => {
    resetPopups();
    setListOfRituais(jsonRituals);
  }, []);
  
  const typeText = (e: ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
    setTextRitual(sanitizedValue);
  };

  const search = (): void => {
    let filterByText = [];
    filterByText = jsonRituals;
    if (textRitual !== '' && textRitual !== ' ') {
      filterByText = jsonRituals.filter((item: any) => 
        item.title.toLowerCase().includes(textRitual.toLowerCase())
        || item.titlePtBr.toLowerCase().includes(textRitual.toLowerCase())
      );
      setListOfRituais(filterByText);
    } else setListOfRituais(jsonRituals);
    setTextRitual('');
  }

  return (
    <div className="w-full bg-ritual bg-cover bg-top relative">
      <div className="absolute w-full h-full bg-black/80" />
      <Nav />
      <section className="mb-2 relative px-2">
        <div className="py-6 px-5 bg-black/90 text-white mt-2 flex flex-col items-center sm:items-start text-justify">
          <h1 className="text-4xl relative">Rituais</h1>
          <hr className="w-10/12 my-6" />
          <p className="pb-2">
            Os Garou, impulsionados por sua Fúria, enfrentam tensões devido à sua natureza orgulhosa e agressiva, bem como à busca incessante por Renome. Os Ritos desempenham um papel fundamental na coesão da sociedade Garou, ritualizando todos os aspectos da vida social, desde formalidades como a concessão do título de Garou aos Parentes até práticas para repreender outros, tudo dentro dos limites dos Ritos. Alguns Ritos têm efeitos além do aspecto mental e sua importância na cultura Garou é indiscutível. Além disso, os Ritos permitem que matilhas e seitas desenvolvam suas próprias interpretações únicas, demonstrando a diversidade e flexibilidade dessas práticas na cultura Garou.
          </p>

          <h2 className="text-2xl pt-5 text-center sm:text-justify">
            Sistema
          </h2>
          <hr className="w-10/12 my-4" />
          <p className="pb-2">
            Para realizar um Rito, um Garou precisa conhecê-lo, geralmente aprendendo com um Garou mais experiente. Se vários Garou que conhecem o Rito participarem, um atua como mestre do Rito, sendo automaticamente designado se apenas um Garou o realizar. O mestre do Rito cria um conjunto de dados com atributos específicos e faz um teste com dificuldade definida.
          </p>
          <p className="pb-2">
            Os dados de Fúria são incluídos, e falhas brutais são possíveis, com efeitos especiais em alguns Ritos. Outros Garou podem participar, adicionando dados se conhecerem o Rito. A realização de um Rito leva uma cena, podendo variar em duração. Se falhar, o mestre do Rito não pode liderar o mesmo antes do próximo dia.
          </p>

          <h2 className="text-2xl pt-2 text-center sm:text-justify">
            Resumo dos Ritos
          </h2>
          <hr className="w-10/12 my-4" />
          <ul className="pl-5 list-disc">
            <li>
              Um Rito deve ser liderado por um mestre do Rito, que deve conhecer o Rito.
            </li>
            <li>
              Cada participante, incluindo o mestre do Rito, deve ter pelo menos um ponto de Fúria.
            </li>
            <li>
              Os atributos do conjunto de dados são mencionados no Rito e são os do mestre do Rito.
            </li>
            <li>
              Cada outro participante contribui com um dado de Fúria.
            </li>
            <li>
              Cada outro participante que conhece o Rito também contribui com um dado regular.
            </li>
          </ul>
        </div>
        <section
          className="bg-black font-bold mt-1 py-2 px-5 text-base flex flex-col pt-5 pb-2 justify-between items-center"
        >
          <p className="w-full text-xl text-center sm:text-left pb-2 text-white mb-4">
            Digite o nome ou um trecho do nome do Ritual, ou mantenha o campo vazio e todos os rituais serão retornados
          </p>
          <input
            className={`shadow shadow-white text-center sm:text-left w-full px-4 py-2 ${textRitual === '' || textRitual === ' '
            ? 'bg-black text-white' : 'bg-white text-black'} rounded-full mb-3`}
            value={ textRitual }
            placeholder="Digite aqui"
            onChange={ (e) => typeText(e) }
          />
        </section>
        <div
          onClick={ search }
          className="font-bold py-4 px-5 text-lg bg-white my-2 cursor-pointer"
        >
          <p className="w-full text-center text-black">
            Buscar
          </p>
          <p className="text-center w-full">
            {
              textRitual !== ''
              && textRitual !== ' '
              && `Rituais contendo o trecho "${textRitual}"`
            }
          </p>
        </div>
        <ListRituals />
        <button
          type="button"
          className="pb-3 text-orange-300 hover:text-orange-600 transition-colors duration-300 mt-5 cursor-pointer underline"
          onClick={() => setShowFeedback(true) }
        >
          Enviar Feedback
        </button>
        {
          showFeedback && <Feedback title={ 'Página "Rituais"' } /> 
        }
      </section>
      <Footer />
    </div>
  );
}