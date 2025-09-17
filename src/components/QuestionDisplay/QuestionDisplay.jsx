import { useState, useEffect } from "react";
import { QuestionOptions } from "../QuestionOptions/QuestionOptions";
import { TextInput } from "../TextInput/TextInput";
import { TextInputPhone } from "../TextInputPhone/TextInputPhone";

export const QuestionDisplay = ({
  currentQuestion,
  loading,
  textInput,
  onTextChange,
  onOptionClick,
  onTextSubmit,
  onMultiSelectSubmit,
  onValidationError,
  scrollUp,
  scrollToBottom,
  // New props for chat mode
  onStarterQuestionSelect,
  onFollowUpQuestionSelect,
  customQuestionInput,
  onCustomQuestionChange,
  onCustomQuestionSubmit,
}) => {
  const [selectedMultiOptions, setSelectedMultiOptions] = useState([]);

  // Scroll to bottom when submit button appears for multi-select
  useEffect(() => {
    if (selectedMultiOptions.length > 0 && scrollToBottom) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [selectedMultiOptions.length, scrollToBottom]);

  if (!currentQuestion || loading) return null;

  const isValidateZip = currentQuestion?.questionId === "Q7";
  const isPhoneInput = currentQuestion?.questionId === "Q2";
  const isAgeInput = currentQuestion?.questionId === "Q3";

  // New question types for chat mode
  const isStarterQuestions = currentQuestion?.inputType === "starter_questions";
  const isFollowUpQuestions =
    currentQuestion?.inputType === "followup_questions";
  const isCombinedInput = currentQuestion?.inputType === "combined_input";

  const handleMultiSelectToggle = (option) => {
    setSelectedMultiOptions((prev) => {
      const isSelected = prev.find((item) => item.text === option.text);
      if (isSelected) {
        return prev.filter((item) => item.text !== option.text);
      } else {
        return [...prev, option];
      }
    });
  };

  const handleMultiSelectSubmitClick = () => {
    if (selectedMultiOptions.length > 0) {
      onMultiSelectSubmit(selectedMultiOptions);
      scrollUp();
      setSelectedMultiOptions([]);
    }
  };

  const handlePhoneSubmit = (phoneData) => {
    onTextSubmit(phoneData);
  };

  return (
    <div className={`mt-0`}>
      <div className="mb-2 mx-4 jost text-sm border-2 border-green-300 px-4 py-2 text-center rounded-xl text-gray-800 font-semibold max-w-sm">
        {currentQuestion.questionText}
      </div>

      {/* Starter Questions Display */}
      {isStarterQuestions && currentQuestion.options && (
        <div className="mx-4">
          <div className="space-y-2">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => onStarterQuestionSelect(option)}
                className="w-full py-2 px-3 text-left jost border-2 border-gray-300 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all"
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Follow-up Questions with Combined Input */}
      {(isFollowUpQuestions || isCombinedInput) && (
        <div className="mx-4">
          {/* Follow-up question options */}
          {currentQuestion.options && currentQuestion.options.length > 0 && (
            <div className="space-y-2 mb-4">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => onFollowUpQuestionSelect(option)}
                  className="w-full py-2 px-3 text-left jost border-2 border-gray-300 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all"
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* Show divider and text input for combined input type */}
          {isCombinedInput && (
            <>
              <div className="fixed bottom-0 pb-4 w-full pr-[28px] max-w-3xl bg-white">
                <TextInput
                  value={customQuestionInput}
                  onChange={onCustomQuestionChange}
                  onSubmit={onCustomQuestionSubmit}
                  validateAsZip={false}
                  isAgeInput={false}
                  onValidationError={onValidationError}
                  scrollToBottom={scrollToBottom}
                />
              </div>
            </>
          )}
        </div>
      )}

      {/* Fixed bottom input for free text */}
      <div
        className={
          currentQuestion.inputType == "free_text"
            ? "fixed bottom-0 pb-4 w-full px-4 max-w-3xl bg-white"
            : ""
        }
      >
        {/* Phone Number Input */}
        {currentQuestion.inputType === "free_text" && isPhoneInput && (
          <TextInputPhone
            value={textInput}
            onChange={onTextChange}
            onSubmit={handlePhoneSubmit}
            onValidationError={onValidationError}
            scrollToBottom={scrollToBottom}
          />
        )}

        {/* Regular Free Text Input (ZIP or other text) */}
        {currentQuestion.inputType === "free_text" && !isPhoneInput && (
          <TextInput
            value={textInput}
            onChange={onTextChange}
            onSubmit={onTextSubmit}
            validateAsZip={isValidateZip}
            isAgeInput={isAgeInput}
            onValidationError={onValidationError}
            scrollToBottom={scrollToBottom}
          />
        )}
      </div>

      {/* Single Select Options */}
      {currentQuestion.inputType === "single_select" &&
        currentQuestion.options && (
          <QuestionOptions
            options={currentQuestion.options}
            onOptionClick={onOptionClick}
          />
        )}

      {/* Multi Select Options */}
      {currentQuestion.inputType === "multi_select" &&
        currentQuestion.options && (
          <div>
            <div className="space-y-2 mb-4 mx-4">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleMultiSelectToggle(option)}
                  className={`w-full px-3 py-2 text-left border-2 rounded-lg transition-all ${
                    selectedMultiOptions.find(
                      (item) => item.text === option.text
                    )
                      ? "border-green-300 bg-green-50 text-primary"
                      : "border-gray-300 hover:border-green-300"
                  }`}
                >
                  <div className="flex items-center justify-between jost">
                    <span className="jost">{option.text}</span>
                    <span className="text-sm jost">
                      {selectedMultiOptions.find(
                        (item) => item.text === option.text
                      )
                        ? "✓"
                        : "+"}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {selectedMultiOptions.length > 0 && (
              <div className="text-center">
                <button
                  onClick={handleMultiSelectSubmitClick}
                  className="px-6 py-2 bg-green-600 jost text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Submit ({selectedMultiOptions.length} selected)
                </button>
              </div>
            )}
          </div>
        )}
    </div>
  );
};
