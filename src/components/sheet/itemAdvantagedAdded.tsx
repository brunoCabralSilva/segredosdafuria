import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionPopupDelAdv, useSlice } from "@/redux/slice";
import { useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { getUserAndDataByIdSession } from "@/firebase/sessions";
import PopupDelAdv from "./popup/popupDelAdv";

export default function ItensAdvantagesAdded(props: any) {
  const { adv, setAdv } = props;
  const dispatch = useAppDispatch();
  const slice = useAppSelector(useSlice);

  useEffect(() => {
    getAllAdvantages();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAllAdvantages = async () => {
    const getUser: any = await getUserAndDataByIdSession(slice.sessionId);
    const playerFound = getUser.players.find((player: any) => player.email === slice.userData.email);
    const listOfAdvantages = playerFound.data.advantagesAndFlaws.filter((item: any) => item.flaws.length > 0 || item.advantages.length > 0);
    setAdv(listOfAdvantages);
  };

  const returnAdvantage = (ad: any) => {
    return(
      <div className="text-white border-2 border-white my-1 p-4">
        <div className="font-normal text-base relative">
          <p className="font-bold pb-1">{ ad.name }</p>
          {
            <div>
              {
                ad.advantages.map((element: any, index2: number) => (
                  <div key={index2} className="">
                    <div className="flex w-full justify-between items-center">
                      <div className="pb-1">
                        <span className="font-bold pr-1">Vantagem:</span>
                        <span>{ element.value }</span>
                      </div>
                      <button
                        type="button"
                        className=""
                        onClick={ () => dispatch(actionPopupDelAdv({
                          show: true,
                          name: element.name,
                          desc: element.advantage,
                          type: "advantage"
                        })) }
                      >
                        <MdDelete className="text-2xl text-white" />
                      </button>
                    </div>
                    <div className="text-justify">
                      <span className="">{ element.advantage }</span>
                    </div>
                    {
                      ad.advantages.length > 1
                      && index2 !== (ad.advantages.length - 1)
                      && <hr className="my-3 w-full bg-white" />
                    }
                  </div>
                ))
              }
            </div>
          }
        </div>
        {
          ad.flaws.length > 0 && 
          <div className="font-normal text-base">
          {
            <div>
              {
                ad.flaws.map((element: any, index2: number) => (
                  <div key={index2} className="">
                    {
                      ad.advantages.length > 0 && ad.flaws.length > 0
                      && <hr className="my-3 w-full bg-white" />
                    }
                    <div className="flex w-full justify-between items-center">
                      <div className="pb-1">
                        <span className="font-bold pr-1">Defeito:</span>
                        <span>{ element.value }</span>
                      </div>
                      <button
                        type="button"
                        className=""
                        onClick={ () => dispatch(actionPopupDelAdv({
                          show: true,
                          name: element.name,
                          desc: element.flaw,
                          type: 'flaw'
                        }))}
                      >
                        <MdDelete className="text-2xl text-white" />
                      </button>
                    </div>
                    <div className="text-justify">
                      <span className="">{  element.flaw }</span>
                    </div>
                    {
                      ad.flaws.length > 1
                      && index2 !== (ad.flaws.length - 1)
                      && <hr className="my-3 w-full bg-white" />
                    }
                  </div>
                ))
              }
            </div>
          }
        </div>
        }
      </div>
    )
  };

  return(
    <div>
      { adv.length > 0 && adv.filter((advr: any) => advr.item === 'background').length > 0 && <div className="w-full text-center mt-6 mb-2 text-white">Backgrounds</div>}
      {
        adv.length > 0 && adv.filter((advr: any) => advr.item === 'background').map((ad: any, index: number) => (
          <div key={index}>
            { returnAdvantage(ad) }
          </div>
        ))
      }
      { adv.length > 0 && adv.filter((advr: any) => advr.item === 'méritos').length > 0 && <div className="w-full text-center mt-6 mb-2 text-white">Méritos</div>}
      {
        adv.length > 0 && adv.filter((advr: any) => advr.item === 'méritos').map((ad: any, index: number) => (
          <div key={index}>
            { returnAdvantage(ad) }
          </div>
        ))
      }
      { adv.length > 0 && adv.filter((advr: any) => advr.item === 'loresheet').length > 0 && <div className="w-full text-center mt-6 mb-2 text-white">Loresheets</div>}
      {
        adv.length > 0 && adv.filter((advr: any) => advr.item === 'loresheet').map((ad: any, index: number) => (
          <div key={index}>
            { returnAdvantage(ad) }
          </div>
        ))
      }
      { adv.length > 0 && adv.filter((advr: any) => advr.item === 'talisman').length > 0 && <div className="w-full text-center mt-6 mb-2 text-white">Talismãs</div>}
      {
        adv.length > 0 && adv.filter((advr: any) => advr.item === 'talisman').map((ad: any, index: number) => (
          <div key={index}>
            { returnAdvantage(ad) }
          </div>
        ))
      }
      { slice.popupDelAdv.show && <PopupDelAdv adv={adv} setAdv={setAdv} /> }
    </div>
  );
}