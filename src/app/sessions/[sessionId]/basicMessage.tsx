export default function BasicMessage(props: { msn: any }) {
  const { msn } = props;
  return (
    <div>
      <div className="flex flex-col justify-center">
        <h1 className="text-center text-sm font-bold w-full">
          {`${ msn.giftPtBr } (${ msn.gift })`}
        </h1>
        <hr className="w-full my-4" />
      </div>
      <p className="pt-1">
        <span className="text-sm font-bold pr-1">Custo:</span>
        <span className="text-sm font-normal">{ msn.cost } (Possíveis Testes de Fúria e gastos de Força de Vontade são feitos automaticamente).</span>
      </p>
      <p className="pt-1">
        <span className="text-sm font-bold pr-1">Ação:</span>
        <span className="text-sm font-normal">{ msn.action }.</span>
      </p>
      { msn.pool !== "" &&
        <p className="pt-1">
          <span className="text-sm font-bold pr-1">Parada de Dados:</span>
          <span className="text-sm font-normal">{ msn.pool }.</span></p>
      }
      { msn.duration !== "" &&
        <p className="pt-1">
          <span className="text-sm font-bold pr-1">Duração:</span>
          <span className="text-sm font-normal">{ msn.duration }.</span>
        </p>
      }
      <p className="pt-1 text-justify mt-2">
        <span className="text-sm font-bold pr-1">Sistema:</span>
        <span className="text-sm font-normal">{ msn.system }</span>
      </p>
    </div>
  )
}