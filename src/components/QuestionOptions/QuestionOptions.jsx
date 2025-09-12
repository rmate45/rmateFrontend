export const QuestionOptions = ({ options, onOptionClick }) => {
  if (!options || options.length === 0) return null;

  return (
    <div className="space-y-2 mx-4">
      {options.map((option, idx) => (
        <button
          key={idx}
          onClick={() => onOptionClick(option)}
          className="w-full py-2 px-3 text-left jost border-2 border-gray-300 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all"
        >
          {option.text}
        </button>
      ))}
    </div>
  );
};