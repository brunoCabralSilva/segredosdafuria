'use client'
import contexto from "@/context/context";
import { registerHistory } from "@/firebase/history";
import { updateDataPlayer } from "@/firebase/players";
import { capitalizeFirstLetter, translate } from "@/firebase/utilities";
import { useContext, useState } from "react";
import { BsCheckSquare } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";

export default function ItemSkill(props: any) {
	const { name, namePtBr, quant } = props;
	const { dataSheet, session, email, sheetId, setShowMessage } = useContext(contexto);
  const [ skill, setSkill ] = useState<string>(dataSheet.data.skills[name].specialty);
  const [input, setInput ] = useState(false);

  const updateValue = async (value: number) => {
    const dataPersist = dataSheet.data.skills[name].value;
    if (dataSheet.data.skills[name].value === 1 && value === 1) 
      dataSheet.data.skills[name] = { value: 0, specialty: skill };
    else dataSheet.data.skills[name] = { value, specialty: skill };
    await updateDataPlayer(sheetId, dataSheet, setShowMessage);
    await registerHistory(session.id, { message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} alterou a Habilidade ${namePtBr} do personagem ${dataSheet.data.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}` : '' } ${dataPersist !== '' ? `de ${dataPersist} ` : ' '}para ${value}.`, type: 'notification' }, null, setShowMessage);
  };

  const updateSpecialty = async () => {
    const dataPersist = dataSheet.data.skills[name].specialty;
    dataSheet.data.skills[name] = { value: dataSheet.data.skills[name].value, specialty: skill };
    await updateDataPlayer(sheetId, dataSheet, setShowMessage);
    await registerHistory(session.id, { message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} alterou a especialização da Habilidade ${namePtBr} do personagem ${dataSheet.data.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}` : '' } de '${dataPersist}' para '${skill}'.`, type: 'notification' }, null, setShowMessage);
  };

  const returnPoints = () => {
    const points = Array(quant).fill('');
    return (
      <div className="flex gap-2 pt-1">
        {
          dataSheet && dataSheet.data && points.map((item, index) => {
            if (dataSheet.data.skills[name].value >= index + 1) {
              return (
                <button
                  type="button"
                  onClick={ () => updateValue(index + 1) }
                  key={index}
                  className="h-6 w-6 rounded-full bg-black border-white border-2 cursor-pointer"
                />
              );
            } return (
              <button
                type="button"
                onClick={ () => updateValue(index + 1) }
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
            value={ skill }
            onChange={ (e) => setSkill(e.target.value.replace(/\s+/g, ' ')) }
          />
        }
        { 
          input
            ? <BsCheckSquare
                onClick={(e: any) => {
                  updateSpecialty();
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
        && dataSheet.data
        && dataSheet.data.skills
        && dataSheet.data.skills[name].specialty !== ''
        && dataSheet.data.skills[name].specialty !== ' '
        && <span className="text-sm capitalize">{ dataSheet.data.skills[name].specialty }</span>
      }
      <div className="w-full">
        { returnPoints() }
      </div>
    </div>
  );
}