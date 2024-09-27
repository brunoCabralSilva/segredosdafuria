'use client'
import contexto from "@/context/context";
import { updateDataPlayer } from "@/firebase/players";
import { useContext, useState } from "react";
import { BsCheckSquare } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";

export default function ItemSkill(props: any) {
	const { name, namePtBr, quant } = props;
	const { dataSheet, sessionId, email, setShowMessage } = useContext(contexto);
  const [ skill, setSkill ] = useState<string>(dataSheet.skills[name].specialty);
  const [input, setInput ] = useState(false);

  const updateValue = async (value: number) => {
    const player = dataSheet;
    if (player.skills[name].value === 1 && value === 1) 
      player.skills[name] = { value: 0, specialty: skill };
    else player.skills[name] = { value, specialty: skill };
    await updateDataPlayer(sessionId, email, player, setShowMessage);
  };

  const updateSpecialty = async () => {
    const player = dataSheet;
    player.skills[name] = { value: player.skills[name].value, specialty: skill };
    await updateDataPlayer(sessionId, email, player, setShowMessage);
  };

  const returnPoints = () => {
    const points = Array(quant).fill('');
    return (
      <div className="flex gap-2 pt-1">
        {
          dataSheet && points.map((item, index) => {
            if (dataSheet.skills[name].value >= index + 1) {
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
        && dataSheet.skills[name].specialty !== ''
        && dataSheet.skills[name].specialty !== ' '
        && <span className="text-sm capitalize">{ dataSheet.skills[name].specialty }</span>
      }
      <div className="w-full">
        { returnPoints() }
      </div>
    </div>
  );
}