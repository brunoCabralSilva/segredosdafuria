'use client'
import Nav from '@/components/nav';
import Footer from '@/components/footer';
import { useSlice } from '@/redux/slice';
import { useAppSelector } from '@/redux/hooks';
import Simplify from '@/components/simplify';
import InConstruction from '@/components/inConstruction';

export default function Loresheets() {
  const slice = useAppSelector(useSlice);
  return (
    <div className={`${slice.simplify ? 'bg-black' : 'bg-ritual'} text-white relative`}>
      <div className="bg-black/60 absolute w-full h-full" />
      <div className="px-2 z-10 relative">
        <Simplify />
        <Nav />
        <InConstruction />
        <Footer />
      </div>
    </div>
  );
}