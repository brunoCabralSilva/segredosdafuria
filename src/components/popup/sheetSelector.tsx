'use client'
import contexto from "@/context/context";
import { useContext } from "react";
import { capitalizeFirstLetter, getOfficialTimeBrazil, sheetStructure } from "@/firebase/utilities";
import { addNewSheetMandatory } from "@/firebase/players";
import { authenticate } from "@/firebase/authenticate";
import { useRouter } from "next/navigation";
import { registerHistory } from "@/firebase/history";

export default function SheetSelector() {
  const router = useRouter();
  const { setSheetId, setShowSelectSheet, setDataSheet, players, email, session, setShowMessage } = useContext(contexto);

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

  return(
    <div className="z-50 fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black/80 px-3 sm:px-0">
      <div className={`w-full sm:w-2/3 md:w-1/2  overflow-y-auto flex flex-col items-center ${players.filter((pl: any) => pl.email === email).length > 3 ? 'justify-start h-70vh' : 'justify-center h-50vh'} bg-black relative border-white border-2 py-5`}>
        <div className="px-5 w-full">
          { 
            players.filter((pl: any) => pl.email === email).length === 0
            ? <div className="w-full text-white text-lg text-center mb-4">
                Você não possui Personagens criados para esta Sessão. Clique abaixo para criar seu primeiro personagem:
              </div>
            :  <div className="w-full text-white text-lg text-center mb-4">
                Escolha um Personagem abaixo para começar o jogo:
              </div>
          }
          {
            players.filter((pl: any) => pl.email === email).length === 0
            &&
            <button
              type="button"
              onClick={ createSheet }
              className="text-white bg-black border-2 border-white hover:border-red-800 transition-colors my-1 mb-3 cursor-pointer w-full p-2 font-bold"
            >
              Criar Ficha
            </button>
          }
          <div className="flex flex-col w-full gap-3">
            {
              players.filter((pl: any) => pl.email === email).length > 0
              &&
              players
              .filter((pl: any) => pl.email === email)
              .map((player: any, index: number) => (
                <button
                  type="button"
                  key={index}
                  onClick={ () => {
                    setSheetId(player.id);
                    setDataSheet(player);
                    setShowSelectSheet(false);
                    setShowMessage({ show: true, text: 'Caso precise trocar de personagem ou criar novos, clique no botão "+" e vá até a opção "Personagens". Desejamos a você um bom jogo!' });
                  }}
                  className="w-full py-4 border border-white cursor-pointer text-white text-center font-bold"
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
      </div>
    </div>
  );
}