'use client'
import { useContext } from "react";
import dataForms from '../../data/forms.json';
import Image from 'next/image';
import contexto from "@/context/context";
import { updateDataPlayer, updateDataWithRage } from "@/firebase/players";
import { registerMessage } from "@/firebase/messagesAndRolls";
import { registerHistory } from "@/firebase/history";
import { capitalizeFirstLetter } from "@/firebase/utilities";

export default function Forms() {
  const {
    email,
    session,
    dataSheet,
    sessionId,
    sheetId,
    setShowMenuSession,
    setShowMessage,
  } = useContext(contexto);

  const updateValue = async (newForm: string) => {
    const actualForm = dataSheet.data.form;
    var findResilienciaDeLuna = dataSheet.data.advantagesAndFlaws.advantages.find((advantage: { title: string }) => advantage.title == 'Resiliência de Luna');
    if (newForm !== actualForm) {
      if (newForm === 'Hominídeo' || newForm === 'Lupino') {
        if (actualForm === 'Crinos') {
          dataSheet.data.attributes.strength -= 4;
          dataSheet.data.attributes.stamina -= 4;
          dataSheet.data.attributes.dexterity -= 4;
          if (dataSheet.data.rage > 0) {
            dataSheet.data.rage = 1;
            await registerMessage( sessionId, { message: `O personagem ${dataSheet.data.name} Mudou para a forma ${newForm}. Fúria reduzida para 1 por ter saído da forma Crinos.`, type: 'transform' }, email, setShowMessage);
            await registerHistory(session.id, { message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} alterou a Forma do personagem ${dataSheet.data.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}` : '' } de ${actualForm} para ${newForm} (Fúria reduzida para 1 por ter saído da forma Crinos.).`, type: 'notification' }, null, setShowMessage);
          }
        } else if (actualForm === 'Hispo' || actualForm === 'Glabro') {
          dataSheet.data.attributes.strength -= 2;
          dataSheet.data.attributes.dexterity -= 2;
          if (findResilienciaDeLuna) {
            dataSheet.data.attributes.stamina -= 4;
          } else dataSheet.data.attributes.stamina -= 2;
          await registerMessage( sessionId, { message: `O personagem ${dataSheet.data.name} Mudou para a forma ${newForm}.`, type: 'transform' }, email, setShowMessage);
          await registerHistory(session.id, { message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} alterou a Forma do personagem ${dataSheet.data.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}` : '' } de ${actualForm} para ${newForm}.`, type: 'notification' }, null, setShowMessage);
        } else {
          await registerMessage( sessionId, { message: `O personagem ${dataSheet.data.name} Mudou para a forma ${newForm}.`, type: 'transform' }, email, setShowMessage);
          await registerHistory(session.id, { message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} alterou a Forma do personagem ${dataSheet.data.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}` : '' } de ${actualForm} para ${newForm}.`, type: 'notification' }, null, setShowMessage);
        }
        dataSheet.data.form = newForm;
        await updateDataPlayer(sheetId, dataSheet, setShowMessage);
        setShowMenuSession('');
      } else if (newForm === 'Crinos') {
        if (dataSheet.data.rage < 2) {
          setShowMessage({show: true, text: `O personagem ${dataSheet.data.name} não possui Fúria para realizar esta ação (Mudar para a forma Crinos).`});
        } else {
          if (actualForm === 'Hominídeo' || actualForm === 'Lupino') {
            dataSheet.data.attributes.strength += 4;
            dataSheet.data.attributes.stamina += 4;
            dataSheet.data.attributes.dexterity += 4;
          } else if (actualForm === 'Hispo' || actualForm === 'Glabro') {
            dataSheet.data.attributes.strength += 2;
            dataSheet.data.attributes.dexterity += 2;
            if (!findResilienciaDeLuna) dataSheet.data.attributes.stamina += 2;
          }
          const oldRage = dataSheet.data.rage;
          dataSheet.data.form = newForm;
          await updateDataWithRage(sessionId, email, sheetId, dataSheet, newForm, setShowMessage);
          await registerHistory(session.id, { message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} alterou a Forma do personagem ${dataSheet.data.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}` : '' } de ${actualForm} para ${dataSheet.data.form} (${ oldRage === dataSheet.data.rage ? 'Não houve perda de Fúria' : `Fúria atualizada de ${oldRage} para ${dataSheet.data.rage}` }).`, type: 'notification' }, null, setShowMessage);
        }
        setShowMenuSession('');
      } else {
        if (dataSheet.data.rage < 1) {
          setShowMessage({show: true, text: `O personagem ${dataSheet.data.name} não possui Fúria para realizar esta ação (Mudar para a forma ${newForm}).`});
        } else {
          if (actualForm === 'Hominídeo' || actualForm === 'Lupino') {
            dataSheet.data.attributes.strength += 2;
            dataSheet.data.attributes.dexterity += 2;
            if (findResilienciaDeLuna) dataSheet.data.attributes.stamina += 4;
            else dataSheet.data.attributes.stamina += 2;
          } else if (actualForm === 'Crinos') {
            dataSheet.data.attributes.strength -= 2;
            dataSheet.data.attributes.dexterity -= 2;
            if (!findResilienciaDeLuna) dataSheet.data.attributes.stamina -= 2;
          }
          dataSheet.data.form = newForm;
          const oldRage = dataSheet.data.rage;
          await updateDataWithRage(sessionId, email, sheetId, dataSheet, newForm, setShowMessage);
          await registerHistory(session.id, { message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} alterou a Forma do personagem ${dataSheet.data.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}` : '' } de ${actualForm} para ${dataSheet.data.form} (${ oldRage === dataSheet.data.rage ? 'Não houve perda de Fúria' : `Fúria atualizada de ${oldRage} para ${dataSheet.data.rage}` }).`, type: 'notification' }, null, setShowMessage);
          setShowMenuSession('');
        }
      }
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
                  className={`mt-2 p-5 w-ful border-white border-2 cursor-pointer flex-col items-center justify-center ${dataSheet.data.form === form.name && 'bg-black'}`}
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