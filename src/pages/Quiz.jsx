import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import logo from "../assets/retiremate-logo.svg";
import { ChatHeader } from "../components/ChatHeader/ChatHeader";
import { ChatMessage } from "../components/ChatMessage/ChatMessage";
import { LoadingIndicator } from "../components/LoadingIndicator/LoadingIndicator";
import { QuestionDisplay } from "../components/QuestionDisplay/QuestionDisplay";
import api from "../api/api.js";

const Quiz = () => {
  const location = useLocation();
  const initialText = location.state?.title || "";
  
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [textInput, setTextInput] = useState("");
  const chatRef = useRef(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [lastAnswerOption, setLastAnswerOption] = useState(null);
  const [lastQuestionText, setLastQuestionText] = useState(null);
  const [lastQuestionData, setLastQuestionData] = useState(null);
  const [canReload, setCanReload] = useState(false);
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const overviewRef = useRef(null);

  // New states for handling the flow
  const [allQuestions, setAllQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [statements, setStatements] = useState([]);
  const [flowInitialized, setFlowInitialized] = useState(false);
  const [statementsShown, setStatementsShown] = useState(false);

  const [userAnswers, setUserAnswers] = useState({});
  const [insightsData, setInsightsData] = useState([]);

  // Initialize the flow when component mounts
 useEffect(() => {
    initializeFlow();
}, []);

  const initializeFlow = async () => {
  try {
    setLoading(true);

    // Show the user's selected question/text first
    setConversation([
      { type: "answer", text: initialText,  }
    ]);

    // Call first API to get statements
    const statementsResponse = await api.get("/get-statements");

    if (statementsResponse.data?.data && statementsResponse.data.data.length > 0) {
      setStatements(statementsResponse.data.data);

      // Start showing statements one by one
      showStatementsSequentially(statementsResponse.data.data);
    } else {
      // If no statements, directly fetch questions
      // fetchQuestions();
    }
  } catch (error) {
    console.error("Error fetching statements:", error);
    // Try to fetch questions anyway
    // fetchQuestions();
  }
};

const showStatementsSequentially = (statementsData) => {
  let index = 0;

  const showNext = () => {
    const statement = statementsData[index];
    if (!statement) {
      // No more statements, fetch questions
      setTimeout(fetchQuestions, 1000);
      return;
    }

    setConversation(prev => [
      ...prev,
      { type: "system", text: statement.question }
    ]);

    index++;

    if (index < statementsData.length) {
      setTimeout(showNext, 1500);
    } else {
      setTimeout(fetchQuestions, 1000);
    }
  };

  setTimeout(showNext, 1000);
};

  const fetchQuestions = async () => {
    try {
      const questionsResponse = await api.get("/get-intake-questions");

      if (questionsResponse.data?.data && questionsResponse.data.data.length > 0) {
        const sortedQuestions = questionsResponse.data.data.sort((a, b) => a.position - b.position);
        setAllQuestions(sortedQuestions);
        setCurrentQuestion(sortedQuestions[0]);
        setCurrentQuestionIndex(0);
        setQuestionNumber(1);
        setStatementsShown(true);
      } else {
        setConversation(prev => [
          ...prev,
          { type: "system", text: "No questions available for this topic." }
        ]);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      setConversation(prev => [
        ...prev,
        { type: "system", text: "Error loading questions. Please try again." }
      ]);
    } finally {
      setLoading(false);
      setFlowInitialized(true);
    }
  };

  const moveToNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    
    if (nextIndex < allQuestions.length) {
      setCurrentQuestionIndex(nextIndex);
      setCurrentQuestion(allQuestions[nextIndex]);
      setQuestionNumber(prev => prev + 1);
      setCanReload(true);
    } else {
      // All questions completed
      setCurrentQuestion(null);
      setIsLastQuestion(true);
      setCanReload(false);
      fetchCalculateData();
    }
  };

  const fetchCalculateData = async () => {
    const payload = {
      userAnswers: {
        ...userAnswers,
      },
      initialText: initialText
    };

    try {
      setLoading(true);
      
      // Show completion message
      addToConversation("system", "Thank you for completing the quiz! Calculating your retirement insights...");

      const { data } = await api.post("/calculate-results-level1", {
        details: {
          ...payload,
        },
      });

      if (data?.data) {
        setInsightsData(data.data);
        addToConversation("system", "Your personalized retirement analysis is ready!");
      } else {
        addToConversation("system", "Results calculated successfully!");
      }
    } catch (error) {
      console.error("Error calculating results:", error);
      addToConversation(
        "system",
        "Something went wrong while calculating results. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const storeAnswer = (questionId, questionText, value, displayLabel) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: {
        questionText: questionText,
        answer: displayLabel,
        value: value
      }
    }));
  };

  const handleOptionClick = async (option) => {
    addToConversation("question", currentQuestion.questionText);
    addToConversation("answer", option.text);
    setLoading(true);

    // Store the answer
    storeAnswer(
      currentQuestion.questionId,
      currentQuestion.questionText,
      option.text,
      option.text
    );

    setLastAnswerOption(option);
    setLastQuestionText(currentQuestion.questionText);
    setLastQuestionData(currentQuestion);

    // Show comment if available
    const comment = option.comment || currentQuestion.defaultComment;
    if (comment && comment.trim()) {
      setTimeout(() => {
        addToConversation("comment", comment);
      }, 1000);
    }

    setTimeout(() => {
      moveToNextQuestion();
      setLoading(false);
    }, (comment && comment.trim()) ? 2500 : 1500);
  };

  const handleMultiSelectSubmit = (selectedOptions) => {
    addToConversation("question", currentQuestion.questionText);
    
    const selectedTexts = selectedOptions.map(opt => opt.text);
    const answerText = selectedTexts.join(", ");
    addToConversation("answer", answerText);
    
    setLoading(true);

    // Store the multi-select answer
    storeAnswer(
      currentQuestion.questionId,
      currentQuestion.questionText,
      selectedTexts,
      answerText
    );

    setLastAnswerOption({ text: answerText, selectedOptions });
    setLastQuestionText(currentQuestion.questionText);
    setLastQuestionData(currentQuestion);

    const comment = currentQuestion.defaultComment;
    if (comment && comment.trim()) {
      setTimeout(() => {
        addToConversation("comment", comment);
      }, 1000);
    }

    setTimeout(() => {
      moveToNextQuestion();
      setLoading(false);
    }, (comment && comment.trim()) ? 2500 : 1500);
  };

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;

    const questionText = currentQuestion.questionText;

    addToConversation("question", questionText);
    addToConversation("answer", textInput);

    // Store the text answer
    storeAnswer(
      currentQuestion.questionId,
      questionText,
      textInput,
      textInput
    );

    setLastQuestionText(questionText);
    setLastQuestionData(currentQuestion);
    setLastAnswerOption({ text: textInput, value: textInput });

    const userInput = textInput;
    setTextInput("");
    setLoading(true);

    const comment = currentQuestion.defaultComment;
    if (comment && comment.trim()) {
      setTimeout(() => {
        addToConversation("comment", comment);
      }, 1000);
    }

    setTimeout(() => {
      moveToNextQuestion();
      setLoading(false);
    }, (comment && comment.trim()) ? 2500 : 1500);
  };

  const handleReloadAnswer = async () => {
    if (!lastAnswerOption || !lastQuestionText || !lastQuestionData) return;

    // Remove the last answer from stored data
    const questionId = lastQuestionData.questionId;

    setUserAnswers((prev) => {
      const updated = { ...prev };
      delete updated[questionId];
      return updated;
    });

    setConversation((prev) => {
      const updated = [...prev];
      let removedCount = 0;
      while (updated.length > 0 && removedCount < 3) {
        const lastItem = updated[updated.length - 1];
        if (
          lastItem.type === "answer" ||
          lastItem.type === "comment" ||
          lastItem.type === "question"
        ) {
          updated.pop();
          removedCount++;
        } else {
          break;
        }
      }
      return updated;
    });

    // Go back to previous question
    const prevIndex = currentQuestionIndex - 1;
    if (prevIndex >= 0) {
      setCurrentQuestionIndex(prevIndex);
      setCurrentQuestion(allQuestions[prevIndex]);
      setQuestionNumber(prev => prev - 1);
    }
    
    setCanReload(false);
    setLoading(false);
  };

  const addToConversation = (type, text) => {
    setConversation((prev) => [...prev, { type, text }]);
  };

  const startNewChatWithTopic = async (selectedTopic) => {
    try {
      setLoading(true);
      setConversation([
        { type: "system", text: `Let's dive into: "${selectedTopic}"` },
      ]);
      setCurrentQuestion(null);
      setQuestionNumber(1);
      setLastAnswerOption(null);
      setLastQuestionText(null);
      setLastQuestionData(null);
      setCanReload(false);
      setIsLastQuestion(false);

      const { data } = await api.get(`/start-topic`, {
        params: { topic: selectedTopic },
      });

      if (data?.data?.question) {
        setCurrentQuestion(data.data.question);
      } else {
        setConversation((prev) => [
          ...prev,
          {
            type: "system",
            text: "No follow-up questions found for this topic.",
          },
        ]);
      }
    } catch (error) {
      console.error("Error starting topic flow:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInsightSelection = (insight) => {
    startNewChatWithTopic(insight.title);
  };


  const scrollUpOnValidationError = () => {
    const chat = chatRef.current;
    if (chat) {
      chat.scrollTo({
        top: chat.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const chat = chatRef.current;
    if (chat) {
      chat.scrollTo({
        top: chat.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [conversation, currentQuestion]);

  useEffect(() => {
    if (!currentQuestion && isLastQuestion && overviewRef.current) {
      overviewRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentQuestion, isLastQuestion]);

  if (loading && conversation.length === 0) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  console.log( "conversation", conversation);

  return (
    <div className="bg-white px-4 min-h-screen flex flex-col items-center relative">
      <div
        ref={chatRef}
        className="bg-white border-2 border-primary rounded-lg shadow-lg mt-5 min-h-[95vh] max-h-[92vh] pb-4 w-full max-w-xl sm:min-w-xl overflow-y-auto flex flex-col relative"
      >
        <ChatHeader logo={logo} />
        <div className="flex-1"></div>
        <div className="flex flex-col pt-4 px-4">
          {conversation.map((item, idx) => {
            const isLastAnswer =
              item.type === "answer" &&
              (idx === conversation.length - 1 ||
                (idx === conversation.length - 2 &&
                  conversation[idx + 1]?.type === "comment"));
            return (
              <ChatMessage
                key={idx}
                message={item}
                isLastAnswer={isLastAnswer}
                canReload={canReload}
                loading={loading}
                onReload={handleReloadAnswer}
              />
            );
          })}

          <LoadingIndicator loading={loading} />

          <QuestionDisplay
            onValidationError={scrollUpOnValidationError}
            currentQuestion={currentQuestion}
            loading={loading}
            textInput={textInput}
            onTextChange={setTextInput}
            onOptionClick={handleOptionClick}
            onTextSubmit={handleTextSubmit}
            onMultiSelectSubmit={handleMultiSelectSubmit}
          />

          {/* Show completion message and insights when quiz is done */}
          {isLastQuestion && !loading && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Quiz Complete!</h3>
              <p className="text-green-700 mb-4">
                Thank you for providing your information. We're analyzing your responses to create a personalized retirement plan.
              </p>
              
              {insightsData && insightsData.length > 0 && (
                <div>
                  <h4 className="font-medium text-green-800 mb-2">Your Retirement Insights:</h4>
                  <div className="space-y-2">
                    {insightsData.map((insight, idx) => (
                      <div 
                        key={idx} 
                        className="p-2 bg-white border border-green-300 rounded cursor-pointer hover:bg-green-50"
                        onClick={() => handleInsightSelection(insight)}
                      >
                        <span className="text-sm text-green-700">{insight.title || insight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div id="overview" ref={overviewRef} className="scroll-mt-20"></div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;