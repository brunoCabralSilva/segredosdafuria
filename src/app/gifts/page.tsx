'use client'
import { useRef } from 'react';
import { useSlice } from '@/redux/slice';
import { useAppSelector } from '@/redux/hooks';

import Nav from '@/components/nav';
import Footer from '@/components/footer';
import Feedback from '@/components/feedback';
import DataGifts from '@/components/dataGifts';
import FilterGifts from '@/components/filterGifts';
import Simplify from '@/components/simplify';
import ListGifts from '@/components/listGifts';
import SearchButton from '@/components/searchButton';

export default function Gifts() {
  const describe = useRef<HTMLDivElement | null>(null);
  const slice = useAppSelector(useSlice);
  return (
    <div className={`${slice.simplify ? 'bg-black' : 'bg-ritual'} text-white relative`}>
      <div className="bg-black/60 absolute w-full h-full" />
      <div className="px-2 z-10 relative">
        <Simplify />
        <Nav />
        <DataGifts />
        <div ref={ describe } />
        <FilterGifts title="Tribos"  />
        <FilterGifts title="Augúrios" />
        <FilterGifts title="Renome e/ou Dons Nativos"  />
        <FilterGifts title="text" />
        <SearchButton />
        <ListGifts describe={ describe } />
      </div>
      <Footer />
    </div>
  );
}