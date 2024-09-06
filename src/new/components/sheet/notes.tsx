export default function Anotations(props: { type: string }) {
	const { type } = props;
	return(
		<div className="flex flex-col w-full overflow-y-auto pr-2 h-full mb-3">
      <div className="w-full h-full mb-2 flex-col items-start justify-center font-bold">
				Anotations - { type }
			</div>
		</div>
	)
}