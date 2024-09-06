import Dice from "./dice";

export default function Message(props: { index: number, dataMessage: any, color: string }) {
	const { index, dataMessage, color } = props;
	switch(dataMessage.type) {
		case 'text':
			return(
				<div key={index} className={`w-full flex ${color === 'green' ? 'justify-end' : 'justify-start' } text-white`}>
					<div className={`${color === 'green' ? 'bg-green-whats': 'bg-gray-whats'} rounded-xl w-11/12 sm:w-7/12 md:w-7/12 p-2 mb-2 pl-3`}>
						{
							color === 'gray' &&
							<div className="pb-2 capitalize font-bold flex items-center gap-2">
								{ dataMessage.user }
							</div>
						}
						<div>
							{ dataMessage.message }
						</div>
						<div className="flex justify-end pt-2">
							<span className="w-full text-right text-sm flex justify-end">
								{ dataMessage.date && dataMessage.date }
							</span>
						</div>
					</div>
				</div>		
			);
		case 'roll':
			return(
				<div key={index} className={`w-full flex ${color === 'green' ? 'justify-end' : 'justify-start' } text-white`}>
					<div className={`${color === 'green' ? 'bg-green-whats': 'bg-gray-whats'} rounded-xl w-11/12 sm:w-7/12 md:w-7/12 p-2 mb-2 pl-3`}>
						<div className="p-2 flex gap-1 flex-wrap">
							{
								dataMessage.rage.length > 0 && dataMessage.rage.sort((a: any, b: any) => a - b).map((dice: any, index: number) => (
									<Dice key={ index } dice={ dice } type="(rage)" />
								))
							}
							{
								dataMessage.margin.sort((a: any, b: any) => a - b).map((dice: any, index: number) => (
									<Dice key={ index } dice={ dice } type="" />
								))
							}
						</div>
						<div className="font-bold py-2 text-left">
							{ dataMessage.message }
						</div>
						<div className="flex justify-start items-center">
								<span className="">{`Sucessos: `}</span>
								<span className="font-bold px-3">
									{ dataMessage.brutalPairs + dataMessage.criticalPairs + dataMessage.success }
								</span>
						</div>
						<div className="flex jufy-start items-center">
							<span className="">{`Dificuldade: `}</span>
							<span className="font-bold px-3">
								{Number(dataMessage.dificulty)}
							</span>
						</div>
						<div className="flex tify-start items-center w-full flex-wrap">
							<span className="">{`Excedente: `}</span>
							<span className="font-bold px-3">
								{Number(dataMessage.successesForDamage) <= 0 ? 'Nenhum' : dataMessage.successesForDamage + 1}
							</span>
						</div>
						<div className="flex justify-end pt-2">
							<span className="w-full text-right text-sm flex justify-end">
								{ dataMessage.date && dataMessage.date }
							</span>
						</div>
					</div>
				</div>
			);
	}
  return(
    <div className="text-white h-full flex items-center justify-center flex-col">
      <span className="loader z-50" />
    </div>
  );
}