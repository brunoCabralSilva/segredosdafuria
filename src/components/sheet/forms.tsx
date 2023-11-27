import ItemForm from "./itemForm";

export default function Forms() {
  return(
    <div className="flex flex-col w-full overflow-y-auto pr-2 h-full mb-3">
      <div className="w-full h-full mb-2 cursor-pointer text-white bg-black flex-col items-start justify-center font-bold">
        <ItemForm />  
      </div>
    </div>
  );
}