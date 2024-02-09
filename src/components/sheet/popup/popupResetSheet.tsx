'use client'
import { useAppDispatch} from "@/redux/hooks";
import { actionResetSheet } from "@/redux/slice";
import { collection, doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { IoIosCloseCircleOutline } from "react-icons/io";
import firestoreConfig from '../../../firebase/connection';
import { authenticate, signIn } from "@/firebase/login";
import { useRouter } from "next/navigation";
import { getHoraOficialBrasil } from "@/firebase/chatbot";

export default function PopupResetSheet(props: { sessionId : string }) {
  const { sessionId } = props;
  const dispatch = useAppDispatch();
  const router = useRouter();

  const resetSheet = async () => {
    const dateMessage = await getHoraOficialBrasil();
    try {
      const authData: { email: string, name: string } | null = await authenticate();
      const db = getFirestore(firestoreConfig);
      if (authData && authData.email && authData.name) {
        const { email, name } = authData;
        const sheet = {
          email: email,
          user: name,
          creationDate: dateMessage,
          data: {
            trybe: '',
            auspice: '',
            name: '',
            glory: 0,
            honor: 0,
            wisdom: 0,
            health: [],
            rage: 0,
            harano: 0,
            hauglosk: 0,
            willpower: [],
            attributes: {
              strength: 1,
              dexterity: 1,
              stamina: 1,
              charisma: 1,
              manipulation: 1,
              composure: 1,
              intelligence: 1,
              wits: 1,
              resolve: 1,
            },
            skills: {
              athletics: { value: 0, specialty: '' },
              animalKen: { value: 0, specialty: '' },
              academics: { value: 0, specialty: '' },
              brawl: { value: 0, specialty: '' },
              etiquette: { value: 0, specialty: '' },
              awareness: { value: 0, specialty: '' },
              craft: { value: 0, specialty: '' },
              insight: { value: 0, specialty: '' },
              finance: { value: 0, specialty: '' },
              driving: { value: 0, specialty: '' },
              intimidation: { value: 0, specialty: '' },
              investigation: { value: 0, specialty: '' },
              firearms: { value: 0, specialty: '' },
              leadership: { value: 0, specialty: '' },
              medicine: { value: 0, specialty: '' },
              larceny: { value: 0, specialty: '' },
              performance: { value: 0, specialty: '' },
              occult: { value: 0, specialty: '' },
              melee: { value: 0, specialty: '' },
              persuasion: { value: 0, specialty: '' },
              politics: { value: 0, specialty: '' },
              stealth: { value: 0, specialty: '' },
              streetwise: { value: 0, specialty: '' },
              science: { value: 0, specialty: '' },
              survival: { value: 0, specialty: '' },
              subterfuge: { value: 0, specialty: '' },
              technology: { value: 0, specialty: '' },
            },
            gifts: [],
            rituals: [],
            advantagesAndFlaws: [
              { name: "Caern", advantages: [], flaws: [] },
              { name: "Trabalho Diário", advantages: [], flaws: [] },
              { name: "Linguística", advantages: [], flaws: [] },
              { name: "Aparência", advantages: [], flaws: [] },
              { name: "Refúgio Seguro", advantages: [], flaws: [] },
              { name: "Situações Sobrenaturais", advantages: [], flaws: [] },
              { name: "Aliados - Efetividade", advantages: [], flaws: [] },
              { name: "Aliados - Confiabilidade", advantages: [], flaws: [] },
              { name: "Contatos", advantages: [], flaws: [] },
              { name: "Fama", advantages: [], flaws: [] },
              { name: "Máscara", advantages: [], flaws: [] },
              { name: "Mentor", advantages: [], flaws: [] },
              { name: "Recursos", advantages: [], flaws: [] },
              { name: "Pacto Espiritual", advantages: [], flaws: [] },
            ],
            form: 'Hominídeo',
            background: '',
            notes: '',
          },
        };
        const sessionsCollectionRef = collection(db, 'sessions');
        const sessionDocRef = doc(sessionsCollectionRef, sessionId);
        const sessionDocSnapshot = await getDoc(sessionDocRef);
        if (sessionDocSnapshot.exists()) {
          const sessionDoc = sessionDocSnapshot.data();
          const playerIndex = sessionDoc.players.findIndex((player: any) => player.email === email);

        if (playerIndex !== -1) {
          const updatedPlayers = [...sessionDoc.players];
          updatedPlayers[playerIndex] = sheet;
          await updateDoc(sessionDocRef, { players: updatedPlayers });
          dispatch(actionResetSheet(false));
          window.alert("Sua ficha foi resetada!");
        } else {
          window.alert("Jogador não encontrado na sessão.");
          dispatch(actionResetSheet(false));
        }
        window.location.reload();
        }
      } else {
        const sign = await signIn();
        window.alert("Ocorreu um erro. Por favor, atualize a página tente novamente remover o jogador.");
        if (!sign) {
          window.alert('Houve um erro ao realizar a autenticação. Por favor, faça login novamente.');
          router.push('/');
        }
        dispatch(actionResetSheet(false));
      }
    } catch(error) {
      window.alert("Ocorreu um erro: " + error);
      dispatch(actionResetSheet(false));
    }
  };

  return(
    <div className="z-50 fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black/80 px-3 sm:px-0">
      <div className="w-full sm:w-2/3 md:w-1/2 overflow-y-auto flex flex-col justify-center items-center bg-black relative border-white border-2 pb-5">
        <div className="pt-4 sm:pt-2 px-2 w-full flex justify-end top-0 right-0">
          <IoIosCloseCircleOutline
            className="text-4xl text-white cursor-pointer"
            onClick={() => dispatch(actionResetSheet(false))}
          />
        </div>
        <div className="pb-5 px-5 w-full">
          <label htmlFor="palavra-passe" className="flex flex-col items-center w-full">
            <p className="text-white w-full text-center pb-3">
              Tem certeza que quer resetar os dados da sua ficha? Absolutamente tudo o que você registrou nela será apagado e ela voltará ao estado inicial de quando você logou pela primeira vez nesta sessão.
            </p>
          </label>
          <div className="flex w-full gap-2">
            <button
              type="button"
              onClick={() => dispatch(actionResetSheet(false))}
              className={`text-white bg-red-800 hover:border-red-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold`}

            >
              Não
            </button>
            <button
              type="button"
              onClick={ resetSheet }
              className={`text-white bg-green-whats hover:border-green-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold`}
            >
              Sim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}