import Dice from "./dice";
import Message from "./message";

export default function MessageWithRoll(
  props: { msn: any, rollDices: any }
) {
  const { msn, rollDices } = props;
  return(
    <div className="p-2">
      <div className="p-2 flex gap-1 flex-wrap">
        {
          msn.rollOfRage.sort((a: any, b: any) => a - b).map((dice: any, index: number) => (
            <Dice key={ index } dice={ dice } type="(rage)" />
          ))
        }
        {
          msn.rollOfMargin.sort((a: any, b: any) => a - b).map((dice: any, index: number) => (
            <Dice key={ index } dice={ dice } type="" />
          ))
        }
      </div>
      <div>
        {
          rollDices.falhaBrutal
          ? rollDices.sucessosParaDano >= 0
            ? <Message rollDices={ rollDices } msn={ msn } type="success-rage" />
            : <Message rollDices={ rollDices } msn={ msn } type="fail" />
          : rollDices.sucessosParaDano >= 0
            ? <Message rollDices={ rollDices } msn={ msn } type="success" />
            : <Message rollDices={ rollDices } msn={ msn } type="fail" />
          }
      </div>
    </div>
  );
}