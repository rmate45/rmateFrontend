import TypingDotsSmall from "../TypingDotsSmall/TypingDotsSmall";
import gif from "../../assets/icons8-sand-clock.gif"
export const StreamingLoading = ({ loading, size = "lg" }) => {
  if (!loading) return null;

  return (
    <div className="flex justify-start items-center gap-1.5 text-sm jost text-back">
   <img className="w-6" src={gif} alt="" />  Generating your results 
   {/* <div className="bg-transparent relative bottom-[2px]">
        
        <TypingDotsSmall />
      </div> */}
    </div>
  );
};
