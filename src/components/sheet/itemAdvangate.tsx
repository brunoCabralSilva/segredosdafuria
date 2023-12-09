import firebaseConfig from "@/firebase/connection";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useSlice } from "@/redux/slice";
import { collection, doc, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
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
  type: string;
}

export default function Advantage(props: any) {
  const { item, session } = props;
  const [ showAd, setShowAd ] = useState(false);
  const slice = useAppSelector(useSlice);
  const router = useRouter();

  const setAdvantageValueItem = async (obj: IAdvantage) => {
    const token = localStorage.getItem('Segredos Da Fúria');
    if (token) {
      const decode: { email: string } = jwtDecode(token);
      const { email } = decode;
      const db = getFirestore(firebaseConfig);
      const userQuery = query(collection(db, 'sessions'), where('name', '==', session));
      const userQuerySnapshot = await getDocs(userQuery);
      const userDocument = userQuerySnapshot.docs[0];
      const userDocRef = doc(db, 'sessions', userDocument.id);

      const searchPlayer = userDocument.data().players.find((player: any) => player.email === email);
      const otherPlayers = userDocument.data().players.filter((player: any) => player.email !== email);

      const foundAdvantage = searchPlayer.data.advantagesAndFlaws.find((item: IAdvantage) => item.name === obj.name);
      const otherAdvantages = searchPlayer.data.advantagesAndFlaws.filter((item: IAdvantage) => item.name !== obj.name);

      if (obj.type === '') {
        if (foundAdvantage.advantages) {
          const updatedAdvantage = {
            name: obj.name, 
            advantages: [],
            flaws: foundAdvantage.flaws,
          }
          searchPlayer.data.advantagesAndFlaws = [...otherAdvantages, updatedAdvantage];
          await updateDoc(userDocRef, {
            players: [searchPlayer, ...otherPlayers],
          });
        } else {
          const updateAdvantage = foundAdvantage.advantages.filter((item: IAdvantage) => item.type !== 'radio');
          const updatedAdvantage = {
            name: obj.name, 
            advantages: updateAdvantage,
            flaws: foundAdvantage.flaws,
          }
          searchPlayer.data.advantagesAndFlaws = [...otherAdvantages, updatedAdvantage];
          await updateDoc(userDocRef, {
            players: [searchPlayer, ...otherPlayers],
          });
        }
      } else if (foundAdvantage.advantages.length === 0) {
        const updated = {
          name: obj.name, 
          advantages: [obj],
          flaws: foundAdvantage.flaws,
        }
        searchPlayer.data.advantagesAndFlaws = [...otherAdvantages, updated];
        await updateDoc(userDocRef, {
          players: [searchPlayer, ...otherPlayers],
        });
      } else {
        if (obj.type === 'radio') {
          const updateAdvantage = foundAdvantage.advantages.filter((item: IAdvantage) => item.type !== 'radio' && item.advantage !== obj.advantage);
          const updatedAdvantage = {
            name: obj.name, 
            advantages: [...updateAdvantage, obj],
            flaws: foundAdvantage.flaws,
          }
          searchPlayer.data.advantagesAndFlaws = [...otherAdvantages, updatedAdvantage];
          await updateDoc(userDocRef, {
            players: [searchPlayer, ...otherPlayers],
          });
        }
        if (obj.type === 'checkbox') {
          const updateAdvantage = foundAdvantage.advantages.find((item: IAdvantage) => item.advantage === obj.advantage);
          if (updateAdvantage) {
            const newObject = foundAdvantage.advantages.filter((item: IAdvantage) => item.advantage !== obj.advantage);
            const updatedAdvantage = {
              name: obj.name, 
              advantages: newObject,
              flaws: foundAdvantage.flaws,
            }
            searchPlayer.data.advantagesAndFlaws = [...otherAdvantages, updatedAdvantage];
            await updateDoc(userDocRef, {
              players: [searchPlayer, ...otherPlayers],
            });
          } else {
            const updatedAdvantage = {
              name: obj.name, 
              advantages: [...foundAdvantage.advantages, obj],
              flaws: foundAdvantage.flaws,
            }
            searchPlayer.data.advantagesAndFlaws = [...otherAdvantages, updatedAdvantage];
            await updateDoc(userDocRef, {
              players: [searchPlayer, ...otherPlayers],
            });
          }
        }
      }
    } else router.push('/user/login');
  }

  const setFlawValueItem = async(obj: IFlaw) => {
    const token = localStorage.getItem('Segredos Da Fúria');
    if (token) {
      const decode: { email: string } = jwtDecode(token);
      const { email } = decode;
      const db = getFirestore(firebaseConfig);
      const userQuery = query(collection(db, 'sessions'), where('name', '==', session));
      const userQuerySnapshot = await getDocs(userQuery);
      const userDocument = userQuerySnapshot.docs[0];
      const userDocRef = doc(db, 'sessions', userDocument.id);

      const searchPlayer = userDocument.data().players.find((player: any) => player.email === email);
      const otherPlayers = userDocument.data().players.filter((player: any) => player.email !== email);

      const foundAdvantage = searchPlayer.data.advantagesAndFlaws.find((item: IAdvantage) => item.name === obj.name);
      const otherAdvantages = searchPlayer.data.advantagesAndFlaws.filter((item: IAdvantage) => item.name !== obj.name);

      if (obj.type === '') {
        if (foundAdvantage.flaws) {
          const updatedAdvantage = {
            name: obj.name, 
            advantages: foundAdvantage.advantages,
            flaws: [],
          }
          searchPlayer.data.advantagesAndFlaws = [...otherAdvantages, updatedAdvantage];
          await updateDoc(userDocRef, {
            players: [searchPlayer, ...otherPlayers],
          });
        } else {
          const updateAdvantage = foundAdvantage.flaws.filter((item: IAdvantage) => item.type !== 'radio');
          const updatedAdvantage = {
            name: obj.name, 
            advantages: foundAdvantage.advantages,
            flaws: updateAdvantage,
          }
          searchPlayer.data.advantagesAndFlaws = [...otherAdvantages, updatedAdvantage];
          await updateDoc(userDocRef, {
            players: [searchPlayer, ...otherPlayers],
          });
        }
      } else if (foundAdvantage.flaws.length === 0) {
        const updated = {
          name: obj.name, 
          advantages: foundAdvantage.advantages,
          flaws: [obj],
        }
        searchPlayer.data.advantagesAndFlaws = [...otherAdvantages, updated];
        await updateDoc(userDocRef, {
          players: [searchPlayer, ...otherPlayers],
        });
      } else {
        if (obj.type === 'radio') {
          const updateAdvantage = foundAdvantage.flaws.filter((item: IFlaw) => {
            return item.type !== 'radio' && item.flaw !== obj.flaw
          });
          const updatedAdvantage = {
            name: obj.name, 
            advantages: foundAdvantage.advantages,
            flaws: [...updateAdvantage, obj],
          }
          searchPlayer.data.advantagesAndFlaws = [...otherAdvantages, updatedAdvantage];
          await updateDoc(userDocRef, {
            players: [searchPlayer, ...otherPlayers],
          });
        }
        if (obj.type === 'checkbox') {
          const updateAdvantage = foundAdvantage.flaws.find((item: IFlaw) => item.flaw === obj.flaw);
          if (updateAdvantage) {
            const newObject = foundAdvantage.flaws.filter((item: IFlaw) => item.flaw !== obj.flaw);
            const updatedAdvantage = {
              name: obj.name, 
              advantages: foundAdvantage.advantages,
              flaws: newObject,
            }
            searchPlayer.data.advantagesAndFlaws = [...otherAdvantages, updatedAdvantage];
            await updateDoc(userDocRef, {
              players: [searchPlayer, ...otherPlayers],
            });
          } else {
            const updatedAdvantage = {
              name: obj.name, 
              advantages: foundAdvantage.advantages,
              flaws: [...foundAdvantage.flaws, obj],
            }
            searchPlayer.data.advantagesAndFlaws = [...otherAdvantages, updatedAdvantage];
            await updateDoc(userDocRef, {
              players: [searchPlayer, ...otherPlayers],
            });
          }
        }
      }
    }
  }


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
                  <div id={`advantages-${item.name}`} />
                  <span className="font-bold">Nenhum (0)</span>
                </label>
                { 
                  item.advantages.map((advantage: any, index2: number) => (
                    <div key={index2} className={`border-2 border-white mb-2 ${advantage.type === "checkbox" ? 'bg-black' : 'bg-gray-whats'}`}>
                      {
                        advantage.title !== ''
                        ? <label
                            htmlFor={advantage.description}
                            className={`mb-4 cursor-pointer ${advantage.type === "checkbox" ? 'bg-black' : 'bg-gray-whats'}`}
                            onClick={() => setAdvantageValueItem({
                              advantage: advantage.title,
                              value: advantage.cost,
                              name: item.name,
                              type: advantage.type,
                             })
                            }
                          >
                          <div className="flex gap-3 pt-4 px-4">
                            <div
                              id={advantage.description}
                            />
                            <p className="font-bold">{ advantage.title } ( {advantage.cost} )</p>
                          </div>
                          <p className="p-4">{ advantage.description }</p>
                        </label>
                        : <label
                            className={`mb-4 cursor-pointer ${advantage.type === "checkbox" ? 'bg-black' : 'bg-gray-whats'}`}   
                            htmlFor={advantage.description}
                            onClick={() => setAdvantageValueItem({
                              advantage: advantage.description,
                              value: advantage.cost,
                              name: item.name,
                              type: advantage.type,
                             })
                            }
                          >
                            <div className="gap-3 p-4">
                              <div id={advantage.description} />
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
                        <div id={ad.description} />
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
                        type: "",
                        name: item.name
                      })}
                    >
                      <div id={`flaw-${item.name}`} />
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
                          name: item.name,
                          type: flaw.type,
                        })}
                      >
                        <div className="flex gap-3 pt-4 px-4">
                          <div id={flaw.description} />
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