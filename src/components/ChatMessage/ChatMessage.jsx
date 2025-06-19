import { ReloadButton } from "../ReloadButton/ReloadButton";

export const ChatMessage = ({ message, isLastAnswer, canReload, loading, onReload }) => {
  const { type, text } = message;

  const isAnswer = type === "answer";
  const isComment = type === "comment";

  return (
    <div
      className={`mb-3 flex ${isAnswer ? "justify-end" : "justify-start"}`}
    >
      {isAnswer && isLastAnswer && canReload && !loading && (
        <ReloadButton onReload={onReload} />
      )}

      <div
        className={`px-4 py-2 text-sm max-w-xs rounded-xl ${
          isAnswer ? "rounded-br-none bg-green-300 text-left text-black" :
          isComment ? "rounded-tl-none bg-blue-100 border-2 border-blue-300 text-black italic  text-left" :
          "rounded-tl-none border-2 border-secondary text-black"
        }`}
      >
        {text}
      </div>
    </div>
  );
};
