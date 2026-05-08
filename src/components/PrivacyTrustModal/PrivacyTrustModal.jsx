import React, { useEffect, useRef, useState } from "react";

const BASE_URL = (import.meta.env.VITE_WEBSITE_URL || "https://www.retiremate.com").trim();

const PrivacyTrustModal = ({
  show,
  onClose,
  privacyPolicyUrl = `${BASE_URL}/privacy-policy`,
  privacyChoicesUrl = `${BASE_URL}/your-privacy-choices`,
}) => {
  console.log(show, "show");
  const [isOpen, setIsOpen] = useState(show);
  const modalRef = useRef(null);

  // Detect click outside modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false);
        if (onClose) onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsOpen(show);
  }, [show]);

  return (
    <>
      {isOpen && (
        <div style={{ backgroundColor: "rgba(0,0,0,30%)" }} className="fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300">
          <div
            ref={modalRef}
            className="bg-white w-[90%] max-w-md rounded-md shadow-lg p-6 relative border border-gray-300"
          >
            {/* Close (X) Button */}
            <button
              onClick={() => { setIsOpen(false); if (onClose) onClose(); }}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>

            {/* Title */}
            <h2 className="text-xl font-semibold mb-4 text-center jost">
              Privacy & Trust
            </h2>

            {/* Description */}
            <p className="text-gray-700 text-base font-semibold mb-4 leading-relaxed jost">
              We built RetireMate to help you explore retirement questions and scenarios.
              Protecting your information and being transparent about how it’s used is important to us.
            </p>

            <p className="text-gray-700 text-sm font-medium mb-2 jost">
           Here’s what to know:
            </p>

            {/* Info List */}
            <ul className="list-disc list-inside text-gray-700 text-sm space-y-2 text-left pl-8 jost">
              <li className="list-outside">
               You can explore RetireMate without creating an account.
              </li>
              <li className="list-outside">
              We may collect and use information to operate, improve, and personalize the experience.
              </li>
              <li className="list-outside">
             Some features may ask for contact or other information.
              </li>
              <li className="list-outside">
                We may use aggregated or de-identified data to improve the site.
              </li>

            </ul>
              <p className="text-gray-700 text-sm font-medium mb-2 jost mt-3">
              For full details, please review our <a href={privacyPolicyUrl} className="text-introPrimary cursor-pointer hover:underline!">Privacy Policy</a> and <a className="text-introPrimary cursor-pointer hover:underline!" href={privacyChoicesUrl}>Your Privacy Choices</a>
            </p>
            {/* Close Button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={() => { setIsOpen(false); onClose() }}
                className="bg-[#D8EBD2] text-gray-800 font-medium px-6 py-2 rounded-md hover:bg-[#c4e0be] transition jost"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PrivacyTrustModal;
