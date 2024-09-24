import Image from 'next/image';
import dataForms from '../../data/forms.json';
import { updateDataPlayer, updateDataWithRage } from '@/firebase/players';
import { registerMessage } from '@/firebase/messagesAndRolls';
import { useContext } from 'react';
import contexto from '@/context/context';

export default function SheetForms(props: { player: any }) {
  const { player } = props;

  const {
    session,
    showPlayer,
    players,
    setShowMessage,
    setShowMenuSession,
  } = useContext(contexto);

  const updateValue = async (newForm: string) => {

    const player: any = players.find((item: any) => item.data.email = showPlayer.email);
    const actualForm = player.data.form;
    if (newForm !== actualForm) {
      if (newForm === 'Hominídeo' || newForm === 'Lupino') {
        if (actualForm === 'Crinos') {
          player.data.attributes.strength -= 4;
          player.data.attributes.stamina -= 4;
          player.data.attributes.dexterity -= 4;
          if (player.data.rage > 0) {
            player.data.rage = 1;
            await registerMessage( session.id, { message: `Mudou para a forma ${newForm}. Fúria reduzida para 1 por ter saído da forma Crinos.`, type: 'transform' }, showPlayer.email, setShowMessage);
          }
        } else if (actualForm === 'Hispo' || actualForm === 'Glabro') {
          player.data.attributes.strength -= 2;
          player.data.attributes.stamina -= 2;
          player.data.attributes.dexterity -= 2;
          await registerMessage( session.id, { message: `Mudou para a forma ${newForm}.`, type: 'transform' }, showPlayer.email, setShowMessage);
        } else {
          await registerMessage( session.id, { message: `Mudou para a forma ${newForm}.`, type: 'transform' }, showPlayer.email, setShowMessage);
        }
        player.data.form = newForm;
        await updateDataPlayer(session.id, showPlayer.email, player.data, setShowMessage);
      } else if (newForm === 'Crinos') {
        if (player.data.rage < 2) {
          await registerMessage( session.id, { message: 'Você não possui Fúria para realizar esta ação (Mudar para a forma Crinos).', type: 'rage check' }, showPlayer.email, setShowMessage);
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
          await updateDataWithRage(session.id, showPlayer.email, player.data, newForm, setShowMessage);
        }
      } else {
        if (player.data.rage < 1) {
          await registerMessage( session.id, { message: `Você não possui Fúria para realizar esta ação (Mudar para a forma ${newForm}).`, type: 'rage check' }, showPlayer.email, setShowMessage);
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
          await updateDataWithRage(session.id, showPlayer.email, player.data, newForm, setShowMessage);
        }
      }
      setShowMenuSession('');
    }
  };

  return(
    <div className="mb-2 flex-col items-start justify-center font-bold mt-2 text-black w-full pb-5 gap-2"> 
      <div className="pb-3 font-bold text-2xl text-white">Formas</div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 h-full">
        {
          dataForms.map((form: any, index: number) => (
            <div
              key={index}
              className={`mt-2 p-2 w-ful border-white border-2 cursor-pointer items-center justify-center ${player.data.form === form.name && 'bg-black'}`}
              onClick={ () => updateValue(form.name) }
            >
              <div className="w-full h-full flex flex-col items-center justify-between">
                <Image
                  src={`/images/forms/${form.name}-white.png`}
                  alt={`Glifo dos ${form.name}`}
                  className="object-cover object-top w-32 my-2"
                  width={800}
                  height={400}
                />
                <p className="w-full py-2 text-white text-center text-lg">{ form.name }</p>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}