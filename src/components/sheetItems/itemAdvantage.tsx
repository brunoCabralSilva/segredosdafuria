import { registerHistory } from '@/firebase/history';
import dataAdvAndFlaws from '../../data/advantagesAndFlaws.json';
import contexto from "@/context/context";
import { updateDataPlayer } from '@/firebase/players';
import { useContext, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { capitalizeFirstLetter } from '@/firebase/utilities';

export default function ItemAdvantage(props: { item: any, type: string }) {
  const { type, item } = props;
  const [showAdvantage, setShowAdvantage] = useState(false);
  const {
    email,
    session,
    sheetId,
    dataSheet,
    setShowMessage,
  } = useContext(contexto);

  const updateAdvantageOrFlaw = async (
    name: string,
    cost: string,
    type: string,
    description: string,
    title: string,
    advOfFlaw: string,
  ) => {
    const obj = { name, cost, description, type, title };

    const aliadosEfetividade = dataSheet.data.advantagesAndFlaws.advantages.find((adv: { cost: number, description: string, name: string, title: string, type: string }) => adv.name == 'Aliados - Efetividade');

    const pactoEspiritual = dataSheet.data.advantagesAndFlaws.advantages.find((adv: { cost: number, description: string, name: string, title: string, type: string }) => adv.name == 'Pacto Espiritual');

    if (name === 'Aliados - Confiabilidade' && !aliadosEfetividade) {
      setShowMessage({ show: true, text: 'A Vantagem "Aliados - Confiabilidade" só pode ser adquirida caso o personagem possua pelo menos 1 ponto em "Aliados - Efetividade".' });
    } else if ((title === 'Acompanhante' || title === 'Hospedeiro') && !pactoEspiritual) {
      setShowMessage({ show: true, text: 'A Vantagem "' + title + '" só pode ser adquirida caso o personagem possua pelo menos 1 ponto em "Pacto Espiritual - Espírito de Poder 1 / gafarete menor".' });
    } else if (title === 'Pacto Condicional' && !pactoEspiritual) {
      setShowMessage({ show: true, text: 'O Defeito "Pacto Condicional" só pode ser adquirido caso o personagem possua pelo menos 1 ponto em "Pacto Espiritual - Espírito de Poder 1 / gafarete menor".' });
    } else {
      let newList: any = [];
      let dataPersist = '';
      if (advOfFlaw === 'flaw') {
        newList = dataSheet.data.advantagesAndFlaws.flaws;
        const findFlaw = dataSheet.data.advantagesAndFlaws.flaws.filter((flaw: any) => flaw.name === name);
        dataPersist = findFlaw
        .map((flaw: any) => {
          let label = flaw.title || flaw.description;
          return `"${label} (${flaw.cost})"`;
        })
        .join(', ')
        .replace(/, ([^,]+)$/, ' e $1');
      } else {
        newList = dataSheet.data.advantagesAndFlaws.advantages;
        const findAdvantage = dataSheet.data.advantagesAndFlaws.advantages.filter((adv: any) => adv.name === name);
        dataPersist = findAdvantage
        .map((adv: any) => {
          let label = adv.title || adv.description;
          return `"${label} (${adv.cost})"`;
        })
        .join(', ')
        .replace(/, ([^,]+)$/, ' e $1');
      }

      if (newList.length === 0) newList.push(obj);
      else {
        const sameName = newList.filter((item: any) => item.name === name);
        if (sameName.length > 0) {
          const equal = newList.find((item: any) => item.description === description);
          if (equal) {
            newList = newList.filter((item: any) => item.description !== description);
          } else {
            if (type === 'radio') {
              newList = newList.filter((item: any) => item.name !== name || (item.name === name && item.type !== 'radio'));
              newList.push(obj);
            } else newList.push(obj);
          }
        } else newList.push(obj);
      }

      if (name === 'Aliados - Efetividade') {
        newList = newList.filter((item: any) => item.name !== 'Aliados - Confiabilidade');
      }

      const titlePactoEspiritual = title === 'Espírito de Poder 5 / jagrete médio' || title === 'Espírito de Poder 4 / jagrete menor' || title === 'Espírito de Poder 3 / gafarete maior ou jagrete inferior' || title === 'Espírito de Poder 2 / gafarete médio' || title === 'Espírito de Poder 1 / gafarete menor';

      if (titlePactoEspiritual) {
        newList = newList.filter((item: any) => item.title !== 'Acompanhante' && item.title !== 'Hospedeiro');

        dataSheet.data.advantagesAndFlaws.flaws =
    dataSheet.data.advantagesAndFlaws.flaws.filter((flaw: any) => flaw.title !== 'Pacto Condicional');
      }

      if (advOfFlaw === 'flaw') dataSheet.data.advantagesAndFlaws.flaws = newList;
      else dataSheet.data.advantagesAndFlaws.advantages = newList;
      await updateDataPlayer(sheetId, dataSheet, setShowMessage);
  
      let newPersist = '';
      if (advOfFlaw === 'flaw') {
        const findFlaw = dataSheet.data.advantagesAndFlaws.flaws.filter((flaw: any) => flaw.name === name);
        newPersist = findFlaw
        .map((flaw: any) => {
          let label = flaw.title || flaw.description;
          return `"${label} (${flaw.cost})"`;
        })
        .join(', ')
        .replace(/, ([^,]+)$/, ' e $1');
      } else {
        const findAdvantage = dataSheet.data.advantagesAndFlaws.advantages.filter((adv: any) => adv.name === name);
        newPersist = findAdvantage
          .map((flaw: any) => {
            let label = flaw.title || flaw.description;
            return `"${label} (${flaw.cost})"`;
          })
          .join(', ')
          .replace(/, ([^,]+)$/, ' e $1');
      }
      await registerHistory(session.id, { message: `${session.gameMaster === email ? 'O Narrador' : capitalizeFirstLetter(dataSheet.user)} alterou o ${advOfFlaw === 'flaw' ? 'Defeito' : 'Mérito/Background'} ${name} do personagem ${dataSheet.data.name}${dataSheet.email !== email ? ` do jogador ${capitalizeFirstLetter(dataSheet.user)}` : '' } de ${dataPersist === '' ? "''" : dataPersist} para ${newPersist === '' ? "''" : newPersist}.`, type: 'notification' }, null, setShowMessage);
    }
  }

  const verifySelected = () => {
    if (type === 'flaw') {
      return item.flaws.find((adv: any) => {
        return dataSheet.data.advantagesAndFlaws.flaws.find((item2: any) => item2.description === adv.description)
      });
    }
    return item.advantages.find((adv: any) => {
      return dataSheet.data.advantagesAndFlaws.advantages.find((item2: any) => item2.description === adv.description)
    });
  }

  return (
    <div>
      {
        type === 'advantage' &&
        dataAdvAndFlaws &&
          <div className={`${verifySelected() && !showAdvantage ? 'bg-black border-2 border-red-500' : 'bg-gray-whats-dark border-2 border-white'} `}>
            <button
              type="button"
              onClick={ () => setShowAdvantage(!showAdvantage)}
              className="capitalize p-4 font-bold flex w-full justify-between items-center "
            >
              <p className="text-base sm:text-lg w-full text-left">{ item.name }</p>
              { showAdvantage
                ? <IoIosArrowUp  />
                : <IoIosArrowDown />
              }
            </button>
            {
              showAdvantage &&
              <div className="px-4 pb-4">
              <p>{ item.description }</p>
              {
                item.advantages
                .map((adv: any, index2: number) => (
                  <div
                    key={index2}
                    onClick={() => {
                      updateAdvantageOrFlaw(item.name, adv.cost, adv.type, adv.description, adv.title, 'advantage') 
                    }}
                    className={`${dataSheet.data.advantagesAndFlaws.advantages.find((item2: any) => item2.description === adv.description) ? 'bg-black border-2 border-red-500' : 'border-2 border-white'} mt-3 pt-3 p-4 cursor-pointer`}
                  >
                    <p>Custo { adv.cost } - { adv.description }</p>
                  </div>
                ))
              }
              </div>
            }
          </div>
        }
        {
          type === 'flaw' &&
          dataAdvAndFlaws &&
          <div className={`${verifySelected() && !showAdvantage ? 'bg-black border-2 border-red-500' : 'border-2 border-white bg-gray-whats-dark'}`}>
            <button
              type="button"
              onClick={ () => setShowAdvantage(!showAdvantage)}
              className="capitalize p-4 font-bold flex w-full justify-between items-center "
            >
              <p className="text-base sm:text-lg w-full text-left">{ item.name }</p>
              { showAdvantage
                ? <IoIosArrowUp  />
                : <IoIosArrowDown />
              }
            </button>
            {
              showAdvantage &&
              <div className="px-4 pb-4">
                <p>{ item.description }</p>
                {
                  item.flaws
                  .map((adv: any, index2: number) => (
                    <div
                      key={index2}
                      onClick={() => {
                        updateAdvantageOrFlaw(item.name, adv.cost, adv.type, adv.description, adv.title, 'flaw')
                      }}
                      className={`${dataSheet.data.advantagesAndFlaws.flaws.find((item2: any) => item2.description === adv.description) ? 'bg-black border-2 border-red-500' : 'border-2 border-white'} mt-3 pt-3 p-4 cursor-pointer`}
                    >
                      <p>Custo { adv.cost } - { adv.description }</p>
                    </div>
                  ))
                }
              </div>
            }
          </div>
        }
    </div>
  );
}