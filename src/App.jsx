import "./App.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Navigate, Route, Routes } from "react-router-dom";     
import Quiz from "./pages/Quiz";
import Demo from "./pages/Demo";
function App() {
  return (
    <>
      <Routes>
        {/* <Route path="/" element={<Navigate to="/quiz" replace />} /> */}
        <Route path="/" element={<Quiz />} />
        {/* <Route path="/demo" element={<Demo />} /> */}
      </Routes>
    </>
  );
}

export default App;
