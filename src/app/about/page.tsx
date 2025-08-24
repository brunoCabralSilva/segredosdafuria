'use client'
import Footer from '@/components/footer';
import { BsInstagram, BsSpotify, BsYoutube, BsFacebook } from "react-icons/bs";
import Image from 'next/image';
import Feedback from '@/components/feedback';
import { useContext, useEffect } from 'react';
import contexto from '@/context/context';
import Nav from '@/components/nav';

export default function About() {
  const { showFeedback, setShowFeedback, resetPopups } = useContext(contexto);
  useEffect(() => resetPopups(), []);
  return (
    <div className="bg-ritual text-white relative">
      <div className="bg-black/60 absolute w-full h-full" />
      <div className="px-2 z-10 relative">
        <Nav />
        <section className="mb-2">
          <div className="h-40vh relative flex bg-black items-end text-black bg-boca md:bg-boca01 bg-cover bg-center" />
          <div className="py-6 px-5 bg-black/90 mt-2 flex flex-col items-center sm:items-start text-justify">
        <h1 className="text-4xl relative text-center">Quem Somos</h1>
            <hr className="w-10/12 my-6" />
            <div className="w-full flex justify-center sm:justify-start text-2xl gap-4">
              <a
                target="_blank"
                href="https://www.instagram.com/garounordeste/"
              >
                <BsInstagram />
              </a>
              <a
                target="_blank"
                href="https://open.spotify.com/show/7kal4LDO3ptHc3sG64btYI"
              >
                <BsSpotify />
              </a>
              <a
                target="_blank"
                href="https://www.facebook.com/garounordeste"
              >
                <BsFacebook />
              </a>
              <a
                target="_blank"
                href="https://www.youtube.com/c/GarouNordeste"
              >
                <BsYoutube />
              </a>
            </div>
            <div className="w-full">
              <p className="pt-4">
                O Garou Nordeste é um projeto visionário que busca mergulhar nas riquezas culturais e místicas do Nordeste do Brasil, transportando essa riqueza para o emocionante cenário de &quot;Lobisomem: O Apocalipse,&quot; inserido no universo do sistema WoD (Mundo das Trevas).
              </p>

              <p className="pt-4">
                A semente desse projeto foi plantada nas mentes de três apaixonados: Bruno Gabryell, Felipe Brito e Jocélio Procópio, que, unidos sob o estandarte da &quot;Taverna Literária&quot;, decidiram embarcar em uma jornada única. Eles almejavam criar algo que destacasse o Nordeste e a cultura dos Garou, mostrando ao Brasil inteiro que nossa região é muito mais do que os estereótipos de seca e carência.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center w-full pt-4 gap-2">
                <Image
                  src={ "/images/modelo01.jpeg" }
                  alt="Modelo branco da camisa do Garou Nordeste"
                  className="w-full sm:w-1/2 object-contain cobject-center h-full"
                  width={ 1200 }
                  height={ 800 }
                />
                <Image
                  src={ "/images/modelo02.jpeg" }
                  alt="Modelo preto da camisa do Garou Nordeste"
                  className="w-full sm:w-1/2 object-contain cobject-center h-full"
                  width={ 1200 }
                  height={ 800 }
                />
              </div>
              <p className="w-full text-center">
                <span className="pr-1">Imagens criadas por</span>
                <a
                  target="_blank"
                  href="https://www.instagram.com/cesarbard/"
                  className="underline">
                    @cesarbard
                </a>
              </p>
              <p className="pt-4">
                O Garou Nordeste é um tributo à diversidade e à espiritualidade profundamente enraizada no coração do Nordeste. É uma celebração da força da natureza, da resiliência de seu povo e da riqueza de suas tradições. Neste projeto, os jogadores de &quot;Lobisomem: O Apocalipse&quot; serão levados a uma jornada única, onde os mistérios da região se mesclam com a mitologia dos Garou de uma forma que cativa, educa e inspira.
              </p>
              <p className="pt-4">
                Nós convidamos você a se juntar a nós nessa aventura emocionante, à medida que desvendamos os segredos do Nordeste, trazendo à tona a magia e o poder dos Garou em uma narrativa que ecoa com a alma vibrante dessa região fascinante. Juntos, vamos descobrir um Brasil que é rico em diversidade e cultura, repleto de histórias esperando para serem contadas. Bem-vindo ao Garou Nordeste, onde a jornada é tão grandiosa quanto o destino!
              </p>
              <div className="flex flex-col-reverse md:flex-col">
                <div className="w-full flex flex-col md:flex-row justify-center md:justify-between md:flex-wrap gap-3 text-center md:text-left">
                  <p className="pt-4 flex flex-col text-sm sm:text-base">
                  <span className="pr-1 font-bold">
                    Criador, revisor e tradutor:
                  </span>
                  <span className="">Bruno Gabryell Cabral da Silva</span>
                  </p>
                  <p className="pt-4 flex flex-col text-sm md:text-base">
                    <span className="pr-1 font-bold">Contato / Whatsapp:</span>
                    <span className="">+55 83 9 9836 4408</span>
                  </p>
                  <p className="pt-4 flex flex-col text-sm md:text-base">
                    <span className="pr-1 font-bold">E-mail:</span>
                    <span className="">
                      bruno.cabral.silva2018@gmail.com
                    </span>
                  </p>
                  <p className="pt-4 flex flex-col text-sm sm:text-base">
                    <span className="pr-1 font-bold">Github:</span>
                    <a
                      target="_blank"
                      href="https://github.com/brunoCabralSilva"
                      className="pt-3 pb-2 sm:py-0 cursor-pointer underline $font-bold">
                      github.com/brunoCabralSilva
                    </a>
                  </p>
                  <p className="pt-4 flex flex-col text-sm sm:text-base">
                    <span className="pr-1 font-bold">Portfólio:</span>
                    <a
                      target="_blank"
                      href="https://bruno-cabral-portfolio.vercel.app/"
                      className="pt-3 pb-2 sm:py-0 cursor-pointer underline $font-bold">
                      bruno-cabral-portfolio.vercel.app/
                    </a>
                  </p>
                </div>
                <div className="flex w-full justify-center items-center pt-4">
                  <Image
                    src={ "/images/garou-Nordeste - icone.png" }
                    alt="Logo do Garou Nordeste"
                    className="w-80 object-contain cobject-center h-full"
                    width={ 1200 }
                    height={ 800 }
                  />
                </div>
              </div>
              <button
                type="button"
                className="text-orange-300 hover:text-orange-600 transition-colors duration-300 mt-5 cursor-pointer underline"
                onClick={() => setShowFeedback(true) }
              >
                Enviar Feedback
              </button>
              { showFeedback && <Feedback title={ 'Página "Quem Somos"' } /> }
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
}