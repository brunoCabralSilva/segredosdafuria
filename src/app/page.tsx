'use client'
import Footer from '@/components/footer';
import Image from 'next/image'
import Link from 'next/link';
import { useRef } from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  const describe = useRef<HTMLDivElement | null>(null);

  const scrollToComponent = () => {
    if (describe.current) {
      describe.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="bg-black flex flex-col items-center justify-center relative">
      <div className="" />
      <header className="h-screen w-full flex flex-col items-center justify-center bg-cover relative bg-ritual bg-top">
        <div className="absolute w-full h-full bg-black/50" />
        <div className="h-screen w-full z-10 flex flex-col justify-center items-center">
          <Image
            src="/images/text.png"
            alt=""
            className="h-50vh sm:h-70vh md:h-50vh w-10/12 sm:w-3/5 md:w-1/2 xl:w-5/12 object-contain"
            width={2000}
            height={800}
            priority
          />
          <Image
            src="/images/arrow-down.png"
            alt=""
            className="sm:h-30vh w-20 object-contain animate-pulse"
            width={2000}
            height={800}
            priority
            onClick={scrollToComponent}
          />
        </div>
      </header>
      <div ref={ describe } className="grid grid-cols-8 grid-row-5 w-full h-full px-8 pb-4 gap-6 ">
        <div
          className="bg-06 mt-8 bg-cover col-span-8 row-span-1 text-center text-white text-3xl relative"
        >
          <div className="absolute w-full h-full bg-black/50" />
          <p className="py-14 p-5 z-10 relative">
            Seja bem-vindo a uma jornada repleta de conhecimento ancestral, onde você poderá desvendar as características únicas das tribos, augúrios, raças e rituais existentes em Werewolf: The Apocalypse 5th!
          </p>
        </div>
        <motion.div whileHover={{ scale: 0.98 }} className="bg-01 bg-cover col-span-2 row-span-2 h-40vh text-white flex items-end relative cursor-pointer">
          <div className="absolute w-full h-full bg-black/40" />
          <Link href="/trybes" className="relative">
              <p className="z-10 font-bold text-xl px-3 p-2 relative">Tribos</p>
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 0.98 }} className="bg-02 bg-cover col-span-2 row-span-4 h-full text-white flex items-end relative cursor-pointer">
          <div className="absolute w-full h-full bg-black/40" />
          <Link href="/auspices" className="relative">
            <p className="z-10 font-bold text-xl px-3 p-2">Augúrios</p>
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 0.98 }} className="bg-03 bg-cover col-span-4 row-span-2 bg-center h-40vh text-white flex items-end relative cursor-pointer">
          <div className="absolute w-full h-full bg-black/40" />
          <Link href="/gifts" className="relative">
            <p className="z-10 font-bold text-xl px-3 p-2">Dons</p>
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 0.98 }} className="bg-04 bg-cover col-span-2 row-span-2 h-40vh text-white flex items-end relative cursor-pointer">
          <div className="absolute w-full h-full bg-black/40" />
          <Link href="/breeds" className="relative">
            <p className="z-10 font-bold text-xl px-3 p-2 relative">Raças</p>
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 0.98 }} className="bg-05 bg-cover col-span-2 row-span-2 h-40vh text-white flex items-end relative cursor-pointer">
            <div className="absolute w-full h-full bg-black/40" />
            <Link href="/rites" className="relative z-10">
              <p className="z-10 font-bold text-xl px-3 p-2">Rituais</p>
            </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 0.98 }} className="bg-06 bg-cover row-span-2 col-span-2 h-40vh text-white flex items-end relative cursor-pointer">
          <div className="absolute w-full h-full bg-black/40" />
          <Link href="/about" className="relative">
            <p className="z-10 font-bold text-xl px-3 p-2">Sobre</p>
          </Link>
        </motion.div>
      </div>
      {/* <div
        className="bg-matilha relative flex flex-col justify-start w-full text-white"
        ref={describe}
      >
        <div className="absolute w-full h-full bg-black/50" />
        <div className="border-2 m-4 flex relative">
          <div className="absolute w-full h-full bg-black/50" />
          <Image
            src="/images/art5.png"
            alt=""
            className="h-full w-10/12 sm:w-3/5 md:w-5/12 object-contain p-10 z-10"
            width={2000}
            height={800}
            priority
          />
          <div className="py-10 z-10">
            <h1 className="text-6xl">
              Bem vindo ao Segredos da Lua
            </h1>
            <p className="py-10 leading-7 z-10 mx-auto text-left ">
              Seja bem-vindo a uma jornada repleta de conhecimento ancestral, onde você poderá desvendar as características únicas das tribos de Werewolf: The Apocalypse 5th, assim como os poderosos augúrios, as diversas raças que habitam este universo e os rituais que moldam o destino dos Garou. Além disso, nossa ferramenta de busca avançada permite que você descubra os dons ocultos, desvendando segredos profundos baseados nas tribos e augúrios. Prepare-se para mergulhar na rica mitologia deste RPG épico e desvendar suas histórias através de informações detalhadas e de fácil acesso.
            </p>
            <button type="button" className="mx-auto relative z-10 border border-white px-4 py-3 text-white">
              Mais
            </button>
          </div>
        </div> */}
      {/* </div> */}
      <Footer />
    </main>
  );
}