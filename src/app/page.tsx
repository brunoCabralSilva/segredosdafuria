'use client'
import Footer from '@/components/footer';
import Image from 'next/image'
import Link from 'next/link';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import Simplify from '@/components/simplify';
import { actionFeedback, useSlice } from '@/redux/slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import Feedback from '@/components/feedback';
import Nav from '@/components/nav';

export default function Home() {
  const describe = useRef<HTMLDivElement | null>(null);
  const slice = useAppSelector(useSlice);
  const dispatch: any = useAppDispatch();

  const scrollToComponent = () => {
    if (describe.current) {
      describe.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="bg-black flex flex-col items-center justify-center relative">
      <Simplify />
      <header className="h-screen w-full flex flex-col items-center justify-center bg-cover relative bg-ritual bg-top">
        <div className={`absolute w-full h-full ${slice.simplify ? 'bg-black' : 'bg-black/50'}`} />
        <div className="h-screen w-full z-10 flex flex-col justify-center items-center">
          <Image
            src="/images/logos/text.png"
            alt="Nome 'Werewolf the Apocalypse' em formato de imagem"
            className="h-50vh sm:h-70vh md:h-50vh w-10/12 sm:w-3/5 md:w-1/2 xl:w-5/12 object-contain"
            width={2000}
            height={800}
            priority
          />
          <Image
            src="/images/logos/arrow-down.png"
            alt="seta para baixo"
            className="sm:h-30vh w-20 object-contain animate-pulse cursor-pointer"
            width={2000}
            height={800}
            priority
            onClick={scrollToComponent}
          />
        </div>
      </header>
      <div ref={ describe } className="grid grid-cols-2 grid-row-5 sm:grid-cols-8 sm:grid-row-5 w-full h-full px-4 sm:px-8 pb-4 gap-4 sm:gap-6">
        <div
          className={`sm:text-3xl bg-06 mt-4 sm:mt-8 bg-cover col-span-2 sm:col-span-8 sm:row-span-1 text-center text-white flex relative cursor-pointer ${slice.simplify ? 'border-2 border-white items-center justify-center' : 'border-transparent items-end'}`}>
          <div className={`absolute w-full h-full ${slice.simplify ? 'bg-black' : 'bg-black/40'}`} />
          <p className="py-14 p-5 z-10 relative">
            Seja bem-vindo a uma jornada repleta de conhecimento ancestral, onde você poderá desvendar as características únicas das tribos, augúrios, raças e rituais existentes em Werewolf: The Apocalypse 5th!
          </p>
        </div>
        <Link href="/trybes" className="col-span-1 sm:col-span-2 sm:row-span-2">
          <motion.div
            whileHover={{ scale: 0.98 }}
            className={`bg-01 bg-cover h-full sm:h-40vh text-white flex relative cursor-pointer ${slice.simplify ? 'border-2 border-white items-center justify-center' : 'border-transparent items-end'}`}>
            <div className={`absolute w-full h-full ${slice.simplify ? 'bg-black' : 'bg-black/40'}`} />
            <p className="z-10 font-bold text-base sm:text-xl px-3 p-2 relative">Tribos</p>
          </motion.div>
        </Link>
        <Link href="/auspices" className="col-span-1 sm:col-span-2 sm:row-span-4">
          <motion.div
            whileHover={{ scale: 0.98 }}
            className={`bg-02 bg-cover h-20vh sm:h-full text-white flex relative cursor-pointer ${slice.simplify ? 'border-2 border-white items-center justify-center' : 'border-transparent items-end'}`}>
            <div className={`absolute w-full h-full ${slice.simplify ? 'bg-black' : 'bg-black/40'}`} />
            <p className="z-10 font-bold text-base sm:text-xl px-3 p-2">Augúrios</p>
          </motion.div>
        </Link>
        <Link href="/gifts" className="col-span-2 sm:col-span-4 sm:row-span-2">
          <motion.div
            whileHover={{ scale: 0.98 }}
            className={`bg-03 bg-cover bg-center h-20vh sm:h-40vh text-white flex relative cursor-pointer ${slice.simplify ? 'border-2 border-white items-center justify-center' : 'border-transparent items-end'}`}>
            <div className={`absolute w-full h-full ${slice.simplify ? 'bg-black' : 'bg-black/40'}`} />
            <p className="z-10 font-bold text-base sm:text-xl px-3 p-2">Dons</p>
          </motion.div>
        </Link>
        <Link href="/forms" className="col-span-1 sm:col-span-2 sm:row-span-2">
          <motion.div
            whileHover={{ scale: 0.98 }}
            className={`bg-04 bg-cover h-20vh sm:h-40vh text-white flex relative cursor-pointer ${slice.simplify ? 'border-2 border-white items-center justify-center' : 'border-transparent items-end'}`}>
            <div className={`absolute w-full h-full ${slice.simplify ? 'bg-black' : 'bg-black/40'}`} />
            <p className="z-10 font-bold text-base sm:text-xl px-3 p-2 relative">Formas</p>
          </motion.div>
        </Link>
        <Link href="/rituals" className="col-span-1 row-span-2 sm:col-span-2 sm:row-span-2">
          <motion.div
            whileHover={{ scale: 0.98 }}
            className={`bg-05 bg-cover h-full sm:h-40vh text-white flex relative cursor-pointer ${slice.simplify ? 'border-2 border-white items-center justify-center' : 'border-transparent items-end'}`}>
            <div className={`absolute w-full h-full ${slice.simplify ? 'bg-black' : 'bg-black/40'}`} />
            <p className="z-10 font-bold text-base sm:text-xl px-3 p-2">Rituais</p>
          </motion.div>
        </Link>
        <Link href="/about" className="col-span-1 sm:row-span-2 sm:col-span-2">
          <motion.div
            whileHover={{ scale: 0.98 }}
            className={`bg-06 bg-cover h-20vh sm:h-40vh text-white flex relative cursor-pointer ${slice.simplify ? 'border-2 border-white items-center justify-center' : 'border-transparent items-end'}`}>
            <div className={`absolute w-full h-full ${slice.simplify ? 'bg-black' : 'bg-black/40'}`} />
            <p className="z-10 font-bold text-base sm:text-xl px-3 p-2">Sobre</p>
          </motion.div>
        </Link>
        <Link href="/loresheets" className="col-span-1 sm:row-span-2 sm:col-span-4">
          <motion.div
            whileHover={{ scale: 0.98 }}
            className={`bg-07 bg-cover h-20vh sm:h-40vh text-white flex relative cursor-pointer ${slice.simplify ? 'border-2 border-white items-center justify-center' : 'border-transparent items-end'}`}>
            <div className={`absolute w-full h-full ${slice.simplify ? 'bg-black' : 'bg-black/40'}`} />
            <p className="z-10 font-bold text-base sm:text-xl px-3 p-2">Loresheets</p>
          </motion.div>
        </Link>
        <Link href="/talismans" className="col-span-1 sm:row-span-2 sm:col-span-4">
          <motion.div
            whileHover={{ scale: 0.98 }}
            className={`bg-08 bg-cover bg-center h-20vh sm:h-40vh text-white flex relative cursor-pointer ${slice.simplify ? 'border-2 border-white items-center justify-center' : 'border-transparent items-end'}`}>
            <div className={`absolute w-full h-full ${slice.simplify ? 'bg-black' : 'bg-black/40'}`} />
            <p className="z-10 font-bold text-base sm:text-xl px-3 p-2">Talismãs</p>
          </motion.div>
        </Link>
        <Link href="/sessions/login" className="col-span-2 sm:row-span-2 sm:col-span-8">
          <motion.div
            whileHover={{ scale: 0.98 }}
            className={`bg-boca01 bg-cover bg-center h-20vh sm:h-40vh text-white flex relative cursor-pointer ${slice.simplify ? 'border-2 border-white items-center justify-center' : 'border-transparent items-end'}`}>
            <div className={`absolute w-full h-full ${slice.simplify ? 'bg-black' : 'bg-black/40'}`} />
            <p className="z-10 font-bold text-base sm:text-xl px-3 p-2">Sessões</p>
          </motion.div>
        </Link>
      </div>
      <button
        type="button"
        className={`pb-3 ${!slice.simplify ? 'text-orange-300 hover:text-orange-600 transition-colors duration-300 mt-5 cursor-pointer underline' : 'bg-white text-black p-2 font-bold mt-3'}`}
        onClick={() => dispatch(actionFeedback({ show: true, message: '' })) }
      >
        Enviar Feedback
      </button>
      {
        slice.feedback.show && <Feedback title={ 'Página "Home"' } /> 
      }
      <Footer />
    </main>
  );
}