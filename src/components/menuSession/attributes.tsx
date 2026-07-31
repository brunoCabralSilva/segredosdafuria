'use client'
import { useContext } from "react";
import contexto from "@/context/context";
import ItemAtr from "../sheetItems/itemAtr";
import { usePathname } from "next/navigation";

export default function Attributes() {
  const pathname = usePathname();
  const isSheetStandalone = pathname?.startsWith('/sheets/');
  const { dataSheet } = useContext(contexto);

  const hasResilienciaDeLuna = dataSheet.data.advantagesAndFlaws.advantages.some((advantage: { title: string }) => advantage.title === 'Resiliência de Luna');

  const getSheetStandalonePhysicalValue = (name: 'strength' | 'dexterity' | 'stamina') => {
    const currentValue = Number(dataSheet.data.attributes[name]);

    if (!isSheetStandalone) return currentValue;

    if (dataSheet.data.form === 'Crinos') {
      return Math.max(0, currentValue - 4);
    }

    if (dataSheet.data.form === 'Hispo' || dataSheet.data.form === 'Glabro') {
      return Math.max(0, currentValue - (hasResilienciaDeLuna ? 4 : 2));
    }

    return currentValue;
  };

  return (
    <div className="flex flex-col w-full h-75vh overflow-y-auto pr-2">
      <div className="w-full h-full mb-2 p-1 flex-col text-white items-start justify-center font-bold">
        <div className="w-full p-4">
          <span className="w-full text-center">Físicos</span>
          <hr className="h-1 w-full" />
          <ItemAtr
            value={getSheetStandalonePhysicalValue('strength')}
            namePtBr="Força"
            name="strength"
            quant={isSheetStandalone ? 6 : dataSheet && dataSheet.data && dataSheet.data.form && dataSheet.data.form === 'Crinos' ? 10 : 6}
          />
          <ItemAtr
            value={getSheetStandalonePhysicalValue('dexterity')}
            name="dexterity"
            namePtBr="Destreza"
            quant={isSheetStandalone ? 6 : dataSheet && dataSheet.data && dataSheet.data.form && dataSheet.data.form === 'Crinos' ? 10 : 6}
          />
          <ItemAtr
            value={getSheetStandalonePhysicalValue('stamina')}
            name="stamina"
            namePtBr="Vigor"
            quant={isSheetStandalone ? 6 : dataSheet && dataSheet.data && dataSheet.data.form && dataSheet.data.form === 'Crinos' ? 10 : 6}
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
