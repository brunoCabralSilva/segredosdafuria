'use client'
import { useContext } from "react";
import dataForms from '../../data/forms.json';
import Image from 'next/image';
import contexto from "@/context/context";
import { getPlayerByEmail, updateDataPlayer, updateDataWithRage } from "@/firebase/players";
import { registerMessage } from "@/firebase/messagesAndRolls";

export default function Forms() {
  const {
    email,
    dataSheet,
    sessionId,
    setShowMenuSession,
    setShowMessage,
  } = useContext(contexto);

  const updateValue = async (newForm: string) => {
    const player: any = await getPlayerByEmail(sessionId, email, setShowMessage);
    const actualForm = player.data.form;
    if (newForm !== actualForm) {
      if (newForm === 'Hominídeo' || newForm === 'Lupino') {
        if (actualForm === 'Crinos') {
          player.data.attributes.strength -= 4;
          player.data.attributes.stamina -= 4;
          player.data.attributes.dexterity -= 4;
          if (player.data.rage > 0) {
            player.data.rage = 1;
            await registerMessage( sessionId, { message: `Mudou para a forma ${newForm}. Fúria reduzida para 1 por ter saído da forma Crinos.`, type: 'transform' }, email, setShowMessage);
          }
        } else if (actualForm === 'Hispo' || actualForm === 'Glabro') {
          player.data.attributes.strength -= 2;
          player.data.attributes.stamina -= 2;
          player.data.attributes.dexterity -= 2;
          await registerMessage( sessionId, { message: `Mudou para a forma ${newForm}.`, type: 'transform' }, email, setShowMessage);
        } else {
          await registerMessage( sessionId, { message: `Mudou para a forma ${newForm}.`, type: 'transform' }, email, setShowMessage);
        }
        player.data.form = newForm;
        await updateDataPlayer(sessionId, email, player.data, setShowMessage);
      } else if (newForm === 'Crinos') {
        if (player.data.rage < 2) {
          await registerMessage( sessionId, { message: 'Você não possui Fúria para realizar esta ação (Mudar para a forma Crinos).', type: 'rage check' }, email, setShowMessage);
        } else {
          if (actualForm === 'Hominídeo' || actualForm === 'Lupino') {
            player.data.attributes.strength += 4;
            player.data.attributes.stamina += 4;
            player.data.attributes.dexterity += 4;
          } else if (actualForm === 'Hispo' || actualForm === 'Glabro') {
            player.data.attributes.strength += 2;
            player.data.attributes.stamina += 2;
            player.data.attributes.dexterity += 2;
          }
          player.data.form = newForm;
          await updateDataWithRage(sessionId, email, player.data, newForm, setShowMessage);
        }
      } else {
        if (player.data.rage < 1) {
          await registerMessage( sessionId, { message: `Você não possui Fúria para realizar esta ação (Mudar para a forma ${newForm}).`, type: 'rage check' }, email, setShowMessage);
        } else {
          if (actualForm === 'Hominídeo' || actualForm === 'Lupino') {
            player.data.attributes.strength += 2;
            player.data.attributes.stamina += 2;
            player.data.attributes.dexterity += 2;
          } else if (actualForm === 'Crinos') {
            player.data.attributes.strength -= 2;
            player.data.attributes.stamina -= 2;
            player.data.attributes.dexterity -= 2;
          }
          player.data.form = newForm;
          await updateDataWithRage(sessionId, email, player.data, newForm, setShowMessage);
        }
      }
      setShowMenuSession('');
    }
  };

  return(
    <div className="flex flex-col w-full pr-2 h-75vh overflow-y-auto">
      <div className="w-full h-full mb-2 flex-col items-start justify-center font-bold">
        <div className="w-full mt-2 text-black">
          <div className="w-full pb-5"> 
            {
              dataForms.map((form: any, index: number) => (
                <div
                  key={index}
                  className={`mt-2 p-5 w-ful border-white border-2 cursor-pointer flex-col items-center justify-center ${dataSheet.form === form.name && 'bg-black'}`}
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