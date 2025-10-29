import { useNavigate } from "react-router-dom";

export const ChatHeader = ({ logo }) => {
  const navigate = useNavigate();

  return (
  <div className="fixed top-0 left-0 right-0 xl:bg-transparent bg-white z-10 flex justify-start xl:border-0 border-b-2 border-gray-100 px-4 w-full">
    <img src={logo} alt="RetireMate Logo" className="sm:w-40 w-35 my-2 cursor-pointer" onClick={() => navigate("/")} />
  </div>
  );
};