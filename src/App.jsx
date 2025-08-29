import "./App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Navigate, Route, Routes } from "react-router-dom";     
import Quiz from "./pages/Quiz";
import WelcomePage from "./pages/WelcomePage";
import IntroPage from "./pages/IntroPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<WelcomePage />}  />
        <Route path="/intro" element={<IntroPage />} />
        <Route path="/quiz" element={<Quiz />} />
      </Routes>
    </>
  );
}

export default App;
