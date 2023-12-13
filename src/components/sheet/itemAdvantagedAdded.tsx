import firebaseConfig from "@/firebase/connection";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionPopupDelAdv, useSlice } from "@/redux/slice";
import { collection, doc, getDocs, getFirestore, query, where } from "firebase/firestore";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import PopupDelAdv from "../popupDelAdv";

export default function ItensAdvantagesAdded(props: any) {
  const { session } = props;
  const [adv, setAdv] = useState([]);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const slice = useAppSelector(useSlice);

  useEffect(() => {
    getAllAdvantages();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAllAdvantages = async () => {
    const token = localStorage.getItem('Segredos Da Fúria');
    if (token) {
      const decode: { email: string } = jwtDecode(token);
      const { email } = decode;
      const db = getFirestore(firebaseConfig);
      const userQuery = query(collection(db, 'sessions'), where('name', '==', session));
      const userQuerySnapshot = await getDocs(userQuery);
      const userDocument = userQuerySnapshot.docs[0];
      const advAndflw = userDocument.data();
      const playerFound = advAndflw.players.find((player: any) => player.email === email);
      const listOfAdvantages = playerFound.data.advantagesAndFlaws.filter((item: any) => item.flaws.length > 0 || item.advantages.length > 0);
      setAdv(listOfAdvantages);
    } else router.push('/user/login');
  }

  const sumAllAdvantagesAndFlaws = () => {
    let advantageSum = 0;
    let flawSum = 0;
    adv.forEach((item: any) => {
      console.log(item);
      if (item.flaws.length > 0) {
        item.flaws.forEach((it: any) => flawSum += it.value)
      }
      if (item.advantages.length > 0) {
        item.advantages.forEach((it: any) => advantageSum += it.value)
      }
    });
    return (
    <div className="flex flex-col border-2 border-white p-4 text-white justify-center items-center">
      <div className={
        `${advantageSum > 7 && 'text-red-800'}
         ${advantageSum === 7 && 'text-green-500'}
      `}>
        Total em Vantagens: {advantageSum} {advantageSum !== 7 && <span>/ 7</span>}</div>
      <div className={`
        ${flawSum > 2 && 'text-red-800'}
        ${flawSum === 2 && 'text-green-500'}
      `}>
        Total em Defeitos: {flawSum} {flawSum !== 2 && <span>/ 2</span>}</div>
    </div>
    );
  }

  return(
    <div>
      <div>{sumAllAdvantagesAndFlaws()}</div>
      {
        adv.length > 0 && adv.map((ad: any, index: number) => (
          <div key={index} className="text-white border-2 border-white my-1 p-4">
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
        ))
      }
      { slice.popupDelAdv.show && <PopupDelAdv session={session} adv={adv} setAdv={setAdv} /> }
    </div>
  );
}