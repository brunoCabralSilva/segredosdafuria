import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionFeedback, actionPopupGift, actionPopupGiftRoll, useSlice } from "@/redux/slice";
import Feedback from "../../feedback";
import Image from "next/image";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { IGift, ITypeGift } from "@/interface";
import { capitalizeFirstLetter } from "@/functions/utilities";
import { GiD10 } from "react-icons/gi";

export default function PopupGift(props: { item: IGift } ) {
  const dispatch: any = useAppDispatch();
  const slice = useAppSelector(useSlice);
  const { item } = props;

  return(
    <div className="w-full h-screen fixed top-0 left-0 bg-black z-50">
      <section className="mb-2 relative px-2 h-full overflow-y-auto">
        <div className="w-full flex justify-end mt-5 mb-3 px-2 sm:px-10">
          <IoIosCloseCircleOutline
            className="text-4xl text-white cursor-pointer mb-2"
            onClick={() => dispatch(actionPopupGift({ show: false, gift: {} }))}
          />
        </div>
        {/* <button
          type="button"
          onClick={() => dispatch(actionPopupGiftRoll({
            show: true,
            gift: { session: slice.sessionId, data: item },
          }))}
        >
          <GiD10 className="text-2xl text-white" />
        </button> */}
        <div className="px-2 sm:px-10 flex flex-col dataGifts-center sm:dataGifts-start w-full z-20 text-white text-justify">
          <article className="w-full h-full px-4 pb-4 text-white">
            <div className="flex flex-col justify-center dataGifts-center sm:dataGifts-start">
              <div className="relative text-white flex sm:hidden w-full justify-center pb-5">
                { 
                  item.belonging.map((trybe: ITypeGift, index: number) => (
                    <Image
                      key={ index }
                      src={ `/images/glifs/${capitalizeFirstLetter(trybe.type)}.png` }
                      alt={`Glifo ${capitalizeFirstLetter(trybe.type)}`}
                      className={`${trybe.type !== 'global' ? 'h-8' : ''} w-10 object-cover object-center`}
                      width={ 1200 }
                      height={ 800 }
                    />
                  ))
                }
              </div>
              <h1 className="font-bold text-lg text-center sm:text-left w-full">
                {`${ item.giftPtBr } (${ item.gift }) - ${ item.renown }`}
              </h1>
              <div className="w-full flex items-center sm:justify-start justify-center">
                <hr className="w-10/12 my-4 sm:my-2" />
              </div>
            </div>
            <p>
              <span className="font-bold pr-1">Pertencente a:</span>
              { 
                item.belonging.map((trybe: ITypeGift, index: number) => (
                  <span key={ index }>
                    { capitalizeFirstLetter(trybe.type) } ({ trybe.totalRenown })
                    { index === item.belonging.length -1 ? '.' : ', ' }
                  </span>
                ))
              }
            </p>
            <p className="pt-1">
              <span className="font-bold pr-1">Fonte:</span>
              { item.book }, pg. { item.page }.
            </p>
            <p className="pt-1">
              <span className="font-bold pr-1">Custo:</span>
              { item.cost }.
            </p>
            <p className="pt-1">
              <span className="font-bold pr-1">Ação:</span>
              { item.action }.
            </p>
            { item.pool !== "" &&
              <p className="pt-1">
                <span className="font-bold pr-1">Parada de Dados:</span>
                { item.pool }.
              </p>
            }
            { item.duration !== "" &&
              <p className="pt-1">
                <span className="font-bold pr-1">Duração:</span>
                { item.duration }.
              </p>
            }
            <p className="pt-1 text-justify">
              <span className="font-bold pr-1">Descrição:</span>
              { item.descriptionPtBr }
            </p>
            <p className="pt-1 text-justify">
              <span className="font-bold pr-1">Sistema:</span>
              { item.systemPtBr }
            </p>
            <p className="pt-1 text-justify">
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
              className={`pb-3 ${!slice.simplify ? 'text-orange-300 hover:text-orange-600 transition-colors duration-300 mt-5 cursor-pointer underline' : 'bg-white text-black p-2 font-bold mt-3'}`}
              onClick={() => dispatch(actionFeedback({ show: true, message: '' })) }
            >
              Enviar Feedback
            </button>
            {
              slice.feedback.show && <Feedback title={ item.gift } /> 
            }
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}