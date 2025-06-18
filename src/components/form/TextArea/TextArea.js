"use client";

import React from "react";
import PropTypes from "prop-types";

const TextArea = React.forwardRef(
  (
    {
      placeholder = "",
      disabled = false,
      className = "",
      rows = 4,
      error,
      ...props
    },
    ref
  ) => {
    return (
      <div className="relative w-full">
        <textarea
          ref={ref}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={`
            w-full bg-gray text-dark focus:outline-none focus:ring-2 focus:ring-primary 
            placeholder-gray-400 px-4 py-3 rounded-md resize-none
            ${disabled ? "opacity-50 cursor-not-allowed" : ""} 
            ${className}
            ${
              error
                ? "border-red-500 focus:ring-red-500"
                : "border border-gray-300"
            }
          `}
          {...props}
        />
        {/* Uncomment below to display the error message if needed */}
        {/* {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>} */}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

TextArea.propTypes = {
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  rows: PropTypes.number,
  error: PropTypes.object,
};

export default TextArea;
