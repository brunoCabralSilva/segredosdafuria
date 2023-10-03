'use client'
import { useEffect, useRef } from 'react';
import { actionType, useSlice } from '@/redux/slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

import Nav from '@/components/nav';
import Footer from '@/components/footer';
import DataGifts from './dataGifts';
import FilterGifts from './filterGifts';
import Simplify from '@/components/simplify';
import ListGifts from './listGifts';
import SearchButton from '@/components/SearchButton';

export default function Gifts() {
  const describe = useRef<HTMLDivElement | null>(null);
  const dispatch: any = useAppDispatch();
  const slice = useAppSelector(useSlice);

  useEffect(() => {
    dispatch(actionType({ show: false, talisman: '', gift: '', ritual: '' }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <SearchButton type="gifts" />
        <ListGifts />
      </div>
      <Footer />
    </div>
  );
}