'use client'
import { useState } from 'react';
import { useSlice } from '@/redux/slice';
import { useAppSelector } from '@/redux/hooks';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Nav from '@/components/nav';
import Footer from '@/components/footer';
import Simplify from '@/components/simplify';
import listAuspices from '../../data/auspices.json';
import { AiFillCloseCircle } from "react-icons/ai";
import ContentAuspice from '@/components/ContentAuspice';

export default function Auspices() {
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
          <div className="h-40vh relative flex bg-black items-end text-black">
          <Image
            src={ "/images/49.png" }
            alt="Matilha contemplando o fim do mundo diante de um espírito maldito"
            className="absolute w-full h-40vh object-cover"
            width={ 1200 }
            height={ 800 }
          />
          </div>
        }
        <div className="py-6 px-5 bg-black/90 text-white mt-2 flex flex-col items-center sm:items-start text-justify">
          <h1 className="text-4xl relative">Augúrios</h1>
          <hr className="w-10/12 my-6" />
          <p className="pb-2">
            A lua e sua jornada pelo céu têm uma grande influência sobre os Garou, conferindo a eles o favor de Luna no momento de seu nascimento. De fato, a lua em si é um símbolo do que diferencia os lobisomens do mundo dos lobos e dos humanos, um presságio da parte que desempenham em um mundo conduzido ao Apocalipse.
          </p>
          <p className="pb-2">
          O augúrio de um lobisomem pode ser refletido em sua personalidade e influencia significativamente o papel que desempenham na matilha e na sociedade Garou em geral. Na verdade, nenhum lobisomem, apesar de sua lenda, pode ser todas as coisas para os Garou como um povo. Os augúrios fazem parte da razão pela qual a cultura de matilha existe entre os Garou - cada augúrio fortalece a matilha quando age em conjunto.
          </p>
          <p className="pb-2">
            
          </p>
        </div>
        <div className="grid grid-cols-1 mobile:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 w-full relative text-white px-4 pb-4 bg-black/90">
          {
            listAuspices.sort((a, b) => {
              const nomeA = a.name.toLowerCase();
              const nomeB = b.name.toLowerCase();
              return nomeA.localeCompare(nomeB);
            }).map((auspice, index) => (
              <motion.div
                key={ index }
                whileHover={{ scale: 0.98 }}
                onClick={() => {
                  setToggle(prevValue => !prevValue );
                  setObject(auspice);
                }}
                className="border-white border-2 p-3 flex items-center justify-center flex-col bg-trybes-background bg-center bg-opacity-10 relative cursor-pointer"
              >
                <div className={`absolute w-full h-full ${slice.simplify ? 'bg-black' : 'bg-black/80'}`} />
                <Image
                  src={`/images/auspices/${auspice.name}.png`}
                  alt={`Glifo do Augúrio ${auspice.name}`}
                  className="w-20 relative"
                  width={800}
                  height={400}
                />
                <p className="relative font-bold text-center">
                  { auspice.name }
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
                  <ContentAuspice object={ object } />
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