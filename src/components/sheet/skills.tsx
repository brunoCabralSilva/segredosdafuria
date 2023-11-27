import ItemSkill from "./itemSkill";

export default function Skills() {
  return(
    <div className="flex flex-col w-full overflow-y-auto pr-2 h-full mb-3">
      <div className="w-full h-full mb-2 p-1 cursor-pointer text-white bg-black flex-col items-start justify-center font-bold">
        <div className="w-full bg-white p-4 text-black">
          <ItemSkill name="athletics" namePtBr="Atletismo" quant={5} />
          <ItemSkill name="brawl" namePtBr="Briga" quant={5} />
          <ItemSkill name="craft" namePtBr="Ofícios" quant={5} />
          <ItemSkill name="driving" namePtBr="Condução" quant={5} />
          <ItemSkill name="firearms" namePtBr="Armas de Fogo" quant={5} />
          <ItemSkill name="larceny" namePtBr="Furto" quant={5} />
          <ItemSkill name="melee" namePtBr="Armas Brancas" quant={5} />
          <ItemSkill name="stealth" namePtBr="Furtividade" quant={5} />
          <ItemSkill name="survival" namePtBr="Sobrevivência" quant={5} />
        </div>
        <div className="w-full mt-2 md:mt-5 bg-white p-4 text-black">
          <ItemSkill name="animalKen" namePtBr="Empatia com Animais" quant={5} />
          <ItemSkill name="etiquette" namePtBr="Etiqueta" quant={5} />
          <ItemSkill name="insight" namePtBr="Intuição" quant={5} />
          <ItemSkill name="intimidation" namePtBr="Intimidação" quant={5} />
          <ItemSkill name="leadership" namePtBr="Liderança" quant={5} />
          <ItemSkill name="performance" namePtBr="Performace" quant={5} />
          <ItemSkill name="persuasion" namePtBr="Persuasão" quant={5} />
          <ItemSkill name="streetwise" namePtBr="Manha" quant={5} />
          <ItemSkill name="subterfuge" namePtBr="Lábia" quant={5} />
        </div>
        <div className="w-full mt-2 md:mt-5 bg-white p-4 text-black">
          <ItemSkill name="academics" namePtBr="Acadêmicos" quant={5} />
          <ItemSkill name="awareness" namePtBr="Percepção" quant={5} />
          <ItemSkill name="finance" namePtBr="Finanças" quant={5} />
          <ItemSkill name="investigation" namePtBr="Investigação" quant={5} />
          <ItemSkill name="medicine" namePtBr="Medicina" quant={5} />
          <ItemSkill name="occult" namePtBr="Ocultismo" quant={5} />
          <ItemSkill name="politics" namePtBr="Política" quant={5} />
          <ItemSkill name="science" namePtBr="Ciência" quant={5} />
          <ItemSkill name="technology" namePtBr="Tecnologia" quant={5} />
        </div>
      </div>
    </div>
  );
}