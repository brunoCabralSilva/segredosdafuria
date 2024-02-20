'use client'
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionPopupDelAdv, useSlice } from "@/redux/slice";
import { updateDoc } from "firebase/firestore";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IAdvantageAndFlaw } from "@/interface";
import { getUserAndDataByIdSession } from "@/firebase/sessions";

function limitCaracteres(texto: string) {
  return texto.slice(0, 300);
}

export default function PopupDelAdv(props: any) {
  const { adv, setAdv } = props;
  const slice = useAppSelector(useSlice);
  const dispatch = useAppDispatch();

  const removeAdv = async () => {
    const getUser: any = await getUserAndDataByIdSession(slice.sessionId);
    const searchPlayer = getUser.players.find((player: any) => player.email === slice.userData.email);
    const otherPlayers = getUser.players.filter((player: any) => player.email !== slice.userData.email);
    const foundAdvantage = searchPlayer.data.advantagesAndFlaws.find((item: IAdvantageAndFlaw) => item.name === slice.popupDelAdv.name);
    const otherAdvantages = searchPlayer.data.advantagesAndFlaws.filter((item: IAdvantageAndFlaw) => item.name !== slice.popupDelAdv.name);

    if (slice.popupDelAdv.type === 'advantage') {
      const remoteItemAdv = foundAdvantage.advantages.filter((ad: any) => ad.advantage !== slice.popupDelAdv.desc);

      const restOfAdvantage = adv.filter((ad: any) => ad.name !== slice.popupDelAdv.name);

      const updatedAdvantage = {
        name: slice.popupDelAdv.name, 
        advantages: remoteItemAdv,
        flaws: foundAdvantage.flaws,
      }

      if (updatedAdvantage.advantages.length === 0 && updatedAdvantage.flaws.length === 0) {
        setAdv(restOfAdvantage);
      } else {
        setAdv([...restOfAdvantage, updatedAdvantage]);
      }
      searchPlayer.data.advantagesAndFlaws = [...otherAdvantages, updatedAdvantage];
    }
    
    if (slice.popupDelAdv.type === 'flaw') {
      const remoteItemflw = foundAdvantage.flaws.filter((ad: any) => ad.flaw !== slice.popupDelAdv.desc);

      const restOfAdvantage = adv.filter((ad: any) => ad.name !== slice.popupDelAdv.name);

      const updatedAdvantage = {
        name: slice.popupDelAdv.name, 
        advantages: foundAdvantage.advantages,
        flaws: remoteItemflw,
      }

      if (updatedAdvantage.advantages.length === 0 && updatedAdvantage.flaws.length === 0) {
        setAdv(restOfAdvantage);
      } else {
        setAdv([...restOfAdvantage, updatedAdvantage]);
      }
      searchPlayer.data.advantagesAndFlaws = [...otherAdvantages, updatedAdvantage];
    }

    await updateDoc(getUser.sessionRef, {
      players: [searchPlayer, ...otherPlayers],
    });
    dispatch(actionPopupDelAdv({show: false, adv: {}, type:'' }));
  };

  return(
    <div className="z-50 fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black/80 px-3 sm:px-0">
      <div className="w-full sm:w-2/3 md:w-1/2 overflow-y-auto flex flex-col justify-center items-center bg-black relative border-white border-2 pb-5">
        <div className="pt-4 sm:pt-2 px-2 w-full flex justify-end top-0 right-0">
          <IoIosCloseCircleOutline
            className="text-4xl text-white cursor-pointer"
            onClick={() => dispatch(actionPopupDelAdv({show: false, adv: {}, type:'' }))}
          />
        </div>
        <div className="pb-5 px-5 w-full">
          <label htmlFor="palavra-passe" className="flex flex-col items-center w-full">
            <p className="text-white w-full text-center pb-3">
              Tem certeza de que quer Remover este item da sua ficha?
            </p>
            <p className="text-white w-full text-center pb-3">
              { limitCaracteres(slice.popupDelAdv.desc) }
              { slice.popupDelAdv.desc.length > 498 ? <span className="text-white">...</span> : ''}
            </p>
          </label>
          <div className="flex w-full gap-2">
            <button
              type="button"
              onClick={() => dispatch(actionPopupDelAdv({show: false, adv: {}, type:'' }))}
              className={`text-white bg-green-whats hover:border-green-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold`}
            >
              Não
            </button>
            <button
              type="button"
              onClick={ removeAdv }
              className={`text-white bg-red-800 hover:border-red-900  transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold`}
            >
              Sim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}