'use client'
import { useState } from 'react';
import { useSlice } from '@/redux/slice';
import { useAppSelector } from '@/redux/hooks';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Nav from '@/components/nav';
import Footer from '@/components/footer';
import Simplify from '@/components/simplify';
import listTrybes from '../../data/trybes.json';
import { AiFillCloseCircle } from "react-icons/ai";
import DataTrybes from '@/components/dataTrybes';

export default function Trybes() {
  const [isToggled, setToggle] = useState(false);
  const [object, setObject] = useState<any>(null);
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
              <motion.div
                key={ index }
                whileHover={{ scale: 0.98 }}
                onClick={() => {
                  setToggle(prevValue => !prevValue );
                  setObject(trybe);
                }}
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
              </motion.div>
            ))
          }
        </div>
        <AnimatePresence>
          {
            object &&
            <motion.div
              initial={{opacity:0}}
              animate={{opacity:1}}
              exit={{opacity:0}}
              className="p-3 sm:p-8 fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/80 z-50 snap-y"
            >
              <div
                className="relative bg-ritual bg-top bg-cover w-full h-full border-2 border-white"
              >
                <div className={`absolute w-full h-full ${slice.simplify ? 'bg-black' : 'bg-black/80'}`} />
                <div className="w-full h-full flex flex-col items-center">
                  <DataTrybes object={ object } />
                  <button className="text-4xl sm:text-5xl fixed top-4 right-5 sm:top-10 sm:right-14 color-white z-50 text-white"
                    onClick={ () => setObject(null)}
                  >
                    <AiFillCloseCircle className="bg-black rounded-full p-2" />
                  </button>
                </div>
              </div>
            </motion.div>
          }
        </AnimatePresence>
      </section>
      <Footer />
    </div>
  );
}