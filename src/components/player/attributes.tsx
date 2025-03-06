'use client'
import { useContext, useEffect } from "react";
import contexto from "@/context/context";
import ItemAtr from "./itemAtr";

export default function Attributes() {
	const { dataSheet } = useContext(contexto);
  return(
    <div className="flex flex-col w-full h-75vh overflow-y-auto pr-2">
      <div className="w-full h-full mb-2 p-1 flex-col text-white items-start justify-center font-bold">
        <div className="w-full p-4">
          <span className="w-full text-center">Físicos</span>
          <hr className="h-1 w-full" />
          <ItemAtr
						value={dataSheet.data.attributes.strength}
						namePtBr="Força"
						name="strength"
						quant={6}
					/>
					<ItemAtr
						value={dataSheet.data.attributes.dexterity}
						name="dexterity"
						namePtBr="Destreza"
						quant={6}
					/>
					<ItemAtr
						value={dataSheet.data.attributes.stamina}
						name="stamina"
						namePtBr="Vigor"
						quant={6}
					/>
        </div>
        <div className="w-full mt-2 md:mt-3 p-4">
          <span className="w-full text-center">Sociais</span>
          <hr className="h-1 w-full" />
					<ItemAtr
						value={dataSheet.data.attributes.charisma}
						name="charisma"
						namePtBr="Carisma"
						quant={6}
					/>
					<ItemAtr
						value={dataSheet.data.attributes.manipulation}
						name="manipulation"
						namePtBr="Manipulação"
						quant={6}
					/>
					<ItemAtr
						value={dataSheet.data.attributes.composure}
						name="composure"
						namePtBr="Autocontrole"
						quant={6}
					/>
        </div>
        <div className="w-full mt-2 md:mt-3 p-4">
          <span className="w-full text-center">Mentais</span>
          <hr className="h-1 w-full" />
					<ItemAtr
						value={dataSheet.data.attributes.intelligence}
						name="intelligence"
						namePtBr="Inteligência"
						quant={6}
					/>
					<ItemAtr
						value={dataSheet.data.attributes.wits}
						name="wits"
						namePtBr="Raciocínio"
						quant={6}
					/>
					<ItemAtr
						value={dataSheet.data.attributes.resolve}
						name="resolve"
						namePtBr="Determinação"
						quant={6}
					/>
        </div>
      </div>
    </div>
  );
}