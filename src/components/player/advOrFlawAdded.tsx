import contexto from "@/context/context";
import { useContext } from "react";

export default function AdvOrFlawAdded(props: { type: string }) {
  const { type } = props;
  const { dataSheet } = useContext(contexto);

  const returnColor = (type: string) => {
    if (type === 'advantage') {
      const value = dataSheet.data.advantagesAndFlaws.advantages.reduce((total: number, item: any) => total + Number(item.cost), 0) + dataSheet.data.advantagesAndFlaws.talens.reduce((total: number, item: any) => total + Number(item.value), 0) + dataSheet.data.advantagesAndFlaws.loresheets.reduce((total: number, item: any) => total + Number(item.cost), 0);
      if (value > 7) return 'text-red-500';
      else if (value === 7) return 'text-green-500';
      return '';
    } else {
      const value = dataSheet.data.advantagesAndFlaws.flaws.reduce((total: number, item: any) => total + Number(item.cost), 0);
      if (value > 2) return 'text-red-500';
      else if (value === 2) return 'text-green-500';
    }
  }

  return (
    <div className="bg-gray-whats-dark w-full h-full overflow-y-auto p-5">
      <p className="capitalize text-lg pb-3 font-bold">
      {
        type === 'advantage' &&
        <p>
          <span>Total em Vantagens:</span>
          <span className={`pl-2 ${returnColor('advantage')}` }>
          { 
            dataSheet.data.advantagesAndFlaws.advantages.reduce((total: number, item: any) => total + Number(item.cost), 0) + dataSheet.data.advantagesAndFlaws.talens.reduce((total: number, item: any) => total + Number(item.value), 0) + dataSheet.data.advantagesAndFlaws.loresheets.reduce((total: number, item: any) => total + Number(item.cost), 0)
          }  / 7
          </span>
        </p>
      }
      {
        type === 'flaw' &&
        <p>
          <span>Total em Desvantagens:</span>
          <span className={`pl-2 ${returnColor('flaw')}` }>
          { 
            dataSheet.data.advantagesAndFlaws.flaws.reduce((total: number, item: any) => total + Number(item.cost), 0)
          }  / 2
          </span>
        </p>
      }
      </p>
      {
        type === 'advantage'
        && dataSheet.data.advantagesAndFlaws.advantages.length > 0
        && <div className="py-2">
            <p>Méritos e Backgrounds</p>
            <hr />
          </div>
      }
      {
        type === 'advantage' &&
        dataSheet.data.advantagesAndFlaws.advantages
          .sort((a: any, b: any) => a.name.localeCompare(b.name))
          .map((item: any, index: number) => (
          <div key={index} className="bg-gray-whats">
            <p className="text-base">
              <span className="pr-1">{ item.name }</span> { item.title && `- ${item.title}` } - { item.cost }
            </p>
          </div>
        ))
      }
      {
        type === 'advantage'
        && dataSheet.data.advantagesAndFlaws.talens.length > 0
        && <div className="py-2">
            <p>Talismãs</p>
            <hr />
          </div>
      }
      {
        type === 'advantage' &&
        dataSheet.data.advantagesAndFlaws.talens
          .sort((a: any, b: any) => a.name.localeCompare(b.name))
          .map((item: any, index: number) => (
          <div key={index} className="bg-gray-whats-dark">
            <p className="text-base">
              <span className="pr-1">{ item.name }</span> - { item.value } - { item.type }
            </p>
          </div>
        ))
      }
      {
        type === 'advantage'
        && dataSheet.data.advantagesAndFlaws.loresheets.length > 0
        && <div className="py-2">
            <p>Loresheets</p>
            <hr />
          </div>
      }
      {
        type === 'advantage' &&
        dataSheet.data.advantagesAndFlaws.loresheets
          .sort((a: any, b: any) => a.name.localeCompare(b.name))
          .map((item: any, index: number) => (
          <div key={index} className="bg-gray-whats">
            <p className="text-base">
              <span className="pr-1">{ item.name }</span> - { item.cost }
            </p>
          </div>
        ))
      }
      {
        type === 'flaw' &&
        dataSheet.data.advantagesAndFlaws.flaws
          .sort((a: any, b: any) => a.name.localeCompare(b.name))
          .map((item: any, index: number) => (
          <div key={index} className="bg-gray-whats">
            <p className="text-base">
              <span className="pr-1 font-bold">{ item.name }</span> { item.title && `- ${item.title}` } - { item.cost }
            </p>
          </div>
        ))
      }
    </div>
  );
}