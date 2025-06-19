import "./App.css";
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
