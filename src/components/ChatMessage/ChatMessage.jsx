import { ReloadButton } from "../ReloadButton/ReloadButton";
import { StreamingLoading } from "../StreamingLoading/StreamingLoading";

export const ChatMessage = ({
  message,
  isLastAnswer,
  canReload,
  loading,
  onReload,
  chatMode,
}) => {
  const { type, text } = message;

  const isAnswer = type === "answer";
  const isComment = type === "comment";
  const isChart = type === "chart";

  // Don't render chart messages here since they're handled in the main component
  if (isChart) {
    return null;
  }

  return (
    <div className={`mb-3 px-4 flex ${isAnswer ? "justify-end" : "justify-start"}`}>
      {isAnswer && isLastAnswer && canReload && !loading && (
        <ReloadButton onReload={onReload} />
      )}

      <div
        className={`px-4 py-2 min-h-10 text-sm max-w-xs rounded-xl flex justify-center items-center jost  ${
          isAnswer
            ? "rounded-br-none bg-green-300 text-left text-black"
            : isComment
            ? "rounded-tl-none bg-blue-100 border-2 border-blue-300 text-black italic  text-left"
            : "rounded-tl-none border-2 border-secondary text-black"
        }`}
      >
        {chatMode && !text ? (
          <StreamingLoading loading={loading} />
        ) : (
          <>{text}</>
        )}
      </div>
    </div>
  );
};