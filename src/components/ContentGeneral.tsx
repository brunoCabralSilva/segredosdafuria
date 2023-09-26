import Image from "next/image";
import { useState } from "react";

interface IAuspice {
  name: String;
  phrase: String;
  description: String[];
}

export default function ContentGeneral(props: { object: IAuspice }) {
  const [isLoading, setIsLoading] = useState(true);
  const { object } = props;

  return(
    <div className="py-10 flex flex-col items-center sm:items-start w-full z-20 text-white text-justify overflow-y-auto">
      <div className="flex items-center justify-center w-full relative h-full">
        <div className="absolute h-full w-full sm:w-5/12 flex items-center justify-center">
          { isLoading && <span className="loader z-50" /> }
        </div>
        <Image
          src={`/images/auspices/${object.name} - referencia.png`}
          alt={`Representação dos ${object.name}`}
          className="w-full h-50vh object-contain mobile:w-8/12 sm:w-5/12 relative px-6"
          width={800}
          height={400}
          onLoad={() => setIsLoading(false)}
        />
      </div>
      <div className="mt-5 mobile:mt-10 px-6 text-sm sm:text-base">
        <h2 className=" font-bold text-xl sm:text-2xl w-full text-center">
          { object.name }
        </h2>
        <div className="flex items-center justify-center w-full text-sm">
          <p className="mt-1 sm:mt-3 text-center sm:w-1/2">
            &quot;{ object.phrase }&quot;
          </p>
        </div>
        <div className="w-full flex items-center justify-center my-5">
          <Image
            src={`/images/auspices/${object.name}.png`}
            alt={`Glifo dos ${object.name}`}
            className="w-20 sm:w-38 my-2"
            width={800}
            height={400}
          />
        </div>
        {
          object.description.map((paragraph: String, index: number) => (
            <p key={ index }>
              { paragraph }
            </p>
          ))
        }
        <div className="flex items-center justify-center w-full">
        </div>
    </div>
   </div>
  );
}