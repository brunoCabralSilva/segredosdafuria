import { BsCheckSquare } from "react-icons/bs";
import { collection, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { FaRegEdit } from "react-icons/fa";
import { useEffect, useState } from "react";
import firebaseConfig from "@/firebase/connection";
import { jwtDecode } from "jwt-decode";

export default function Anotations() {
  const [textArea, setTextArea] = useState<boolean>(false);
  const [text, setText] = useState<string>('');

  const typeText = (e: any) => {
    const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
    setText(sanitizedValue);
  };

  const isEmpty = (obj: any) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    returnValue();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const returnValue = async () => {
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
          setText(userData.characterSheet[0].data.notes);
        } else {
          window.alert('Nenhum documento de usuário encontrado com o email fornecido.');
        }
      } catch (error) {
        window.alert('Erro ao obter valor da Anotação: ' + error);
      }
    }
  };

  const updateValue = async () => {
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
            userData.characterSheet[0].data.notes = text;
            await updateDoc(userDocRef, { characterSheet: userData.characterSheet });
          }
        } else {
          window.alert('Nenhum documento de usuário encontrado com o email fornecido.');
        }
      } catch (error) {
        window.alert('Erro ao atualizar Anotação: (' + error + ')');
      }
    }
    returnValue();
  };

  return(
    <div className="flex flex-col w-full overflow-y-auto pr-2 h-full mb-3">
      <div className="w-full h-full mb-2 flex-col items-start justify-center font-bold">
        <div className="mt-1 p-2 flex justify-between items-center">
          <div
            className="text-white mt-2 pb-2 w-full cursor-pointer flex-col items-center justify-center"
            onClick={
              () => {
                setTextArea(true);
              }
            }
          >
            Anotações do Personagem
          </div>
            { 
              textArea
                ? <BsCheckSquare
                    onClick={(e: any) => {
                      updateValue();
                      setTextArea(false);
                      e.stopPropagation();
                    }}
                    className="text-3xl text-white cursor-pointer"
                  />
                : <FaRegEdit
                    onClick={(e: any) => {
                      setTextArea(true);
                      e.stopPropagation();
                    }}
                    className="text-3xl text-white cursor-pointer" />
            }
        </div>
        { 
          textArea ?
          <textarea
            className="text-white bg-black font-normal p-2 border-2 border-white w-full mr-1 mt-1 h-full"
            placeholder="Digite aqui suas anotações"
            value={ text }
            onChange={(e) => typeText(e)}
          />
          : <div
              className="text-white font-normal p-2 border-2 border-white w-full mr-1 mt-1 h-full cursor-pointer"
              onClick={() => setTextArea(true)} 
            >
            { text }
          </div>
        }
      </div>
    </div>
  );
}