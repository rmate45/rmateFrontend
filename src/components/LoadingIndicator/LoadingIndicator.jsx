import TypingDots from "../TypingDots/TypingDots";

export const LoadingIndicator = ({ loading }) => {
  if (!loading) return null;
  
  return (
    <div className="mb-3 flex justify-start">
      <div className="bg-transparent">
        <TypingDots />
      </div>
    </div>
  );
};