import sendIcon from "../../assets/send.svg"; 

export const TextInput = ({ value, onChange, onSubmit }) => {
  
  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          placeholder="Type your answer here..."
          className="w-full px-4 py-2 pr-10 border-2 border-gray-300 rounded-xl text-sm focus:outline-none focus:border-primary"
        />
        <button
          onClick={onSubmit}
          disabled={!value.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-0 text-blue disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          <img src={sendIcon} alt="send" className="w-6 mt-4 mb-4" />
        </button>
      </div>
    </div>
  );
};
