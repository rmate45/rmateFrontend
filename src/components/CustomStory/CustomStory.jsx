import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FilterDropdown } from "../FilterDropdown/FilterDropdown";
import api from "../../api/api";

const incomeOptions = [
  { value: "25000-50000", label: "$25,000 – $50,000", numeric: 37500 },
  { value: "51000-100000", label: "$51,000 – $100,000", numeric: 75500 },
  { value: "101000-150000", label: "$101,000 – $150,000", numeric: 125500 },
  { value: "151000-200000", label: "$151,000 – $200,000", numeric: 175500 },
  { value: "200000-250000", label: "$200,000 – $250,000", numeric: 225000 },
  { value: "250000-350000", label: "$250,000 – $350,000", numeric: 300000 },
  { value: "350000-500000", label: "$350,000 – $500,000", numeric: 425000 },
  { value: "500000+", label: "$500,000+", numeric: 500000 },
  { value: "no_income", label: "No Income", numeric: 0 },
];

const savingsOptions = [
  { value: "lt_50000", label: "Less than $50,000", numeric: 25000 },
  { value: "50000-100000", label: "$50,000 – $100,000", numeric: 75000 },
  { value: "100000-200000", label: "$100,000 – $200,000", numeric: 150000 },
  { value: "200000-300000", label: "$200,000 – $300,000", numeric: 250000 },
  { value: "300000-400000", label: "$300,000 – $400,000", numeric: 350000 },
  { value: "400000-500000", label: "$400,000 – $500,000", numeric: 450000 },
  { value: "500000-1000000", label: "$500,000 – $1,000,000", numeric: 750000 },
  { value: "1m_plus", label: "1 Million Plus", numeric: 1000000 },
  { value: "nothing", label: "Nothing", numeric: 0 },
];

const CustomStory = () => {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    income: "",
    savings: "",
    zipCode: "",
  });
  const [zipError, setZipError] = useState(null);
  const [loadingZip, setLoadingZip] = useState(false);
  const [isZipValid, setIsZipValid] = useState(true);
  const navigate = useNavigate();

  // handle input change
  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (key === "zipCode") {
      setZipError(null);
      setIsZipValid(true);
    }
  };

  const validateZip = async (zip) => {
    if (!zip || zip.length < 3 || zip.length > 6) {
      setIsZipValid(false);
      setZipError("ZIP code must be between 3 and 6 digits.");
      return false;
    }

    try {
      setLoadingZip(true);
      const { data } = await api.post("/check-valid-zipcode", { zipcode: zip });
      if (data?.type !== "success") {
        setIsZipValid(false);
        setZipError("Invalid ZIP code.");
        return false;
      }

      setIsZipValid(true);
      setZipError(null);
      return true;
    } catch (error) {
      console.error("ZIP validation failed", error);
      setIsZipValid(false);
      setZipError("Failed to validate ZIP code.");
      return false;
    } finally {
      setLoadingZip(false);
    }
  };

  const isFormValid =
    Object.values(formData).every((val) => val !== "") && isZipValid;

  const handleSubmit = async () => {
    const validZip = await validateZip(formData.zipCode);
    if (!validZip) return;

    if (isFormValid) {
      try {
        const incomeObj = incomeOptions.find(
          (opt) => opt.value === formData.income
        );
        const savingsObj = savingsOptions.find(
          (opt) => opt.value === formData.savings
        );

        const payload = {
          age: Number(formData.age),
          gender: formData.gender,
          income: incomeObj?.numeric ?? 0,
          savings: savingsObj?.numeric ?? 0,
          zipCode: formData.zipCode,
        };

        const { data } = await api.post("/save-demographic", payload);

        if (data?.type === "success" && data?.data?._id) {
          navigate(`/quiz/${data.data._id}`);
        } else {
          alert("Failed to save demographic data.");
        }
      } catch (error) {
        console.error("Error saving demographic:", error);
        alert("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="px-6 py-10 sm:py-16">
      <div className="text-center max-w-7xl mx-auto">
        <div className="flex flex-col justify-center">
          <h2 className="text-introPrimary font-medium text-2xl mb-8">
            Create your custom retirement story
          </h2>

          <div className="bg-white border max-w-[800px] w-full border-gray-200 p-6 sm:p-10 rounded-2xl mx-auto shadow-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Age */}
              <div className="flex items-start flex-col w-full">
                <label
                  htmlFor="age"
                  className="block text-sm font-semibold text-[#2A2420] mb-2"
                >
                  Age
                </label>
                <FilterDropdown
                  id="age"
                  value={formData.age}
                  onChange={(val) => handleChange("age", val)}
                  options={[
                    { value: "25", label: "25" },
                    { value: "35", label: "35" },
                    { value: "45", label: "45" },
                    { value: "55", label: "55" },
                    { value: "65", label: "65" },
                    { value: "75", label: "75" },
                  ]}
                />
              </div>

              {/* Gender */}
              <div className="flex items-start flex-col w-full">
                <label
                  htmlFor="gender"
                  className="block text-sm font-semibold text-[#2A2420] mb-2"
                >
                  Gender
                </label>
                <FilterDropdown
                  id="gender"
                  value={formData.gender}
                  onChange={(val) => handleChange("gender", val)}
                  options={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                  ]}
                />
              </div>

              {/* Income */}
              <div className="flex items-start flex-col w-full">
                <label
                  htmlFor="income"
                  className="block text-sm font-semibold text-[#2A2420] mb-2"
                >
                  Income
                </label>
                <FilterDropdown
                  id="income"
                  value={formData.income}
                  onChange={(val) => handleChange("income", val)}
                  options={incomeOptions}
                />
              </div>

              {/* Savings */}
              <div className="flex items-start flex-col w-full">
                <label
                  htmlFor="savings"
                  className="block text-sm font-semibold text-[#2A2420] mb-2"
                >
                  Savings
                </label>
                <FilterDropdown
                  id="savings"
                  value={formData.savings}
                  onChange={(val) => handleChange("savings", val)}
                  options={savingsOptions}
                />
              </div>

              {/* ZIP / Location Input */}
              <div className="flex items-start flex-col w-full">
                <label
                  htmlFor="zipCode"
                  className="block text-sm font-semibold text-[#2A2420] mb-2"
                >
                  Location (ZIP Code)
                </label>

                <div className="relative w-full">
                  <input
                    type="text"
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) =>
                      handleChange("zipCode", e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="Enter ZIP code (3–6 digits)"
                    disabled={loadingZip}
                    maxLength={6}
                    className={`w-full px-4 py-3 pr-10 border-2 jost rounded-xl text-sm focus:outline-none 
                      ${isZipValid ? "border-gray-300" : "border-red-500"} 
                      focus:border-secondary`}
                  />
                </div>

                {zipError && (
                  <p className="text-red-500 text-sm mt-1">{zipError}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!isFormValid || loadingZip}
              className={`mt-8 w-full rounded-xl py-3 font-semibold text-white transition 
                ${
                  isFormValid
                    ? "bg-[#7BB77C] hover:bg-[#6FA56F]"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
            >
              {loadingZip ? "Checking ZIP..." : "Explore this retirement"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomStory;