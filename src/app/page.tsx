'use client'
import Footer from '@/components/footer';
import Nav from '@/components/nav'
import Image from 'next/image'
import { useRef } from 'react';

export default function Home() {
  const describe = useRef<HTMLDivElement | null>(null);

  const scrollToComponent = () => {
    if (describe.current) {
      describe.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="bg-black flex flex-col items-center justify-center">
      <header className="w-full h-full flex flex-col items-center justify-center bg-ritual bg-cover relative">
        <div className="absolute w-full h-full bg-black/60" />
        <Nav />
        <div className="h-screen sm:mt-20 w-full z-10 flex flex-col justify-center items-center">
          <Image
            src="/images/text.png"
            alt=""
            className="h-70vh sm:h-30vh w-10/12 sm:w-3/5 md:w-5/12 object-contain"
            width={2000}
            height={800}
            priority
          />
          <Image
            src="/images/logos/arrow-down.png"
            alt=""
            onClick={ scrollToComponent }
            className="sm:mt-20 w-14 sm:w-20 z-10 animate-pulse cursor-pointer"
            width={2000}
            height={800}
            priority
          />
        </div>
      </header>
      <div className="sm:h-screen flex items-center justify-center bg-matilha relative" ref={describe}>
        <div className="absolute w-full h-full bg-black/60" />
        <p className="relative my-28 w-10/12 sm:w-3/5 md:w-6/12 leading-7 text-center text-white z-10 flex items-center justify-center">
          Explore as profundezas místicas do mundo de Werewolf: The Apocalypse 5th Edition! Seja bem-vindo a uma jornada repleta de conhecimento ancestral, onde você poderá desvendar as características únicas das tribos, os poderosos augúrios, as diversas raças que habitam este universo e os rituais que moldam o destino dos Garou. Além disso, nossa ferramenta de busca avançada permite que você descubra os dons ocultos, desvendando segredos profundos baseados nas tribos e augúrios. Prepare-se para mergulhar na rica mitologia deste RPG épico e desvendar suas histórias através de informações detalhadas e de fácil acesso. Bem-vindo a um mundo de mistério, poder e aventura!
        </p>
      </div>
      <Footer />
    </main>
  );
}