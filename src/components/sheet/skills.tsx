'use client'
import ItemSkill from "./itemSkill";
export default function Skills(props: { session: string }) {
  const { session } = props;
  return(
    <div className="flex flex-col w-full overflow-y-auto pr-2 h-full mb-3">
      <div className="w-full h-full mb-2 p-1 text-white flex-col items-start justify-center font-bold">
        <div className="w-full px-4 pt-4">
          <ItemSkill name="athletics" namePtBr="Atletismo" quant={5} session={session} />
          <ItemSkill name="brawl" namePtBr="Briga" quant={5} session={session} />
          <ItemSkill name="craft" namePtBr="Ofícios" quant={5} session={session} />
          <ItemSkill name="driving" namePtBr="Condução" quant={5} session={session} />
          <ItemSkill name="firearms" namePtBr="Armas de Fogo" quant={5} session={session} />
          <ItemSkill name="larceny" namePtBr="Furto" quant={5} session={session} />
          <ItemSkill name="melee" namePtBr="Armas Brancas" quant={5} session={session} />
          <ItemSkill name="stealth" namePtBr="Furtividade" quant={5} session={session} />
          <ItemSkill name="survival" namePtBr="Sobrevivência" quant={5} session={session} />
        </div>
        <hr className="mx-4 my-6" />
        <div className="w-full px-4">
          <ItemSkill name="animalKen" namePtBr="Empatia com Animais" quant={5} session={session} />
          <ItemSkill name="etiquette" namePtBr="Etiqueta" quant={5} session={session} />
          <ItemSkill name="insight" namePtBr="Intuição" quant={5} session={session} />
          <ItemSkill name="intimidation" namePtBr="Intimidação" quant={5} session={session} />
          <ItemSkill name="leadership" namePtBr="Liderança" quant={5} session={session} />
          <ItemSkill name="performance" namePtBr="Performace" quant={5} session={session} />
          <ItemSkill name="persuasion" namePtBr="Persuasão" quant={5} session={session} />
          <ItemSkill name="streetwise" namePtBr="Manha" quant={5} session={session} />
          <ItemSkill name="subterfuge" namePtBr="Lábia" quant={5} session={session} />
        </div>
        <hr className="mx-4 my-6" />
        <div className="w-full px-4">
          <ItemSkill name="academics" namePtBr="Acadêmicos" quant={5} session={session} />
          <ItemSkill name="awareness" namePtBr="Percepção" quant={5} session={session} />
          <ItemSkill name="finance" namePtBr="Finanças" quant={5} session={session} />
          <ItemSkill name="investigation" namePtBr="Investigação" quant={5} session={session} />
          <ItemSkill name="medicine" namePtBr="Medicina" quant={5} session={session} />
          <ItemSkill name="occult" namePtBr="Ocultismo" quant={5} session={session} />
          <ItemSkill name="politics" namePtBr="Política" quant={5} session={session} />
          <ItemSkill name="science" namePtBr="Ciência" quant={5} session={session} />
          <ItemSkill name="technology" namePtBr="Tecnologia" quant={5} session={session} />
        </div>
      </div>
    </div>
  );
}