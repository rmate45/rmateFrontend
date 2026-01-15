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
      <Header onLoginClick={handleLoginClick} alwaysGreen={true} redirectToHome={true} />
      <div className="min-h-screen pt-32 pb-16 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-introPrimary">
              RetireMate Privacy Policy
            </h1>
            <div className="text-sm sm:text-base text-gray-600 space-y-1">
              <p><span className="font-semibold">Effective Date:</span> February 18, 2025</p>
              <p><span className="font-semibold">Last Updated:</span> February 18, 2025</p>
            </div>
          </div>

          {/* Introduction */}
          <div className="mb-10">
            <p className="text-base sm:text-lg leading-relaxed text-gray-700 mb-6">
              RetireMate is a brand operated by CareMaps Group Inc., a Delaware corporation ("CareMaps Group Inc."). RetireMate ("RetireMate," "we," "us," or "our") provides tools, content, and services designed to help individuals explore retirement-related questions and scenarios. This Privacy Policy describes how we collect, use, disclose, and otherwise process information in connection with our website, products, and services (collectively, the "Services").
            </p>
            <p className="text-base sm:text-lg leading-relaxed text-gray-700">
              This policy is intended to describe our data practices broadly and may apply to current and future features and offerings.
            </p>
          </div>

          {/* Privacy Policy Sections */}
          <div className="space-y-8">
            {/* Section 1 */}
            <section className="border-l-4 border-introPrimary pl-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-introPrimary">
                1. Information We May Collect
              </h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p className="text-base sm:text-lg">
                  We may collect information directly from you, automatically when you use the Services, and from third parties.
                </p>
                <div className="ml-4 space-y-3">
                  <p className="text-base sm:text-lg font-semibold">a. Information You Provide</p>
                  <p className="text-base sm:text-lg">
                    We may collect information that you choose to provide when you interact with the Services, including information submitted through forms, questionnaires, interactive tools, or communications with us.
                  </p>
                  <p className="text-base sm:text-lg">
                    Providing information is voluntary, though certain features may require it.
                  </p>
                  <p className="text-base sm:text-lg font-semibold mt-4">b. Information Collected Automatically</p>
                  <p className="text-base sm:text-lg">
                    When you access or use the Services, we may automatically collect information related to your device, browser, usage, interactions, and activity. This may include identifiers, log data, usage data, and information derived from your interactions with the Services.
                  </p>
                  <p className="text-base sm:text-lg">
                    We may collect this information using cookies, pixels, tags, SDKs, local storage, and similar technologies.
                  </p>
                  <p className="text-base sm:text-lg font-semibold mt-4">c. Information From Third Parties</p>
                  <p className="text-base sm:text-lg">
                    We may receive information from third parties, including analytics providers, advertising partners, marketing partners, data providers, and other sources, and may combine this information with other information we collect.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section className="border-l-4 border-introPrimary pl-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-introPrimary">
                2. Cookies, Tracking Technologies, and Advertising
              </h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p className="text-base sm:text-lg">
                  We may use cookies and similar technologies to operate, analyze, improve, and personalize the Services, as well as to support analytics, attribution, marketing, and advertising activities.
                </p>
                <p className="text-base sm:text-lg">
                  These technologies may be used by us and by third parties, may be session-based or persistent, and may operate across devices, browsers, and platforms.
                </p>
                <p className="text-base sm:text-lg">
                  We may work with advertising and measurement partners to understand how users interact with the Services and to evaluate the effectiveness of campaigns across channels.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section className="border-l-4 border-introPrimary pl-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-introPrimary">
                3. How We May Use Information
              </h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p className="text-base sm:text-lg">
                  We may use information for purposes including to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base sm:text-lg ml-4">
                  <li>Provide, operate, and improve the Services</li>
                  <li>Personalize content, features, and experiences</li>
                  <li>Generate insights or outputs through automated or analytical processes</li>
                  <li>Conduct research, analytics, and product development</li>
                  <li>Communicate with users, including for informational or promotional purposes</li>
                  <li>Measure and optimize marketing and advertising performance</li>
                  <li>Maintain the security and integrity of the Services</li>
                  <li>Comply with legal obligations and enforce policies</li>
                </ul>
                <p className="text-base sm:text-lg mt-3">
                  We may use automated systems, including artificial intelligence or machine learning tools, in connection with these purposes.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section className="border-l-4 border-introPrimary pl-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-introPrimary">
                4. Facilitating Connections and Requested Services
              </h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p className="text-base sm:text-lg">
                  Certain features of the Services may be designed to facilitate connections or interactions between users and third parties.
                </p>
                <p className="text-base sm:text-lg">
                  When you request information, express interest, or otherwise engage with features intended to provide access to third-party services or information, we may share information as reasonably necessary to provide those services or facilitate those interactions.
                </p>
                <p className="text-base sm:text-lg">
                  In some cases, information may be shared at your direction or with your consent.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section className="border-l-4 border-introPrimary pl-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-introPrimary">
                5. How We May Share Information
              </h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p className="text-base sm:text-lg">
                  We may share information:
                </p>
                <ul className="list-disc list-inside space-y-2 text-base sm:text-lg ml-4">
                  <li>With service providers and vendors performing services on our behalf</li>
                  <li>With analytics, advertising, and marketing partners</li>
                  <li>In connection with features or services you request or engage with</li>
                  <li>As directed or authorized by you</li>
                  <li>In connection with corporate transactions or business transfers</li>
                  <li>To comply with legal obligations or protect rights, safety, and security</li>
                </ul>
                <p className="text-base sm:text-lg mt-3">
                  We may also share aggregated or de-identified information that cannot reasonably be used to identify you.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section className="border-l-4 border-introPrimary pl-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-introPrimary">
                6. Data Retention
              </h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p className="text-base sm:text-lg">
                  We may retain information for as long as reasonably necessary for the purposes described in this Privacy Policy, including to provide the Services, comply with legal obligations, resolve disputes, and enforce agreements.
                </p>
                <p className="text-base sm:text-lg">
                  Retention periods may vary depending on context, purpose, and legal requirements.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section className="border-l-4 border-introPrimary pl-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-introPrimary">
                7. Your Rights and Choices
              </h2>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p className="text-base sm:text-lg">
                  Depending on your location, you may have certain rights with respect to your information, such as rights to access, correct, or delete information, or to object to or restrict certain processing.
                </p>
                <p className="text-base sm:text-lg">
                  We will respond to requests as required by applicable law. Some rights may be subject to limitations, exceptions, or technical feasibility.
                </p>
                <p className="text-base sm:text-lg">
                  You may also opt out of certain communications by following applicable instructions.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section className="border-l-4 border-introPrimary pl-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-introPrimary">
                8. Minor's Information
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                The Services are not intended for minors under 13, and we do not knowingly collect personal information from minors under 13.
              </p>
            </section>

            {/* Section 9 */}
            <section className="border-l-4 border-introPrimary pl-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-introPrimary">
                9. Data Security
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                We implement reasonable administrative, technical, and organizational measures designed to protect information. However, no security measure is perfect, and we cannot guarantee absolute security.
              </p>
            </section>

            {/* Section 10 */}
            <section className="border-l-4 border-introPrimary pl-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-introPrimary">
                10. Cross-border Data Processing
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                RetireMate is based in the United States. Information will be processed by RetireMate and its affiliates, and stored in the United States.
              </p>
            </section>

            {/* Section 11 */}
            <section className="border-l-4 border-introPrimary pl-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-introPrimary">
                11. Changes to This Policy
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. Updates will be posted with a revised effective date. Continued use of the Services indicates acceptance of the updated policy.
              </p>
            </section>

            {/* Section 12 */}
            <section className="border-l-4 border-introPrimary pl-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-introPrimary">
                12. Contact Us
              </h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-3">
                If you have questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-base sm:text-lg text-gray-700 font-semibold mb-2">RetireMate</p>
                <p className="text-base sm:text-lg text-gray-700">
                  Email: <a href="mailto:privacy@retiremate.com" className="text-introPrimary hover:underline font-medium">privacy@retiremate.com</a>
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

export default PrivacyPolicy;

