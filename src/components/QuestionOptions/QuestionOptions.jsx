export const QuestionOptions = ({ options, onOptionClick, question, questionNumber, sessionId, trackAnswer }) => {
  if (!options || options.length === 0) return null;

  const handleOptionClick = (option) => {
    // Push to Google Tag Manager dataLayer
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: "quiz_answer",
        quiz_question_number: questionNumber || "unknown",
        quiz_question_text: question || "Question",
        quiz_answer_text: option.text,
      });
      console.log('GTM Event Pushed (Option):', {
        event: "quiz_answer",
        quiz_question_number: questionNumber || "unknown",
        quiz_question_text: question || "Question",
        quiz_answer_text: option.text,
      });
    }
    
    // Track answer in session
    if (trackAnswer) {
      trackAnswer(
        questionNumber || "unknown",
        question || "Question",
        option.text
      );
    }
    
    // Call the original handler
    onOptionClick(option);
  };

  return (
    <div className="space-y-2">
      {options.map((option, idx) => (
        <button
          key={idx}
          onClick={() => handleOptionClick(option)}
          className="w-full text-base py-2 px-3 text-left jost border-2 border-gray-300 rounded-lg
           hover:border-green-300 hover:bg-green-50 transition-all"
        >
          {option.text}
        </button>
      ))}
    </div>
  );
};