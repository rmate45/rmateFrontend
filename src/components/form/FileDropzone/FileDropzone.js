"use client";

import React from "react";
import { useDropzone } from "react-dropzone";
import clsx from "clsx";

const FileDropzone = ({
  onDrop,
  file,
  error,
  multiple = false,
  maxFiles = 1,
  accept = { "image/*": [], "application/pdf": [] },
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: maxFiles,
    multiple: multiple,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={clsx(
          "border border-dashed p-6 text-center rounded-md cursor-pointer transition min-h-[160px] flex items-center justify-center",
          {
            "border-primary bg-blue-50": isDragActive,
            "border-gray-300 bg-gray-50": !isDragActive,
            "border-red-500": error,
          }
        )}
      >
        <input {...getInputProps()} />
        <p className="text-sm text-gray-600">
          {file && file.name ? (
            <span className="font-medium text-black">{file.name}</span>
          ) : (
            <>
              Drag and drop files here, or{" "}
              <span className="text-primary underline">browse</span>
            </>
          )}
        </p>
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default FileDropzone;
