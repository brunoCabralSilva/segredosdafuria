import firebaseConfig from "@/firebase/connection";
import { authenticate, signIn } from "@/firebase/login";
import { collection, doc, getDoc, getDocs, getFirestore } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SessionDetails() {
  const [players, setPlayers] = useState<any[]>([]);
  const [nameSession, setNameSession] = useState('');
  const [creationDate, setCreationDate] = useState('');
  const [description, setDescription] = useState('');
  const [dm, setDm] = useState('');
  const router = useRouter();

  useEffect(() => {
    const returnValue = async () => {
      try {
        const db = getFirestore(firebaseConfig);
        const collectionRef = collection(db, 'sessions');
          const querySnapshot = await getDocs(collectionRef);
          const sessionsList = querySnapshot.docs.map((doc: any) => ({
            id: doc.id,
            ...doc.data(),
          }));
        const sessionDocRef = doc(collectionRef, sessionsList[0].id);
        const sessionDocSnapshot = await getDoc(sessionDocRef);
        const authData: { email: string, name: string } | null = await authenticate();
          if (authData && authData.email && authData.name) {
            if (sessionDocSnapshot.exists()) {
              const sessionData = sessionDocSnapshot.data();
              setNameSession(sessionData.name);
              setCreationDate(sessionData.creationDate);
              setDescription(sessionData.description);
              setDm(sessionData.dm);
              setPlayers(sessionData.players);
            } else router.push('/sessions');
          } else {
            const sign = await signIn();
            if (!sign) {
              window.alert('Houve um erro ao realizar a autenticação. Por favor, faça login novamente.');
              router.push('/');
            }
          }
      } catch (error) {
        window.alert(`Erro ao obter a lista de jogadores: ` + error);
      }
    };
    returnValue();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return(
    <div className="flex flex-col w-full overflow-y-auto h-full mb-3">
      <div className="w-full h-full mb-2 text-white items-start justify-center font-bold px-1">
        <div
          className="w-full mt-2 flex justify-between items-start"
        >
          {
            creationDate !== ''
            ? <div className="h-full w-full">
                <div className="flex flex-col items-center justify-start w-full">
                  <div
                    className="w-full capitalize flex justify-between items-center pr-2 border-2 border-white mb-2"
                  >
                    <span className="text-white font-bold text-2xl my-3 capitalize break-words w-full px-4">
                      { nameSession }
                    </span>
                  </div>
                  <div className="w-full mb-2 flex-col font-bold border-2 border-white">
                    <div className="pl-4 pr-2 pt-2 flex justify-between items-center w-full">
                      <div
                        className="text-white w-full flex-col items-center justify-center"
                      >
                        Descrição:
                      </div>
                    </div>
                    <div className="w-full h-full">
                        <div
                            className="text-white font-normal p-4 text-justify w-full h-full break-words"
                          >
                          { description }
                        </div>
                    </div>
                  </div>
                  <div
                    className="w-full mb-2 mt-1 flex flex-col justify-between items-center p-2 border-2 border-white"
                  >
                    <div className="flex w-full">
                      <span className="text-white break-words w-full p-2">
                        <span className="font-bold pr-1">Narrador:</span>
                      </span>
                    </div>
                    <span className="border border-transparent text-sm text-white w-full p-2 break-words">
                      { dm }
                    </span>
                  </div>
                  <p className="mt-1 text-white sm:text-left w-full text-center border-2 border-white p-4">
                    <span className="font-bold pr-1">Data de Criação:</span>
                    <span>{ creationDate }</span>
                  </p>
                  <div className="text-white pb-3 sm:text-left w-full text-center mt-3 border-2 border-white p-4 mb-3">
                    <span className="pr-1 font-bold">Jogadores:</span>
                    {
                      players.filter((player:any) => player.email !== dm ).map((item: any, index: number) => (
                        <span className="capitalize" key={index}>
                          { index === players.length -2 ? item.user + '.' : item.user + ', ' }
                        </span>
                      ))
                    }
                  </div>
                </div>
              </div>
            : <div className="h-screen w-full flex items-center justify-center">
                <span className="loader z-50" />
              </div>
          }
        </div>
      </div>
    </div>
  );
}