import { IMessage } from "@/interface";
import Dice from "./dice";

export default function Message(props: any) {
  const { rollDices, msn, type } = props;
  if (msn.roll === 'false') {

  }
  if (type === 'fail') {
    return(
      <div>
        {`Falhou no teste, pois a dificuldade era ${Number(msn.dificulty)} e número de sucessos foi ${Number(rollDices.paresBrutais + rollDices.paresCriticals + rollDices.success)}. `}
      </div>
    );
  } if (type ==="rage-check") {
    return(
      <div className="p-2">
        <div className="flex gap-1 flex-wrap">
          {
            msn.rollOfRage.sort((a: any, b: any) => a - b).map((dice: any, index: any) => (
              <Dice key={ index } dice={ dice } type="(rage)" />
            ))
          }
        </div>
        <div className="w-full">
          <div className="font-bold pt-4 pb-2 text-left">
            { `${ msn.rollOfRage.length === 2 ? 'Foram realizados 2 Testes de Fúria': msn.rollOfRage.length === 1 ? 'Foi realizado um Teste de Fúria' : `Foram realizados ${msn.rollOfRage.length} Testes de Fúria`} ${ msn.cause !== 'manual' ? ` por mudar para a forma ${msn.cause}` : '!' }`}
          </div>
          <div className="pb-2 text-left">
            { msn.success === 1 && <span>
              {
                msn.rollOfRage.length == 2
                  ? `Obteve 1 sucesso no Teste. A Fúria foi reduzida em 1.`
                  : msn.rollOfRage.length === 1 
                    ? `Obteve ${msn.success} sucesso no Teste. Não houve redução na Fúria.`
                    : `Obteve sucesso no Teste.`
              }
              </span>}
            { msn.success > 2 && <span>{`Obteve ${msn.success} sucessos no Teste.`}</span> }
            { msn.success === 2 && <span>Obteve 2 sucessos no Teste. Não houve redução na Fúria.</span> }
            { msn.success === 0 && <span>Não obteve sucesso no Teste. A fúria foi reduzida em {msn.rollOfRage.length}.</span> }
            <div className="font-bold py-3">Fúria Atual: {msn.rage}</div>
          </div>
        </div>
    </div>
    );
  } return(
    <div className="w-full">
      <div className="font-bold py-2 text-left">
        { type === 'success-rage'
          ? 'Obteve sucesso se a ação foi CAUSAR DANO (Caso contrário, ocorreu uma falha brutal)'
          : 'Obteve sucesso no teste!'
        }
      </div>
      <div className="flex justify-start items-center">
          <span className="">{`Sucessos: `}</span>
          <span className="font-bold px-3">
            { rollDices.paresBrutais + rollDices.paresCriticals + rollDices.success }
          </span>
      </div>
      <div className="flex jufy-start items-center">
        <span className="">{`Dificuldade: `}</span>
        <span className="font-bold px-3">
          {Number(msn.dificulty)}
        </span>
      </div>
      <div className="flex tify-start items-center w-full flex-wrap">
        <span className="">{`Excedente: `}</span>
        <span className="font-bold px-3">
          {Number(rollDices.sucessosParaDano) <= 0 ? 'Nenhum' : rollDices.sucessosParaDano + 1}
        </span>
      </div>
    </div>
  );
}