import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionRegisterSession, useSlice } from "@/redux/slice";
import { collection, getDocs, getFirestore, serverTimestamp } from "firebase/firestore";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import firestoreConfig from '../../../firebase/connection';
import { MdDelete } from "react-icons/md";

interface IUsersOfSession {
  email: string;
  character: string;
};

interface ISessions {
  name: string;
  description: string;
  image: string;
  dm: string;
  creationDate: Date;
  anotations: string;
  chat: any[],
  users: IUsersOfSession[],
};

export default function RegisterSession() {
  const router = useRouter();
  const slice = useAppSelector(useSlice);
  const dispatch: any = useAppDispatch();
  const [nameSession, setNameSession] = useState<string>('');
  const [errNameSession, setErrNameSession] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [errDescription, setErrDescription] = useState<string>('');
  const [listOfPlayers, setListOfPlayers] = useState<string[]>([]);
  const [listOfUsers, setListOfUsers] = useState<any>([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const db = getFirestore(firestoreConfig);
        const collectionRef = collection(db, 'users');
        const querySnapshot = await getDocs(collectionRef);
        const listUsers = querySnapshot.docs.map((doc: any) => ({
          name: `${doc.data().firstName} ${doc.data().lastName}`,
          email: doc.data().email,
        }));
        setListOfUsers(listUsers);
      } catch (error) {
        window.alert('Erro ao obter sessões: ' + error);
      }
    };
    getUsers();
  }, []);

  const manageUsers = (userEmail: string) => {
    if (listOfPlayers.length === 0) setListOfPlayers([userEmail]);
    else {
      const findUser = listOfPlayers.find((player: string) => player === userEmail);
      if (!findUser) setListOfPlayers([userEmail, ...listOfPlayers]);
    }
  };

  const removeUser = (userEmail: string) => {
    if (listOfPlayers.length === 0) setListOfPlayers([userEmail]);
    else {
      const remove = listOfPlayers.filter((player: string) => player !== userEmail);
      setListOfPlayers(remove);
    }
  };

  const registerSession = () => {
    if (nameSession.length < 3) {
      setErrNameSession('Necessário preencher um nome com pelo menos 3 caracteres');
    } else setErrNameSession('');
    
    if (description.length < 10) {
      setErrDescription('Necessário preencher uma descrição com pelo menos 10 caracteres');
    } else setErrDescription('');

    if (nameSession.length > 3 && description.length > 10) {
      const token = localStorage.getItem('Segredos da Fúria');
      if (token) {
        const data: { email: string } = jwtDecode(JSON.parse(token));
        const dm = data;
        const creationDate = serverTimestamp();
        const anotations = '';
        const chat = [];
        // users: IUsersOfSession[],
        // image: string;
      } else {
        router.push('/sessions/login');
        window.alert('Não foi possível validar seu Token. Por favor, faça login novamente');
      }
    }
  };

  return(
    <div className="w-full h-screen fixed top-0 left-0 bg-black/90 z-50 flex items-center justify-center p-2 sm:p-0">
      <div className="flex flex-col w-full h-full overflow-y-auto sm:w-2/3 md:w-1/3 justify-center items-center bg-black p-5 border-2 border-white">
        <div className="w-full mb-2 flex justify-end text-white">
          <IoIosCloseCircleOutline
            className="text-4xl text-white cursor-pointer"
            onClick={() => dispatch(actionRegisterSession(false))}
          />
        </div>
        <div className="w-full text-white text-2xl pb-3 font-bold text-center">
          Crie sua Sessão
        </div>
        <label htmlFor="nameSession" className={`${errNameSession !== '' ? 'mb-2' : 'mb-4'} flex flex-col items-center w-full`}>
          <p className="text-white w-full pb-3">Name</p>
          <input
            type="text"
            id="nameSession"
            value={ nameSession }
            className="bg-white w-full p-3 capitalize cursor-pointer text-black"
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
              const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
              setNameSession(sanitizedValue);
            }}
          />
        </label>
        {
          errNameSession !== '' && <div className="text-white pb-3 text-center">{ errNameSession }</div>
        }
        <label htmlFor="description" className={`${errDescription !== '' ? 'mb-2' : 'mb-4'} flex flex-col items-center w-full`}>
          <p className="text-white w-full pb-3">Descrição</p>
          <textarea
            id="description"
            value={ description }
            className="bg-white w-full p-3 capitalize cursor-pointer text-black"
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
              setDescription(sanitizedValue);
            }}
          />
        </label>
        {
          errDescription !== '' && <div className="text-white pb-3 text-center">{ errDescription }</div>
        }
        <label htmlFor="valueOf" className="mb-4 flex flex-col items-center w-full">
          <p className="text-white w-full pb-3">Jogadores</p>
          <select
          onClick={(e: any) => manageUsers(e.target.value)}
          className="w-full py-3 capitalize cursor-pointer"
        >
          <option
            className="capitalize text-center text-ehite"
            disabled selected
          >
            Escolha Jogadores
          </option>
          {
            listOfUsers
              .map((item: any, index: number) => (
              <option
                className="capitalize text-center text-black"
                key={index}
                value={item.email}
              >
                { item.name }
              </option>
            ))
          }
        </select>
        <div className="w-full mt-2">
          {
            listOfPlayers.map((player: string, index: number) => {
              const find = listOfUsers.find((user: any) => user.email === player);
              return(
                <div
                  key={index}
                  className="bg-white w-full p-3 capitalize cursor-pointer text-black mb-2 text-center flex justify-between"
                >
                  <span>{ find.name }</span>
                  <MdDelete
                    className="text-2xl"
                    onClick={ () => removeUser(player) }
                  />
                </div>
              )
            })
          }
        </div>
        </label>

        <label
          htmlFor="description"
          className="mb-4 flex flex-col items-center w-full"
        >
          <p className="text-white w-full pb-3">Imagem</p>
          <input
            type="file"
            className="w-full
            text-white"
            id="fileInput"
          />
        </label>
        <button
          className={`text-white bg-black hover:border-red-800 transition-colors cursor-pointer' } border-2 border-white w-full p-2 mt-6 font-bold`}
          onClick={ registerSession }
        >
          Criar
        </button>
      </div>
    </div>
  );
}