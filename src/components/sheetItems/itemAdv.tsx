import contexto from "@/context/context";
import { IAdvantageAndFlaw } from "@/interface";
import { getPlayerByEmail, updateDataPlayer } from "@/firebase/players";
import { useContext, useState } from "react";
import { IoArrowDownCircleSharp, IoArrowUpCircleSharp, IoCheckmarkDone } from "react-icons/io5";

export default function Advantage(props: any) {
  const { item, adv } = props;
  const [ showAd, setShowAd ] = useState(false);
  const { sheetId, setShowMessage, dataSheet } = useContext(contexto);

  const setAdvantageValueItem = async (obj: IAdvantageAndFlaw) => {
    const foundAdvantage = dataSheet.data.advantagesAndFlaws.find((item: IAdvantageAndFlaw) => item.name === obj.name);
    const otherAdvantages = dataSheet.data.advantagesAndFlaws.filter((item: IAdvantageAndFlaw) => item.name !== obj.name);
    const restOfAdvantage = adv.filter((ad: any) => ad.name !== obj.name);
    if (obj.type === '') {
      if (foundAdvantage.advantages) {
        const updatedAdvantage = {
          name: obj.name, 
          advantages: [],
          flaws: foundAdvantage.flaws,
          item: obj.item,
        }
        props.setAdv([...restOfAdvantage, updatedAdvantage]);
        dataSheet.data.advantagesAndFlaws = [...otherAdvantages, updatedAdvantage];
        await updateDataPlayer(sheetId, dataSheet, setShowMessage);
      } else {
        const updateAdvantage = foundAdvantage.advantages.filter((item: IAdvantageAndFlaw) => item.type !== 'radio');
        const updatedAdvantage = {
          name: obj.name, 
          advantages: updateAdvantage,
          flaws: foundAdvantage.flaws,
          item: obj.item,
        }
        dataSheet.data.advantagesAndFlaws = [...otherAdvantages, updatedAdvantage];
        props.setAdv([...restOfAdvantage, updatedAdvantage]);
        await updateDataPlayer(sheetId, dataSheet, setShowMessage);
      }
    } else if (foundAdvantage.advantages.length === 0) {
      const updated = {
        name: obj.name, 
        advantages: [obj],
        flaws: foundAdvantage.flaws,
        item: obj.item,
      }
      dataSheet.data.advantagesAndFlaws = [...otherAdvantages, updated];
      props.setAdv([...restOfAdvantage, updated]);
      await updateDataPlayer(sheetId, dataSheet, setShowMessage);
    } else {
      if (obj.type === 'radio') {
        const updateAdvantage = foundAdvantage.advantages.filter((item: IAdvantageAndFlaw) => item.type !== 'radio' && item.advantage !== obj.advantage);
        const updatedAdvantage = {
          name: obj.name, 
          advantages: [...updateAdvantage, obj],
          flaws: foundAdvantage.flaws,
          item: obj.item,
        }
        dataSheet.data.advantagesAndFlaws = [...otherAdvantages, updatedAdvantage];
        props.setAdv([...restOfAdvantage, updatedAdvantage]);
        await updateDataPlayer(sheetId, dataSheet, setShowMessage);
      }
      if (obj.type === 'checkbox') {
        const updateAdvantage = foundAdvantage.advantages.find((item: IAdvantageAndFlaw) => item.advantage === obj.advantage);
        if (updateAdvantage) {
          const newObject = foundAdvantage.advantages.filter((item: IAdvantageAndFlaw) => item.advantage !== obj.advantage);
          const updatedAdvantage = {
            name: obj.name, 
            advantages: newObject,
            flaws: foundAdvantage.flaws,
            item: obj.item,
          }
          dataSheet.data.advantagesAndFlaws = [...otherAdvantages, updatedAdvantage];
          props.setAdv([...restOfAdvantage, updatedAdvantage]);
          await updateDataPlayer(sheetId, dataSheet, setShowMessage);
        } else {
          const updatedAdvantage = {
            name: obj.name, 
            advantages: [...foundAdvantage.advantages, obj],
            flaws: foundAdvantage.flaws,
            item: obj.item,
          }
          dataSheet.data.advantagesAndFlaws = [...otherAdvantages, updatedAdvantage];
          props.setAdv([...restOfAdvantage, updatedAdvantage]);
          await updateDataPlayer(sheetId, dataSheet, setShowMessage);
        }
      }
    }
  };

  const setFlawValueItem = async(obj: IAdvantageAndFlaw) => {
    const foundAdvantage = dataSheet.data.advantagesAndFlaws.find((item: IAdvantageAndFlaw) => item.name === obj.name);
    const otherAdvantages = dataSheet.data.advantagesAndFlaws.filter((item: IAdvantageAndFlaw) => item.name !== obj.name);
    const restOfAdvantage = adv.filter((ad: any) => ad.name !== obj.name);

    if (obj.type === '') {
      if (foundAdvantage.flaws) {
        const updatedAdvantage = {
          name: obj.name, 
          advantages: foundAdvantage.advantages,
          flaws: [],
        }
        dataSheet.data.advantagesAndFlaws = [...otherAdvantages, updatedAdvantage];
        props.setAdv([...restOfAdvantage, updatedAdvantage]);
        await updateDataPlayer(sheetId, dataSheet, setShowMessage);
      } else {
        const updateAdvantage = foundAdvantage.flaws.filter((item: IAdvantageAndFlaw) => item.type !== 'radio');
        const updatedAdvantage = {
          name: obj.name, 
          advantages: foundAdvantage.advantages,
          flaws: updateAdvantage,
        }
        dataSheet.data.advantagesAndFlaws = [...otherAdvantages, updatedAdvantage];
        props.setAdv([...restOfAdvantage, updatedAdvantage]);
        await updateDataPlayer(sheetId, dataSheet, setShowMessage);
      }
    } else if (foundAdvantage.flaws.length === 0) {
      const updated = {
        name: obj.name, 
        advantages: foundAdvantage.advantages,
        flaws: [obj],
        item: obj.item,
      }
      dataSheet.data.advantagesAndFlaws = [...otherAdvantages, updated];
      props.setAdv([...restOfAdvantage, updated]);
      await updateDataPlayer(sheetId, dataSheet, setShowMessage);
    } else {
      if (obj.type === 'radio') {
        const updateAdvantage = foundAdvantage.flaws.filter((item: IAdvantageAndFlaw) => {
          return item.type !== 'radio' && item.flaw !== obj.flaw
        });
        const updatedAdvantage = {
          name: obj.name, 
          advantages: foundAdvantage.advantages,
          flaws: [...updateAdvantage, obj],
          item: obj.item,
        }
        dataSheet.data.advantagesAndFlaws = [...otherAdvantages, updatedAdvantage];
        props.setAdv([...restOfAdvantage, updatedAdvantage]);
        await updateDataPlayer(sheetId, dataSheet, setShowMessage);
      }
      if (obj.type === 'checkbox') {
        const updateAdvantage = foundAdvantage.flaws.find((item: IAdvantageAndFlaw) => item.flaw === obj.flaw);
        if (updateAdvantage) {
          const newObject = foundAdvantage.flaws.filter((item: IAdvantageAndFlaw) => item.flaw !== obj.flaw);
          const updatedAdvantage = {
            name: obj.name, 
            advantages: foundAdvantage.advantages,
            flaws: newObject,
            item: obj.item,
          }
          dataSheet.data.advantagesAndFlaws = [...otherAdvantages, updatedAdvantage];
          props.setAdv([...restOfAdvantage, updatedAdvantage]);
          await updateDataPlayer(sheetId, dataSheet, setShowMessage);
        } else {
          const updatedAdvantage = {
            name: obj.name, 
            advantages: foundAdvantage.advantages,
            flaws: [...foundAdvantage.flaws, obj],
            item: obj.item,
          }
          dataSheet.data.advantagesAndFlaws = [...otherAdvantages, updatedAdvantage];
          props.setAdv([...restOfAdvantage, updatedAdvantage]);
          await updateDataPlayer(sheetId, dataSheet, setShowMessage);
        }
      }
    }
  };

  const returnIfHavePoint = () => {
    const find: any = adv.find((ad: any) => ad.name === item.name);
    if (find) return find.advantages.length > 0 || find.flaws.length > 0;
    return false;
  };

  const returnAdvantageNull = () => {
    const find: any = adv.find((ad: any) => ad.name === item.name);
    if (find) return find.advantages.length === 0;
    return true;
  };

  const returnFlawNull = () => {
    const find: any = adv.find((ad: any) => ad.name === item.name);
    if (find) return find.flaws.length === 0;
    return true;
  };

  const returnIfHaveAdvantage = (element: string) => {
    const find: any = adv.find((ad: any) => ad.name === item.name);
    if (find) return find.advantages.find((ad: any) => ad.advantage === element);
    return false;
  }

  const returnIfHaveFlaw = (element: string) => {
    const find: any = adv.find((ad: any) => ad.name === item.name);
    if (find) return find.flaws.find((ad: any) => ad.flaw === element);
    return false;
  }

  return(
    <div>
    {
      !showAd
        ? <div className={`${returnIfHavePoint() ? 'bg-black' : ''} border-2 border-white mb-3 text-base font-normal flex justify-between items-center w-full`}>
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
                  className={`${returnAdvantageNull() ? 'bg-black' : ''} flex gap-3 cursor-pointer border border-white pl-2 py-4 pr-4 mb-2 items-center`}
                  onClick={() => {
                      setAdvantageValueItem({
                        advantage: '',
                        value: 0,
                        name: item.name,
                        type: "",
                        item: '',
                      });
                    }}
                >
                  { returnAdvantageNull() && <IoCheckmarkDone className="text-2xl" /> }
                  <span className="font-bold" id={`advantages-${item.name}`}>
                    Nenhum (0)
                  </span>
                </label>
                { 
                  item.advantages.map((advantage: any, index2: number) => (
                    <div
                      key={index2}
                      className={`border-2 border-white mb-2 ${ returnIfHaveAdvantage(advantage.description) ? 'bg-black': ''}`}>
                      <label
                        className={`mb-4 cursor-pointer`}   
                        htmlFor={advantage.description}
                        onClick={() => {
                          setAdvantageValueItem({
                            advantage: advantage.description,
                            value: advantage.cost,
                            name: item.name,
                            type: advantage.type,
                            item: item.type,
                          });
                        }}
                        >
                          <p className="list-none pl-2 py-4 pr-4 text-justify flex">
                            <span className="list-disc text-2xl pr-2">
                              {returnIfHaveAdvantage(advantage.description) && <IoCheckmarkDone />}
                            </span>
                            <span id={advantage.description} className="flex">
                              Custo {advantage.cost} - {advantage.description}
                            </span>
                          </p>
                      </label>
                    </div>
                  ))
                }
                { 
                  item.flaws.length > 0 &&
                  <div>
                    <p className="my-3 font-bold">Desvantagens</p>
                    <label
                      htmlFor={`flaw-${item.name}`}
                      className={`${returnFlawNull() ? 'bg-black' : ''} flex gap-3 cursor-pointer border border-white pl-2 py-4 pr-4 mb-2`}
                      onClick={async () => {
                        setFlawValueItem({
                          flaw: '',
                          value: 0,
                          type: "",
                          name: item.name,
                          item: '',
                        });
                      }}
                    >
                      { returnFlawNull() && <IoCheckmarkDone className="text-2xl" /> }
                      <span id={`flaw-${item.name}`} className="font-bold">
                        Nenhum (0)
                      </span>
                    </label>
                  </div>
                }
                { 
                  item.flaws.map((flaw: any, index2: number) => (
                    <div key={index2} className={`border-2 border-white mb-3 ${ returnIfHaveFlaw(flaw.description) ? 'bg-black': ''}`}>
                      <label
                        htmlFor={flaw.description}
                        className="mb-4 cursor-pointer"
                        onClick={() => {
                          setFlawValueItem({
                            flaw: flaw.description,
                            value: flaw.cost,
                            name: item.name,
                            type: flaw.type,
                            item: item.type,
                          });
                      }}
                      >
                        <p className="list-none pl-2 py-4 pr-4 text-justify flex">
                          <span className="list-disc text-2xl pr-2">
                            {returnIfHaveFlaw(flaw.description) && <IoCheckmarkDone />}
                          </span>
                          <span id={flaw.description} className="flex">
                          Custo {flaw.cost} - {flaw.description}
                          </span>
                        </p>
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