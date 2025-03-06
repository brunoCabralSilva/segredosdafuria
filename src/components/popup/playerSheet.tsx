// 'use client'
// import { useContext, useEffect, useState } from "react";
// import { IoIosCloseCircleOutline } from "react-icons/io";
// import contexto from "@/context/context";
// import dataTrybes from '../../data/trybes.json';
// import { updateDataPlayer } from "@/firebase/players";
// import { BsCheckSquare } from "react-icons/bs";
// import { FaRegEdit } from "react-icons/fa";
// import SheetPoints from "../master/sheetPoints";
// import SheetData from "../master/sheetData";
// import SheetForms from "../master/sheetForms";

// export default function PlayerSheet() {
//   const [player, setPlayer ]: any = useState({});
//   const [edit, setEdit] = useState(false);
//   const [newName, setNewName] = useState('');
//   const {
//     showPlayer, setShowPlayer,
//     players,
//     session,
//     setShowEvaluateSheet,
//     setShowMessage,
//     setShowDownloadPdf,
//     setShowResetPlayer,
//     setShowRemovePlayer,
//   } = useContext(contexto);

//   useEffect(() => {
//     const playerData = players.find((item: any) => item.email === showPlayer.email);
//     setPlayer(playerData);
//     setNewName(playerData.data.name)
//   }, [players]);

//   const updateValue = async (key: string, value: string) => {
//     if (player.data[key] !== value) {
//       await updateDataPlayer(session.id, player.email, { ...player.data, [key]: value }, setShowMessage);
//       setPlayer({ ...player, data: {  ...player.data, [key]: value }});
//     }
//   };

//   return(
//     <div>
//     {
//       player.data
//       ? <div className="fixed top-0 left-0 w-full h-full flex flex-col bg-black/70 font-normal p-5 sm:p-0 pb-3 z-60 text-white">
//         <div className="bg-gray-whats-dark border-2 border-white w-full h-full overflow-y-auto">
//           <div className="flex justify-between">
//             <div className="grid grid-cols-1 sm:grid-cols-3 w-full pt-5">
//               <div className="text-white font-bold pl-5 ">
//                 <span className="pr-2">Nome:</span>
//                 <div className="flex items-center gap-2 mt-2">
//                   {
//                     edit
//                     ? <input 
//                         type="text"
//                         value={newName}
//                         onChange={ (e: any) => {
//                           const sanitizedValue = e.target.value.replace(/\s+/g, ' ');
//                           setNewName(sanitizedValue);
//                         }}
//                         className="w-full text-center py-1 bg-gray-whats-dark border-2 border-white cursor-pointer"
//                       />
//                     : <div className="w-full text-center py-1 bg-gray-whats-dark border-2 border-white cursor-pointer">{ newName === '' ? 'Sem Nome definido' : newName }</div>
//                   }
//                   { 
//                     edit
//                       ? <BsCheckSquare
//                           onClick={(e:any) => {
//                             updateValue('name', newName);
//                             setEdit(false);
//                             e.stopPropagation();
//                           }}
//                           className="text-3xl cursor-pointer"
//                         />
//                       : <FaRegEdit
//                           onClick={
//                             (e:any) => {
//                               setEdit(true);
//                               setNewName(player.data.name);
//                               e.stopPropagation();
//                             }}
//                           className="text-3xl cursor-pointer"
//                         />
//                   }
//                 </div>
//               </div>
//               <div className="text-white font-bold pl-5">
//                 <span className="pr-2">Tribo:</span>
//                 <select
//                   className="w-full text-center py-1 bg-gray-whats-dark border-2 border-white mt-2 cursor-pointer"
//                   value={ player.data.trybe }
//                   onChange={ (e) => updateValue('trybe', e.target.value) }
//                 >
//                   <option disabled value="">Escolha uma Tribo</option>
//                   {
//                     dataTrybes
//                       .sort((a, b) => a.namePtBr.localeCompare(b.namePtBr))
//                       .map((trybe, index) => (
//                       <option
//                         key={index}
//                         value={ trybe.nameEn }
//                       >
//                         { trybe.namePtBr }
//                       </option>
//                     ))
//                   }
//                 </select>
//               </div>
//               <div className="text-white font-bold pl-5">
//                 <span className="pr-2">Augúrio:</span>
//                 <select
//                   className="w-full text-center py-1 bg-gray-whats-dark border-2 border-white mt-2 cursor-pointer"
//                   value={player.data.auspice}
//                   onChange={ (e) => updateValue('auspice', e.target.value) }
//                 >
//                   <option disabled value="">Escolha um Augúrio</option>
//                   <option value="ragabash">Ragabash</option>
//                   <option value="theurge">Theurge</option>
//                   <option value="philodox">Philodox</option>
//                   <option value="galliard">Galliard</option>
//                   <option value="ahroun">Ahroun</option>
//                 </select>
//               </div>
//             </div>
//             <button
//               type="button"
//               className="p-1 right-3 h-10"
//               onClick={ () => setShowPlayer({ show: false, email: '' }) }
//             >
//               <IoIosCloseCircleOutline
//                 className="text-4xl text-white cursor-pointer"
//               />
//             </button>
//           </div>
//           <div className="pt-3 w-full h-full sm:px-5 sm:pb-5 p-3">
//             <SheetPoints player={player} />
//             <SheetForms player={player} />
//             <SheetData player={player} />
//             <button
//               type="button"
//               onClick={ () => {
//                 setShowEvaluateSheet({show: true, data: showPlayer.email });
//                 setShowPlayer({ show: false, email: '' });
//               }}
//               className="mt-8 mb-2 p-2 w-full text-center border-2 border-white text-white bg-black cursor-pointer font-bold hover:border-red-500 transition-colors"
//             >
//               Avaliar Ficha
//             </button>
//             <button
//               type="button"
//               onClick={ () => setShowDownloadPdf({ show: true, email: showPlayer.email }) }
//               className="mb-2 p-2 w-full text-center border-2 border-white text-white bg-black cursor-pointer font-bold hover:border-red-500 transition-colors"
//             >
//               Exportar Ficha
//             </button>
//             <button
//               type="button"
//               className="mb-3 p-2 w-full text-center border-2 border-white text-white bg-red-800 cursor-pointer font-bold hover:bg-red-900 transition-colors"
//               onClick={ () => {
//                 setShowPlayer({ show: false, email: showPlayer.email });
//                 setShowResetPlayer({ show: true, email: player.email });
//               }}
//             >
//               Limpar Ficha
//             </button>
//             <button
//               type="button"
//               className="mb-3 p-2 w-full text-center border-2 border-white text-white bg-red-800 cursor-pointer font-bold hover:bg-red-900 transition-colors"
//               onClick={ () => {
//                 setShowPlayer({ show: false, email: showPlayer.email });
//                 setShowRemovePlayer({ show: true, email: player.email })
//               }}
//             >
//               Remover da Sessão
//             </button>
//           </div>
//         </div>
//       </div>
//       : <div>Carregando</div>
//     }
//   </div>
//   );
// }