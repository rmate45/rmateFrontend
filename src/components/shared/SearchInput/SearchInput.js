"use client";
import React, { useState } from "react";
import PropTypes from "prop-types";
import Image from "next/image";

const SearchInput = React.forwardRef(
    (
        {
            placeholder = "Search by ID or name",
            type = "text",
            disabled = false,
            className = "",
            error,
            onSearch,
            ...props
        },
        ref
    ) => {
        const [value, setValue] = useState('');

        const handleChange = (e) => {
            const newValue = e.target.value;
            setValue(newValue);
            onSearch(newValue);
        };

        return (
            <div className="relative w-full min-w-[330px]">
                <input
                    ref={ref}
                    type={type}
                    placeholder={placeholder}
                    disabled={disabled}
                    onChange={handleChange}
                    className={`
            w-full bg-white text-dark focus:outline-none focus:ring-1 focus:ring-primary 
            placeholder-subheadline py-2 pl-10 pr-8 rounded-md border border-subheadline shadow-sm
            ${disabled ? "opacity-50 cursor-not-allowed" : ""} 
            ${className}
          `}
                    {...props}
                />
                <Image src="/search-normal.svg" alt="search" width={24} height={24} className="absolute top-[9px] cursor-pointer left-2 flex items-center" />
            </div>
        );
    }
);

SearchInput.displayName = "SearchInput";

SearchInput.propTypes = {
    placeholder: PropTypes.string,
    type: PropTypes.string,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    error: PropTypes.object,
};

export default SearchInput;
