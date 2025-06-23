import sendIcon from "../../assets/send.svg";
import { useState } from "react";
import api from "../../api/api";

export const TextInput = ({
  value,
  onChange,
  onSubmit,
  validateAsZip = false,
  onValidationError,
}) => {
  const [isValid, setIsValid] = useState(true);
  const [validZipCode, setValidZipCode] = useState(null);
  // console.log(onValidationError,"onValidationError");

  const isValidZip = async (zip) => {
    if (!zip || zip.length < 0 || zip.length > 6) {
      setIsValid(false);
      onValidationError?.();
      return;
    }

    try {
      const { data } = await api.post("/check-valid-zipcode", {
        zipcode: zip,
      });

      // Check server response
      setIsValid(data?.type === "success");
      setValidZipCode(null);
    } catch (error) {
      console.error("ZIP code validation failed", error);
      setIsValid(false);
      setValidZipCode(
        error?.response?.data?.message || "ZIP code validation failed."
      );
      onValidationError?.();
    }
  };

  const handleChange = (rawValue) => {
    const cleaned = validateAsZip ? rawValue.replace(/\D/g, "") : rawValue;

    onChange(cleaned);
    setValidZipCode(null);
    setIsValid(false);

    if (validateAsZip) {
      if (cleaned.length > 0 && cleaned.length <= 6) {
        isValidZip(cleaned);
        onValidationError?.();
      } else {
        setIsValid(false);
      }
    } else {
      setIsValid(!!cleaned.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && isValid && !validZipCode) {
      onSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <input
          type="text"
          inputMode={validateAsZip ? "numeric" : "text"}
          pattern={validateAsZip ? "\\d{0,6}" : undefined}
          maxLength={validateAsZip ? 6 : undefined}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            validateAsZip
              ? "Enter ZIP code (3–6 digits)"
              : "Type your answer here..."
          }
          className={`w-full px-4 py-2 pr-10 border-2 border-gray-300 rounded-xl text-sm focus:outline-none focus:border-primary}`}
        />
        <button
          onClick={onSubmit}
          disabled={!isValid || validZipCode !== null}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-0 text-blue disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          <img src={sendIcon} alt="send" className="w-6 mt-4 mb-4" />
        </button>
      </div>

      {/* {validateAsZip && value.length > 0 && !isValid && (
        <p className="text-red-500 text-sm">
          ZIP code must be between 3 and 6 digits.
        </p>
      )} */}

      {validZipCode && <p className="text-red-500 text-sm">{validZipCode}</p>}
    </div>
  );
};
