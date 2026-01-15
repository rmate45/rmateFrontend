import React from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const PrivacyPolicy = () => {
  const handleLoginClick = () => {
    window.open("/quiz");
  };

  const handleFooterLinkClick = (link) => {
    console.log("Footer link clicked:", link);
  };

  return (
    <>
      <Header onLoginClick={handleLoginClick} />
      <div className="min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-[#2A2420]">Privacy Policy</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed">
              Content will be provided later.
            </p>
          </div>
        </div>
      </div>
      <Footer onLinkClick={handleFooterLinkClick} />
    </>
  );
};

export default PrivacyPolicy;

