'use client'
import { useSlice } from '@/redux/slice';
import { useAppSelector } from '@/redux/hooks';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Nav from '@/components/nav';
import Footer from '@/components/footer';
import Simplify from '@/components/simplify';
import listTrybes from '../../data/trybes.json';
import Link from 'next/link';

export default function Trybes() {
  const slice = useAppSelector(useSlice);
  
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
            src={ "/images/84.png" }
            alt="Matilha contemplando o fim do mundo diante de um espírito maldito"
            className="absolute w-full h-40vh object-contain object-top"
            width={ 1200 }
            height={ 800 }
          />
          </div>
        }
        <div className="py-6 px-5 bg-black/90 text-white mt-2 flex flex-col items-center sm:items-start text-justify">
          <h1 className="text-4xl relative">Tribos</h1>
          <hr className="w-10/12 my-6" />
          <p className="pb-2">
            As tribos são grupos de lobisomens unidos por um propósito espiritual comum e afinidades compartilhadas. Cada tribo é associada a um Espírito Patrono e os Garou que fazem parte dela prometem seguir os valores desse espírito, criando assim uma relação de compromisso espiritual.
          </p>
          <p className="pb-2">
            Além disso, as tribos representam uma comunidade de lobisomens que compartilham uma visão de mundo, objetivos e mentalidade semelhantes, embora nem sempre haja consenso interno, pois as rivalidades entre os membros podem surgir devido a diferenças pessoais e ideológicas. Essas tribos desempenham um papel fundamental na identidade e na cultura dos Garou, influenciando suas aptidões, comportamentos e como eles se relacionam com a natureza e Gaia.
          </p>
        </div>
        <div className="grid grid-cols-1 mobile:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 w-full relative text-white px-4 pb-4 bg-black/90">
          {
            listTrybes.sort((a, b) => {
              const nomeA = a.namePtBr.toLowerCase();
              const nomeB = b.namePtBr.toLowerCase();
              return nomeA.localeCompare(nomeB);
            }).map((trybe, index) => (
              <Link
                href={`/trybes/${trybe.nameEn.toLowerCase()}`}
                key={ index }
                className="border-white border-2 p-3 flex items-center justify-center flex-col bg-filters bg-center bg-opacity-10 relative cursor-pointer"
              >
                <div className={`absolute w-full h-full ${slice.simplify ? 'bg-black' : 'bg-black/80'}`} />
                <Image
                  src={`/images/trybes/${trybe.namePtBr}.png`}
                  alt={`Glifo dos ${trybe.namePtBr}`}
                  className="w-20 relative"
                  width={800}
                  height={400}
                />
                <p className="relative font-bold text-center">
                  { trybe.namePtBr }
                </p>
              </Link>
            ))
          }
        </div>
      </section>
      <Footer />
    </div>
  );
}