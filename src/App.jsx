import "./App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Navigate, Route, Routes } from "react-router-dom";     
import Quiz from "./pages/Quiz";

function App() {
  return (
    <>
      <Routes>
        {/* <Route path="/" element={<Navigate to="/quiz" replace />} /> */}
        <Route path="/" element={<Quiz />} />
      </Routes>
    </>
  );
}

export default App;
