import contexto from "@/context/context";
import { authenticate } from "@/firebase/authenticate";
import { registerHistory } from "@/firebase/history";
import { addNewSheetMandatory } from "@/firebase/players";
import { capitalizeFirstLetter, getOfficialTimeBrazil, sheetStructure } from "@/firebase/utilities";
import { useContext } from "react";

export default function Players() {
  const { players, session, email, dataSheet, setOptionSelect, setSheetId, setShowMessage, setDataSheet } = useContext(contexto);

  const createSheet = async () => {
    try {
      const dateMessage = await getOfficialTimeBrazil();
      let sheet = { user: '' };
      if (email === session.gameMaster) {
        const auth = await authenticate(setShowMessage);
        if (auth && auth.email && auth.displayName) {
          sheet = sheetStructure(auth.email, auth.displayName, dateMessage);
        }
      } else {
        const auth = await authenticate(setShowMessage);
        if (auth && auth.email && auth.displayName) {
          sheet = sheetStructure(email, auth.displayName, dateMessage);
        } 
      }
      const register: string = await addNewSheetMandatory(session.id, sheet, setShowMessage);
      await registerHistory(session.id, { message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(sheet.user)} criou um novo personagem.`, type: 'notification' }, null,  setShowMessage);
      if (register) {
        setSheetId(register);
        setDataSheet(sheet);
        setShowMessage({ show: true, text: 'Ficha Criada com sucesso!' });
      }
    } catch (error) {
      setShowMessage({ show: true, text: 'Ocorreu um erro inesperado: ' + error });
    }
  }

  const selectSheet = async (player: any) => {
    if (dataSheet.id !== player.id) {
      setSheetId(player.id);
      setOptionSelect('general');
      setDataSheet(player);
      setShowMessage({ show: true, text: `Você Selecionou o Personagem ${player.data.name !== '' ? player.data.name : ''} (${capitalizeFirstLetter(player.user)})` });
      await registerHistory(session.id, { message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(player.user)} selecionou um personagem ${ session.gameMaster === email ? `de ${capitalizeFirstLetter(player.user)}` : ''}${player.data.name !== '' ? ` (${player.data.name}).` : '.'}`, type: 'notification' }, null,  setShowMessage);
    }
  }

  return(
    <div className="flex flex-col items-center justify-start z-60 top-0 right-0 w-full overflow-y-auto h-75vh">
      <button
        type="button"
        onClick={ createSheet }
        className="text-white bg-black border-2 border-white hover:border-red-800 transition-colors my-1 mb-3 cursor-pointer w-full p-2 font-bold"
      >
        Criar Ficha
      </button>
      { 
        players.length === 0 && session.gameMaster === email && <div className="w-full text-white text-lg text-center mt-4">
          Você não possui Personagens na sua Sessão.
        </div>
      }
      { 
        players.filter((pl: any) => pl.email === email).length === 0 && session.gameMaster !== email && <div className="w-full text-white text-lg text-center mt-4">
          Você não possui Jogadores.
        </div>
      }
      
      <div className="flex flex-col w-full gap-3">
        {
          players.length > 0
          &&
          session.gameMaster === email &&
          players.map((player: any, index: number) => (
            <button
              type="button"
              key={index}
              onClick={ () => selectSheet(player) }
              className={`w-full py-4 border cursor-pointer text-white text-center font-bold border-white flex items-center justify-center gap-3 ${player.data.name === dataSheet && dataSheet.data && dataSheet.data.name ? 'bg-ritual bg-cover' : ''} px-4`}
            >
              {
                player && player.data && player.data.name !== ''
                ? `${player.data.name} (${capitalizeFirstLetter(player.user)})`
                : capitalizeFirstLetter(player.user)
              }
            </button>
          ))
        }
        {
          players.length > 0
          &&
          session.gameMaster !== email &&
          players
          .filter((pl: any) => pl.email === email)
          .map((player: any, index: number) => (
            <button
              type="button"
              key={index}
              onClick={ () => selectSheet(player) }
              className={`w-full py-4 border cursor-pointer text-white text-center font-bold border-white flex items-center justify-center gap-3 ${player.data.name === dataSheet.data.name ? 'bg-ritual bg-cover' : ''} px-4`}
            >
              {
                player && player.data && player.data.name !== ''
                ? `${player.data.name} (${capitalizeFirstLetter(player.user)})`
                : capitalizeFirstLetter(player.user)
              }
            </button>
          ))
        }
      </div>
    </div>
  );
}