'use client'
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionForm, actionShowMenuSession, useSlice } from "@/redux/slice";
import { updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import dataForms from '../../data/forms.json';
import Image from 'next/image';
import { returnRageCheck } from "@/firebase/checks";
import { registerMessage } from "@/firebase/chatbot";
import { getUserAndDataByIdSession, getUserByIdSession } from "@/firebase/sessions";

export default function Forms() {
  const [ formSelected, setFormSelected ] = useState<any>('');
  const dispatch = useAppDispatch();
  const slice = useAppSelector(useSlice);

  useEffect(() => {
    returnValue();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const returnValue = async (): Promise<void> => {
    const player = await getUserByIdSession(
      slice.sessionId,
      slice.userData.email,
    );
    if (player) {
      setFormSelected(player.data.form);
    } else window.alert('Jogador não encontrado! Por favor, atualize a página e tente novamente');
  };

  const updateValue = async (nameForm: string) => {
    const getUser: any = await getUserAndDataByIdSession(slice.sessionId);
    const player = getUser.players.find((gp: any) => gp.email === slice.userData.email);
    if (player) {
      if (nameForm !== formSelected) {
        if (nameForm === 'Hominídeo' || nameForm === 'Lupino') {
          await registerMessage({
            message: `Mudou para a forma ${nameForm}.`,
            user: slice.userData.name,
            email: slice.userData.email,
          }, slice.sessionId);
        }
        if (nameForm === 'Crinos') await returnRageCheck(2, nameForm, slice.sessionId, slice.userData);
        if (nameForm === 'Glabro' || nameForm === 'Hispo') await returnRageCheck(1, nameForm, slice.sessionId, slice.userData);
      }
      if (player.data.form === "Crinos") {
        if (player.data.rage > 0) {
          player.data.rage = 1;
          await registerMessage({
            message: 'Fúria reduzida para 1 por ter saído da forma Crinos.',
            user: slice.userData.name,
            email: slice.userData.email,
          }, slice.sessionId);
        }
      }
      dispatch(actionShowMenuSession(''))
      player.data.form = nameForm;
      const playersFiltered = getUser.players.filter((gp: any) => gp.email !== slice.userData.email);
      await updateDoc(getUser.sessionRef, { players: [...playersFiltered, player] });
      dispatch(actionForm(nameForm));
      returnValue();
    } else window.alert('Jogador não encontrado! Por favor, atualize a página e tente novamente');
  };

  return(
    <div className="flex flex-col w-full overflow-y-auto pr-2 h-full mb-3">
      <div className="w-full h-full mb-2 flex-col items-start justify-center font-bold">
        <div className="w-full mt-2 text-black">
          <div className="w-full"> 
            {
              dataForms.map((form: any, index) => (
                <div
                  key={index}
                  className={`mt-2 p-5 w-ful border-white border-2 cursor-pointer flex-col items-center justify-center ${formSelected === form.name && 'bg-black'}`}
                  onClick={ () => updateValue(form.name) }
                >
                  <div className="w-full flex items-center justify-center">
                  <Image
                    src={`/images/forms/${form.name}-white.png`}
                    alt={`Glifo dos ${form.name}`}
                    className="object-cover object-top w-32 my-2"
                    width={800}
                    height={400}
                  />
                  </div>
                  <p className="w-full text-center py-2 text-white">{ form.name } - { form.subtitle }</p>
                  <ul className="pl-5 text-sm font-normal text-white">
                      <li className="list-disc">
                        {
                          form.cost === 'Nenhum.'
                            ? 'Nenhum Teste de Fúria'
                            : form.cost
                        }
                      </li>
                    {
                      form.resume.map((item: string, index: number) => (
                        <li className="list-disc" key={index}>
                          { item }
                        </li>
                      ))
                    }
                  </ul>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}