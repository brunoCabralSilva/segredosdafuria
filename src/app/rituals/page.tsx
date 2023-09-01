'use client'
import Nav from '@/components/nav';
import Footer from '@/components/footer';
import InConstruction from '@/components/inConstruction';
import { useSlice } from '@/redux/slice';
import { useAppSelector } from '@/redux/hooks';
import Simplify from '@/components/simplify';

export default function Rituals() {
  const slice = useAppSelector(useSlice);
  return (
    <div className="w-full h-screen bg-ritual bg-cover bg-top relative">
      <div className={`absolute w-full h-full ${slice.simplify ? 'bg-black' : 'bg-black/50'}`} />
      <Simplify />
      <Nav />
      <InConstruction />
      <Footer />
    </div>
  );
}