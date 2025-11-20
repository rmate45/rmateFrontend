import TypingDots from "../TypingDots/TypingDots";
import gif from "../../assets/RetireMate-beating-icon.gif"
export const LoadingIndicator = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="mx-4 px-4 py-2 min-h-10 text-sm max-w-xs rounded-xl flex w-fit justify-start items-center rounded-tl-none 
    border-1 border-green-300 text-black">
      <div className="flex justify-start items-center gap-1.5 text-sm jost text-back">
        <img className="w-6" src={gif} alt="" />  Generating your results 
        </div>
    </div>
  );
};
