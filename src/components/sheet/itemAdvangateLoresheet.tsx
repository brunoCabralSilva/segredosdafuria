import { getUserAndDataByIdSession } from "@/firebase/sessions";
import { IAdvantageAndFlaw } from "@/interface";
import { useAppSelector } from "@/redux/hooks";
import { useSlice } from "@/redux/slice";
import { updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { IoArrowDownCircleSharp, IoArrowUpCircleSharp, IoCheckmarkDone } from "react-icons/io5";

export default function AdvantageLoresheets(props: any) {
  const { item, adv } = props;
  const [ showAd, setShowAd ] = useState(false);
  const slice = useAppSelector(useSlice);

  useEffect(() => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setAdvantageValueItem = async (obj: IAdvantageAndFlaw) => {
    const getUser: any = await getUserAndDataByIdSession(slice.sessionId);
    const searchPlayer = getUser.players.find((player: any) => player.email === slice.userData.email);
    const otherPlayers = getUser.players.filter((player: any) => player.email !== slice.userData.email);
    let foundAdvantage = searchPlayer.data.advantagesAndFlaws.find((item: IAdvantageAndFlaw) => item.name === obj.name);

    if (!foundAdvantage) {
      foundAdvantage = {
        advantages: [],
        flaws: [],
        name: obj.name,
        item: obj.item,
      };
    }

    const otherAdvantages = searchPlayer.data.advantagesAndFlaws.filter((item: IAdvantageAndFlaw) => item.name !== obj.name);
    const restOfAdvantage = adv.filter((ad: any) => ad.name !== obj.name);

    if (obj.type === '') {
      const updatedAdvantage = {
        name: obj.name, 
        advantages: [],
        flaws: [],
        item: obj.item,
      }
      props.setAdv([...restOfAdvantage, updatedAdvantage]);
      searchPlayer.data.advantagesAndFlaws = [...otherAdvantages, updatedAdvantage];
      await updateDoc(getUser.sessionRef, {
        players: [searchPlayer, ...otherPlayers],
      });
    } else {
      const updated = {
        name: obj.name, 
        advantages: [obj],
        flaws: [],
        item: obj.item,
      }
      searchPlayer.data.advantagesAndFlaws = [...otherAdvantages, updated];
      props.setAdv([...restOfAdvantage, updated]);
      await updateDoc(getUser.sessionRef, {
        players: [searchPlayer, ...otherPlayers],
      });
    }
  };

  const returnIfHavePoint = () => {
    const find: any = adv.find((ad: any) => ad.name === item.titlePtBr);
    if (find) return find.advantages.length > 0;
  };

  const returnAdvantageNull = () => {
    const find: any = adv.find((ad: any) => ad.name === item.titlePtBr);
    if (find) return find.advantages.length === 0;
    return true;
  };

  const returnIfHaveAdvantage = (element: string) => {
    const find: any = adv.find((ad: any) => ad.name === item.titlePtBr);
    if (find) return find.advantages.find((ad: any) => ad.advantage === element);
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
              <p className="capitalize font-bold">{item.titlePtBr}</p>
              <IoArrowDownCircleSharp className="text-3xl text-white" />
            </button>
          </div>
        : <div className="border-2 border-white my-3 text-base font-normal">
            <button
              type="button"
              className="flex justify-between items-center w-full p-4"
              onClick={() => setShowAd(false)}
            >
              <p className="capitalize font-bold">{item.titlePtBr}</p>
              <IoArrowUpCircleSharp className="text-3xl text-white" />
            </button>
            <div className="px-4">
              <hr className="mb-4" />
              <p className="text-justify">{item.descriptionPtBr}</p>
              <div>
                <label
                  htmlFor={`advantages-${item.titlePtBr}`}
                  className={`${returnAdvantageNull() ? 'bg-black' : ''} mt-3 flex gap-3 cursor-pointer border-2 border-white pl-2 py-4 pr-4 mb-2 items-center`}
                  onClick={() => {
                      setAdvantageValueItem({
                        advantage: '',
                        value: 0,
                        name: item.titlePtBr,
                        type: "",
                        item: '',
                      });
                    }}
                >
                  { returnAdvantageNull() && <IoCheckmarkDone className="text-2xl" /> }
                  <span className="font-bold" id={`advantages-${item.titlePtBr}`}>
                    Nenhum (0)
                  </span>
                </label>
                { 
                  item.habilities.map((advantage: any, index: number) => (
                    <div
                      key={index}
                      className={`${returnIfHaveAdvantage(advantage.skillPtBr) ? 'bg-black': ''} border-2 border-white mb-2`}
                    >
                      <label
                        className={`mb-4 cursor-pointer`}   
                        htmlFor={advantage.skillPtBr}
                        onClick={() => {
                          setAdvantageValueItem({
                            advantage: advantage.skillPtBr,
                            value: index + 1,
                            name: item.titlePtBr,
                            type: 'radio',
                            item: 'loresheet',
                          });
                        }}
                      >
                        <p className="list-none pl-2 py-4 pr-4 text-justify flex">
                          <span className="list-disc text-2xl pr-2">
                            {returnIfHaveAdvantage(advantage.skillPtBr) && <IoCheckmarkDone />}
                          </span>
                          <span id={advantage.skillPtBr} className="flex">
                            Custo {index + 1} - {advantage.skillPtBr}
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