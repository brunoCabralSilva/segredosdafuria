'use client'
import firebaseConfig from "@/firebase/connection";
import { authenticate, signIn } from "@/firebase/login";
import { collection, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BsCheckSquare } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";

interface ISkl {
  name: string;
  namePtBr: string;
  quant: number;
  session: string;
}

export default function ItemSkill(props: ISkl) {
  const [ skill, setSkill ] = useState<{ value: number, specialty: string }>({ value: 0, specialty: '' });
  const [input, setInput ] = useState(false);
  const { name, namePtBr, quant, session } = props;
  const router = useRouter();

  const typeText = (e: any) => {
    const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
    setSkill({
      value: skill.value,
      specialty: sanitizedValue,
    });
  };

  useEffect(() => {
    returnValueSkill();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const returnValueSkill = async (): Promise<void> => {
    const db = getFirestore(firebaseConfig);
    const authData: { email: string, name: string } | null = await authenticate();
    try {
      if (authData && authData.email && authData.name) {
        const { email } = authData;
        const userQuery = query(collection(db, 'sessions'), where('name', '==', session));
        const userQuerySnapshot = await getDocs(userQuery);
        const players: any = [];
        userQuerySnapshot.forEach((doc: any) => players.push(...doc.data().players));
        const player: any = players.find((gp: any) => gp.email === email);
        setSkill(player.data.skills[name]);
      } else {
        const sign = await signIn();
        if (!sign) {
          window.alert('Houve um erro ao realizar a autenticação. Por favor, faça login novamente.');
          router.push('/');
        }
      }
    } catch (error) {
      window.alert('Erro ao obter valor da Forma: ' + error);
    }
  };
  
  const updateValue = async (name: string, value: number) => {
    const db = getFirestore(firebaseConfig);
    const authData: { email: string, name: string } | null = await authenticate();
    try {
      if (authData && authData.email && authData.name) {
        const { email } = authData;
        const userQuery = query(collection(db, 'sessions'), where('name', '==', session));
        const userQuerySnapshot = await getDocs(userQuery);
        const players: any = [];
        userQuerySnapshot.forEach((doc: any) => players.push(...doc.data().players));
        const player: any = players.find((gp: any) => gp.email === email);
        player.data.skills[name] = value;
        if (player.data.skills[name].value === 1 && value === 1) player.data.skills[name] = { value: 0, specialty: skill.specialty };
        else player.data.skills[name] = { value, specialty: skill.specialty };
        const docRef = userQuerySnapshot.docs[0].ref;
        const playersFiltered = players.filter((gp: any) => gp.email !== email);
        await updateDoc(docRef, { players: [...playersFiltered, player] });
      } else {
        const sign = await signIn();
        if (!sign) {
          window.alert('Houve um erro ao realizar a autenticação. Por favor, faça login novamente.');
          router.push('/');
        }
      }
    } catch (error) {
      window.alert('Erro ao obter valor da Forma: ' + error);
    }
    returnValueSkill();
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