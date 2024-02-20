'use client'
import { updateDoc } from "firebase/firestore";
import { useState } from "react";
import { actionFeedback, useSlice } from "@/redux/slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IoAddCircle, IoArrowUpCircleSharp } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { getUserAndDataByIdSession } from "@/firebase/sessions";
import Feedback from "../feedback";

export default function ItemRituals(props: any) {
  const { index, ritual, remove } = props;
  const slice = useAppSelector(useSlice);
  const dispatch = useAppDispatch();
  const [showRitual, setShowRitual] = useState<boolean>(false);

  const addRitual = async () => {
    const getUser: any = await getUserAndDataByIdSession(slice.sessionId);
    const player = getUser.players.find((gp: any) => gp.email === slice.userData.email);
    if (player) {
      const filterRitual = player.data.rituals.find((item: any) => item.title === ritual.title);
      if (filterRitual) {
        window.alert("Este Ritual já está cadastrado na sua Ficha.")
      } else {
        player.data.rituals = [...player.data.rituals, ritual];
        const playersFiltered = getUser.players.filter((gp: any) => gp.email !== slice.userData.email);
        await updateDoc(getUser.sessionRef, { players: [...playersFiltered, player] });
        setShowRitual(false);
        window.alert(`Ritual '${ritual.titlePtBr}' adicionado com sucesso!`)
        }
    } else window.alert('Jogador não encontrado! Por favor, atualize a página e tente novamente');
  };

  const removeRitual = async () => {
    const getUser: any = await getUserAndDataByIdSession(slice.sessionId);
    const player = getUser.players.find((gp: any) => gp.email === slice.userData.email);
    if (player) {
      const filterRitual = player.data.rituals.filter((item: any) => item.title !== ritual.title);
      player.data.rituals = filterRitual;
      const playersFiltered = getUser.players.filter((gp: any) => gp.email !== slice.userData.email);
      await updateDoc(getUser.sessionRef, { players: [...playersFiltered, player] });
      setShowRitual(false);
      window.alert(`Ritual '${ritual.titlePtBr}' removido com sucesso!`)
    } else window.alert('Jogador não encontrado! Por favor, atualize a página e tente novamente');
    props.generateDataForRituals();
  };

  if(showRitual) return (
    <section key={index} className="border-2 border-white mb-2 relative min-h-screen">
      <div className="py-4 flex flex-col dataGifts-center sm:dataGifts-start w-full z-20 text-justify overflow-y-auto relative">
        <article className=" relative w-full h-full px-4 pb-4 pt-10 sm:p-10 text-white">
          <div className="flex flex-col justify-center items-center sm:items-start">
            <p className="font-bold text-center w-full text-sm">
              {`${ ritual.titlePtBr } (${ ritual.title }) - ${ ritual.type === 'social' ? "Social" : 'Comum' }`}
            </p>
            <hr className="w-10/12 my-4 sm:my-2" />
          </div>
          <p className="pt-1">
            <span className="text-sm font-bold pr-1">Fonte:</span>
            <span className="text-sm font-normal pr-1">
              { ritual.book }, pg. { ritual.page }.
            </span>
          </p>
          { ritual.pool !== "" &&
            <p className="pt-1">
              <span className="text-sm font-bold pr-1">Parada de Dados:</span>
              <span className="text-sm font-normal pr-1">
                { ritual.pool }.
              </span>
            </p>
          }
          <p className="pt-3 text-justify">
            <span className="text-sm font-bold pr-1">Descrição:</span>
            <span className="text-sm font-normal pr-1">
              { ritual.descriptionPtBr }
            </span>
          </p>
          <p className="pt-1 text-justify">
            <span className="text-sm font-bold pr-1">Sistema:</span>
            <span className="text-sm font-normal pr-1">
              { ritual.systemPtBr }
            </span>
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
            <IoAddCircle className="text-3xl text-white" />
          </button>
        }
        {
        remove && <button
          type="button"
          onClick={ removeRitual }
        >
          <MdDelete className="text-3xl text-white" />
        </button>
        }
        <button
          type="button"
          onClick={ () => setShowRitual(false) }
        >
          <IoArrowUpCircleSharp className="text-3xl text-white" />
        </button>
      </div>
      </div>
    </section>
  );
  return (
    <button
      className="border-2 border-white mb-2 p-2 py-6 w-full hover:bg-black transition-colors"
      type="button"
      onClick={() => setShowRitual(true)}
    >
      <h1 className="font-bold text-white text-normal text-center text-sm w-full px-2">
        {`${ ritual.titlePtBr } (${ ritual.title })`}
      </h1>
    </button>
  );
}