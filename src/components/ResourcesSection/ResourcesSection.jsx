// components/ResourcesSection/ResourcesSection.js
import React from 'react';

const ResourceColumn = ({ title, items = [], browseAllText, onBrowseAllClick }) => {
  return (
    <div>
      <h3 className="text-introPrimary text-left font-medium text-xl mb-1">
        {title}
      </h3>
      <ul className="divide-y divide-[#D9D9D9]">
        {items.map((item, index) => (
          <li key={index} className="py-4 text-base jost grow text-[#6B7280] text-left">
            {item}
          </li>
        ))}
      </ul>
      {/* <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onBrowseAllClick && onBrowseAllClick();
        }}
        className="pt-4 w-full border-t border-[#D9D9D9] inline-block text-[#2A2420] jost text-center font-semibold"
      >
        {browseAllText}
      </a> */}
    </div>
  );
};

const ResourcesSection = ({ columns = [] }) => {
  const defaultColumns = [
    {
      id: 1,
      title: "Top Questions for 35-44 Year Olds",
      items: [
        "Am I on track for retirement savings at 40?",
        "How can I catch up if I started saving late?",
        "How do I avoid burnout while building wealth?",
        "How does taking time off for caregiving affect my retirement?"
      ],
      browseAllText: "Browse all articles"
    },
    {
      id: 2,
      title: "Top Questions for 45-54 Year Olds",
      items: [
        "Am I behind on retirement savings at age 50?",
        "Can I retire early at 55?",
        "Is it worth starting a side business for retirement income?",
        "What retirement benefits can I claim from a deceased or ex-spouse?"
      ],
      browseAllText: "Browse all checklists"
    },
    {
      id: 3,
      title: "Top Questions for 55-64 Year Olds",
      items: [
        "When should I start taking Social Security?",
        "Should I buy an annuity to guarantee income?",
        "How can I maximize pension and Social Security benefits?",
        "How do I plan for retirement if I was a full-time homemaker?"
      ],
      browseAllText: "Browse all FAQs"
    }
  ];

  const columnsToDisplay = columns.length > 0 ? columns : defaultColumns;

  return (
    <section className="bg-white px-6 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-12">
          {columnsToDisplay.map((column) => (
            <ResourceColumn
              key={column.id}
              title={column.title}
              items={column.items}
              browseAllText={column.browseAllText}
              onBrowseAllClick={column.onBrowseAllClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResourcesSection;