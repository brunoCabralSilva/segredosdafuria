'use client'

import { useAppSelector } from "@/redux/hooks";
import { useSlice } from "@/redux/slice";
import Image from "next/image";
import { useState } from "react";

interface ITrybe {
  nameEn: String, namePtBr: String
}

export default function ItemTrybe(props: { trybe: ITrybe}) {
    const slice = useAppSelector(useSlice);
    const [opacity, setOpacity] = useState(80);
    const { trybe } = props;
    return(
      <div
        className="border-white border p-3 flex items-center justify-center flex-col bg-trybes-background bg-center bg-opacity-10 relative cursor-pointer"
        onMouseEnter={() => setOpacity(90)}
        onMouseLeave={() => setOpacity(80)}
      >
        <div className={`absolute w-full h-full ${slice.simplify ? 'bg-black' : `bg-black/${opacity}`}`} />
        <Image
          src={`/images/trybes/${trybe.namePtBr}.png`}
          alt={`Glifo dos ${trybe.namePtBr}`}
          className="w-20 relative"
          width={800}
          height={400}
        />
        <p className="relative font-bold text-center">
          { trybe.namePtBr }
        </p>
      </div>
    )
}