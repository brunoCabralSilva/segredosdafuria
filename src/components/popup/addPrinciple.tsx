import contexto from "@/context/context";
import { authenticate } from "@/firebase/authenticate";
import { updateDataPlayer } from "@/firebase/players";
import { updateSession } from "@/firebase/sessions";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function AddPrinciple() {
  const [description, setDescription] = useState('');
  const [listPrinciples, setListPrinciples] = useState({});
  const {
    addPrinciple, setAddPrinciple,
    setShowMessage,
    session,
  } = useContext(contexto);
  const router = useRouter();

  useEffect(() => {
    if (addPrinciple.data.description) {
      setDescription(addPrinciple.data.description);
      setListPrinciples(session.principles.filter((principle: any) => principle.order !== addPrinciple.data.order));
    }
  }, []);

  const createPrinciple = async () => {
    const auth = await authenticate(setShowMessage);
    const newDataSession = session;
    if (auth) {
      if (addPrinciple.data.description) {
        newDataSession.principles = listPrinciples;
        newDataSession.principles = [...newDataSession.principles, { email: auth.email, description }];
        await updateSession(newDataSession, setShowMessage);
      } else {
        newDataSession.principles = [...newDataSession.principles, { email: auth.email, description, order: newDataSession.principles.length + 1 }];
        await updateSession(newDataSession, setShowMessage);
      }
    } else router.push('/login');
    setAddPrinciple({ show: false, data: {} });
  }

  return(
    <div className="z-60 fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black/80 px-3 sm:px-0 text-white">
      <div className="w-full sm:w-2/3 md:w-1/2 overflow-y-auto flex flex-col justify-center items-center bg-ritual bg-cover bg-center relative border-white border-2">
        <div className="bg-black/90 h-full w-full">
          <div className="pt-4 sm:pt-2 px-2 w-full flex justify-end top-0 right-0">
            <IoIosCloseCircleOutline
              className="text-4xl text-white cursor-pointer"
              onClick={() => setAddPrinciple({ show: false, data: {} }) }
            />
          </div>
          <div className="pb-5 px-5 w-full">
            <p className="font-bold pb-1 pt-4">Descreva o Princípio</p>
            <textarea
              className="focus:outline-none text-white bg-black font-normal p-3 border-2 border-white w-full mr-1 mt-1"
              value={ description }
              onChange={(e) => {
                const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
                setDescription(sanitizedValue);
              }}
            />
            <button
              type="button"
              onClick={ createPrinciple }
              className="mt-2 mb-5 p-2 w-full text-center border-2 border-white text-white bg-black cursor-pointer font-bold hover:border-red-500 transition-colors"
            >
              { addPrinciple.data.description ? 'Atualizar': 'Adicionar' } Princípio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}