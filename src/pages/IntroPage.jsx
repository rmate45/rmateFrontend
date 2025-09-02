// IntroPage.js
import React from 'react';

// Import all the component modules
import Header from '../components/Header/Header';
import HeroSection from '../components/HeroSection/HeroSection';
import SuggestedQuestions from '../components/SuggestedQuestions/SuggestedQuestions';
import InsightsSection from '../components/InsightsSection/InsightsSection';
import FeaturesSection from '../components/FeaturesSection/FeaturesSection';
import QuestionsToAction from '../components/QuestionsToAction/QuestionsToAction';
import ResourcesSection from '../components/ResourcesSection/ResourcesSection';
import Footer from '../components/Footer/Footer';

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
    { id: 1, text: "How long will my savings last?", color: "#567257" },
    { id: 2, text: "What age can I retire?", color: "#896A58" },
    { id: 3, text: "How much money do I need to retire?", color: "#ACAB9E" },
  ];

  const questionsAsked = [
    { id: 1, text: "How does divorce impact my retirement benefits?" },
    { id: 2, text: "What retirement benefits can I claim from a deceased or ex-spouse" },
    { id: 3, text: "Should I increase contributions now that kids are older?" },
  ];

  const features = [
    {
      id: 1,
      icon: bookmark,
      description: "RetireMate has read all the best Retirement books, so you don't have to."
    },
    {
      id: 2,
      icon: currency,
      description: "When laws and markets change, you'll be the first to know how it affects you and what you need to do."
    },
    {
      id: 3,
      icon: savings,
      description: "Haven't saved enough? RetireMate will help you get on track and shows you all your options."
    },
    {
      id: 4,
      icon: chat,
      description: "Want to speak with a Certified Financial Planner? RetireMate will help you find the right one for you."
    }
  ];

  const testimonials = [
    {
      id: 1,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamc. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamc...",
      avatar: avatar,
      name: "Lisa*",
      title: "Full-Time Mom"
    },
    {
      id: 2,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamc. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamc...",
      avatar: avatar,
      name: "Lisa*",
      title: "Full-Time Mom"
    },
    {
      id: 3,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamc. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamc...",
      avatar: avatar,
      name: "Lisa*",
      title: "Full-Time Mom"
    },
    {
      id: 4,
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamc. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamc...",
      avatar: avatar,
      name: "Lisa*",
      title: "Full-Time Mom"
    }
  ];

  // Event handlers - these are now optional since navigation is handled within components
  const handleLoginClick = () => {
    console.log('Login clicked');
    // Add your login logic here
  };

  const handleSearch = (query) => {
    console.log('Search query:', query);
    // This is now optional - navigation is handled in HeroSection
  };

  const handleVoiceSearch = () => {
    console.log('Voice search clicked');
    // Add your voice search logic here
  };

  const handleQuestionClick = (question) => {
    console.log('Question clicked:', question);
    // This is now optional - navigation is handled in SuggestedQuestions
  };

  const handleBrowseAllClick = () => {
    console.log('Browse all clicked');
    // Add your browse all logic here
  };

  const handleFooterLinkClick = (link) => {
    console.log('Footer link clicked:', link);
    // Add your footer link logic here
  };

  return (
    <>
      <Header 
        logo={logo} 
        onLoginClick={handleLoginClick}
      />

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

      <FeaturesSection 
        features={features}
        testimonials={testimonials}
      />

      <QuestionsToAction 
        questions={questionsAsked}
        onQuestionClick={handleQuestionClick}
        onBrowseAllClick={handleBrowseAllClick}
      />

      <ResourcesSection />

      <Footer 
        onLinkClick={handleFooterLinkClick}
      />
    </>
  );
}

export default IntroPage;