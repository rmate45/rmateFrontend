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

function IntroPage() {
  // Data for components
  const suggestedQuestions = [
    {
      id: 1,
      text: "How long will my savings last?",
      color: "#567257",
      tag: "Budget",
      tagcolor: "#FFDDB5",
    },
    {
      id: 2,
      text: "What age can I retire?",
      color: "#896A58",
      tag: "Age",
      tagcolor: "#B5E0FF",
    },
      {
      id: 3,
      text: "How much should I save per month?",
      color: "#ACAB9E",
      tag: "Budget",
      tagcolor: "#FFDDB5",
    },
    {
      id: 4,
      text: "What will my retirement income be?",
      color: "#ACAB9E",
      tag: "Budget",
      tagcolor: "#FFDDB5",
    },
    {
      id: 5,
      text: "Should I delay Social Security?",
      color: "#ACAB9E",
      tag: "Location",
      tagcolor: "#BEFFB5",
    },
    {
      id: 6,
      text: "How will inflation impact me?",
      color: "#ACAB9E",
      tag: "Category",
      tagcolor: "#DDB5FF",
    },
  
  ];

  const questionsAsked = [
    { id: 1, text: "How does divorce impact my retirement benefits?" },
    {
      id: 2,
      text: "What retirement benefits can I claim from a deceased or ex-spouse",
    },
    { id: 3, text: "Should I increase contributions now that kids are older?" },
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

  const testimonials = [
    {
      id: 1,
      text: "I've always let my husband handle our finances, but I worry what would happen if I had to figure out retirement alone. RetireMate gives me confidence that I'd know exactly what to do.",
      name: "Lisa M.",
      title: "Recently Divorced, Part-time worker",
    },
    {
      id: 2,
      text: "Full-time Mom, Planning aheadWe've been saving for years, but we honestly don't know if it's enough. Between our mortgage, kids, and everything else, it's hard to know if we're on track. RetireMate gave us a roadmap to see where we stand and what we should do next.",
      name: "Rachel T.",
      title: "Full-time Mom, Planning ahead",
    },
    {
      id: 3,
      text: "I make a good living, but I never realized how much I'd need to maintain my lifestyle into my 90s. RetireMate gave me a roadmap to see the gap and how to close it.",
      name: "David & Sarah K.",
      title: "Working Parents, Homeowners",
    },
    {
      id: 4,
      text: "I drive for Uber and never had a retirement plan through work. I didn't even know where to start. RetireMate gave me simple steps to begin saving, even with an irregular income.",
      name: "Dr. James R.",
      title: "Cardiologist, High Earner",
    },
    {
      id: 5,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamc. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamc...",
      name: "Marcus L.",
      title: "Rideshare Driver, Contract Worker",
    },
  ];

  // Event handlers - these are now optional since navigation is handled within components
  const handleLoginClick = () => {
    console.log("Login clicked");
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
    console.log("Question clicked:", question);
    // This is now optional - navigation is handled in SuggestedQuestions
  };

  const handleBrowseAllClick = () => {
    console.log("Browse all clicked");
    // Add your browse all logic here
  };

  const handleFooterLinkClick = (link) => {
    console.log("Footer link clicked:", link);
    // Add your footer link logic here
  };

  return (
    <>
      <Header logo={logo} onLoginClick={handleLoginClick} />

      <HeroSection
        searchIcon={search}
        micIcon={mic}
        onSearch={handleSearch}
        onVoiceSearch={handleVoiceSearch}
      />

      <SuggestedQuestions
        questions={suggestedQuestions}
        onQuestionClick={handleQuestionClick}
      />

      <InsightsSection />

      <RetireMateAdvantage />

      <FeaturesSection features={features} />

      <QuestionsToAction
        questions={questionsAsked}
        onQuestionClick={handleQuestionClick}
        onBrowseAllClick={handleBrowseAllClick}
      />

      <ResourcesSection />

      <Footer onLinkClick={handleFooterLinkClick} />
    </>
  );
}

export default IntroPage;
