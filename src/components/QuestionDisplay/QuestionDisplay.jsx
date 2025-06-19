import { useState,useEffect } from "react";
import { QuestionOptions } from "../QuestionOptions/QuestionOptions";
import { RangeSlider } from "../RangeSlider/RangeSlider";
import { TextInput } from "../TextInput/TextInput";

const findMatchingOption = (options, selectedValue) => {
  for (const option of options) {
    if (option.value === "less_than_40" && selectedValue < 40) return option;
    if (option.value === "40_49" && selectedValue >= 40 && selectedValue <= 49)
      return option;
    if (option.value === "50_59" && selectedValue >= 50 && selectedValue <= 59)
      return option;
    if (option.value === "60_65" && selectedValue >= 60 && selectedValue <= 65)
      return option;
    if (option.value === "66_79" && selectedValue >= 66 && selectedValue <= 79)
      return option;
    if (option.value === "80+" && selectedValue >= 80) return option;
  }
  return null;
};

const matchRetirementSavedOption = (value) => {
  if (value < 50000) return 0;
  if (value >= 50000 && value <= 200000) return 1;
  if (value > 200000 && value <= 500000) return 2;
  if (value > 500000) return 3;
  return -1;
};

export const QuestionDisplay = ({
  currentQuestion,
  loading,
  textInput,
  onTextChange,
  onOptionClick,
  onTextSubmit,
   onValidationError
}) => {
  if (!currentQuestion || loading) return null;
  const [rangeValue, setRangeValue] = useState(20);
  const [savedForRetiementRange, setSavedForRetirementRange] = useState(20000);
  const [yearAmountRange, setYearAmountRange] = useState(20000);
 const isValidateZip =
    currentQuestion?.questionText ===
      "Where do you currently live? Please be as specific as possible (Address, Zip Code, Neighborhood, City, or State)" ||
    currentQuestion?.questionText ===
      "Where do you currently live? Please enter your zip code";
const [shouldValidateZip,setShouldValidateZip] = useState(isValidateZip)

useEffect(() => {
    const isValidateZip =
      currentQuestion.questionText ===
        "Where do you currently live? Please be as specific as possible (Address, Zip Code, Neighborhood, City, or State)" ||
      currentQuestion.questionText ===
        "Where do you currently live? Please enter your zip code";
if(isValidateZip){
   setShouldValidateZip(isValidateZip);
}
else{
   setShouldValidateZip(false);
}
   
  }, [currentQuestion]);

 
  return (
    <div className="mt-4">
      <div className="mb-2 text-sm border-2 border-secondary px-4 py-2 text-center rounded-xl text-gray-800 font-semibold max-w-sm">
        {currentQuestion.questionText}
      </div>

      {currentQuestion.type === "option" && currentQuestion.options && (
        <QuestionOptions
          options={currentQuestion.options}
          onOptionClick={onOptionClick}
        />
      )}

      {currentQuestion.type === "text" && (
        <TextInput
          value={textInput}
          onChange={onTextChange}
          onSubmit={onTextSubmit}
          validateAsZip={shouldValidateZip}
           onValidationError={onValidationError}
        
        />
      )}

      {currentQuestion.type === "range" && currentQuestion.quiz_no === 1 && (
        <RangeSlider
          min={currentQuestion.min || 20}
          max={currentQuestion.max || 90}
          value={rangeValue}
          onChange={setRangeValue}
          labelFormatter={(v) => v}
          step={1}
          onSubmit={() => {
            const matchedOption = findMatchingOption(
              currentQuestion.options,
              rangeValue
            );
            if (matchedOption) {
              onOptionClick({
                value: rangeValue,
                comment: matchedOption.comment,
                label: rangeValue,
              });
            }
          }}
        />
      )}

      {currentQuestion.type === "range" &&
        currentQuestion.question_number === 5 && (
          <RangeSlider
            min={20000}
            max={500000}
            value={savedForRetiementRange}
            onChange={setSavedForRetirementRange}
            labelFormatter={(v) =>
              v >= 1000000
                ? `$${(v / 1000000).toFixed(1)}M`
                : `$${v?.toLocaleString()}`
            }
            step={5000} // adjustable for smoothness vs precision
            onSubmit={() => {
              const idx = matchRetirementSavedOption(savedForRetiementRange);
              const matchedOption = currentQuestion.options[idx];
              if (matchedOption) {
                onOptionClick({
                  value: savedForRetiementRange,
                  comment: matchedOption.comment,
                  label: `$${savedForRetiementRange}`,
                });
              }
            }}
          />
        )}

      {currentQuestion.type === "range" &&
        currentQuestion.question_number === 6 && (
          <RangeSlider
            min={20000}
            max={500000}
            value={yearAmountRange}
            onChange={setYearAmountRange}
            labelFormatter={(v) =>
              v >= 1000000
                ? `$${(v / 1000000).toFixed(1)}M`
                : `$${v?.toLocaleString()}`
            }
            step={5000} // adjustable for smoothness vs precision
            onSubmit={() => {
              const onlyOption = currentQuestion.options?.[0];
              if (onlyOption) {
                onOptionClick({
                  value: yearAmountRange,
                  comment: onlyOption.comment,

                  label: `$${yearAmountRange}`,
                });
              }
            }}
          />
        )}
    </div>
  );
};
