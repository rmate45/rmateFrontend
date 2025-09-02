import { useState, useRef, useEffect } from "react";
import { ChevronDown, Send } from "lucide-react";
import api from "../../api/api";

// Country codes data
const countryCodes = [
  { code: "+1", country: "US", flag: "🇺🇸", name: "United States" },
  { code: "+1", country: "CA", flag: "🇨🇦", name: "Canada" },
  { code: "+44", country: "GB", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+33", country: "FR", flag: "🇫🇷", name: "France" },
  { code: "+49", country: "DE", flag: "🇩🇪", name: "Germany" },
  { code: "+39", country: "IT", flag: "🇮🇹", name: "Italy" },
  { code: "+34", country: "ES", flag: "🇪🇸", name: "Spain" },
  { code: "+91", country: "IN", flag: "🇮🇳", name: "India" },
  { code: "+86", country: "CN", flag: "🇨🇳", name: "China" },
  { code: "+81", country: "JP", flag: "🇯🇵", name: "Japan" },
  { code: "+82", country: "KR", flag: "🇰🇷", name: "South Korea" },
  { code: "+61", country: "AU", flag: "🇦🇺", name: "Australia" },
  { code: "+55", country: "BR", flag: "🇧🇷", name: "Brazil" },
  { code: "+52", country: "MX", flag: "🇲🇽", name: "Mexico" },
  { code: "+7", country: "RU", flag: "🇷🇺", name: "Russia" },
];

export const TextInputPhone = ({
  value,
  onChange,
  onSubmit,
  onValidationError,
}) => {
  const [isValid, setIsValid] = useState(true);
  const [validationMessage, setValidationMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter countries based on search term
  const filteredCountries = countryCodes.filter(
    country =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.code.includes(searchTerm) ||
      country.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validatePhoneNumber = async (phone, countryCode) => {
    const fullPhoneNumber = `${countryCode}${phone}`;
    
    // Basic validation - check if phone number has reasonable length
    if (!phone || phone.length < 7 || phone.length > 15) {
      setIsValid(false);
      setValidationMessage("Phone number must be between 7 and 15 digits.");
      onValidationError?.();
      return false;
    } else {
        return true;
    }

    // Remove any non-digit characters for validation
    const cleanedPhone = phone.replace(/\D/g, "");
    if (cleanedPhone.length < 7 || cleanedPhone.length > 15) {
      setIsValid(false);
      setValidationMessage("Invalid phone number format.");
      onValidationError?.();
      return false;
    }

    try {
      setLoading(true);
      // You can replace this with your actual phone validation API
      const { data } = await api.post("/validate-phone", {
        phoneNumber: fullPhoneNumber,
        countryCode: selectedCountry.country,
      });
      
      setIsValid(data?.type === "success");

      if (data?.type !== "success") {
        setValidationMessage("Invalid phone number.");
        onValidationError?.();
        return false;
      }

      setValidationMessage(null);
      return true;
    } catch (error) {
      console.error("Phone validation failed", error);
      setValidationMessage(
        error?.response?.data?.message || "Phone validation failed."
      );
      setIsValid(false);
      onValidationError?.();
      return false;
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (phone, countryCode) => {
    // Basic US/Canada formatting
    if (countryCode === "+1" && phone.length === 10) {
      return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
    }
    return phone;
  };

  const handleChange = (rawValue) => {
    // Only allow digits, spaces, parentheses, and hyphens
    const cleaned = rawValue.replace(/[^\d\s\-\(\)]/g, "");
    onChange(cleaned);
    setIsValid(true);
    setValidationMessage(null);
  };

  const handleSubmit = async () => {
    if (value.trim()) {
      const isPhoneValid = await validatePhoneNumber(value, selectedCountry.code);
      if (isPhoneValid) {
        // Create a formatted phone number object to pass
        const phoneData = {
          fullNumber: `${selectedCountry.code}${value.replace(/\D/g, "")}`,
          displayNumber: `${selectedCountry.code} ${formatPhoneNumber(value, selectedCountry.code)}`,
          countryCode: selectedCountry.code,
          phoneNumber: value.replace(/\D/g, ""),
          countryFlag: selectedCountry.flag,
          countryName: selectedCountry.name
        };
        onSubmit(phoneData);
      }
    } else {
      setIsValid(false);
      setValidationMessage("Please enter a phone number.");
      onValidationError?.();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    setSearchTerm("");
    inputRef.current?.focus();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setSearchTerm("");
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="relative flex">
        {/* Country Code Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={toggleDropdown}
            className={`flex items-center gap-2 px-2 py-1 border-2 rounded-l-xl bg-gray-50 hover:bg-gray-100 focus:outline-none transition-colors ${
              isValid ? "border-gray-300" : "border-red-500"
            }`}
          >
            <span className="text-lg">{selectedCountry.flag}</span>
            <span className="text-sm font-medium">{selectedCountry.code}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute bottom-full left-0 z-50 w-80 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden mb-2">
              {/* Search Input */}
              <div className="p-2 border-b">
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-1 text-sm border rounded focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Countries List */}
              <div className="overflow-y-auto max-h-48">
                {filteredCountries.map((country, index) => (
                  <button
                    key={`${country.country}-${index}`}
                    onClick={() => handleCountrySelect(country)}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-lg">{country.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium truncate">{country.name}</span>
                        <span className="text-sm text-gray-600 ml-2">{country.code}</span>
                      </div>
                    </div>
                  </button>
                ))}
                {filteredCountries.length === 0 && (
                  <div className="px-3 py-2 text-sm text-gray-500 text-center">
                    No countries found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Phone Number Input */}
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="tel"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter phone number"
            className={`w-full px-4 py-2 pr-10 border-2 border-l-0 rounded-r-xl text-sm focus:outline-none ${
              isValid ? "border-gray-300" : "border-red-500"
            }`}
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-blue-500 hover:text-blue-600 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {validationMessage && (
        <p className="text-red-500 text-sm">{validationMessage}</p>
      )}
      
      {/* Display formatted full phone number */}
      {value && !validationMessage && (
        <p className="text-gray-600 text-sm">
          Full number: {selectedCountry.code} {formatPhoneNumber(value, selectedCountry.code)}
        </p>
      )}
    </div>
  );
};