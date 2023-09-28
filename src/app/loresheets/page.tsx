'use client'
import Nav from '@/components/nav';
import Footer from '@/components/footer';
import { actionFeedback, useSlice } from '@/redux/slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import Simplify from '@/components/simplify';
import listLoresheets from '../../data/loresheets.json';
import { AnimatePresence, motion } from 'framer-motion';
import { AiFillCloseCircle } from 'react-icons/ai';
import { useState } from 'react';
import Image from 'next/image';
import Feedback from '@/components/feedback';
import { RxDotFilled } from 'react-icons/rx';

interface IHabilities {
  skill: String;
  skillPtBr: String;
}

interface ILoresheet {
  titlePtBr: String;
  title: String;
  descriptionPtBr: String;
  description: String;
  habilities: IHabilities[];
}

export default function Loresheets() {
  const slice = useAppSelector(useSlice);
  const dispatch: any = useAppDispatch();
  const [isToggled, setToggle] = useState(false);
  const [object, setObject] = useState<any>(null);

  const returnDot = (index: number) => {
    const dots = ['● ', '●● ', '●●● ', '●●●● ', '●●●●● '];
    return dots[index];
  };

  return (
    <div className="w-full bg-ritual bg-cover bg-top relative text-white">
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
          <h1 className="text-4xl relative">Loresheets</h1>
          <hr className="w-10/12 my-6" />
          <p className="pb-2">
            As Loresheets ajudam a vincular os personagens da sua crônica ao amplo Mundo das Trevas, conectando-os a eventos e organizações que afetam o cenário de Lobisomem. Em geral, elas oferecem um benefício ligeiramente mais significativo do que seu nível e custo de Vantagem sugerem, mas geralmente também têm amarras ou riscos adicionais associados.
          </p>
          <p className="pb-2">
            Em geral, os jogadores devem trabalhar com seu Narrador para esclarecer alguns dos detalhes de seus Traços de Loresheet, para que possam ter uma aparência coerente na história. No entanto, alguns Traços de Loresheet provavelmente são melhores mantidos em segredo pelos personagens de outros jogadores...
          </p>
        </div>
        <div className="grid grid-cols-1 mobile:grid-cols-2 sm:grid-cols-3 gap-2 w-full">
          {
            listLoresheets.map((loresheet: ILoresheet, index: number) => (
              <motion.div
                key={ index }
                whileHover={{ scale: 0.98 }}
                onClick={() => {
                  setToggle(prevValue => !prevValue );
                  setObject(loresheet);
                }}
                className={`w-full bg-02 bg-cover h-30vh text-white flex relative cursor-pointer ${slice.simplify ? 'border-2 border-white items-center justify-center' : 'border-transparent items-end'}`}
              >
                <Image
                  src={ `/images/loresheets/${loresheet.titlePtBr}.png` }
                  alt=""
                  className="absolute w-full h-full object-cover object-top"
                  width={ 1200 }
                  height={ 800 }
                />
                <div className={`absolute w-full h-full ${slice.simplify ? 'bg-black' : 'bg-black/60'}`} />
                <div className="text-left relative w-full font-bold text-base px-3 p-2">
                  <p>{ loresheet.titlePtBr }</p>
                  <p>({ loresheet.title })</p>
                </div>
              </motion.div>
            ))
          }
        </div>
      </section>
      <Footer />
      <AnimatePresence>
        {
          object &&
          <motion.div
            initial={{opacity:0}}
            animate={{opacity:1}}
            exit={{opacity:0}}
            className="p-3 sm:p-8 fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/80 z-50"
          >
            <div
              className="border-white border-2 overflow-y-auto relative bg-ritual bg-top bg-cover w-full h-full"
            >
              <div className={`absolute w-full h-full ${slice.simplify ? 'bg-black' : 'bg-black/80'}`} />
              <div className="w-full h-full flex flex-col items-center relative">
                <article className="border w-full h-full px-4 pb-4 pt-10 sm:p-10 border-3 bg-black/70 text-white overflow-y-auto">
                  <div className="flex flex-col justify-center items-center sm:items-start">
                    <h1 className="font-bold text-lg text-center sm:text-left w-full">
                      {`${ object.titlePtBr } (${ object.title })`}
                    </h1>
                    <hr className="w-10/12 my-4 sm:my-2" />
                  </div>
                  <p className="pt-1">
                    <span className="font-bold pr-1">Fonte:</span>
                    { object.book }, pg. { object.page }.
                  </p>
                  <p className="pt-3 text-justify">
                    <span className="font-bold pr-1">Descrição:</span>
                    { object.descriptionPtBr }
                  </p>
                  <ul className="pt-3 sm:justify-between">
                    {
                      object.habilities.map((hability: IHabilities, index: number) => (
                        <div className="pt-2 text-justify flex" key={ index }>
                          {returnDot(index) }{hability.skillPtBr}
                        </div>
                      ))
                    }
                  </ul>
                  {/* <p className="pt-3 text-justify">
                    <span className="font-bold pr-1">Description (original):</span>
                    { object.description }
                  </p>
                  <ul className="list-disc lex flex-col sm:justify-between">
                    {
                      object.habilities.map((hability: IHabilities, index: number) => (
                        <div key={ index }>
                          <li>{ hability.skill }</li>
                        </div>
                      ))
                    }
                  </ul> */}
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                  <button
                    type="button"
                    className={ !slice.simplify ? 'text-orange-300 hover:text-orange-600 transition-colors duration-300 mt-5 cursor-pointer underline' : 'bg-white text-black p-2 font-bold mt-3'}
                    onClick={() => dispatch(actionFeedback({ show: true, message: object.title })) }
                  >
                    Enviar Feedback
                  </button>
                  </div>
                  { slice.feedback.show && <Feedback gift={ slice.feedback.gift } /> }
                </article>
                <button className="text-4xl sm:text-5xl fixed top-4 sm:top-10 sm:right-14 color-white z-50 text-white"
                  onClick={ () => setObject(null)}
                >
                  <AiFillCloseCircle className="bg-black rounded-full p-2" />
                </button>
              </div>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </div>
  );
}