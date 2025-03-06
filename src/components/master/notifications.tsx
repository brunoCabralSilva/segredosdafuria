// import { useContext } from 'react';
// import contexto from '@/context/context';
// import { IoIosCloseCircleOutline } from 'react-icons/io';
// import { approveUser, removeNotification } from '@/firebase/notifications';

// export default function Notifications() {
//   const { session, sessionId, listNotification, setListNotification, setShowMessage } = useContext(contexto);
  
//   const remNotFromCache = async(list: any[]) => {
//     const listNotif = listNotification.filter(listNot => JSON.stringify(listNot) !== JSON.stringify(list));
//     setListNotification(listNotif);
//   }

//   return(
//     <div className="text-white w-full overflow-y-auto h-75vh">
//       <div className="w-full">
//         {
//           listNotification.map((listNot: any, index: number) => (
//             listNot.type === 'approval'
//             ? <div key={index} className="border-2 pt-1 px-1 border-white mb-2">
//               <div className="w-full flex justify-end pb-3">
//                 <IoIosCloseCircleOutline
//                   className="text-3xl text-white cursor-pointer"
//                   onClick={() => remNotFromCache(listNot)}
//                 />
//               </div>
//               <p className="text-center w-full px-3">{listNot.message}</p>
//               <div className="flex w-full gap-2 px-3 mb-3">
//                 <button
//                   type="button"
//                   onClick={ () => removeNotification(sessionId, listNot.message, setShowMessage) }
//                   className={`text-white bg-red-800 hover:border-red-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold`}

//                 >
//                   Negar
//                 </button>
//                 <button
//                   type="button"
//                   onClick={ () => approveUser(listNot, session, setShowMessage) }
//                   className={`text-white bg-green-whats hover:border-green-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold`}
//                 >
//                   Aceitar
//                 </button>
//               </div>
//               </div>
//             : <div key={index} className="border-2 pt-1 px-1 border-white mb-2">
//                 <div className="w-full flex justify-end pb-3">
//                   <IoIosCloseCircleOutline
//                     className="text-3xl text-white cursor-pointer"
//                     onClick={() => remNotFromCache(listNot)}
//                   />
//                 </div>
//                 <p className="text-center w-full px-3">{listNot.message}</p>
//                 <div className="flex w-full gap-2 px-3 mb-3">
//                   <button
//                     type="button"
//                     onClick={ () => removeNotification(sessionId, listNot.message, setShowMessage) }
//                     className={`text-white bg-green-whats hover:border-green-900 transition-colors cursor-pointer border-2 border-white w-full p-2 mt-6 font-bold`}
//                   >
//                     Ok
//                   </button>
//                 </div>
//               </div>
//           ))
//         }
//         {
//           listNotification.length === 0 &&
//           <div className="w-full text-white text-lg text-center mt-4">
//             Você não possui notificações.
//           </div>
//         }
//       </div>
//     </div>
//   );
// }