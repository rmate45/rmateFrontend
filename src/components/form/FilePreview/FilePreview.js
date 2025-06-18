"use client";

import React from "react";
import Image from "next/image";

const FilePreview = ({ file, onRemove }) => {
  // Determine URL
  const fileUrl =
    file.url || (file instanceof File ? URL.createObjectURL(file) : null);

  // Determine file type safely
  const fileType =
    file.type ||
    (file.name ? (file.name.endsWith(".pdf") ? "application/pdf" : "") : "");

  const isImage = fileType.startsWith("image/");
  const isPdf = fileType === "application/pdf";

  // Optional: You may want to set size to null or unknown if no info
  const fileSizeKB = file.size ? (file.size / 1024).toFixed(1) : null;

  return (
    <div className="mt-2 border border-gray-300 rounded-md p-3 bg-gray-50 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 max-w-[80%]">
        {/* Preview Section */}
        {isImage && fileUrl ? (
          <Image
            src={fileUrl}
            alt="Preview"
            width={50}
            height={50}
            className="rounded object-cover border"
          />
        ) : isPdf && fileUrl ? (
          <Image
            src="/pdf.svg"
            alt="Preview"
            width={50}
            height={50}
            className="rounded object-cover border"
          />
        ) : (
          // <iframe
          //   src={fileUrl}
          //   title="PDF Preview"
          //   className="w-[60px] h-[60px] border rounded-sm"
          // />
          <div className="w-[50px] h-[50px] flex items-center justify-center bg-gray-200 rounded">
            <span className="text-sm">📄</span>
          </div>
        )}

        {/* File Info */}
        <div className="flex flex-col justify-center truncate">
          <span className="text-sm font-medium text-gray-800 truncate">
            {file.name}
          </span>
          {fileSizeKB && (
            <span className="text-xs text-gray-500">{fileSizeKB} KB</span>
          )}
        </div>
      </div>

      {/* Remove Button */}
      <button type="button" className="cursor-pointer ml-2" onClick={onRemove}>
        <Image src="/close.svg" width={24} height={24} alt="close" />
      </button>
    </div>
  );
};

export default FilePreview;
