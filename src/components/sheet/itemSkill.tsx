'use client'
import firebaseConfig from "@/firebase/connection";
import { collection, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { BsCheckSquare } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import { TiInputChecked } from "react-icons/ti";

interface ISkl {
  name: string;
  namePtBr: string;
  quant: number;
}

export default function ItemSkill(props: ISkl) {
  const [ skill, setSkill ] = useState<{ value: number, specialty: string }[]>([{ value: 0, specialty: '' }]);
  const [input, setInput ] = useState(false);
  const { name, namePtBr, quant } = props;

  const typeText = (e: any) => {
    const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
    setSkill([{
      value: skill[0].value,
      specialty: sanitizedValue,
    }]);
  };

  useEffect(() => {
    returnValueSkill();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const returnValueSkill = async (): Promise<void> => {
    const db = getFirestore(firebaseConfig);
    const token = localStorage.getItem('Segredos Da Fúria');
    if (token) {
      try {
        const decodedToken: { email: string } = jwtDecode(token);
        const { email } = decodedToken;
        const userQuery = query(collection(db, 'users'), where('email', '==', email));
        const userQuerySnapshot = await getDocs(userQuery);
        if (!isEmpty(userQuerySnapshot.docs)) {
          const userData = userQuerySnapshot.docs[0].data();
          setSkill([userData.characterSheet[0].data.skills[name]]);
        } else {
          window.alert('Nenhum documento de usuário encontrado com o email fornecido.');
        }
      } catch (error) {
        window.alert('Erro ao obter valor do atributo: ' + error);
      }
    }
  };
  
  const isEmpty = (obj: any) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  };
  
  const updateValue = async (name: string, value: number) => {
    const db = getFirestore(firebaseConfig);
    const token = localStorage.getItem('Segredos Da Fúria');
    if (token) {
      try {
        const decodedToken: { email: string } = jwtDecode(token);
        const { email } = decodedToken;
        const userQuery = query(collection(db, 'users'), where('email', '==', email));
        const userQuerySnapshot = await getDocs(userQuery);
        if (!isEmpty(userQuerySnapshot.docs)) {
          const userDocRef = userQuerySnapshot.docs[0].ref;
          const userData = userQuerySnapshot.docs[0].data();
          if (userData.characterSheet && userData.characterSheet.length > 0) {
            userData.characterSheet[0].data.skills[name] = { value, specialty: skill[0].specialty };
            await updateDoc(userDocRef, { characterSheet: userData.characterSheet });
          }
        } else {
          window.alert('Nenhum documento de usuário encontrado com o email fornecido.');
        }
      } catch (error) {
        window.alert('Erro ao atualizar valor: (' + error + ')');
      }
    }
    returnValueSkill();
  };

  const returnPoints = (name: string) => {
    const points = Array(quant).fill('');
    return (
      <div className="grid grid-cols-5 gap-1 pt-1">
        {
          skill.length > 0 && points.map((item, index) => {
            if (skill[0].value >= index + 1) {
              return (
                <button
                  type="button"
                  onClick={ () => updateValue(name, index + 1) }
                  key={index}
                  className="h-5 w-full bg-black border-black border-2 cursor-pointer"
                />
              );
            } return (
              <button
                type="button"
                onClick={ () => updateValue(name, index + 1) }
                key={index}
                className="h-5 w-full bg-white border-black border-2 cursor-pointer"
              />
            );
          })
        }
      </div>
    );
  };

  return(
    <div className="w-full mt-2 pr-5">
      <div className={ `capitalize ${ input ? 'flex-col' : 'flex justify-between' } items-center` }>
        <span>{ namePtBr } ({ name })</span>
        <div className="flex">
        { 
          input &&
          <input
            type="text"
            className="border-2 border-black text-center w-full mr-1"
            placeholder="Especialização"
            value={ skill[0].specialty }
            onChange={(e) => typeText(e)}
          />
        }
        { 
          input
            ? <BsCheckSquare
                onClick={() => {
                  updateValue(name, skill[0].value);
                  setInput(false);
                }}
                className="text-3xl"
              />
            : <FaRegEdit onClick={() => setInput(true)} className="text-xl" />
        }
        </div>
      </div>
      { 
        !input
        && skill[0].specialty !== ''
        && skill[0].specialty !== ' '
        && <span className="text-sm capitalize">Especialização: { skill[0].specialty }</span>
      }
      <div className="w-full">
        { returnPoints(name) }
      </div>
    </div>
  );
}