import sendIcon from "../../assets/send.svg";
import { useState } from "react";
import api from "../../api/api";
export const TextInput = ({
  value,
  onChange,
  onSubmit,
  validateAsZip = false,
}) => {
  const [isValid, setIsValid] = useState(true);
  const [validZipCode, setValidZipCode] = useState(null);


const isValidZip = async (zip) => {

    if (!zip || zip.length !== 5) {
      setIsValid(false);
      return;
    }    
    try {
      const { data } = await api.post("/check-valid-zipcode", {
        zipcode: zip,
      });

      // Assuming API returns { isValid: true/false }
      setIsValid(data?.type == "success" ?? false);
  
    } catch (error) {
      console.error("ZIP code validation failed", error);
            setIsValid(true)

          setValidZipCode(error?.response.data.message);

    }
  };
  console.log(validZipCode);
  
 const handleChange = (rawValue) => {
  setValidZipCode(null);
  setIsValid(false)
  console.log("test");
  
    const cleaned = validateAsZip ? rawValue.replace(/\D/g, "") : rawValue;
    onChange(cleaned);

    if (validateAsZip) {
        console.log("test", cleaned);

      // Fire validation only for 5-digit inputs
      if (cleaned.length === 5) {
        isValidZip(cleaned);
      } else {
        setIsValid(false);
      }
    } else {
      setIsValid(!!cleaned.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && isValid) {

      onSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <input
          type="text"
          inputMode={validateAsZip ? "numeric" : "text"}
          pattern={validateAsZip ? "\\d{5}" : undefined}
          maxLength={validateAsZip ? 5 : undefined}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            validateAsZip ? "Enter a valid ZIP code" : "Type your answer here..."
          }
          className="w-full px-4 py-2 pr-10 border-2 border-gray-300 rounded-xl text-sm focus:outline-none focus:border-primary"
        />
        <button
          onClick={onSubmit}
          disabled={!isValid || validZipCode !== null}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-0 text-blue disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          <img src={sendIcon} alt="send" className="w-6 mt-4 mb-4" />
        </button>
      </div>
      {validateAsZip && value.length > 0 && !isValid && (
        <p className="text-red-500 text-sm">Please enter a valid 5-digit ZIP code.</p>
      )}
      {validZipCode != null && (
        <p className="text-red-500 text-sm">{validZipCode}</p>
      )}
    </div>
  );
};
