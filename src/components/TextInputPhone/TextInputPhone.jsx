import { useState, useRef, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import sendIcon from "../../assets/send.svg";

export const TextInputPhone = ({
  value,
  onChange,
  onSubmit,
  onValidationError,
}) => {
  const [isValid, setIsValid] = useState(true);
  const [validationMessage, setValidationMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  // Auto focus on mount
  useEffect(() => {
    if (inputRef.current) {
      // react-phone-input-2 nests the input, so we target it
      const inputEl = inputRef.current.querySelector("input");
      if (inputEl) {
        inputEl.focus();
      }
    }
  }, []);

  const validatePhoneNumber = (phone) => {
    if (!phone || phone.length < 7 || phone.length > 15) {
      setIsValid(false);
      setValidationMessage("Phone number must be between 7 and 15 digits.");
      onValidationError?.();
      return false;
    }
    setIsValid(true);
    setValidationMessage(null);
    return true;
  };

  const handleSubmit = () => {
    if (value) {
      const isPhoneValid = validatePhoneNumber(value);
      if (isPhoneValid) {
        onSubmit?.({
          fullNumber: `+${value}`, // react-phone-input-2 gives full number with country code
          phoneNumber: value,
        });
      }
    } else {
      setIsValid(false);
      setValidationMessage("Please enter a phone number.");
      onValidationError?.();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <style>{`
        .phone-input-upward .flag-dropdown.open .country-list,
        .phone-input-upward .flag-dropdown.open ul.country-list {
          top: auto !important;
          bottom: 100% !important;
          margin-bottom: 4px !important;
          transform: none !important;
          position: absolute !important;
        }
        .phone-dropdown-upward {
          top: auto !important;
          bottom: 100% !important;
          margin-bottom: 4px !important;
        }
      `}</style>
      {validationMessage && (
        <p className="text-red-500 jost text-sm">{validationMessage}</p>
      )}
      <div className="relative flex" ref={inputRef}>
        <PhoneInput
         country="us"
  onlyCountries={["us", "ca"]}
  preferredCountries={["us", "ca"]}
  disableCountryCode={true}
          value={value}
          onChange={(phone) => {
            onChange(phone);
            setIsValid(true);
            setValidationMessage(null);
          }}
          inputClass={`!w-full !pl-12 !pr-10 !py-3 !text-sm !border-2 !rounded-xl !h-[50px] jost ${
            isValid ? "!border-gray-300" : "!border-red-500 "
          }`}
          buttonClass={`!border-2 !rounded-l-xl ${
            isValid ? "!border-gray-300" : "!border-red-500 "
          }`}
          containerClass="w-full jost phone-input-upward"
          dropdownClass="phone-dropdown-upward"
          inputProps={{
            name: "phone",
            required: true,
            onKeyDown: (e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // prevent form submit reloads
                handleSubmit();
              }
            },
          }}
        />

        {/* Send button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-blue-500 hover:text-blue-600 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          <img src={sendIcon} alt="send" className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
