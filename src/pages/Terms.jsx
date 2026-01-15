import React from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const Terms = () => {
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
              RetireMate Terms of Use
            </h1>
            <div className="text-sm sm:text-base text-gray-600 space-y-1">
              <p><span className="font-semibold">Effective Date:</span> February 18, 2025</p>
              <p><span className="font-semibold">Last Updated:</span> February 18, 2025</p>
            </div>
          </div>

          {/* Introduction */}
          <div className="mb-10">
            <p className="text-base sm:text-lg leading-relaxed text-gray-700 mb-6">
              These Terms of Use ("Terms") govern your access to and use of the RetireMate website, products, and services (collectively, the "Services"). RetireMate is a brand operated by CareMaps Group Inc., a Delaware corporation ("CareMaps Group Inc.", "we," "us," or "our"). By accessing or using the Services, you agree to be bound by these Terms.
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-gray-700 font-medium">
              If you do not agree to these Terms, you may not access or use the Services.
            </p>
          </div>

          {/* Terms Sections */}
          <div className="space-y-8">
            {/* Section 1 */}
            <section className="border-l-4 border-introPrimary pl-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-introPrimary">
                1. Nature of the Services
              </h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p className="text-base sm:text-lg">
                  The Services are provided for informational and educational purposes only. RetireMate is designed to help users explore retirement-related questions, scenarios, and concepts.
                </p>
                <p className="text-base sm:text-lg">
                  The Services do not provide financial, investment, tax, legal, or accounting advice, and nothing contained in the Services should be construed as such. You are solely responsible for evaluating any information provided through the Services and for making decisions based on your individual circumstances.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section className="border-l-4 border-introPrimary pl-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-introPrimary">
                2. No Professional or Fiduciary Relationship
              </h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p className="text-base sm:text-lg">
                  Your use of the Services does not create a fiduciary, advisory, client, or professional relationship between you and RetireMate or CareMaps Group Inc.
                </p>
                <p className="text-base sm:text-lg">
                  Any interactions you may have with third parties through the Services are solely between you and those third parties, and RetireMate is not responsible for their actions, advice, or services.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section className="border-l-4 border-introPrimary pl-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-introPrimary">
                3. Eligibility
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                You must be at least 18 years old to use the Services. By using the Services, you represent and warrant that you meet this requirement.
              </p>
            </section>

            {/* Section 4 */}
            <section className="border-l-4 border-introPrimary pl-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-introPrimary">
                4. User Content
              </h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p className="text-base sm:text-lg">
                  You may submit information, inputs, questions, or other content through the Services ("User Content"). You retain ownership of your User Content, but you grant RetireMate a non-exclusive, worldwide, royalty-free license to use, store, reproduce, modify, and process such User Content for purposes of operating, improving, and providing the Services.
                </p>
                <p className="text-base sm:text-lg">
                  You represent that you have the right to submit User Content and that your User Content does not violate any applicable law or third-party rights.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section className="border-l-4 border-introPrimary pl-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-introPrimary">
                5. Automated and AI-Generated Content
              </h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p className="text-base sm:text-lg">
                  The Services may use automated systems, including artificial intelligence or machine learning tools, to generate outputs or insights based on information you provide.
                </p>
                <p className="text-base sm:text-lg">
                  Such outputs are provided on an "as is" basis, may be incomplete, inaccurate, or outdated, and should not be relied upon as professional advice or as a substitute for independent judgment.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section className="border-l-4 border-introPrimary pl-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-introPrimary">
                6. Prohibited Conduct
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-3">
                You agree not to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-base sm:text-lg text-gray-700 ml-4">
                <li>Use the Services in violation of any applicable law or regulation</li>
                <li>Interfere with or disrupt the operation of the Services</li>
                <li>Attempt to gain unauthorized access to the Services or related systems</li>
                <li>Use the Services for fraudulent, misleading, or abusive purposes</li>
              </ul>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mt-4">
                We reserve the right to restrict or terminate access to the Services for violations of these Terms.
              </p>
            </section>

            {/* Section 7 */}
            <section className="border-l-4 border-introPrimary pl-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-introPrimary">
                7. Intellectual Property
              </h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p className="text-base sm:text-lg">
                  The Services, including all content, features, and functionality, are owned by or licensed to CareMaps Group Inc. and are protected by intellectual property laws.
                </p>
                <p className="text-base sm:text-lg">
                  You may not copy, modify, distribute, sell, or create derivative works based on the Services except as expressly permitted by law or with our prior written consent.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section className="border-l-4 border-introPrimary pl-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-introPrimary">
                8. Third-Party Services and Links
              </h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p className="text-base sm:text-lg">
                  The Services may include links to or integrations with third-party websites or services. We do not control and are not responsible for third-party content, policies, or practices.
                </p>
                <p className="text-base sm:text-lg">
                  Your interactions with third parties are at your own risk and subject to their terms and policies.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section className="border-l-4 border-introPrimary pl-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-introPrimary">
                9. Disclaimer of Warranties
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-medium">
                THE SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
            </section>

            {/* Section 10 */}
            <section className="border-l-4 border-introPrimary pl-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-introPrimary">
                10. Limitation of Liability
              </h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p className="text-base sm:text-lg font-medium">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, CAREMAPS GROUP INC. AND ITS AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, OR EXEMPLARY DAMAGES ARISING OUT OF OR RELATING TO YOUR USE OF THE SERVICES.
                </p>
                <p className="text-base sm:text-lg font-medium">
                  IN NO EVENT SHALL OUR TOTAL LIABILITY EXCEED ONE HUNDRED DOLLARS ($100).
                </p>
              </div>
            </section>

            {/* Section 11 */}
            <section className="border-l-4 border-introPrimary pl-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-introPrimary">
                11. Indemnification
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                You agree to indemnify and hold harmless CareMaps Group Inc. and its affiliates from any claims, liabilities, damages, losses, and expenses arising out of your use of the Services or violation of these Terms.
              </p>
            </section>

            {/* Section 12 */}
            <section className="border-l-4 border-introPrimary pl-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-introPrimary">
                12. Modification and Termination
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                We may modify, suspend, or discontinue the Services at any time without notice. We may also update these Terms from time to time. Continued use of the Services constitutes acceptance of the updated Terms.
              </p>
            </section>

            {/* Section 13 */}
            <section className="border-l-4 border-introPrimary pl-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-introPrimary">
                13. Governing Law
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                These Terms are governed by the laws of the State of Delaware, without regard to conflict-of-laws principles.
              </p>
            </section>

            {/* Section 14 */}
            <section className="border-l-4 border-introPrimary pl-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-introPrimary">
                14. Miscellaneous
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                If any provision of these Terms is found unenforceable, the remaining provisions will remain in effect. Our failure to enforce any right or provision does not constitute a waiver.
              </p>
            </section>

            {/* Section 15 */}
            <section className="border-l-4 border-introPrimary pl-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-introPrimary">
                15. Accessibility
              </h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p className="text-base sm:text-lg">
                  We are committed to making the Services accessible to a broad range of users. Accessibility is an ongoing effort, and we welcome feedback on ways to improve the usability of the Services.
                </p>
                <p className="text-base sm:text-lg">
                  If you experience difficulty accessing any part of the Services, please contact us so we can work to address the issue.
                </p>
              </div>
            </section>

            {/* Section 16 */}
            <section className="border-l-4 border-introPrimary pl-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-introPrimary">
                16. Contact Us
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-3">
                If you have questions about these Terms, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-base sm:text-lg text-gray-700 font-semibold mb-2">RetireMate</p>
                <p className="text-base sm:text-lg text-gray-700">
                  Email: <a href="mailto:legal@retiremate.com" className="text-introPrimary hover:underline font-medium">legal@retiremate.com</a>
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

export default Terms;

