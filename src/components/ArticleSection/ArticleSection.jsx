import React from "react";
import million from "../../assets/million.png";

const ArticleSection = () => {
  const articles = [
    {
      image: million,
      title: "Is $1 Million enough to retire?",
      description:
        "According to the Government Accountability Office, divorced women face a 25% higher poverty risk. Discover the key steps you can take to make sure you are secure in retirement and explore all best options available to you.",
      date: "October 5",
      readTime: "20 min read",
    },
    // {
    //   image: million,
    //   title: "How does divorce impact retirement income?",
    //   description:
    //     "Divorced women face unique financial challenges during retirement. Learn strategies to protect your income and reduce long-term financial risks.",
    //   date: "October 12",
    //   readTime: "15 min read",
    // },
    // {
    //   image: million,
    //   title: "Top strategies to maximize your retirement savings",
    //   description:
    //     "From smart investment allocations to catch-up contributions, explore key ways to make your savings work harder for you.",
    //   date: "October 20",
    //   readTime: "12 min read",
    // },
  ];

  return (
    <div className="bg-white relative px-6 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto">
         <h1 className="text-introPrimary text-center font-medium text-2xl mb-8">
          Top Retirement Articles
        </h1>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-48 object-cover"
              />

              <div className="p-5 flex flex-col grow">
                <h2 className="text-wrap font-bold text-lg md:text-[24px] text-[#567257] grow-1 text-left">
                  {article.title}
                </h2>
                <p className="text-base  jost inline-block p-1.5 rounded text-[#6B7280] text-left">
                  {article.description}
                </p>

                <div className="flex justify-between items-center text-xs text-gray-500 mt-4 border-t border-gray-300 pt-3">
                  <span className="text-base  jost inline-block p-1.5 rounded text-[#6B7280] text-left">{article.date}</span>
                  <span className="text-base  jost inline-block p-1.5 rounded text-[#6B7280] text-left">{article.readTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticleSection;
