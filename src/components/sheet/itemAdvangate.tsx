import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionUpdateAdvantage, useSlice } from "@/redux/slice";
import { useState } from "react";
import { IoArrowDownCircleSharp, IoArrowUpCircleSharp } from "react-icons/io5";

interface IAdvantage {
  advantage: string;
  value: number;
  name: string;
  type: string;
}

interface IFlaw {
  flaw: string;
  value: number;
  name: string;
}

export default function Advantage(props: any) {
  const { item } = props;
  const [ showAd, setShowAd ] = useState(false);
  const slice = useAppSelector(useSlice);
  const dispatch = useAppDispatch();

  const setAdvantageValueItem = (obj: IAdvantage) => {
    const foundAdvantage = slice.advantagesAndFlaws.find((item: IAdvantage) => item.name === obj.name);
    const otherAdvantages = slice.advantagesAndFlaws.filter((item: IAdvantage) => item.name !== obj.name);
    if (obj.type === '') {
      console.log('entrou na compararação de type com string vazia');
      if (foundAdvantage.advantages) {
        const updatedAdvantage = {
          name: obj.name, 
          advantages: [],
          flaws: foundAdvantage.flaws,
        }
        dispatch(actionUpdateAdvantage([...otherAdvantages, updatedAdvantage]));
      } else {
        const updateAdvantage = foundAdvantage.advantages.filter((item: IAdvantage) => item.type !== 'radio');
        const updatedAdvantage = {
          name: obj.name, 
          advantages: updateAdvantage,
          flaws: foundAdvantage.flaws,
        }
        dispatch(actionUpdateAdvantage([...otherAdvantages, updatedAdvantage]));
      }
    } else if (foundAdvantage.advantages.length === 0) {
      console.log('adentrou na condição de advantage vazia, ', obj);
      const updatedAdvantage = {
        name: obj.name, 
        advantages: [obj],
        flaws: foundAdvantage.flaws,
      }
      console.log([...otherAdvantages, updatedAdvantage])
      dispatch(actionUpdateAdvantage([...otherAdvantages, updatedAdvantage]));
    } else {
      if (obj.type === 'radio') {
        const updateAdvantage = foundAdvantage.advantages.filter((item: IAdvantage) => item.type !== 'radio' && item.advantage !== obj.advantage);
        const updatedAdvantage = {
          name: obj.name, 
          advantages: [...updateAdvantage, obj],
          flaws: foundAdvantage.flaws,
        }
        dispatch(actionUpdateAdvantage([...otherAdvantages, updatedAdvantage]));
      }
      if (obj.type === 'checkbox') {
        console.log('Adentrou na condição de checkbox');
        console.log(foundAdvantage.advantages);
        const updateAdvantage = foundAdvantage.advantages.find((item: IAdvantage) => item.advantage === obj.advantage);
        if (updateAdvantage) {
          const newObject = foundAdvantage.advantages.filter((item: IAdvantage) => item.advantage !== obj.advantage);
          const updatedAdvantage = {
            name: obj.name, 
            advantages: newObject,
            flaws: foundAdvantage.flaws,
          }
          console.log('se existe, remove: ', [...otherAdvantages, updatedAdvantage]);
          dispatch(actionUpdateAdvantage([...otherAdvantages, updatedAdvantage]));
        } else {
          const updatedAdvantage = {
            name: obj.name, 
            advantages: [...foundAdvantage.advantages, obj],
            flaws: foundAdvantage.flaws,
          }
          console.log('se não existe, adiciona: ', [...otherAdvantages, updatedAdvantage]);
          dispatch(actionUpdateAdvantage([...otherAdvantages, updatedAdvantage]));
        }
      }
    }
  }

  const setFlawValueItem = (obj: IFlaw) => {

  };

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
                <label
                  htmlFor={`advantages-${item.name}`}
                  className="flex gap-3 cursor-pointer border border-white p-4 mb-2 items-center"
                  onClick={() => setAdvantageValueItem({
                    advantage: '',
                    value: 0,
                    name: item.name,
                    type: "",
                  })
                  }
                >
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
                        ? <label
                            htmlFor={advantage.description}
                            className="mb-4 cursor-pointer"
                            onClick={() => setAdvantageValueItem({
                              advantage: advantage.title,
                              value: advantage.cost,
                              name: item.name,
                              type: advantage.type,
                             })
                            }
                          >
                          <div className="flex gap-3 pt-4 px-4">
                            <input
                              name={`advantageOption-${item.name}`}
                              id={advantage.description}
                              type={advantage.type}
                            />
                            <p className="font-bold">{ advantage.title } ( {advantage.cost} )</p>
                            
                          </div>
                          <p className="p-4">{ advantage.description }</p>
                        </label>
                        : <label
                            htmlFor={advantage.description}
                            onClick={() => setAdvantageValueItem({
                              advantage: advantage.description,
                              value: advantage.cost,
                              name: item.name,
                              type: advantage.type,
                             })
                            }
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
                  <div key={index2} className="border-2 border-white mb-2">
                    <label
                      htmlFor={ad.description}
                      className="mb-4 cursor-pointer"
                      onClick={() => setAdvantageValueItem({
                        advantage: ad.title,
                        value: ad.cost,
                        name: item.name,
                        type: ad.type,
                      })}
                    >
                      <div className="flex gap-3 pt-4 px-4">
                        <input
                          name={`adOption-${item.name}`}
                          id={ad.description}
                          type={ad.type}
                        />
                        <p className="font-bold">{ ad.title } ( {ad.cost} )</p>
                      </div>
                      <p className="p-4">{ ad.description }</p>
                    </label>
                    </div>
                    ))
                  }
                </div>
              <div>
                { 
                  item.flaws.length > 0 &&
                  <div>
                    <p className="my-3 font-bold">Desvantagens</p>
                    <label
                      htmlFor={`flaw-${item.name}`}
                      className="flex gap-3 cursor-pointer border border-white p-4 mb-2"
                      onClick={() => setFlawValueItem({
                        flaw: '',
                        value: 0,
                        // type: "",
                        name: item.name })
                      }
                    >
                      <input
                        id={`flaw-${item.name}`}
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
                      <label
                        htmlFor={flaw.description}
                        className="mb-4 cursor-pointer"
                        onClick={() => setFlawValueItem({
                          flaw: flaw.title,
                          value: flaw.cost,
                          name: item.name })
                        }
                      >
                        <div className="flex gap-3 pt-4 px-4">
                          <input
                            name={`flawOption-${item.name}`}
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