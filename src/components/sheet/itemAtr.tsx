'use client'
import firebaseConfig from "@/firebase/connection";
import { collection, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

interface IAtr {
  name: string;
  namePtBr: string;
  quant: number;
}

export default function ItemAtr(props: IAtr) {
  const [ attributes, setAttributes ] = useState<any>([]);
  const { name, namePtBr, quant } = props;

  useEffect(() => {
    returnValueAttribute();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const returnValueAttribute = async (): Promise<void> => {
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
          setAttributes([userData.characterSheet[0].data.attributes[name]]);
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
            userData.characterSheet[0].data.attributes[name] = value;
            await updateDoc(userDocRef, { characterSheet: userData.characterSheet });
          }
        } else {
          window.alert('Nenhum documento de usuário encontrado com o email fornecido.');
        }
      } catch (error) {
        window.alert('Erro ao atualizar valor: (' + error + ')');
      }
    }
    returnValueAttribute();
  };

  const returnPoints = (name: string) => {
    const points = Array(quant).fill('');
    return (
      <div className="flex flex-wrap gap-2 pt-1">
        {
          attributes.length > 0 && points.map((item, index) => {
            if (attributes[0] >= index + 1) {
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
      <span className="capitalize">{ namePtBr } ({ name })</span>
      <div className="w-full mt-1">
        { returnPoints(name) }
      </div>
    </div>
  );
}