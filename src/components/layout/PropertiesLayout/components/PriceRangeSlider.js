import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export const PriceRangeSlider = ({ priceRange, setPriceRange }) => {
  const handleSliderChange = (newRange) => {
    setPriceRange(newRange);
  };

  const handleMinInput = (e) => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value < priceRange[1]) {
      setPriceRange([value, priceRange[1]]);
    }
  };

  const handleMaxInput = (e) => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value > priceRange[0]) {
      setPriceRange([priceRange[0], value]);
    }
  };

  return (
    <div className="w-full space-y-4">
      <label  className="block text-sm font-medium text-[#98A0B4] mb-2">
        Price Range
      </label>

      <div className="flex space-x-2">
        {/* Min Input */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 text-sm">
            $
          </span>
          <input
            type="number"
            placeholder="Min"
            className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            value={priceRange[0]}
            onChange={handleMinInput}
          />
        </div>

        {/* Max Input */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 text-sm">
            $
          </span>
          <input
            type="number"
            placeholder="Max"
            className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            value={priceRange[1]}
            onChange={handleMaxInput}
          />
        </div>
      </div>

      {/* Displayed Range Values */}
      <div className="flex justify-between text-sm text-purple-600 font-semibold">
        <span>${priceRange[0].toLocaleString()}</span>
        <span>
          $
          {priceRange[1] >= 1e9
            ? (priceRange[1] / 1e9).toFixed(1) + "B"
            : priceRange[1].toLocaleString()}
        </span>
      </div>

      {/* Slider */}
      <Slider
        range
        min={0}
        max={1000000}
        step={100}
        allowCross={false}
        value={priceRange}
        onChange={handleSliderChange}
        trackStyle={[{ backgroundColor: "#a855f7" }]}
        handleStyle={[{ borderColor: "#a855f7" }, { borderColor: "#a855f7" }]}
        railStyle={{ backgroundColor: "#e5e7eb" }}
      />

      {/* Input Fields */}
    </div>
  );
};
