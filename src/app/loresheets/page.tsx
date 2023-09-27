'use client'
import Nav from '@/components/nav';
import Footer from '@/components/footer';
import { useSlice } from '@/redux/slice';
import { useAppSelector } from '@/redux/hooks';
import Simplify from '@/components/simplify';
import listLoresheets from '../../data/loresheets.json';

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
  return (
    <div className={`${slice.simplify ? 'bg-black' : 'bg-ritual'} text-white relative`}>
      <div className="bg-black/60 absolute w-full h-full" />
      <div className="px-2 z-10 relative">
        <Simplify />
        <Nav />
        <div>
          {
            listLoresheets.map((loresheet: ILoresheet, index: number) => (
              <div key={ index } className="py-10">
                <p>{ loresheet.titlePtBr } - { loresheet.title }</p>
                <p>{ loresheet.descriptionPtBr }</p>
                <p>{ loresheet.description }</p>
                {
                  loresheet.habilities.map((hability: IHabilities, index: number) => (
                    <div key={ index }>
                      <p>{ hability.skill }</p>
                      <p>{ hability.skillPtBr }</p>
                    </div>
                  ))
                }
              </div>
            ))
          }
        </div>
      </div>
      <Footer />
    </div>
  );
}