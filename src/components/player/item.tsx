'use client'
import contexto from "@/context/context";
import { rageCheck } from "@/firebase/messagesAndRolls";
import { getPlayerByEmail, updateDataPlayer } from "@/firebase/players";
import { useContext } from "react";

export default function Item(props: any) {
	const { name, quant, namePtBr } = props;
	const {
    email,
    dataSheet,
    sessionId,
    sheetId,
    setShowMessage,
    setShowHarano,
    setShowHauglosk,
    setShowMenuSession,
  } = useContext(contexto);
  
  const updateValue = async (name: string, value: number) => {
    if (dataSheet.data[name] === 1 && value === 1) dataSheet.data[name] = 0;
    else dataSheet.data[name] = value;
		await updateDataPlayer(sheetId, dataSheet, setShowMessage);
  };

  return(
    <div className={ `w-full ${ name === 'rage' ? 'mt-8' : 'mt-4' }` }>
      <span className="capitalize">{ namePtBr }</span>
      <div className="flex flex-col items-center lg:flex-row">
        <div className="w-full">
          <div className="flex flex-wrap gap-2 pt-1">
            {
              Array(quant).fill('').map((item, index) => {
                if (dataSheet.data[name] >= index + 1) {
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
        </div>
        {
          namePtBr === 'Fúria' &&
          <button
              className="mt-3 lg:mt-0 bg-white p-1 w-full cursor-pointer capitalize text-center text-black hover:font-bold hover:bg-black hover:text-white rounded border-2 border-black hover:border-white transition-colors duration-600"
              onClick={ async () => {
                const rage: number = await rageCheck(sessionId, email, sheetId, setShowMessage, dataSheet);
                updateValue('rage', rage);
                setShowMenuSession('');
              }}
					>
						Teste de Fúria
					</button>
        }
				{
          namePtBr === 'Harano' &&
          <button
              className="mt-3 lg:mt-0 bg-white p-1 w-full cursor-pointer capitalize text-center text-black hover:font-bold hover:bg-black hover:text-white rounded border-2 border-black hover:border-white transition-colors duration-600"
              onClick={ async () => setShowHarano(true) }
					>
						Teste de Harano
					</button>
        }
				{
          namePtBr === 'Hauglosk' &&
          <button
              className="mt-3 lg:mt-0 bg-white p-1 w-full cursor-pointer capitalize text-center text-black hover:font-bold hover:bg-black hover:text-white rounded border-2 border-black hover:border-white transition-colors duration-600"
              onClick={ async () => setShowHauglosk(true) }
					>
						Teste de Hauglosk
					</button>
        }
      </div>
    </div>
  );
}