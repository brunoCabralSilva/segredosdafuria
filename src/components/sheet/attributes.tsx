import ItemAtr from "./itemAtr"

export default function Attributes() {
  return(
    <div className="flex flex-col w-full overflow-y-auto pr-2 h-full mb-3">
      <div className="w-full h-full mb-2 p-1 cursor-pointer text-white bg-black flex-col items-start justify-center font-bold">
        <div className="w-full bg-white p-4 text-black">
          <span className="w-full text-center">Físicos</span>
          <hr className="bg-black h-1 text-black w-full" />
          <ItemAtr namePtBr="Força" name="strength" quant={6} />
          <ItemAtr namePtBr="Destreza" name="dexterity" quant={6} />
          <ItemAtr namePtBr="Vigor" name="stamina" quant={6} />
        </div>
        <div className="w-full mt-2 md:mt-3 bg-white p-4 text-black">
          <span className="w-full text-center">Sociais</span>
          <hr className="bg-black h-1 text-black w-full" />
          <ItemAtr namePtBr="Carisma" name="charisma" quant={6} />
          <ItemAtr namePtBr="Manipulação" name="manipulation" quant={6} />
          <ItemAtr namePtBr="Perseverança" name="composure" quant={6} />
        </div>
        <div className="w-full mt-2 md:mt-3 bg-white p-4 text-black">
          <span className="w-full text-center">Mentais</span>
          <hr className="bg-black h-1 text-black w-full" />
          <ItemAtr namePtBr="Inteligência" name="intelligence" quant={6} />
          <ItemAtr namePtBr="Raciocínio" name="wits" quant={6} />
          <ItemAtr namePtBr="Autocontrole" name="resolve" quant={6} />
        </div>
      </div>
    </div>
  );
}