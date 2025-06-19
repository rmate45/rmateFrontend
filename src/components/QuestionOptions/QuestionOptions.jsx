export const QuestionOptions = ({ options, onOptionClick }) => (
  <div className="flex flex-col gap-2 max-w-sm">
    {options.map((opt, idx) => (
      <button
        key={idx}
        onClick={() => onOptionClick(opt)}
        className="px-4 py-2 bg-blue hover:bg-blue-600 focus:outline-none text-white rounded-xl text-sm transition-colors duration-200"
      >
        {opt.label}
      </button>
    ))}
  </div>
);