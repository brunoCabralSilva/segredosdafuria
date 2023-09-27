import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { actionFeedback, useSlice } from "@/redux/slice";
import Feedback from "./feedback";

interface ITalisman {
  title :String;
  titlePtBr :String;
  description :String;
  descriptionPtBr :String;
  system :String;
  systemPtBr :String;
  backgroundCost :String;
  backgroundCostPtBr :String;
  book: String;
  page: number;
}

export default function Talisman(props: { item: ITalisman } ) {
  const dispatch: any = useAppDispatch();
  const slice = useAppSelector(useSlice);
  const { item } = props;

  return(
    <article className="border w-full h-full px-4 pb-4 pt-10 sm:p-10 border-3 bg-black/70 text-white overflow-y-auto">
      <div className="flex flex-col justify-center items-center sm:items-start">
        <h1 className="font-bold text-lg text-center sm:text-left w-full">
          {`${ item.titlePtBr } (${ item.title })`}
        </h1>
        <hr className="w-10/12 my-4 sm:my-2" />
      </div>
      <p className="pt-1">
        <span className="font-bold pr-1">Fonte:</span>
        { item.book }, pg. { item.page }.
      </p>
      {
        <p className="pt-1">
          <span className="font-bold pr-1">Custo:</span>
          { item.backgroundCostPtBr }.
        </p>
      }
      {
        <p className="pt-1">
          <span className="font-bold pr-1">Cost:</span>
          { item.backgroundCost }.
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
      { slice.feedback.show && <Feedback gift={ slice.feedback.gift } /> }
    </article>
  );
}