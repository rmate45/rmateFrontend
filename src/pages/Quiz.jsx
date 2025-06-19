import React, { useState, useRef, useEffect, use } from "react";
import logo from "../assets/retiremate-logo.svg";
import { ChatHeader } from "../components/ChatHeader/ChatHeader";
import { ChatMessage } from "../components/ChatMessage/ChatMessage";
import { LoadingIndicator } from "../components/LoadingIndicator/LoadingIndicator";
import { QuestionDisplay } from "../components/QuestionDisplay/QuestionDisplay";
import { InsightsSection } from "../components/InsightsSection/InsightsSection";
import { AdvisorMeetingSection } from "../components/AdvisorMeetingSection/AdvisorMeetingSection.jsx";
import { ContinueWithAiSection } from "../components/ContinueWithAiSection/ContinueWithAiSection";
import api from "../api/api.js";

const getRangeKeyFromValue = (value) => {
  if (value < 40) return "less_than_40";
  if (value >= 40 && value <= 49) return "40_49";
  if (value >= 50 && value <= 59) return "50_59";
  if (value >= 60 && value <= 65) return "60_65";
  if (value >= 66 && value <= 79) return "66_79";
  if (value >= 80) return "80+";
  return null;
};

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [textInput, setTextInput] = useState("");
  const chatRef = useRef(null);
  const [primeValue, setPrimeValue] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [lastAnswerOption, setLastAnswerOption] = useState(null);
  const [lastQuestionText, setLastQuestionText] = useState(null);
  const [lastQuestionData, setLastQuestionData] = useState(null);
  const [canReload, setCanReload] = useState(false);
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const [topic, setTopic] = useState(null);
  const overviewRef = useRef(null);

  const [userRangeAnswers, setUserRangeAnswers] = useState({});
  const [userAnswers, setUserAnswers] = useState({});
  const [insightsData, setInightsData] = useState([]);

  const fetchFirstQuestion = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/get-prime-questions");

      setConversation(
        data?.data?.questions[0].system_greetings.map((greeting) => ({
          type: "system",
          text: greeting,
        }))
      );
      setCurrentQuestion(data?.data?.questions[0]);
    } catch (error) {
      console.error("Error fetching first question:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFirstQuestion();
  }, []);

  const fetchNextQuestion = async (nextValue = primeValue) => {
    if (isLastQuestion) {
      setLoading(false);
      setCurrentQuestion(null);
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post("/get-next-question", {
        next_question: questionNumber,
        prime_value: nextValue,
      });

      if (data?.data?.question) {
        setCurrentQuestion(data.data.question);
        setQuestionNumber((prev) => prev + 1);
        setCanReload(true);

        if (data.data.isLastQuestion) {
          setIsLastQuestion(true);
          setCanReload(false);

          fetchCalculateData();
        }
      } else {
        setCurrentQuestion(null);
        setCanReload(false);
      }
    } catch (error) {
      console.error("Error fetching next question:", error);
      addToConversation(
        "system",
        "Something went wrong while fetching the next question. Please try again later."
      );
      setCanReload(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchCalculateData = async () => {
    const payload = {
      userRangeAnswers: {
        ...userRangeAnswers,
      },
      userAnswers: {
        ...userAnswers,
      },
    };

    try {
      setLoading(true);

      const { data } = await api.post("/calculate-results-level1", {
        details: {
          ...payload,
        },
      });

      if (data) {
        setInightsData(data?.data);
      }
    } catch (error) {
      console.error("Error fetching next question:", error);
      addToConversation(
        "system",
        "Something went wrong while fetching the next question. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const storeAnswer = (questionText, value, displayLabel, isRange = false) => {
    if (isRange) {
      setUserRangeAnswers((prev) => ({
        ...prev,
        [questionText]: value,
      }));
    } else {
      // Always store in userAnswers with display label
      setUserAnswers((prev) => ({
        ...prev,
        [questionText]: displayLabel,
      }));
    }
  };

  const handleOptionClick = async (option) => {
    addToConversation("question", currentQuestion.questionText);
    addToConversation("answer", option.label);
    setLoading(true);

    // Store the answer
    const isRangeQuestion = currentQuestion.type === "range";
    storeAnswer(
      currentQuestion.questionText,
      option.value,
      option.label,
      isRangeQuestion
    );

    setLastAnswerOption(option);
    setLastQuestionText(currentQuestion.questionText);
    setLastQuestionData(currentQuestion);

    let nextPrimeValue = primeValue;
    if (currentQuestion.quiz_no === 1) {
      nextPrimeValue = getRangeKeyFromValue(option.value);
      setPrimeValue(nextPrimeValue);
    }

    setTimeout(() => {
      addToConversation("comment", option.comment);
    }, 1000);

    setTimeout(() => {
      fetchNextQuestion(nextPrimeValue);
    }, 2500);
  };

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;

    const questionText = currentQuestion.questionText;

    addToConversation("question", questionText);
    addToConversation("answer", textInput);

    // Store the text answer
    storeAnswer(questionText, textInput, textInput, false);

    setLastQuestionText(questionText);
    setLastQuestionData(currentQuestion);
    setLastAnswerOption({ label: textInput, value: textInput });

    setTextInput("");
    setLoading(true);

    setTimeout(() => {
      addToConversation("comment", currentQuestion.options[0].comment);
    }, 1000);

    setTimeout(() => {
      fetchNextQuestion(primeValue);
    }, 2500);
  };

  const handleReloadAnswer = async () => {
    if (!lastAnswerOption || !lastQuestionText || !lastQuestionData) return;

    // Remove the last answer from stored data
    const questionText = lastQuestionText;
    const wasRangeQuestion = lastQuestionData.type === "range";

    if (wasRangeQuestion) {
      setUserRangeAnswers((prev) => {
        const updated = { ...prev };
        delete updated[questionText];
        return updated;
      });
    }

    setUserAnswers((prev) => {
      const updated = { ...prev };
      delete updated[questionText];
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

    setQuestionNumber((prev) => prev - 1);
    setCurrentQuestion(lastQuestionData);
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
      setPrimeValue(null);
      setLastAnswerOption(null);
      setLastQuestionText(null);
      setLastQuestionData(null);
      setCanReload(false);
      setIsLastQuestion(false);
      setTopic(selectedTopic);

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

  const handleStartQuiz2 = () => {
    console.log("Start Quiz 2 or advanced flow");
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

  if (loading && !currentQuestion) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center">
        <div className="text-lg">Loading quiz...</div>
      </div>
    );
  }

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
            currentQuestion={currentQuestion}
            loading={loading}
            textInput={textInput}
            onTextChange={setTextInput}
            onOptionClick={handleOptionClick}
            onTextSubmit={handleTextSubmit}
          />

          <div id="overview" ref={overviewRef} className="scroll-mt-20"></div>
          {!currentQuestion && isLastQuestion && (
            <>
              <hr className="my-8" />

              <div className="space-y-4">
                <h2 className="text-xl font-bold text-center">
                  Your Financial Health Below
                </h2>
                <InsightsSection
                  onStartQuiz2={handleStartQuiz2}
                  onInsightSelect={handleInsightSelection}
                  insightsData={insightsData}
                />
              </div>

              <hr className="my-8" />

              <AdvisorMeetingSection
                onScheduleMeeting={() =>
                  startNewChatWithTopic(
                    "Schedule a free meeting with an advisor."
                  )
                }
              />

              <hr className="my-8" />

              <ContinueWithAiSection
                onStartQuiz2={() =>
                  startNewChatWithTopic("Discover financial freedom.")
                }
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
