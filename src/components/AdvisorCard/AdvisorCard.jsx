import locationIcon from "../../assets/location.svg";

export const AdvisorCard = ({ name, location, onConsult }) => (
  <div className="bg-[#ececec] rounded-2xl shadow-sm p-5">
    <div className="text-center space-y-6 bg-[#fff] rounded-2xl px-5 py-8 flex flex-col justify-center items-center min-h-[200px]">
      <div className="font-medium text-[#616161] text-md">
        {name || "Business Name to be Shown Here"}
      </div>
      <div className="text-[#828384] text-sm font-normal flex items-center justify-center gap-1 w-full">
        <div className="flex items-center w-full gap-2">
          <div className="flex-grow border-t border-[#dcdcdc]" />
          <div className="flex items-center gap-1 whitespace-nowrap">
            <img src={locationIcon} alt="location" className="w-5 h-5" />
            <span>{location || "Newport Beach, CA"}</span>
          </div>
          <div className="flex-grow border-t border-[#dcdcdc]" />
        </div>
      </div>
      <button
        onClick={onConsult}
        className="bg-blue text-white text-sm font-normal px-4 py-2 mt-2 rounded"
      >
        Free Consultation
      </button>
    </div>
  </div>
);
