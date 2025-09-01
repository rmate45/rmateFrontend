// components/ResourcesSection/ResourcesSection.js
import React from 'react';

const ResourceColumn = ({ title, items = [], browseAllText, onBrowseAllClick }) => {
  return (
    <div>
      <h3 className="text-[#2A2420] text-lg text-center font-medium mb-1">
        {title}
      </h3>
      <ul className="divide-y divide-[#D9D9D9]">
        {items.map((item, index) => (
          <li key={index} className="py-4 text-sm text-[#2A2420] jost">
            {item}
          </li>
        ))}
      </ul>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onBrowseAllClick && onBrowseAllClick();
        }}
        className="pt-4 w-full border-t border-[#D9D9D9] inline-block text-[#2A2420] jost text-center font-semibold"
      >
        {browseAllText}
      </a>
    </div>
  );
};

const ResourcesSection = ({ columns = [] }) => {
  const defaultColumns = [
    {
      id: 1,
      title: "Top Questions for 45-54 Year Olds",
      items: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod?",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod?",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod?",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod?"
      ],
      browseAllText: "Browse all articles"
    },
    {
      id: 2,
      title: "Checklists for 45-54 Year Olds",
      items: [
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod?",
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod?",
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod?",
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod?"
      ],
      browseAllText: "Browse all checklists"
    },
    {
      id: 3,
      title: "Frequently Asked Questions",
      items: [
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod?",
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod?",
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod?",
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod?"
      ],
      browseAllText: "Browse all FAQs"
    }
  ];

  const columnsToDisplay = columns.length > 0 ? columns : defaultColumns;

  return (
    <section className="bg-white border-t border-[#D9D9D9]">
      <div className="max-w-7xl mx-auto px-6 py-10 sm:py-16">
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