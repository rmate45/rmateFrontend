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
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/intro" element={<IntroPage />} />
        <Route path="/quiz" element={<QuizView />} />
        <Route path="/plans/:phone/:id" element={<PlanPage />} />
        <Route
          path="/Top-Roth-Conversion-Retirement-Questions/:slug"
          element={<RothPage />}
        />
        <Route
          path="/Persona/:slug"
          element={<PersonaPage />}
        />
        <Route
          path="/Top-Financial-Planning-Questions/:slug"
          element={<FinancialPage />}
        />
        <Route
          path="/Top-Medicare-Questions/:slug"
          element={<MedicarePage />}
        />
        <Route
          path="/Top-Explore-Questions/:slug"
          element={<ExploreQuestionsPage />}
        />
        <Route
          path="/test"
          element={<Test />}
        />
      </Routes>
    </>
  );
}

export default App;
