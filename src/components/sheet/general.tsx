import { useEffect, useState } from "react";
import { collection, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import ItemHealth from "./itemHealth";
import ItemRage from "./itemRage";
import ItemRenown from "./itemRenown"
import ItemWillpower from "./itemWillPower";
import firebaseConfig from "@/firebase/connection";
import { jwtDecode } from "jwt-decode";
import { BsCheckSquare } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import dataTrybes from '../../data/trybes.json';

export default function General() {
  const [input, setInput ] = useState('');
  const [nameCharacter, setNameCharacter] = useState<string[]>([]);
  const [auspice, setAuspice] = useState<string[]>([]);
  const [trybeI, setTrybe] = useState<string[]>([]);

  const typeName = (e: any) => {
    const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
    setNameCharacter([sanitizedValue]);
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
            setAuspice([userData.characterSheet[0].data.auspice]);
            setTrybe([userData.characterSheet[0].data.trybe]);
            setNameCharacter([userData.characterSheet[0].data.name]);
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

  const updateValue = async (key: string, value: string) => {
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
            if (key === 'name') userData.characterSheet[0].data.name = nameCharacter[0];
            if (key === 'auspice') userData.characterSheet[0].data.auspice = value;
            if (key === 'trybe') userData.characterSheet[0].data.trybe = value;
            userData.characterSheet[0].key = nameCharacter[0];
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

  return(
    <div className="flex flex-col w-full overflow-y-auto pr-2 h-full mb-3">
      <div className="w-full h-full mb-2 p-1 cursor-pointer text-white flex-col items-start justify-center font-bold px-4">
        <div className={ `mt-5 capitalize ${ input ? 'flex-col' : 'flex justify-between' } items-center` }>
          { 
            input !== 'nameCharacter' && <span className="capitalize break-words text-xl">{
              nameCharacter.length === 0 || nameCharacter[0] === '' || nameCharacter[0] === ' '
              ? <span onClick={() => setInput('nameCharacter')}>
                  Insira um nome
                </span>
              : <span onClick={() => setInput('nameCharacter')}>{ nameCharacter }</span>
            }</span>
          }
          <div className="flex">
          { 
            input === 'nameCharacter' &&
            <input
              type="text"
              className="border-2 border-white text-white text-center w-full mr-1 bg-black"
              placeholder="Nome"
              value={ nameCharacter[0] }
              onChange={(e) => typeName(e)}
            />
          }
          { 
            input
              ? <BsCheckSquare
                  onClick={() => {
                    updateValue('name', nameCharacter[0]);
                    setInput('');
                  }}
                  className="text-3xl"
                />
              : <FaRegEdit onClick={() => setInput('nameCharacter')} className="text-xl" />
          }
          </div>
        </div>
        <div className={ `mt-5 capitalize flex-col justify-between items-center` }>
          <span className="pr-3">Augúrio</span>
          <select
            className="w-full text-center py-1 bg-gray-whats border-2 border-white mt-2"
            value={auspice}
            onChange={ (e) => {
              updateValue('auspice', e.target.value);
              setAuspice([e.target.value]);
            }}
          >
            <option disabled value="">Escolha um Augúrio</option>
            <option value="ragabash">Ragabash</option>
            <option value="theurge">Theurge</option>
            <option value="philodox">Philodox</option>
            <option value="galliard">Galliard</option>
            <option value="ahroun">Ahroun</option>
          </select>
        </div>
        <div className={ `mt-5 capitalize flex-col justify-between items-center` }>
          <span className="pr-3">Tribo</span>
          <select
            className="w-full text-center py-1 bg-gray-whats border-2 border-white mt-2"
            value={ trybeI }
            onChange={ (e) => {
              updateValue('trybe', e.target.value);
              setTrybe([e.target.value]);
            }}
          >
            <option disabled value="">Escolha uma Tribo</option>
            {
              dataTrybes
                .sort((a, b) => a.namePtBr.localeCompare(b.namePtBr))
                .map((trybe, index) => (
                <option
                  key={index}
                  value={ trybe.nameEn }
                >
                  { trybe.namePtBr }
                </option>
              ))
            }
          </select>
        </div>
        <ItemRage name="rage" namePtBr="Fúria" quant={5} />
        <ItemWillpower name="willpower" namePtBr="Força de Vontade" quant={10} />
        <ItemHealth name="health" namePtBr="Vitalidade" quant={10} />
        <ItemRenown name="honor" namePtBr="Honra" quant={5} />
        <ItemRenown name="glory" namePtBr="Glória" quant={5} />
        <ItemRenown name="wisdom" namePtBr="Sabedoria" quant={5} />
      </div>
    </div>
  );
}