import { useState, useEffect } from "react";
import { QuestionOptions } from "../QuestionOptions/QuestionOptions";
import { RangeSlider } from "../RangeSlider/RangeSlider";
import { TextInput } from "../TextInput/TextInput";

export const QuestionDisplay = ({
  currentQuestion,
  loading,
  textInput,
  onTextChange,
  onOptionClick,
  onTextSubmit,
  onMultiSelectSubmit,
  onValidationError,
}) => {
  const [selectedMultiOptions, setSelectedMultiOptions] = useState([]);
  
  if (!currentQuestion || loading) return null;

  const isValidateZip = currentQuestion?.questionId === "Q7"; // Question 7 asks for zip code

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
      setSelectedMultiOptions([]);
    }
  };

  return (
    <div className="mt-4">
      <div className="mb-2 text-sm border-2 border-secondary px-4 py-2 text-center rounded-xl text-gray-800 font-semibold max-w-sm">
        {currentQuestion.questionText}
      </div>

      {/* Free Text Input */}
      {currentQuestion.inputType === "free_text" && (
        <TextInput
          value={textInput}
          onChange={onTextChange}
          onSubmit={onTextSubmit}
          validateAsZip={isValidateZip}
          onValidationError={onValidationError}
        />
      )}

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
          <div className="space-y-2 mb-4">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleMultiSelectToggle(option)}
                className={`w-full p-3 text-left border-2 rounded-lg transition-all ${
                  selectedMultiOptions.find(item => item.text === option.text)
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 hover:border-green-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option.text}</span>
                  <span className="text-sm">
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
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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