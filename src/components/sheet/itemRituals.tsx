import Image from "next/image";
import { collection, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { useState } from "react";
import { actionFeedback, useSlice } from "@/redux/slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Feedback from "../feedback";
import { IoAddCircle, IoArrowUpCircleSharp } from "react-icons/io5";
import firebaseConfig from "@/firebase/connection";
import { jwtDecode } from "jwt-decode";
import { MdDelete } from "react-icons/md";

export default function ItemRituals(props: any) {
  const slice = useAppSelector(useSlice);
  const dispatch = useAppDispatch();
  const { index, ritual, remove } = props;
  const [showRitual, setShowRitual] = useState<boolean>(false);

  const isEmpty = (obj: any) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  };

  const addRitual = async () => {
    const db = getFirestore(firebaseConfig);
    const token = localStorage.getItem('Segredos Da Fúria');
    if (token) {
      try {
        const decodedToken: { email: string } = jwtDecode(token);
        const { email } = decodedToken;
        const userQuery = query(collection(db, 'users'), where('email', '==', email));
        const userQuerySnapshot = await getDocs(userQuery);
        if (!isEmpty(userQuerySnapshot.docs)) {
          const userDocRef = userQuerySnapshot.docs[0].ref;
          const userData = userQuerySnapshot.docs[0].data();
          if (userData.characterSheet && userData.characterSheet.length > 0) {
            const filterRitual = userData.characterSheet[0].data.rituals.find((item: any) => item.title === ritual.title);
            if (filterRitual) {
              window.alert("Este Ritual já está cadastrado na sua Ficha.")
            } else {
              userData.characterSheet[0].data.rituals = [...userData.characterSheet[0].data.rituals, ritual];
              await updateDoc(userDocRef, { characterSheet: userData.characterSheet });
              setShowRitual(false);
              window.alert(`Dom '${ritual.titlePtBr}' adicionado com sucesso!`)
            }
          }
        } else {
          window.alert('Nenhum documento de usuário encontrado com o email fornecido.');
        }
      } catch (error) {
        window.alert('Erro ao atualizar Ritual: (' + error + ')');
      }
    }
  };

  const removeRitual = async () => {
    const db = getFirestore(firebaseConfig);
    const token = localStorage.getItem('Segredos Da Fúria');
    if (token) {
      try {
        const decodedToken: { email: string } = jwtDecode(token);
        const { email } = decodedToken;
        const userQuery = query(collection(db, 'users'), where('email', '==', email));
        const userQuerySnapshot = await getDocs(userQuery);
        if (!isEmpty(userQuerySnapshot.docs)) {
          const userDocRef = userQuerySnapshot.docs[0].ref;
          const userData = userQuerySnapshot.docs[0].data();
          if (userData.characterSheet && userData.characterSheet.length > 0) {
            userData.characterSheet[0].data.rituals = userData.characterSheet[0].data.rituals.filter((item: any) => item.title !== ritual.title );
            await updateDoc(userDocRef, { characterSheet: userData.characterSheet });
          }
          setShowRitual(false);
          window.alert(`Ritual '${ritual.titlePtBr}' removido com sucesso!`)
        } else {
          window.alert('Nenhum documento de usuário encontrado com o email fornecido.');
        }
      } catch (error) {
        window.alert('Erro ao atualizar Ritual: (' + error + ')');
      }
    }
    props.generateDataForRituals();
  };

  if(showRitual) return (
    <section key={index} className="bg-white mb-2 relative min-h-screen">
      <div className="py-4 flex flex-col dataGifts-center sm:dataGifts-start w-full z-20 text-justify overflow-y-auto relative">
        <article className=" relative w-full h-full px-4 pb-4 pt-10 sm:p-10 text-black">
          <div className="flex flex-col justify-center items-center sm:items-start">
            <h1 className="font-bold text-lg text-center w-full">
              {`${ ritual.titlePtBr } (${ ritual.title }) - ${ ritual.type === 'social' ? "Social" : 'Comum' }`}
            </h1>
            <hr className="w-10/12 my-4 sm:my-2" />
          </div>
          <p className="pt-1">
            <span className="font-bold pr-1">Fonte:</span>
            { ritual.book }, pg. { ritual.page }.
          </p>
          { ritual.pool !== "" &&
            <p className="pt-1">
              <span className="font-bold pr-1">Parada de Dados:</span>
              { ritual.pool }.
            </p>
          }
          <p className="pt-3 text-justify">
            <span className="font-bold pr-1">Descrição:</span>
            { ritual.descriptionPtBr }
          </p>
          <p className="pt-1 text-justify">
            <span className="font-bold pr-1">Sistema:</span>
            { ritual.systemPtBr }
          </p>
          <p className="pt-3 text-justify">
            <span className="font-bold pr-1">Description (original):</span>
            { ritual.description }
          </p>
          <p className="pt-1 text-justify">
            <span className="font-bold pr-1">System (original):</span>
            { ritual.system }
          </p>
          <div className="flex flex-col sm:flex-row sm:justify-between">
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between">
          <button
            type="button"
            className={ !slice.simplify ? 'text-orange-300 hover:text-orange-600 transition-colors duration-300 mt-5 cursor-pointer underline' : 'bg-white text-black p-2 font-bold mt-3'}
            onClick={() => dispatch(actionFeedback({ show: true, message: ritual.title })) }
          >
            Enviar Feedback
          </button>
          </div>
          { slice.feedback.show && <Feedback title={ ritual.title } /> }
        </article>
        <div className="absolute top-0 right-0 text-black flex p-2 gap-3">
        {
          !remove &&
          <button
            type="button"
            onClick={ () => addRitual() }
          >
            <IoAddCircle className="text-3xl" />
          </button>
        }
        {
        remove && <button
          type="button"
          onClick={ removeRitual }
        >
          <MdDelete className="text-3xl" />
        </button>
        }
        <button
          type="button"
          onClick={ () => setShowRitual(false) }
        >
          <IoArrowUpCircleSharp className="text-3xl" />
        </button>
      </div>
      </div>
    </section>
  );
  return (
    <button
      className="bg-white mb-2 p-2 py-3 w-full"
      type="button"
      onClick={() => setShowRitual(true)}
    >
      <h1 className="font-bold text-lg text-center w-full text-black">
        {`${ ritual.titlePtBr } (${ ritual.title })`}
      </h1>
    </button>
  );
}