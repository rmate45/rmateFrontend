// components/Footer/Footer.js
import React from 'react';

const FooterLink = ({ href, children, onClick }) => {
  return (
    <a
      className="hover:underline text-white jost font-medium py-4"
      href={href}
      onClick={onClick}
    >
      {children}
    </a>
  );
};

const Footer = ({ 
  disclaimerText, 
  copyrightText, 
  links = [],
  onLinkClick 
}) => {
  const defaultDisclaimerText = "The content provided here and elsewhere on the SeniorCareMaps site is provided for general informational purposes only. It is not intended as, and SeniorCareMaps does not provide, medical advice, diagnosis, or treatment. Always contact your healthcare provider directly with any questions you may have regarding your health or specific medical advice.";
  
  const defaultCopyrightText = "© 2023 CareMaps Group, Inc";
  
  const defaultLinks = [
    { id: 1, text: "Terms", href: "#" },
    { id: 2, text: "Privacy", href: "#" },
    { id: 3, text: "Your Privacy Choices", href: "#" }
  ];

  const linksToDisplay = links.length > 0 ? links : defaultLinks;

  return (
    <footer className="bg-[#2A2420]  px-6 py-6 md:py-16 text-white">
      <div className="max-w-7xl mx-auto flex justify-between items-start flex-wrap">
        <div>
          <p className="text-sm jost font-medium leading-6 opacity-90 max-w-[705px]">
            {disclaimerText || defaultDisclaimerText}
          </p>

          <div className=" mt-4 md:mt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <p className="text-sm jost font-medium opacity-90">
              {copyrightText || defaultCopyrightText}
            </p>
          </div>
        </div>
        
        <nav className="flex items-center gap-6 text-sm">
          {linksToDisplay.map((link, index) => (
            <React.Fragment key={link.id}>
              <FooterLink
                href={link.href}
                onClick={(e) => {
                  if (onLinkClick) {
                    e.preventDefault();
                    onLinkClick(link);
                  }
                }}
              >
                {link.text}
              </FooterLink>
              {index < linksToDisplay.length - 1 && (
                <span aria-hidden="true" className="h-10 w-px bg-white/30"></span>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;