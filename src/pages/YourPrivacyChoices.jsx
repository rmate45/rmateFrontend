import React from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const YourPrivacyChoices = () => {
  const handleLoginClick = () => {
    window.open("/quiz");
  };

  const handleFooterLinkClick = (link) => {
    console.log("Footer link clicked:", link);
  };

  return (
    <>
      <Header onLoginClick={handleLoginClick} alwaysGreen={true} redirectToHome={true} />
      <div className="min-h-screen pt-32 pb-16 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-introPrimary">
              Your Privacy Choices
            </h1>
            <div className="text-sm sm:text-base text-gray-600 space-y-1">
              <p><span className="font-semibold">Effective Date:</span> February 18, 2025</p>
              <p><span className="font-semibold">Last Updated:</span> February 18, 2025</p>
            </div>
          </div>

          {/* Introduction */}
          <div className="mb-10">
            <p className="text-base sm:text-lg leading-relaxed text-gray-700 mb-6">
              Depending on where you live, you may have certain rights regarding your personal information under applicable privacy laws.
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-gray-700">
              RetireMate provides this page to explain how you can make privacy-related requests or ask questions about our data practices. For information about how we collect, use, and share information, please review our Privacy Policy.
            </p>
          </div>

          {/* Terms Sections */}
          <div className="space-y-8">
            {/* Section 1 */}
            <section className="border-l-4 border-introPrimary pl-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-introPrimary">
                How to Make a Privacy Request
              </h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p className="text-base sm:text-lg">
                  If you would like to make a request regarding your personal information, or if you have questions about our privacy practices, you may contact us using the information below. We may need to verify your request before responding, and the rights available to you may vary depending on your jurisdiction.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4">
                  <p className="text-base sm:text-lg text-gray-700">
                    Email: <a href="mailto:privacy@retiremate.com" className="text-introPrimary hover:underline font-medium">privacy@retiremate.com</a>
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section className="border-l-4 border-introPrimary pl-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-introPrimary">
                Additional Information
              </h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p className="text-base sm:text-lg">
                  RetireMate is a brand operated by CareMaps Group Inc., a Delaware corporation. Our privacy practices may evolve as our Services develop, and this page is intended to provide a centralized way for users to reach us regarding privacy-related matters.
                </p>
                <p className="text-base sm:text-lg">
                  For more details, please refer to our Privacy Policy.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer onLinkClick={handleFooterLinkClick} />
    </>
  );
};

export default YourPrivacyChoices;

