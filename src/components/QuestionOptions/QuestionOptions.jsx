export const QuestionOptions = ({ options, onOptionClick }) => {
  if (!options || options.length === 0) return null;

  return (
    <div className="space-y-2">
      {options.map((option, idx) => (
        <button
          key={idx}
          onClick={() => onOptionClick(option)}
          className="w-full p-3 text-left border-2 border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all"
        >
          {option.text}
        </button>
      ))}
    </div>
  );
};