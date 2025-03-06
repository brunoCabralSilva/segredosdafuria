// 'use client'
// import contexto from '@/context/context';
// import { updateDataPlayer } from '@/firebase/players';
// import { useContext, useEffect, useState } from "react";

// export default function ItemAtrMaster(props: any) {
//   const { player, name, namePtBr, quant } = props;
//   const [points, setPoints]: any = useState([]);
// 	const { session, setShowMessage } = useContext(contexto);

//   const updateValue = async (name: string, value: number) => {
//     if (player.data.attributes[name] === 1 && value === 1) player.data.attributes[name] = 0;
//     else player.data.attributes[name] = value;
//     await updateDataPlayer(session.id, player.email, player.data, setShowMessage);
//   };

//   useEffect(() => { setPoints(Array(quant).fill('')) }, []);

//   const returnPoints = (name: string) => {
//     return (
//       <div className="flex flex-wrap gap-2 pt-1">
//         {
//           points.map((item: any, index: number) => {
//             if (player.data.attributes[name] >= index + 1) {
//               return (
//                 <button
//                   type="button"
//                   onClick={ () => {
//                     if (player.data.form === 'Hominídeo' || player.data.form === 'Lupino')
//                       updateValue(name, index + 1)
//                     else setShowMessage({ show: true, text: 'Os Atributos só podem ser atualizados na forma Hominídea ou Lupina' })
//                   }}
//                   key={index}
//                   className="h-6 w-6 rounded-full bg-black border-white border-2 cursor-pointer"
//                 />
//               );
//             } return (
//               <button
//                 type="button"
//                 onClick={ () => {
//                   if (player.data.form === 'Hominídeo' || player.data.form === 'Lupino') updateValue(name, index + 1)
//                   else setShowMessage({ show: true, text: 'Os Atributos só podem ser atualizados na forma Hominídea ou Lupina' })
//                 }}
//                 key={index}
//                 className="h-6 w-6 rounded-full bg-white border-white border-2 cursor-pointer"
//               />
//             );
//           })
//         }
//       </div>
//     );
//   };

//   return(
//     <div className="w-full mt-4">
//       <span className="capitalize">{ namePtBr } ({ name })</span>
//       <div className="w-full mt-1">
//         { returnPoints(name) }
//       </div>
//     </div>
//   );
// }