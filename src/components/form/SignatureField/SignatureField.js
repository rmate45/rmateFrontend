"use client";
import React from "react";
import SignatureCanvas from "react-signature-canvas";
import PropTypes from "prop-types";

const SignatureField = ({ label, sigRef, signatureError, onClear }) => {
  const isEmpty = sigRef?.current?.isEmpty?.();

  return (
    <div className="mt-5 max-w-1/3">
      <h2 className="mb-3">{label}</h2>
      <div className="border border-gray-300 rounded-md relative">
        <SignatureCanvas
          ref={sigRef}
          penColor="black"
          canvasProps={{ className: "w-full h-40 rounded-md" }}
        />
        {isEmpty && (
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
            <span className="text-gray-400 font-medium">Sign Here</span>
          </div>
        )}
      </div>
      {signatureError && (
        <p className="text-sm text-red-500 mt-1">{signatureError}</p>
      )}
      <div className="flex justify-between items-center mt-1">
        <span className="text-xs text-gray-500">Powered by Signature Pad</span>
        <button
          type="button"
          onClick={onClear}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

SignatureField.propTypes = {
  label: PropTypes.string,
  sigRef: PropTypes.object.isRequired,
  signatureError: PropTypes.string,
  onClear: PropTypes.func.isRequired,
};

export default SignatureField;
