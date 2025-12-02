// IntroPage.js
import React from "react";

// Import all the component modules
import Header from "../components/Header/Header";
import HeroSection from "../components/HeroSection/HeroSection";
import SuggestedQuestions from "../components/SuggestedQuestions/SuggestedQuestions";
import InsightsSection from "../components/InsightsSection/InsightsSection";
import FeaturesSection from "../components/FeaturesSection/FeaturesSection";
import QuestionsToAction from "../components/QuestionsToAction/QuestionsToAction";
import ResourcesSection from "../components/ResourcesSection/ResourcesSection";
import Footer from "../components/Footer/Footer";
import RetireMateAdvantage from "../components/RetireMateAdvantage/RetireMateAdvantage";
// Import assets
import logo from "../assets/logo.png";
import mic from "../assets/mic.png";
import search from "../assets/search.png";
import chat from "../assets/chat.png";
import bookmark from "../assets/bookmark.png";
import savings from "../assets/savings.png";
import currency from "../assets/currency_exchange.png";
import avatar from "../assets/Avatar.png";
import RetiremateEdge from "../components/RetiremateEdge/RetiremateEdge";
import TestimonialsGrid from "../components/FeaturesSection/components/TestimonialsGrid";
import AskAnything from "../components/AskAnything/AskAnything";
import LinkSection from "../components/LinkSection/LinkSection";
import ArticleSection from "../components/ArticleSection/ArticleSection";
import CustomStory from "../components/CustomStory/CustomStory";
import RetirematePlanningQuestion from "../components/RetirematePlanningQuestion/RetirematePlanningQuestion";
import RothQuestions from "../components/RothQuestions/RothQuestions";
import ExploreMoreQuestions from "../components/ExploreMoreQuestions/ExploreMoreQuestions";
import MedicareQuestions from "../components/MedicareQuestions/MedicareQuestions";
import MedicareQuiz from "../components/MedicareQuiz/MedicareQuiz";
import SeoHelmet from "../components/Seo/SeoHelmet";
function IntroPage() {
  // Data for components
  const suggestedQuestions = [
    {
      id: 1,
      text: "How long will my savings last?",
      color: "#567257",
      tag: "Budget",
      description:
        "Learn how your savings will grow and then decline in retirement for 3 lifestyle types.",
      tagcolor: "#FFDDB5",
    },
    {
      id: 2,
      text: "What age can I retire?",
      color: "#896A58",
      tag: "Age",
      description:
        "Discover the earliest and most sustainable retirement age based on your savings, income, and lifestyle goals.",
      tagcolor: "#B5E0FF",
    },
    {
      id: 3,
      text: "How much should I save per month?",
      color: "#ACAB9E",
      tag: "Budget",
      tagcolor: "#FFDDB5",
      description:
        "Find out the monthly savings you need today to stay on track for a secure and comfortable retirement.",
    },
    {
      id: 4,
      text: "What will my retirement income be?",
      color: "#ACAB9E",
      description:
        "Estimate your retirement income from savings, Social Security, and other sources to see how much you’ll have each month.",
      tag: "Budget",
      tagcolor: "#FFDDB5",
    },
    {
      id: 5,
      text: "Should I delay Social Security?",
      color: "#ACAB9E",
      tag: "Location",
      tagcolor: "#BEFFB5",
      description:
        "Compare the benefits of claiming Social Security early versus delaying, and see which option maximizes your lifetime income.",
    },
    {
      id: 6,
      text: "How will inflation impact me?",
      color: "#ACAB9E",
      description:
        "Understand how rising costs will affect your retirement expenses and what you can do to protect your purchasing power.",
      tag: "Category",
      tagcolor: "#DDB5FF",
    },
  ];

  const features = [
    {
      id: 1,
      icon: bookmark,
      description:
        "RetireMate has read all the best Retirement books, so you don't have to.",
    },
    {
      id: 2,
      icon: currency,
      description:
        "When laws and markets change, you'll be the first to know how it affects you and what you need to do.",
    },
    {
      id: 3,
      icon: savings,
      description:
        "Haven't saved enough? RetireMate will help you get on track and shows you all your options.",
    },
    {
      id: 4,
      icon: chat,
      description:
        "Want to speak with a Certified Financial Planner? RetireMate will help you find the right one for you.",
    },
  ];

  // Event handlers - these are now optional since navigation is handled within components
  const handleLoginClick = () => {
     window.open("/quiz");
    // Add your login logic here
  };

  const handleSearch = (query) => {
    console.log("Search query:", query);
    // This is now optional - navigation is handled in HeroSection
  };

  const handleVoiceSearch = () => {
    console.log("Voice search clicked");
    // Add your voice search logic here
  };

  const handleQuestionClick = (question) => {
    const queryParam = encodeURIComponent(question.text);
    window.open(`/quiz?title=${queryParam}`, "_blank");
  };

  const handleBrowseAllClick = () => {
    console.log("Browse all clicked");
    // Add your browse all logic here
  };

  const handleFooterLinkClick = (link) => {
    console.log("Footer link clicked:", link);
    // Add your footer link logic here
  };
const WEBSITE_URL = import.meta.env.VITE_WEBSITE_URL;
  
  return (
    <>
       <SeoHelmet 
       title="RetireMate" 
       description="Expert-curated retirement and Medicare insights." 
       url={WEBSITE_URL} />
      <Header logo={logo} onLoginClick={handleLoginClick} />

      <HeroSection
        searchIcon={search}
        micIcon={mic}
        onSearch={handleSearch}
        onVoiceSearch={handleVoiceSearch}
      />

      <TestimonialsGrid />

      {/* <CustomStory /> */}

      <RetiremateEdge />
      <RetirematePlanningQuestion />
      <ExploreMoreQuestions />
      <RothQuestions />
      <ExploreMoreQuestions />
      <MedicareQuiz/>
      <MedicareQuestions />
      <ExploreMoreQuestions />
      <SuggestedQuestions
        questions={suggestedQuestions}
        onQuestionClick={handleQuestionClick}
      />

      <InsightsSection />

      <RetireMateAdvantage />

      <FeaturesSection features={features} />

      <AskAnything />

      <QuestionsToAction
        onQuestionClick={handleQuestionClick}
        onBrowseAllClick={handleBrowseAllClick}
      />

      <ArticleSection />

      <LinkSection />

      <ResourcesSection />

      <Footer onLinkClick={handleFooterLinkClick} />
    </>
  );
}

export default IntroPage;
