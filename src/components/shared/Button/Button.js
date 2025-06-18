import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import Spinner from "../Spinner/Spinner";

const Button = ({
  title = "",
  iconSrc = "", // New prop
  iconAlt = "icon", // Optional alt
  onClick,
  type = "button",
  disabled = false,
  variant = "primary",
  size = "md",
  className = "",
  isLoading = false,
}) => {
  const baseClasses =
    "text-nowrap min-h-[40px] font-medium focus:outline-none rounded-md transition inline-flex items-center justify-center cursor-pointer w-fit gap-2 hover:shadow-l";

  const variantStyles = {
    primary: "bg-primary text-white hover:bg-primary",
    secondary:
      "bg-transparent font-medium text-headline border-headline border-1 hover:bg-white ",
    danger: "bg-red-600 text-white hover:bg-red-700 ",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const classes = [
    baseClasses,
    variantStyles[variant] || variantStyles.primary,
    sizeStyles[size] || sizeStyles.md,
    disabled ? "opacity-90 cursor-not-allowed" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      className={classes}
      style={
        variant === "purple"
          ? { minWidth: "386px", borderRadius: "5px" }
          : undefined
      }
    >
      {isLoading ? (
        <div className="flex-shrink-0">
          <Spinner />
        </div>
      ) : (
        <>
          {iconSrc && (
            <Image
              src={iconSrc}
              alt={iconAlt}
              width={20}
              height={20}
              className="flex-shrink-0"
            />
          )}
          {title}
        </>
      )}
    </button>
  );
};

Button.propTypes = {
  title: PropTypes.string.isRequired,
  iconSrc: PropTypes.string,
  iconAlt: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(["primary", "secondary", "danger", "purple"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  className: PropTypes.string,
};

export default Button;
