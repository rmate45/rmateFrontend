import { useState } from "react";
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
      {validationMessage && (
        <p className="text-red-500 jost text-sm">{validationMessage}</p>
      )}
      <div className="relative flex">
        <PhoneInput
          country={"us"} // default country
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
          containerClass="w-full jost"
          inputProps={{
            name: "phone",
            required: true,
            autoFocus: false,
          }}
          dropdownStyle={{
            top: "auto", // disable normal "below"
            bottom: "100%", // place above input
            position: "absolute",
            zIndex: 1000, // keep above other UI
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
