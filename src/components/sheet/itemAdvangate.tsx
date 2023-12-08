import { useState } from "react";
import { IoArrowDownCircleSharp, IoArrowUpCircleSharp } from "react-icons/io5";

export default function Advantage(props: any) {
  const [ showAd, setShowAd ] = useState(false);
  const { item } = props;
  return(
    <div>
    {
      !showAd
        ? <div className="border-2 border-white mb-3 text-base font-normal flex justify-between items-center w-full">
            <button
              type="button"
              className="flex justify-between items-center w-full p-4"
              onClick={() => setShowAd(true)}
            >
              <p className="capitalize font-bold">{item.name}</p>
              <IoArrowDownCircleSharp className="text-3xl text-white" />
            </button>
          </div>
        : <div className="border-2 border-white my-3 text-base font-normal">
            <button
              type="button"
              className="flex justify-between items-center w-full p-4"
              onClick={() => setShowAd(false)}
            >
              <p className="capitalize font-bold">{item.name}</p>
              <IoArrowUpCircleSharp className="text-3xl text-white" />
            </button>
            <div className="px-4">
              <hr className="mb-4" />
              <p className="text-justify">{item.description}</p>
              <div>
                <p className="my-3 font-bold">Vantagens</p>
                <label htmlFor={`advantages-${item.name}`} className="flex gap-3 cursor-pointer border border-white p-4 mb-2 items-center">
                  <input
                    id={`advantages-${item.name}`}
                    type="radio"
                    name={`advantageOption-${item.name}`}
                  />
                  <span className="font-bold">Nenhum (0)</span>
                </label>
                { 
                  item.advantages.map((advantage: any, index2: number) => (
                    <div key={index2} className="border-2 border-white mb-2">
                      {
                        advantage.title !== ''
                        ? <label htmlFor={advantage.description} className="mb-4 cursor-pointer">
                          <div className="flex gap-3 pt-4 px-4">
                            <input
                              name={`advantageOption-${item.name}`}
                              id={advantage.description}
                              type={advantage.type}
                            />
                            {
                              item.type !== "background" && <p className="font-bold">{ advantage.title } ( {advantage.cost} )</p>
                            }
                          </div>
                          <p className="p-4">{ advantage.description }</p>
                        </label>
                        : <label htmlFor={advantage.description} 
                            className="mb-4 cursor-pointer">
                            <div className="gap-3 p-4">
                              <input
                                name={`advantageOption-${item.name}`}
                                id={advantage.description}
                                type={advantage.type}
                              />
                              <span className="p-4">{ advantage.description }</span>
                            </div>
                          </label>
                      }
                    </div>
                  ))
                }
                {
                  item.name === 'Máscara' &&
                  item.aditional.map((ad: any, index2: number) => (
                    <div key={index2} className="">
                      <p>{ ad.cost }</p>
                      { item.type !== "background" && <p>Título{ ad.title }</p> }
                      <p>{ ad.type }</p>
                      <p>{ ad.description }</p>
                    </div>
                  ))
                }
              </div>
              <div>
                { 
                  item.flaws.length > 0 &&
                  <div>
                    <p className="my-3 font-bold">Desvantagens</p>
                    <label htmlFor={`flaw${item.name}`} className="flex gap-3 cursor-pointer border border-white p-4 mb-2">
                      <input
                        id={`flaw${item.name}`}
                        type="radio"
                        name={`flawOption-${item.name}`}
                      />
                      <span className="font-bold">Nenhum (0)</span>
                    </label>
                  </div>
                }
                { 
                  item.flaws.map((flaw: any, index2: number) => (
                    <div key={index2} className="border-2 border-white mb-3">
                      <label htmlFor={flaw.description} className="mb-4 cursor-pointer">
                        <div className="flex gap-3 pt-4 px-4">
                          <input
                            name={`advantageOption-${item.name}`}
                            id={flaw.description}
                            type={flaw.type}
                          />
                          {
                            item.type !== "background" && <p className="font-bold">{ flaw.title } ( {flaw.cost} )</p>
                          }
                        </div>
                        <p className="p-4">{ flaw.description }</p>
                      </label>
                    </div>
                  ))
                }
              </div>
            </div>
         </div>
    }
    </div>
  );
}