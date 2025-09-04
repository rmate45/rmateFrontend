import TypingDotsSmall from "../TypingDotsSmall/TypingDotsSmall";

export const StreamingLoading = ({ loading, size = "lg" }) => {
  if (!loading) return null;

  return (
    <div className="flex justify-start">
      <div className="bg-transparent">
        <TypingDotsSmall />
      </div>
    </div>
  );
};
