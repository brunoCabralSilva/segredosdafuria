import Image from "next/image";
import { useState } from "react";

interface IArchetypes {
  title: String;
  description: String;
}

interface ITrybe {
  namePtBr: String;
  nameEn: String;
  phrase: String;
  description: String[];
  whoAre: String[];
  patron: String;
  favor: String;
  ban: String;
  archetypes: IArchetypes[];
};

export default function DataTrybes(props: { object: ITrybe }) {
  const [isLoading, setIsLoading] = useState(true);
  const { object } = props;

  function firstLetter(frase: String) {
    const palavras = frase.split(' ');
  
    const palavrasComPrimeiraMaiuscula = palavras.map((palavra) => {
      if (palavra.length > 0) {
        return palavra.charAt(0).toUpperCase() + palavra.slice(1);
      } else {
        return palavra;
      }
    });
    const fraseComPrimeiraMaiuscula = palavrasComPrimeiraMaiuscula.join(' ');
    return fraseComPrimeiraMaiuscula;
  };

  return(
    <div className="py-10 flex flex-col items-center sm:items-start w-full z-20 text-white text-justify overflow-y-auto">
      <div className="flex items-center justify-center w-full relative h-full">
        <div className="absolute h-full w-full sm:w-5/12 flex items-center justify-center">
          { isLoading && <span className="loader z-50" /> }
        </div>
        <Image
          src={`/images/trybes/${object.namePtBr} - representation.png`}
          alt={`Representação dos ${object.namePtBr}`}
          className="w-full mobile:w-8/12 sm:w-5/12 relative px-6"
          width={800}
          height={400}
          onLoad={() => setIsLoading(false)}
        />
      </div>
      <div className="mt-5 mobile:mt-10 px-6 text-sm sm:text-base">
        <h2 className=" font-bold text-xl sm:text-2xl w-full text-center">
          {`${object.namePtBr} (${firstLetter(object.nameEn)})`}
        </h2>
        <div className="flex items-center justify-center w-full text-sm">
          <p className="mt-1 sm:mt-3 mb-10 text-center sm:w-1/2">
            &quot;{ object.phrase }&quot;
          </p>
        </div>
        {
          object.description.map((paragraph: String, index: number) => (
            <p key={ index }>
              { paragraph }
            </p>
          ))
        }
        <div className="flex items-center justify-center w-full">
          <Image
            src={`/images/trybes/${object.namePtBr}.png`}
            alt={`Glifo dos ${object.namePtBr}`}
            className="w-20 sm:w-38 my-2"
            width={800}
            height={400}
          />
        </div>
        <h2 className="text-center sm:text-left w-full text-xl">
          Quem são
        </h2>
        <hr className="w-10/12 my-2" />
        {
          object.whoAre.map((paragraph: String, index: number) => (
            <p key={ index }>
              { paragraph }
            </p>
          ))
        }
        
        <h2 className="text-center sm:text-left w-full pt-8 text-xl">
          Patrono Espiritual
        </h2>
        <hr className="w-10/12 my-2" />
        <p>{object.patron}</p>
        
        <div>
          <span className="underline">Favor</span>
          <span className="px-1">-</span>
          <span>{object.favor}</span>
        </div>
        <div>
          <span className="underline">Proibição</span>
          <span className="px-1">-</span>
          <span>{object.ban}</span>
        </div>
        
        <h2 className="text-center sm:text-left w-full pt-8 text-xl">
          Arquétipos
        </h2>
        <hr className="w-10/12 mt-2 mb-5" />
        <div>
          {
            object.archetypes.map((archetype: IArchetypes, index: number) => (
              <div key={ index }>
                <h2 className="underline">{ archetype.title } </h2>
                <p className="pb-5">{ archetype.description }</p>
              </div>
            ))
          }
        </div>
    </div>
   </div>
  );
}