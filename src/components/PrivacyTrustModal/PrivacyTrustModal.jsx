import React, { useEffect, useRef, useState } from "react";

const PrivacyTrustModal = ({show, onClose}) => {
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
        <div style={{backgroundColor:"rgba(0,0,0,30%)"}} className="fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300">
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
            <h2 className="text-xl font-semibold mb-4 text-center">
              Privacy &amp; Trust
            </h2>

            {/* Description */}
            <p className="text-gray-700 text-base font-semibold mb-4 leading-relaxed">
              We built RetireMate to help you explore and achieve a better
              retirement — not to collect your personal data.
            </p>

            <p className="text-gray-700 text-sm font-medium mb-2">
              Here's how we handle information:
            </p>

            {/* Info List */}
            <ul className="list-disc list-inside text-gray-700 text-sm space-y-2 text-left pl-8">
              <li className="list-outside">
                You can use the site anonymously. We don't track you or set
                cookies.
              </li>
              <li className="list-outside">
                If you create a free account to get more personalized answers
                and articles, we'll ask for basic contact info (name, email,
                phone) so we can save your progress, authenticate you when
                logging in, and customize your experience.
              </li>
              <li className="list-outside">
                Your inputs stay private and are used only to improve your
                results.
              </li>
              <li className="list-outside">
                We may use aggregated, non-identifiable data to make the site
                better.
              </li>
            </ul>

            {/* Close Button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={() => {setIsOpen(false); onClose()}}
                className="bg-[#D8EBD2] text-gray-800 font-medium px-6 py-2 rounded-md hover:bg-[#c4e0be] transition"
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
