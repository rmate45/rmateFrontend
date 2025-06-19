import reloadIcon from "../../assets/reload.svg"; // Adjust the path as necessary

export const ReloadButton = ({ onReload }) => {
  
  return (
    <button
      onClick={onReload}
      className="mr-1 hover:bg-gray-100 rounded-full transition-colors duration-200 self-end"
      title="Reload last question"
    >
      <img src={reloadIcon} alt="reload" className="w-8 h-8" />
    </button>
  );
}