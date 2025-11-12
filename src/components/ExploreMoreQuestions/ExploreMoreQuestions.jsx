import React, { useEffect, useState } from "react";
import api from "../../api/api";

const ExploreMoreQuestions = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState("");

  useEffect(() => {
    getQuestion();
  }, []);

  const getQuestion = async () => {
    setLoading(true);
    try {
      const response = await api.get("/get-explore-questions");
      if (response.data?.type === "success" && response.data?.data) {
        setData(response.data.data);
      } else {
        setError("Failed to load questions");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionClick = (question) => {
    console.log("question", question);
    const queryParam = encodeURIComponent(question);
    window.open(`/quiz?id=${queryParam}&type=explore`, "_blank");
  };

  if (loading) {
    return (
      <div className="text-center px-6 max-w-7xl mx-auto py-10 sm:py-16">
        <h2 className="text-introPrimary font-medium text-2xl mb-8">
          Explore retirement through stories like yours
        </h2>
        <p className="text-gray-600 text-lg">Loading Explore more questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center px-6 max-w-7xl mx-auto py-10 sm:py-16">
        <h2 className="text-introPrimary font-medium text-2xl mb-8">
          Explore retirement through stories like yours
        </h2>
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="text-center px-6 pt-10 sm:pt-16">
      <div className="max-w-7xl mx-auto text-center flex flex-col items-center justify-center">
        <p className="text-primary font-medium text-xl sm:text-2xl mb-10">
          Explore more questions
        </p>

        {/* Select Dropdown */}
        <select
          value={selectedQuestion}
          onChange={(e) => setSelectedQuestion(e.target.value)}
          className="border-r-10 border-r-transparent  rounded-2xl p-5 bg-white outline outline-primary flex gap-3 max-w-4/5 max-auto"
        >
          <option value="">Select a question</option>
          {data?.map((item, index) => (
            <option value={item?._id} key={index}>
              {item?.question}
            </option>
          ))}
        </select>

        {/* Button */}
        <div className="mt-6">
          <button
            onClick={() => handleQuestionClick(selectedQuestion)}
            disabled={!selectedQuestion}
            className={`px-6 py-2 rounded-md font-semibold border transition
              ${
                selectedQuestion
                  ? "text-primary border-primary hover:bg-green-50"
                  : "text-gray-400 border-gray-300 cursor-not-allowed"
              }`}
          >
            Ask RetireMate
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExploreMoreQuestions;
