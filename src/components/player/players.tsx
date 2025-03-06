import contexto from "@/context/context";
import { addNewSheet } from "@/firebase/players";
import { capitalizeFirstLetter, getOfficialTimeBrazil, sheetStructure } from "@/firebase/utilities";
import { useContext } from "react";

export default function Players(props: { setOptionSelect: any }) {
  const { setOptionSelect } = props;
  const { players, session, setSheetId, setShowMessage, setDataSheet } = useContext(contexto);
  return(
    <div className="flex flex-col items-center justify-start z-60 top-0 right-0 w-full overflow-y-auto h-75vh">
      <button
        type="button"
        onClick={async () => {
          try {
            const dateMessage = await getOfficialTimeBrazil();
            const sheet = sheetStructure('', 'Personagem ' + (players.length + 1), dateMessage);
            await addNewSheet(session.id, sheet, setShowMessage);
            setShowMessage({ show: true, text: 'Ficha Criada com sucesso!' });
          } catch (error) {
            setShowMessage({ show: true, text: 'Ocorreu um erro inesperado: ' + error });
          }
         }}
        className="text-white bg-black border-2 border-white hover:border-red-800 transition-colors my-1 mb-3 cursor-pointer w-full p-2 font-bold"
      >
        Criar Ficha
      </button>
      { 
        players.length === 0 && <div className="w-full text-white text-lg text-center mt-4">
          Você não possui Jogadores.
        </div>
      }
      <div className="flex flex-col w-full gap-3">
        {
          players.length > 0
          &&
          // players.filter((pl: any) => pl.email !== session.gameMaster)
          players.map((player: any, index: number) => (
            <button
              type="button"
              key={index}
              onClick={ () => {
                setSheetId(player.id);
                setOptionSelect('general');
                setDataSheet(player);
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
  );
}