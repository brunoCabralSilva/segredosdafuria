'use client'
import firebaseConfig from "@/firebase/connection";
import { authenticate, signIn } from "@/firebase/login";
import { getUserAndDataByIdSession, getUserByIdSession } from "@/firebase/sessions";
import { IItem } from "@/interface";
import { useAppSelector } from "@/redux/hooks";
import { useSlice } from "@/redux/slice";
import { collection, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BsCheckSquare } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";

export default function ItemSkill(props: IItem) {
  const [ skill, setSkill ] = useState<{ value: number, specialty: string }>({ value: 0, specialty: '' });
  const [input, setInput ] = useState(false);
  const { name, namePtBr, quant } = props;
  const slice = useAppSelector(useSlice);

  const typeText = (e: any) => {
    const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
    setSkill({
      value: skill.value,
      specialty: sanitizedValue,
    });
  };

  useEffect(() => {
    returnValue();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const returnValue = async (): Promise<void> => {
    const player = await getUserByIdSession(
      slice.sessionId,
      slice.userData.email,
    );
    if (player) {
      setSkill(player.data.skills[name]);
    } else window.alert('Jogador não encontrado! Por favor, atualize a página e tente novamente');
  };

  const updateValue = async (name: string, value: number) => {
    const getUser: any = await getUserAndDataByIdSession(slice.sessionId);
    const player = getUser.players.find((gp: any) => gp.email === slice.userData.email);
    if (player) {
      player.data.skills[name] = value;
        if (player.data.skills[name].value === 1 && value === 1) player.data.skills[name] = { value: 0, specialty: skill.specialty };
        else player.data.skills[name] = { value, specialty: skill.specialty };
        const playersFiltered = getUser.players.filter((gp: any) => gp.email !== slice.userData.email);
        await updateDoc(getUser.sessionRef, { players: [...playersFiltered, player] });
      await updateDoc(getUser.sessionRef, { players: [...playersFiltered, player] });
      returnValue();
    } else window.alert('Jogador não encontrado! Por favor, atualize a página e tente novamente');
  };

  const returnPoints = (name: string) => {
    const points = Array(quant).fill('');
    return (
      <div className="flex gap-2 pt-1">
        {
          skill && points.map((item, index) => {
            if (skill.value >= index + 1) {
              return (
                <button
                  type="button"
                  onClick={ () => updateValue(name, index + 1) }
                  key={index}
                  className="h-6 w-6 rounded-full bg-black border-white border-2 cursor-pointer"
                />
              );
            } return (
              <button
                type="button"
                onClick={ () => updateValue(name, index + 1) }
                key={index}
                className="h-6 w-6 rounded-full bg-white border-white border-2 cursor-pointer"
              />
            );
          })
        }
      </div>
    );
  };

  return(
    <div className="w-full mt-4">
      <div className={ `capitalize ${ input ? 'flex-col' : 'flex justify-between' } items-center cursor-pointer` } onClick={() => setInput(true)}>
        <span>{ namePtBr } ({ name })</span>
        <div
          className="flex cursor-pointer"
        >
        { 
          input &&
          <input
            type="text"
            className="my-1 border-2 border-white bg-black text-center w-full mr-1"
            placeholder="Especialização"
            value={ skill.specialty }
            onChange={(e) => typeText(e)}
          />
        }
        { 
          input
            ? <BsCheckSquare
                onClick={(e: any) => {
                  updateValue(name, skill.value);
                  setInput(false);
                  e.stopPropagation();
                }}
                className="text-3xl my-1 cursor-pointer"
              />
            : <FaRegEdit
                onClick={(e: any) => {
                  setInput(true);
                  e.stopPropagation();
                }}
                className="text-xl cursor-pointer"
              />
        }
        </div>
      </div>
      { 
        !input
        && skill.specialty !== ''
        && skill.specialty !== ' '
        && <span className="text-sm capitalize">{ skill.specialty }</span>
      }
      <div className="w-full">
        { returnPoints(name) }
      </div>
    </div>
  );
}