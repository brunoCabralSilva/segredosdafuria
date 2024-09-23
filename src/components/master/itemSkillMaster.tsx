'use client'
import contexto from "@/context/context";
import { getPlayerByEmail, updateDataPlayer } from "@/firebase/players";
import { useContext, useState } from "react";
import { BsCheckSquare } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";

export default function ItemSkillMaster(props: any) {
	const { value, name, namePtBr, quant } = props;
	const { viewPlayer, session, returnDataPlayer, setShowMessage } = useContext(contexto);
  const [ skill, setSkill ] = useState<{ value: number, specialty: string }>({ value: viewPlayer.data.data.skills[name].value, specialty: viewPlayer.data.data.skills[name].specialty });
  const [input, setInput ] = useState(false);

  const typeText = (e: any) => {
    const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
    setSkill({
      value: skill.value,
      specialty: sanitizedValue,
    });
  };

  const updateValue = async (number: number) => {
    const player: any = await getPlayerByEmail(session.id, viewPlayer.data.email, setShowMessage);
    if (player) {
      if (player.data.skills[name].value === 1 && number === 1) 
				player.data.skills[name] = { value: 0, specialty: skill.specialty };
      else player.data.skills[name] = { value: number, specialty: skill.specialty };
			await updateDataPlayer(session.id, viewPlayer.data.email, player.data, setShowMessage);
      returnDataPlayer(viewPlayer.data.email, session.id, null);
    } else setShowMessage({ show: true, text: 'Jogador não encontrado! Por favor, atualize a página e tente novamente' });
  };

  const returnPoints = () => {
    const points = Array(quant).fill('');
    return (
      <div className="flex gap-2 pt-1">
        {
          viewPlayer.data.data && points.map((item, index) => {
            if (viewPlayer.data.data.skills[name].value >= index + 1) {
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
            value={ skill.specialty }
            onChange={(e) => typeText(e)}
          />
        }
        { 
          input
            ? <BsCheckSquare
                onClick={(e: any) => {
                  updateValue(viewPlayer.data.data.skills[name].value);
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
        && viewPlayer.data.data.skills[name].specialty !== ''
        && viewPlayer.data.data.skills[name].specialty !== ' '
        && <span className="text-sm capitalize">{ viewPlayer.data.data.skills[name].specialty }</span>
      }
      <div className="w-full">
        { returnPoints() }
      </div>
    </div>
  );
}