import Image from 'next/image';

export default function Dice(props: { dice: number, type: string }) {
  const { dice, type } = props;
  let imgItem = '';
  if (Number(dice) === 10) {
    imgItem = `critical${type}.png`;
  } else if (Number(dice) > 2 && Number(dice) < 6) {
    imgItem = `falha${type}.png`;
  } else if (Number(dice) > 5 && Number(dice) < 10) {
    imgItem = `success${type}.png`;
  } else {
    imgItem = `brutal${type}.png`;
  }
  return (
    <div className="flex flex-col items-center justify-center">
      <Image
        alt={`Dado representando o valor ${dice}`}
        src={`/images/dices/${imgItem}`}
        width={500}
        height={500}
        className="w-10 sm:w-14"
      />
    </div>
  );
}