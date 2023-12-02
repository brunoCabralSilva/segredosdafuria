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
		<div className="flex flex-col items-center justify-start h-screen z-50 top-0 right-0 px-3 pt-12 bg-gray-whats-dark">
			<IoIosCloseCircleOutline
				className="fixed top-0 right-1 text-4xl text-white ml-2 mt-2 cursor-pointer z-50"
				onClick={() => dispatch(actionShowMenuSession(''))}
			/>
			<div className="text-white font-bold text-2xl mb-5">{session}</div>
			{
				players.length > 0 && players.map((player: any, index) => (
					<div className="text-white w-full border-2 border-white flex flex-col items-center justify-center p-3" key={index}>
						<h1 className="capitalize">{`${player.user} (${player.data.name === '' ? 'Sem nome': player.data.name})`}</h1>
						<div>
							Tribo: { player.data.trybe === '' ? 'Indefinida' : player.data.trybe }
						</div>
						<div>
							Augúrio: { player.data.auspice === '' ? 'Indefinido' : player.data.auspice }
						</div>
						<div>
							Fúria: { player.data.rage }
						</div>
						<div>
							Força de Vontade total: { player.data.attributes.composure + player.data.attributes.resolve }
						</div>
						<div>
							Vitalidade: { player.data.form === 'Crinos' ? player.data.attributes.stamina + 7 : player.data.attributes.stamina + 3}
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
						<div>
							Forma Atual: { player.data.form }
						</div>
						<div>
							Honra: { player.data.honor }
						</div>
						<div>
							Glória: { player.data.glory }
						</div>
						<div>
							Sabedoria: { player.data.wisdom }
						</div>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
							{
								Object.entries(player.data.attributes).map(([chave, valor]: any, index) => (
									<div className="capitalize" key={index}>
										{chave}: {valor}
									</div>
								))
							}
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
							{
								Object.entries(player.data.skills).map(([chave, valor]: any, index) => {
									if (valor.value !== 0)
									return (
										<div className="capitalize" key={index}>
											{chave}: { valor.value }
											{valor.specialty === '' ? '' : (valor.specialty)}
										</div>
									)
								})
							}
						</div>
						<div>
							Dons: { player.data.gifts.length === 0 ? 'Nenhum' : player.data.gifts.map((gift: any) => gift.giftPtBr) }
						</div>
						<div>
							Rituais: { player.data.rituals.length  === 0 ? 'Nenhum' : player.data.rituals.map((ritual: any) => ritual.titlePtBr) }
						</div>
						<div>
							Background: { player.data.background }
						</div>
						<p>Criado em: { returnDate(player) }</p>
					</div>
				))
			}
			<button onClick={returnValue}>Atualizar</button>
		</div>
  )
}