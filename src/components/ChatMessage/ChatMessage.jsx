import { ReloadButton } from "../ReloadButton/ReloadButton";
import { StreamingLoading } from "../StreamingLoading/StreamingLoading";
import retiremateLogo from "../../assets/retiremate-logo-favicon.svg";
export const ChatMessage = ({
  message,
  isLastAnswer,
  canReload,
  loading,
  onReload,
  chatMode,
}) => {
  const { type, text, isDesktop, isMobile } = message;

  const isAnswer = type === "answer";
  const isComment = type === "comment";
  const isChart = type === "chart";

  console.log(isDesktop, "isMobile")

  // Don't render chart messages here since they're handled in the main component
  if (isChart) {
    return null;
  }

  return (
    <div className={`mb-3 px-4 flex items-start ${isAnswer ? "justify-end" : "justify-start"} ${isDesktop && window.innerWidth < 786 ? "hidden" : ""} ${isMobile && window.innerWidth > 786 ? "hidden" : ""}`}>
      {isAnswer && isLastAnswer && canReload && !loading && (
        <ReloadButton onReload={onReload} />
      )}

      {(!isAnswer || isComment) && (<img src={retiremateLogo} alt="retiremate" className="pt-1" />)}     <div
        className={`px-4 py-2 min-h-10 text-sm sm:text-base max-w-xs rounded-xl flex justify-center items-center jost  ${isAnswer
            ? "rounded-br-none bg-green-300 text-left text-black"
            : isComment
              ? "rounded-tl-none bg-blue-100 border border-blue-300 text-black italic  text-left"
              : "rounded-tl-none border border-green-300 text-black whitespace-pre-line"
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