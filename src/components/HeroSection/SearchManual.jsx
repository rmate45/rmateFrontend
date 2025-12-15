import React from "react";
const SearchManual = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = React.useState("");
    const inputRef = React.useRef(null);
    const handleSearch = () => {
        const query = searchQuery.trim();

        if (query) {
            const url = `/quiz?title=${encodeURIComponent(query)}`;
            window.open(url, "_blank"); // ✅ opens in new tab
        }

        if (typeof onSearch === "function") onSearch(searchQuery);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <form
            className="px-3 border-b border-gray-100 mb-5"
            onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
            }}
        >
            <div className="bg-white rounded-full flex items-center  max-w-xl mx-auto mt-10 relative">

                <input
                    disabled={searchQuery.length === 0}
                    ref={inputRef}
                    type="text"
                    placeholder="Ask any question about Retiremate - Financial, Health, Travel"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 outline-none rounded-lg  h-12 jost font-normal text-base px-2 pr-[94px] text-introPrimary border-introPrimary border"
                    placeholdertextcolor="#567257"
                />
                <button className="text-base rounded-lg px-4 right-[5px] py-2  bg-introPrimary text-white absolute" type="submit">
                    Submit
                </button>
            </div>
           <div className="flex items-center mt-5 max-w-48 m-auto gap-3">
            <span className="flex-1 h-px bg-gray-400"></span>
             <h2 className="text-center text-[#6B7280] text-xl ">
                OR
            </h2>
            <span className="flex-1 h-px bg-gray-400"></span>
           </div>
            <h2 className="text-center text-introPrimary font-medium text-2xl mb-8 mt-5">
                Explore Answers to Real Questions People Ask

            </h2>
        </form>
    );
};

export default SearchManual