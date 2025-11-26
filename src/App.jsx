import "./App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Quiz from "./pages/Quiz";
import IntroPage from "./pages/IntroPage";
import PlanPage from "./pages/PlanPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/intro" element={<IntroPage />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/plans/:phone/:id" element={<PlanPage />} />
      </Routes>
    </>
  );
}

export default App;
