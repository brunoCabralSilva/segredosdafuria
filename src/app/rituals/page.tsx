'use client'
import Nav from '@/components/nav';
import Footer from '@/components/footer';
import { useSlice, actionRitual } from '@/redux/slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import Simplify from '@/components/simplify';
import Image from 'next/image';
import { ChangeEvent } from 'react';
import SearchRitualButton from '@/components/SearchRitualButton';
import ListRituals from '@/components/listRituals';

export default function Rituals() {
  const slice = useAppSelector(useSlice);
  const dispatch: any = useAppDispatch();

  const typeText = (e: ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
    dispatch(actionRitual(sanitizedValue));
  };

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
            className={`shadow shadow-white text-center sm:text-left w-full px-4 py-2 ${slice.searchRitual === '' || slice.searchRitual === ' '
            ? 'bg-black text-white' : 'bg-white text-black'} rounded-full mb-3`}
            value={ slice.searchRitual }
            placeholder="Digite aqui"
            onChange={ (e) => typeText(e) }
          />
        </section>
        <SearchRitualButton />
        <ListRituals />
      </section>
      <Footer />
    </div>
  );
}