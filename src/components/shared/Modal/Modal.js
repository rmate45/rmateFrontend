"use client";

import Image from "next/image";
import { useEffect } from "react";

const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl p-6 sm:p-10 pt-14 sm:pt-16">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-primary rounded p-1 cursor-pointer"
        >
          <Image src="/close-white.svg" width={24} height={24} alt="close" />
        </button>

        {/* Children */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
