import React, { useEffect } from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import SeoHelmet from "../components/Seo/SeoHelmet";

const ContactPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleLoginClick = () => {
    window.open("/quiz");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SeoHelmet
        title="Contact Us | RetireMate"
        description="Get in touch with RetireMate. Reach us at 578 Washington Blvd Ste 693, Marina Del Rey, CA 90292, by email at John@retiremate.com, or by phone at 603-252-2976."
        url={`${(import.meta.env.VITE_WEBSITE_URL || "https://www.retiremate.com").trim()}/contact`}
      />
      <Header onLoginClick={handleLoginClick} alwaysGreen={true} redirectToHome={true} />

      <div className="pt-32 pb-16 px-4 sm:px-6 bg-white grow">
        <div className="max-w-4xl mx-auto">

          {/* Page Title */}
          <div className="mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-introPrimary jost">
              Contact Us
            </h1>
            <p className="text-base sm:text-lg text-gray-600 jost">
              We'd love to hear from you. Reach out using any of the details below.
            </p>
          </div>

          {/* Contact Card */}
          <div className="border-l-4 border-introPrimary pl-6">
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 sm:p-8 space-y-6">

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="mt-1 w-10 h-10 rounded-full bg-introPrimary/10 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-introPrimary" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.079 3.218-4.402 3.218-7.327a6.5 6.5 0 00-13 0c0 2.925 1.274 5.248 3.218 7.327a19.58 19.58 0 002.683 2.282 16.975 16.975 0 001.144.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide jost mb-1">Address</p>
                  <p className="text-base sm:text-lg text-gray-700 jost">578 Washington Blvd Ste 693</p>
                  <p className="text-base sm:text-lg text-gray-700 jost">Marina Del Rey, CA 90292</p>
                </div>
              </div>

              <div className="border-t border-gray-200" />

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="mt-1 w-10 h-10 rounded-full bg-introPrimary/10 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-introPrimary" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide jost mb-1">Email</p>
                  <a
                    href="mailto:John@retiremate.com"
                    className="text-base sm:text-lg text-introPrimary hover:underline font-medium jost"
                  >
                    John@retiremate.com
                  </a>
                </div>
              </div>

              <div className="border-t border-gray-200" />

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="mt-1 w-10 h-10 rounded-full bg-introPrimary/10 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-introPrimary" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide jost mb-1">Phone</p>
                  <a
                    href="tel:+16032522976"
                    className="text-base sm:text-lg text-introPrimary hover:underline font-medium jost"
                  >
                   +1 603-252-2976
                  </a>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactPage;
