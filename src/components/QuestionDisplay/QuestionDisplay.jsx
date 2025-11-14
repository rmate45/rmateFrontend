import { useState, useEffect } from "react";
import { QuestionOptions } from "../QuestionOptions/QuestionOptions";
import { TextInput } from "../TextInput/TextInput";
import { TextInputPhone } from "../TextInputPhone/TextInputPhone";
import PrivacyTrustModal from "../PrivacyTrustModal/PrivacyTrustModal";
import cuidaAlert from "../../assets/cuida_alert-outline.svg";
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
  scrollToBottom, // Add this new prop for scrolling to bottom
  type,
}) => {
  const [selectedMultiOptions, setSelectedMultiOptions] = useState([]);
const [showModal, setShowModal] = useState(false);
  // Scroll to bottom when submit button appears for multi-select
  useEffect(() => {
    if (selectedMultiOptions.length > 0 && scrollToBottom) {
      setTimeout(() => {
        scrollToBottom();
      }, 100); // Small delay to ensure DOM is updated
    }
  }, [selectedMultiOptions.length, scrollToBottom]);

  if (!currentQuestion || loading) return null;

  const isValidateZip = currentQuestion?.questionId === "MQ1"; // Question 7 asks for zip code
  const isPhoneInput = false;
  const isAgeInput = currentQuestion?.questionId === "Q1"; // Question 1 is for age range

  const handleMultiSelectToggle = (option) => {
    setSelectedMultiOptions(prev => {
      const isSelected = prev.find(item => item.text === option.text);
      if (isSelected) {
        return prev.filter(item => item.text !== option.text);
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

  // Handle phone number submission with full phone data
  const handlePhoneSubmit = (phoneData) => {
    onTextSubmit(phoneData);
  };

  return (
    <div className={`mt-0`}>
        <PrivacyTrustModal show={showModal} onClose={() => setShowModal(false)} />
      <div className="mb-2 mx-4 jost text-sm border-2 border-green-300 px-4 py-2 text-center flex gap-2 items-center justify-center rounded-xl text-gray-800 font-semibold max-w-sm">
        {currentQuestion.questionText} {type === "medicareQuiz" && <img src={cuidaAlert} alt="retiremate" onClick={() => setShowModal(true)} />}
      </div>

      <div className={currentQuestion.inputType == "free_text" ? "fixed bottom-0 pb-4 w-full px-4 max-w-3xl bg-white" : ""}>
        {/* Phone Number Input */}
        {currentQuestion.inputType === "free_text" && isPhoneInput && (
          <TextInputPhone
            value={textInput}
            onChange={onTextChange}
            onSubmit={handlePhoneSubmit}
            onValidationError={onValidationError}
            scrollToBottom={scrollToBottom} // Pass scrollToBottom prop
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
            scrollToBottom={scrollToBottom} // Pass scrollToBottom prop
          />
        )}
      </div>

      {/* Single Select Options */}
      {currentQuestion.inputType === "single_select" && currentQuestion.options && (
        <QuestionOptions
          options={currentQuestion.options}
          onOptionClick={onOptionClick}
        />
      )}

      {/* Multi Select Options */}
      {currentQuestion.inputType === "multi_select" && currentQuestion.options && (
        <div>
          <div className="space-y-2 mb-4 mx-4">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleMultiSelectToggle(option)}
                className={`w-full px-3 py-2 text-left border-2 rounded-lg transition-all ${selectedMultiOptions.find(item => item.text === option.text)
                    ? 'border-green-300 bg-green-50 text-primary'
                    : 'border-gray-300 hover:border-green-300'
                  }`}
              >
                <div className="flex items-center justify-between jost">
                  <span className="jost">{option.text}</span>
                  <span className="text-sm jost">
                    {selectedMultiOptions.find(item => item.text === option.text) ? '✓' : '+'}
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