"use client";

import React from "react";

const TermsAndAgreementSection = ({
  name = "agreed",
  title = "Terms and Agreement",
  description = "By submitting this application, I acknowledge and agree that:",
  terms = [],
}) => {
  return (
    <section className="space-y-4 mt-4">
      <h2 className="text-lg font-medium text-dark border-b border-subheadline pb-2">
        {title}
      </h2>

      <div className="leading-relaxed my-4">
        <p className="mb-4 font-medium">{description}</p>
        <ol className="list-inside list-decimal pl-4 space-y-2">
          {terms.map((term, index) => (
            <li key={index}>{term}</li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default TermsAndAgreementSection;
