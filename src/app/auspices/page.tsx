'use client'
import Nav from '@/components/nav';
import Footer from '@/components/footer';
import InConstruction from '@/components/inConstruction';
import { useSlice } from '@/redux/slice';
import { useAppSelector } from '@/redux/hooks';
import Simplify from '@/components/simplify';

export default function Auspices() {
  const slice = useAppSelector(useSlice);
  return (
    <div>
    <div className="w-full h-screen bg-ritual bg-cover bg-top relative">
      <div className={`absolute w-full h-full ${slice.simplify ? 'bg-black' : 'bg-black/80'}`} />
      <Simplify />
      <Nav />
      <div>
        Os augúrios são categorias fundamentais que representam os papéis espirituais e as características dos lobisomens em Lobisomem: O Apocalipse. Cada augúrio é associado a uma fase específica da lua e é determinado no momento da Primeira Mudança de um lobisomem, refletindo influências cósmicas e místicas em sua personalidade e destino.
      </div>
      <div>
        Esses augúrios desempenham um papel crucial na sociedade dos Garou, definindo as funções e responsabilidades de cada lobisomem em sua matilha e comunidade, enquanto também servem como requisitos para o uso de habilidades especiais chamadas Dons.
      </div>
    </div>
      <Footer />
    </div>
  );
}