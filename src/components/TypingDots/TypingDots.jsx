import React from "react";

const TypingDots = () => {
  return (
    <div className="flex items-center space-x-2">
     <span className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
    <span className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
    <span className="w-3 h-3 bg-primary rounded-full animate-bounce"></span>
    </div>
  );
};

export default TypingDots;
