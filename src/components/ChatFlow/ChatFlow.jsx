// components/ChatFlow.jsx
import React, { useState, useEffect, useRef } from "react";
import { ChatMessage } from "../ChatMessage/ChatMessage";
import { QuestionDisplay } from "../QuestionDisplay/QuestionDisplay";
import { LoadingIndicator } from "../LoadingIndicator/LoadingIndicator";

export const ChatFlow = ({
  initialEndpoint,
  primeValueOverride,
  onComplete,
  greetingOverride,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [textInput, setTextInput] = useState("");
  const [primeValue, setPrimeValue] = useState(primeValueOverride || null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const chatRef = useRef(null);
  const [isLastQuestion, setIsLastQuestion] = useState(false);

  useEffect(() => {
    fetchFirstQuestion();
  }, []);

  const fetchFirstQuestion = async () => {
    try {
      setLoading(true);
      const response = await fetch(initialEndpoint);
      const data = await response.json();
      const greetings = greetingOverride || data?.data?.system_greetings;

      setConversation(
        greetings.map((g) => ({
          type: "system",
          text: g,
        }))
      );
      setCurrentQuestion(data?.data?.questions[0]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchNextQuestion = async (nextValue = primeValue) => {
    if (isLastQuestion) return;

    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/get-next-question?next_question=${questionNumber}&prime_value=${nextValue}`
      );
      const data = await response.json();

      if (data?.data?.question) {
        setCurrentQuestion(data.data.question);
        setQuestionNumber((prev) => prev + 1);
        if (data?.data?.isLastQuestion) {
          setIsLastQuestion(true);
        }
      } else {
        setCurrentQuestion(null);
        setIsLastQuestion(true);
        if (onComplete) onComplete();
      }
    } catch (error) {
      console.error("Error fetching next question:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionClick = async (option) => {
    addToConversation("question", currentQuestion.questionText);
    addToConversation("answer", option.label);

    if (currentQuestion.questionText === "How old are you?") {
      setPrimeValue(option.value);
    }

    setTimeout(() => {
      addToConversation("comment", option.comment);
    }, 1000);

    setTimeout(() => {
      fetchNextQuestion(option.value);
    }, 2500);
  };

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;

    addToConversation("question", currentQuestion.questionText);
    addToConversation("answer", textInput);
    setTextInput("");

    setTimeout(() => {
      addToConversation("comment", currentQuestion.options?.[0]?.comment || "");
    }, 1000);

    setTimeout(() => {
      fetchNextQuestion();
    }, 2500);
  };

  const addToConversation = (type, text) => {
    setConversation((prev) => [...prev, { type, text }]);
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [conversation, currentQuestion]);

  return (
    <div ref={chatRef} className="flex flex-col px-4 pt-4 overflow-y-auto">
      {conversation.map((item, idx) => (
        <ChatMessage key={idx} message={item} />
      ))}

      <LoadingIndicator loading={loading} />

      <QuestionDisplay
        currentQuestion={currentQuestion}
        loading={loading}
        textInput={textInput}
        onTextChange={setTextInput}
        onOptionClick={handleOptionClick}
        onTextSubmit={handleTextSubmit}
      />
    </div>
  );
};
