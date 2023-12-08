// import { IGift, ITypeGift } from "@/interfaces/Gift";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionFeedback, actionPopupRitual, useSlice } from "@/redux/slice";
import Feedback from "./feedback";
import Image from "next/image";
import { IoIosCloseCircleOutline } from "react-icons/io";

interface IRitual {
  titlePtBr: string;
  title:string;
  type: string;
  descriptionPtBr: string;
  description: string;
  pool: string;
  systemPtBr: string;
  system: string;
  book: string;
  page: number;
}

export default function PopupRitual(props: { item: IRitual } ) {
  const dispatch: any = useAppDispatch();
  const slice = useAppSelector(useSlice);
  const { item } = props;
  return(
    <div className="w-full h-screen fixed top-0 left-0 bg-black z-50">
      <section className="mb-2 relative px-2 h-full overflow-y-auto">
        <div className="w-full flex justify-end mt-5 mb-3 px-2 sm:px-10">
          <IoIosCloseCircleOutline
            className="text-4xl text-white cursor-pointer mb-2"
            onClick={() => dispatch(actionPopupRitual({ show: false, ritual: {} }))}
          />
        </div>
        <div className="px-2 sm:px-10 flex flex-col dataGifts-center sm:dataGifts-start w-full z-20 text-white text-justify">
          <article className="w-full h-full px-4 pb-4 text-white">
            <div className="flex flex-col justify-center items-center sm:items-start">
              <h1 className="font-bold text-lg text-center sm:text-left w-full">
                {`${ item.titlePtBr } (${ item.title }) - ${ item.type === 'social' ? "Social" : 'Comum' }`}
              </h1>
              <hr className="w-10/12 my-4 sm:my-2" />
            </div>
            <p className="pt-1">
              <span className="font-bold pr-1">Fonte:</span>
              { item.book }, pg. { item.page }.
            </p>
            { item.pool !== "" &&
              <p className="pt-1">
                <span className="font-bold pr-1">Parada de Dados:</span>
                { item.pool }.
              </p>
            }
            <p className="pt-3 text-justify">
              <span className="font-bold pr-1">Descrição:</span>
              { item.descriptionPtBr }
            </p>
            <p className="pt-1 text-justify">
              <span className="font-bold pr-1">Sistema:</span>
              { item.systemPtBr }
            </p>
            <p className="pt-3 text-justify">
              <span className="font-bold pr-1">Description (original):</span>
              { item.description }
            </p>
            <p className="pt-1 text-justify">
              <span className="font-bold pr-1">System (original):</span>
              { item.system }
            </p>
            <div className="flex flex-col sm:flex-row sm:justify-between">
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between">
            <button
              type="button"
              className={ !slice.simplify ? 'text-orange-300 hover:text-orange-600 transition-colors duration-300 mt-5 cursor-pointer underline' : 'bg-white text-black p-2 font-bold mt-3'}
              onClick={() => dispatch(actionFeedback({ show: true, message: item.title })) }
            >
              Enviar Feedback
            </button>
            </div>
            { slice.feedback.show && <Feedback title={ item.title } /> }
          </article>
        </div>
      </section>
    </div>
  );
}