import Image from "next/image";
import { useState } from "react";

interface IForm {
  name: String;
  subtitle: String;
  description: String;
  cost: String;
  skills: String[];
  list: String[];
}

export default function DataForms(props: { object: IForm }) {
  const [isLoading, setIsLoading] = useState(true);
  const { object } = props;

  return(
    <div className="py-10 flex flex-col items-center sm:items-start w-full z-20 text-white text-justify overflow-y-auto">
      <div className="flex items-center justify-center w-full relative h-full">
        <div className="absolute h-full w-full sm:w-5/12 flex items-center justify-center">
          { isLoading && <span className="loader z-50" /> }
        </div>
        <Image
            src={`/images/forms/${object.name}.png`}
            alt={`Glifo dos ${object.name}`}
            className="w-10/12 sm:w-1/6 sm:w-38 my-2"
            width={800}
            height={400}
            onLoad={() => setIsLoading(false)}
          />
      </div>
      <div className="mt-4 mobile:mt-4 px-6 text-sm sm:text-base w-full">
        <h2 className="font-bold text-xl sm:text-2xl w-full text-center">
          {`${object.name} - ${object.subtitle}`}
        </h2>
        <p className="pt-3">{ object.description }</p>
        <div className="w-full my-2">
          <span className="pr-1 font-bold">Custo:</span>
          <span>{ object.cost }</span>
        </div>
        <p>
          <span className="pr-1 font-bold">Habilidades e Limitações:</span>
          <span>{ object.skills }</span>
        </p>
        {
          object.list.map((paragraph: String, index: number) => (
            <li className="py-1" key={ index }>
              { paragraph }
            </li>
          ))
        }
        <div className="flex items-center justify-center w-full">
        </div>
    </div>
   </div>
  );
}