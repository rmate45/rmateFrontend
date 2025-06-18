import React from "react";

const DocumentsPreviewCard = ({ onViewMore }) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm poppins">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xs font-medium text-black">Documents</h2>
        <button
          className="text-[10px] font-medium text-primary hover:underline"
          onClick={onViewMore}
        >
          View More
        </button>
      </div>

      <div className="flex gap-1">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="w-[70px] h-[80px] bg-[#D9D9D9] rounded-md"
          ></div>
        ))}
      </div>
    </div>
  );
};

export default DocumentsPreviewCard;
