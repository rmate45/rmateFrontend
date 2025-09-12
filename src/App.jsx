import "./App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Quiz from "./pages/Quiz";
import WelcomePage from "./pages/WelcomePage";
import IntroPage from "./pages/IntroPage";
import PlanPage from "./pages/PlanPage";
import { useEffect } from "react";
function App() {
  // in App.js or a layout component
useEffect(() => {
  const setVh = () => {
    // Get the real window inner height (ignores keyboard resizing)
    document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
  };

  setVh();
  window.addEventListener("resize", setVh);

  return () => window.removeEventListener("resize", setVh);
}, []);

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
