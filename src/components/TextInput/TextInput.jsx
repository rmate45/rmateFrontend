import sendIcon from "../../assets/send.svg";
import { useState, useEffect } from "react";
import api from "../../api/api";
import { useRef } from "react";

export const TextInput = ({
  value,
  onChange,
  onSubmit,
  validateAsZip = false,
  onValidationError,
  isAgeInput = false,
  scrollToBottom,
}) => {
  const [isValid, setIsValid] = useState(true);
  const [validationMessage, setValidationMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const [hasFocused, setHasFocused] = useState(false);

  // Enhanced focus handling with better mobile support
  useEffect(() => {
    const focusInput = () => {
      if (inputRef.current && !hasFocused) {
        const isMobile =
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          );

        if (isMobile) {
          // For mobile, use a user interaction to trigger focus
          // This works better than automatic focus
          const handleFirstInteraction = () => {
            if (inputRef.current && !hasFocused) {
              inputRef.current.focus();
              setHasFocused(true);
            }
            // Remove listeners after first interaction
            document.removeEventListener("touchstart", handleFirstInteraction);
            document.removeEventListener("click", handleFirstInteraction);
          };

          // Add listeners for user interaction
          document.addEventListener("touchstart", handleFirstInteraction, {
            once: true,
          });
          document.addEventListener("click", handleFirstInteraction, {
            once: true,
          });

          // Also try delayed focus as backup
          setTimeout(() => {
            if (inputRef.current && !hasFocused) {
              inputRef.current.focus();
              inputRef.current.click();
              setHasFocused(true);
            }
          }, 500);
        } else {
          // Desktop - normal focus
          inputRef.current.focus();
          setHasFocused(true);
        }
      }
    };

    // Use requestAnimationFrame for better timing
    const animationFrame = requestAnimationFrame(() => {
      setTimeout(focusInput, 100);
    });

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [hasFocused]);

  useEffect(() => {
    if (validationMessage && scrollToBottom) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [validationMessage, scrollToBottom]);

  const validateZip = async (zip) => {
    if (!zip || zip.length < 3 || zip.length > 6) {
      setIsValid(false);
      setValidationMessage("ZIP code must be between 3 and 6 digits.");
      onValidationError?.();
      return false;
    }

    try {
      setLoading(true);
      const { data } = await api.post("/check-valid-zipcode", { zipcode: zip });
      setIsValid(data?.type === "success");

      if (data?.type !== "success") {
        setValidationMessage("Invalid ZIP code.");
        onValidationError?.();
        return false;
      }

      setValidationMessage(null);
      return true;
    } catch (error) {
      console.error("ZIP code validation failed", error);
      setValidationMessage(
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
    let cleaned = rawValue;

    if (validateAsZip) {
      cleaned = rawValue.replace(/\D/g, ""); // only digits
    } else if (isAgeInput) {
      cleaned = rawValue.replace(/\D/g, ""); // only digits for age too
    }

    onChange(cleaned);
    setIsValid(true);
    setValidationMessage(null);
  };

  const handleSubmit = async () => {
    if (validateAsZip) {
      const isZipValid = await validateZip(value);
      if (isZipValid) onSubmit();
    } else if (isAgeInput) {
      const age = parseInt(value, 10);
      if (!age || isNaN(age) || age < 18) {
        setIsValid(false);
        setValidationMessage("Age must be a number and at least 18.");
        onValidationError?.();
        if (scrollToBottom) {
          setTimeout(() => {
            scrollToBottom();
          }, 100);
        }
      } else {
        setIsValid(true);
        onSubmit();
      }
    } else {
      if (value.trim()) {
        setIsValid(true);
        onSubmit();
      } else {
        setIsValid(false);
        setValidationMessage("This field is required.");
        onValidationError?.();
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
      {validationMessage && (
        <p className="text-red-500 jost text-sm">{validationMessage}</p>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          autoFocus
          type={isAgeInput ? "number" : "text"}
          inputMode={validateAsZip || isAgeInput ? "numeric" : "text"}
          pattern={validateAsZip || isAgeInput ? "\\d*" : undefined}
          maxLength={validateAsZip ? 6 : undefined}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            validateAsZip
              ? "Enter ZIP code (3–6 digits)"
              : isAgeInput
              ? "Enter your age (18+)"
              : "Type your answer here..."
          }
          className={`w-full px-4 py-3 pr-10 border-2 jost rounded-xl text-sm focus:outline-none focus:border-secondary ${
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
    </div>
  );
};
