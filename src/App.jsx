import "./App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Quiz from "./pages/Quiz.jsx";
import IntroPage from "./pages/IntroPage.jsx";
import PlanPage from "./pages/PlanPage.jsx";
import RothPage from "./pages/RothPage.jsx";
import PersonaPage from "./pages/PersonaPage.jsx";
import FinancialPage from "./pages/FinancialPage.jsx";
import MedicarePage from "./pages/MedicarePage.jsx";
import ExploreQuestionsPage from "./pages/ExploreQuestionsPage.jsx";
import Test from "./pages/Test.jsx";
import QuizView from "./pages/QuizView.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import Terms from "./pages/Terms.jsx";
import YourPrivacyChoices from "./pages/YourPrivacyChoices.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/intro" element={<IntroPage />} />
        <Route path="/quiz" element={<QuizView />} />
        <Route path="/plans/:phone/:id" element={<PlanPage />} />
        <Route
          path="/q/Top-Explore-Questions/roth-conversions/:id"
          element={<RothPage />}
        />
        <Route
          path="/q/Top-Explore-Questions/persona/:id"
          element={<PersonaPage />}
        />
        <Route
          path="/p/:slug/:id"
          element={<PersonaPage />}
        />
        <Route
          path="/q/Top-Explore-Questions/financial-planning/:id"
          element={<FinancialPage />}
        />
        <Route
          path="/q/Top-Explore-Questions/medicare/:id"
          element={<MedicarePage />}
        />
        <Route
          path="/q/Top-Explore-Questions/general/:id"
          element={<ExploreQuestionsPage />}
        />
        <Route
          path="/test"
          element={<Test />}
        />
        <Route
          path="/privacy-policy"
          element={<PrivacyPolicy />}
        />
        <Route
          path="/terms"
          element={<Terms />}
        />
        <Route
          path="/your-privacy-choices"
          element={<YourPrivacyChoices />}
        />
      </Routes>
    </>
    
  );
}

export default App;
