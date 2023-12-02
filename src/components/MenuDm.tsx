'use client'
import firebaseConfig from "@/firebase/connection";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionShowMenuSession, useSlice } from "@/redux/slice";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function MenuDm(props: { session: string }) {
  const { session } = props;
  const dispatch = useAppDispatch();
  const slice = useAppSelector(useSlice);
  const [players, setPlayers] = useState([]);

	const returnValue = async () => {
		try {
			const db = getFirestore(firebaseConfig);
			const userQuery = query(collection(db, 'sessions'), where('name', '==', session));
			const userQuerySnapshot = await getDocs(userQuery);
			const players: any = [];
			userQuerySnapshot.forEach((doc: any) => players.push(...doc.data().players));
			console.log('players', players);
			setPlayers(players);
		} catch (error) {
			window.alert(`Erro ao obter a lista de jogadores: ` + error);
    }
	};

  useEffect(() => {
		returnValue();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

	const returnDate = (msg: any) => {
		console.log(msg);
    const data = new Date(msg.date);
    const formatoData = `${`${data.getDate() < 10 ? 0 : ''}${data.getDate()}`}/${data.getMonth() + 1}/${data.getFullYear()}`;
    const formatoHora = `${data.getHours() === 0 ? 0 : ''}${data.getHours()}:${data.getMinutes() < 10 ? 0: ''}${data.getMinutes()}:${data.getSeconds() < 10 ? 0 : ''}${data.getSeconds()}`;
    return `${formatoHora}, ${formatoData}`;
  }

  return(
		<div className="flex flex-col items-center justify-start h-screen z-50 top-0 right-0 px-3 pt-5 bg-gray-whats-dark overflow-y-auto">
			<div className="w-full flex justify-end">
				<IoIosCloseCircleOutline
					className="text-4xl text-white cursor-pointer"
					onClick={() => dispatch(actionShowMenuSession(''))}
				/>
			</div>
			<div className="text-white font-bold text-2xl mb-5">{session}</div>
			{
				players.length > 0 && players.map((player: any, index) => (
					<div className="text-white w-full border-2 border-white flex flex-col items-center justify-center p-3 mb-4" key={index}>
						<h1 className="capitalize text-xl pt-5">{`${player.user} (${player.data.name === '' ? 'Sem nome': player.data.name})`}</h1>
						<hr className="w-full my-3" />
						<div>
							<span className="font-bold pr-1">Tribo:</span>
							<span className="capitalize">{ player.data.trybe === '' ? 'Indefinida' : player.data.trybe }</span>
						</div>
						<div>
						<span className="font-bold pr-1">Augúrio:</span>
						<span className="capitalize">{ player.data.auspice === '' ? 'Indefinido' : player.data.auspice }</span>
						</div>
						<div className="mt-3">
							<span className="font-bold pr-1">Fúria:</span>
							<span>{ player.data.rage }</span>
						</div>
						<div>
							<span className="font-bold pr-1">Força de Vontade Total:</span>
							<span className="capitalize">{ player.data.attributes.composure + player.data.attributes.resolve }</span>
						</div>
						<div className="">
							<span className="font-bold pr-1">Vitalidade:</span>
							<span className="capitalize">{ player.data.form === 'Crinos' ? player.data.attributes.stamina + 7 : player.data.attributes.stamina + 3}</span>
						</div>
						<div className="mt-3">
							<span className="font-bold pr-1">Forma Atual:</span>
							<span className="capitalize">{ player.data.form }</span>
						</div>
						<p className="font-bold pr-1 mt-3">Renome</p>
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full">
							<p className="text-center">
								Honra: { player.data.honor }
							</p>
							<p className="text-center">
								Glória: { player.data.glory }
							</p>
							<p className="text-center">
								Sabedoria: { player.data.wisdom }
							</p>
						</div>
						<p className="font-bold pr-1 mt-3">Atributos</p>
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full">
							{
								Object.entries(player.data.attributes).map(([chave, valor]: any, index) => (
									<div className="capitalize text-center" key={index}>
										{chave}: {valor}
									</div>
								))
							}
						</div>
						<p className="font-bold pr-1 mt-3">Habilidades</p>
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full">
							{
								Object.entries(player.data.skills).map(([chave, valor]: any, index) => {
									if (valor.value !== 0)
									return (
										<div className="capitalize text-center w-full" key={index}>
											{chave}: { valor.value }
											{valor.specialty === '' ? '' : (valor.specialty)}
										</div>
									)
								})
							}
						</div>
						<p className="font-bold pr-1 w-full text-center mt-3">Dons</p>
						<div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
						{ 
							player.data.gifts.length === 0
								? 'Nenhum'
								: player.data.gifts.map((gift: any, index: number) => (
										<p className="text-center" key={index}>{ gift.giftPtBr }</p>
									))
						}
						</div>
						<p className="font-bold pr-1 w-full text-center mt-3">Rituais</p>
						<div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
						{ 
							player.data.rituals.length === 0
								? 'Nenhum'
								: player.data.rituals.map((ritual: any, index: number) => (
										<p className="text-center" key={index}>{ ritual.titlePtBr }</p>
									))
						}
						</div>
						<p className="font-bold pr-1 w-full text-center mt-3">Background</p>
						<p className="w-full text-center">{ player.data.background }</p>
						<p>Ficha criada em: { returnDate(player) }</p>
					</div>
				))
			}
			<button className="p-4 bg-black border-2 border-white w-full text-white font-bold" onClick={returnValue}>Atualizar</button>
		</div>
  )
}