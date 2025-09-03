import sendIcon from "../../assets/send.svg";
import { useState, useEffect } from "react";
import api from "../../api/api";

export const TextInput = ({
  value,
  onChange,
  onSubmit,
  validateAsZip = false,
  onValidationError,
  scrollToBottom, // Add this new prop
}) => {
  const [isValid, setIsValid] = useState(true);
  const [validZipCode, setValidZipCode] = useState(null);
  const [loading, setLoading] = useState(false);

  // Scroll to bottom when error message appears
  useEffect(() => {
    if (validZipCode && scrollToBottom) {
      setTimeout(() => {
        scrollToBottom();
      }, 100); // Small delay to ensure DOM is updated
    }
  }, [validZipCode, scrollToBottom]);

  const validateZip = async (zip) => {
    if (!zip || zip.length < 3 || zip.length > 6) {
      setIsValid(false);
      setValidZipCode("ZIP code must be between 3 and 6 digits.");
      onValidationError?.();
      return false;
    }

    try {
      setLoading(true);
      const { data } = await api.post("/check-valid-zipcode", {
        zipcode: zip,
      });
      setIsValid(data?.type === "success");

      if (data?.type !== "success") {
        setValidZipCode("Invalid ZIP code.");
        onValidationError?.();
        return false;
      }

      setValidZipCode(null);
      return true;
    } catch (error) {
      console.error("ZIP code validation failed", error);
      setValidZipCode(
        error?.response?.data?.message || "ZIP code validation failed."
      );
      setIsValid(false);
      onValidationError?.();
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (rawValue) => {
    const cleaned = validateAsZip ? rawValue.replace(/\D/g, "") : rawValue;
    onChange(cleaned);
    setIsValid(true);
    setValidZipCode(null);
  };

  const handleSubmit = async () => {
    if (validateAsZip) {
      const isZipValid = await validateZip(value);
      if (isZipValid) onSubmit();
    } else {
      if (value.trim()) {
        setIsValid(true);
        onSubmit();
      } else {
        setIsValid(false);
        onValidationError?.();
        // Show error for empty input and scroll
        if (scrollToBottom) {
          setTimeout(() => {
            scrollToBottom();
          }, 100);
        }
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
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
          className={`w-full px-4 py-2 pr-10 border-2 rounded-xl text-sm focus:outline-none ${
            isValid ? "border-gray-300" : "border-red-500"
          }`}
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-0 text-blue disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          <img src={sendIcon} alt="send" className="w-6 mt-4 mb-4" />
        </button>
      </div>
      {validZipCode && <p className="text-red-500 text-sm">{validZipCode}</p>}
    </div>
  );
};