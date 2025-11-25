import "./App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Quiz from "./pages/Quiz.jsx";
import IntroPage from "./pages/IntroPage.jsx";
import PlanPage from "./pages/PlanPage.jsx";
import RothPage from "./pages/RothPage.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/intro" element={<IntroPage />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/plans/:phone/:id" element={<PlanPage />} />
        <Route
          path="/Top-Roth-Conversion-Retirement-Questions/:slug"
          element={<RothPage />}
        />
      </Routes>
    </>
  );
}

export default App;
