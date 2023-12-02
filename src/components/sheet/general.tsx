'use client'
import { useEffect, useState } from "react";
import { collection, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import Item from "./item";
import firebaseConfig from "@/firebase/connection";
import { jwtDecode } from "jwt-decode";
import { BsCheckSquare } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import dataTrybes from '../../data/trybes.json';
import ItemAgravated from "./itemAgravated";

export default function General(props: { session: string }) {
  const { session } = props;
  const [input, setInput ] = useState('');
  const [nameCharacter, setNameCharacter] = useState<string>('');
  const [auspice, setAuspice] = useState<string>('');
  const [trybeI, setTrybe] = useState<string>('');

  const typeName = (e: any) => {
    const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
    setNameCharacter(sanitizedValue);
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
        const userQuery = query(collection(db, 'sessions'), where('name', '==', session));
        const userQuerySnapshot = await getDocs(userQuery);
        const players: any = [];
        userQuerySnapshot.forEach((doc: any) => players.push(...doc.data().players));
        const player: any = players.find((gp: any) => gp.email === email);
        setAuspice(player.data.auspice);
        setTrybe(player.data.trybe);
        setNameCharacter(player.data.name);
      } catch (error) {
        window.alert('Erro ao obter valor do atributo: ' + error);
      }
    }
  };
  const updateValue = async (key: string, value: string) => {
    const db = getFirestore(firebaseConfig);
    const token = localStorage.getItem('Segredos Da Fúria');
    if (token) {
      try {
        const decodedToken: { email: string } = jwtDecode(token);
        const { email } = decodedToken;
        const userQuery = query(collection(db, 'sessions'), where('name', '==', session));
        const userQuerySnapshot = await getDocs(userQuery);
        const players: any = [];
        userQuerySnapshot.forEach((doc: any) => players.push(...doc.data().players));
        const player: any = players.find((gp: any) => gp.email === email);
        if (key === 'name') player.data.name = nameCharacter;
        if (key === 'auspice') player.data.auspice = value;
        if (key === 'trybe') player.data.trybe = value;
        const docRef = userQuerySnapshot.docs[0].ref;
        const playersFiltered = players.filter((gp: any) => gp.email !== email);
        await updateDoc(docRef, { players: [...playersFiltered, player] });
      } catch (error) {
        window.alert('Erro ao atualizar valor: (' + error + ')');
      }
    }
    returnValueSkill();
  };

  return(
    <div className="flex flex-col w-full overflow-y-auto pr-2 h-full mb-3">
      <div className="w-full h-full mb-2 p-1 text-white flex-col items-start justify-center font-bold px-4">
        <div
          className="w-full mt-5 capitalize flex justify-between items-center cursor-pointer"
          onClick={() => setInput('nameCharacter')}
        >
          { 
            input !== 'nameCharacter' && <span className="capitalize break-words text-xl w-full">{
              nameCharacter.length === 0 || nameCharacter[0] === '' || nameCharacter[0] === ' '
              ? <span className=" w-full">
                  Insira um nome
                </span>
              : <span className="w-full">
                  { nameCharacter }
                </span>
            }</span>
          }
          { 
            input === 'nameCharacter' &&
            <input
              type="text"
              className="border-2 border-white text-white text-center w-full mr-1 bg-black"
              placeholder="Nome"
              value={ nameCharacter }
              onChange={(e) => typeName(e)}
            />
          }
          { 
            input
              ? <BsCheckSquare
                  onClick={(e:any) => {
                    updateValue('name', nameCharacter[0]);
                    setInput('');
                    e.stopPropagation();
                  }}
                  className="text-3xl"
                />
              : <FaRegEdit
                  onClick={
                    (e:any) => {
                      setInput('nameCharacter');
                      e.stopPropagation();
                    }}
                  className="text-3xl"
                />
          }
        </div>
        <div className={ `mt-5 capitalize flex-col justify-between items-center` }>
          <span className="pr-3">Augúrio</span>
          <select
            className="w-full text-center py-1 bg-gray-whats-dark border-2 border-white mt-2 cursor-pointer"
            value={auspice}
            onChange={ (e) => {
              updateValue('auspice', e.target.value);
              setAuspice(e.target.value);
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
            className="w-full text-center py-1 bg-gray-whats-dark border-2 border-white mt-2 cursor-pointer"
            value={ trybeI }
            onChange={ (e) => {
              updateValue('trybe', e.target.value);
              setTrybe(e.target.value);
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
        <Item name="rage" namePtBr="Fúria" quant={5} session={session} />
        <ItemAgravated name="willpower" namePtBr="Força de Vontade" session={session} />
        <ItemAgravated name="health" namePtBr="Vitalidade" session={session} />
        <Item name="honor" namePtBr="Honra" quant={5} session={session} />
        <Item name="glory" namePtBr="Glória" quant={5} session={session} />
        <Item name="wisdom" namePtBr="Sabedoria" quant={5} session={session} />
      </div>
    </div>
  );
}