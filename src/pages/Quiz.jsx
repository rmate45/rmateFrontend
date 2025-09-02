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

  const [userAnswers, setUserAnswers] = useState({});
  const [insightsData, setInsightsData] = useState([]);

  // New states for chat functionality
  const [isChatMode, setIsChatMode] = useState(false);
  const [userId, setUserId] = useState(null);

  // Initialize the flow when component mounts
  useEffect(() => {
    initializeFlow();
  }, []);

  // Extract userId from phone number when available
  useEffect(() => {
    const phoneNumberAnswer = userAnswers["Q2"];
    if (phoneNumberAnswer) {
      let phoneNumber = "";

      if (
        phoneNumberAnswer.value &&
        typeof phoneNumberAnswer.value === "object" &&
        phoneNumberAnswer.value.fullNumber
      ) {
        phoneNumber = phoneNumberAnswer.value.fullNumber;
      } else if (typeof phoneNumberAnswer.value === "string") {
        phoneNumber = phoneNumberAnswer.value;
      } else if (typeof phoneNumberAnswer.answer === "string") {
        phoneNumber = phoneNumberAnswer.answer;
      }

      if (phoneNumber) {
        setUserId(phoneNumber);
      }
    }
  }, [userAnswers]);

  const initializeFlow = async () => {
    try {
      setLoading(true);

      // Show the user's selected question/text first
      setConversation([{ type: "answer", text: initialText }]);

      // Call first API to get statements
      const statementsResponse = await api.get("/get-statements");

      if (
        statementsResponse.data?.data &&
        statementsResponse.data.data.length > 0
      ) {
        // Start showing statements one by one
        showStatementsSequentially(statementsResponse.data.data);
      } else {
        // If no statements, directly fetch questions
      }
    } catch (error) {
      console.error("Error fetching statements:", error);
      // Try to fetch questions anyway
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

      setConversation((prev) => [
        ...prev,
        { type: "system", text: statement.question },
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

      if (
        questionsResponse.data?.data &&
        questionsResponse.data.data.length > 0
      ) {
        const sortedQuestions = questionsResponse.data.data.sort(
          (a, b) => a.position - b.position
        );
        setAllQuestions(sortedQuestions);
        setCurrentQuestion(sortedQuestions[0]);
        setCurrentQuestionIndex(0);
        setQuestionNumber(1);
      } else {
        setConversation((prev) => [
          ...prev,
          { type: "system", text: "No questions available for this topic." },
        ]);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      setConversation((prev) => [
        ...prev,
        { type: "system", text: "Error loading questions. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const moveToNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex < allQuestions.length) {
      setCurrentQuestionIndex(nextIndex);
      setCurrentQuestion(allQuestions[nextIndex]);
      setQuestionNumber((prev) => prev + 1);
      setCanReload(true);
    } else {
      // All questions completed
      setCurrentQuestion(null);
      setIsLastQuestion(true);
      setCanReload(false);
      // Call save API first, then start chat mode
      saveUserResponses().then(() => {
        startChatMode();
      });
    }
  };

  // New function to save user responses
  const saveUserResponses = async () => {
    try {
      // Format the payload according to the required structure
      const payload = formatSavePayload();

      console.log("Saving user responses:", payload);

      const response = await api.post("/save", payload);

      console.log("Save response:", response.data);

      // Optionally show a message to the user
      addToConversation(
        "system",
        "Your responses have been saved successfully!"
      );

      return response.data;
    } catch (error) {
      console.error("Error saving user responses:", error);
      addToConversation(
        "system",
        "There was an issue saving your responses, but we'll continue with your results."
      );
    }
  };

  // Function to format the payload for the save API
  const formatSavePayload = () => {
    // Extract phone number from Q2 (assuming Q2 is the phone number question)
    const phoneNumberAnswer = userAnswers["Q2"];
    let phoneNumber = "";

    if (phoneNumberAnswer) {
      // Check if it's a phone data object with fullNumber
      if (
        phoneNumberAnswer.value &&
        typeof phoneNumberAnswer.value === "object" &&
        phoneNumberAnswer.value.fullNumber
      ) {
        phoneNumber = phoneNumberAnswer.value.fullNumber;
      } else if (typeof phoneNumberAnswer.value === "string") {
        phoneNumber = phoneNumberAnswer.value;
      } else if (typeof phoneNumberAnswer.answer === "string") {
        phoneNumber = phoneNumberAnswer.answer;
      }
    }

    // Format responses array
    const responses = Object.entries(userAnswers).map(
      ([questionId, answerData]) => {
        let answer = answerData.answer;

        // Handle phone number specially - use full number for API
        if (
          questionId === "Q2" &&
          answerData.value &&
          typeof answerData.value === "object" &&
          answerData.value.fullNumber
        ) {
          answer = answerData.value.fullNumber;
        }
        // For multi-select questions, the answer should be an array
        else if (Array.isArray(answerData.value)) {
          answer = answerData.value;
        } else if (
          typeof answerData.value === "string" &&
          answerData.value.includes(",")
        ) {
          // If it's a comma-separated string, convert to array
          answer = answerData.value.split(", ").map((item) => item.trim());
        }

        return {
          questionId,
          answer,
        };
      }
    );

    // Sort responses by questionId to maintain order (Q1, Q2, Q3, etc.)
    responses.sort((a, b) => {
      const aNum = parseInt(a.questionId.replace("Q", ""));
      const bNum = parseInt(b.questionId.replace("Q", ""));
      return aNum - bNum;
    });

    return {
      phoneNumber,
      responses,
    };
  };

  // Function to generate a personalized initial message based on user's quiz responses
  const generateCustomInitialMessage = () => {
    try {
      const mainTopic = initialText || "retirement planning";

      // Create a simple user-style question with their context
      let message = `${mainTopic}? `;

      // Add key details from their answers in a natural way
      const keyDetails = [];
      Object.entries(userAnswers).forEach(([questionId, answerData]) => {
        // Skip phone number for privacy
        if (
          questionId === "Q2" &&
          answerData.questionText.toLowerCase().includes("phone")
        ) {
          return;
        }

        let answerText = answerData.answer;
        if (Array.isArray(answerData.value)) {
          answerText = answerData.value.join(", ");
        }

        keyDetails.push(answerText);
      });

      if (keyDetails.length > 0) {
        message += `I'm ${keyDetails.join(", ")}. `;
      }

      message += "What should I do?";

      return message;
    } catch (error) {
      console.error("Error generating message:", error);
      return `${initialText || "How should I plan for retirement"}?`;
    }
  };

  // New function to start chat mode after quiz completion
  const startChatMode = async () => {
    try {
      setLoading(true);
      setIsChatMode(true);

      // Show completion message
      addToConversation(
        "system",
        "Thank you for completing the quiz! Let me analyze your responses and provide personalized retirement insights..."
      );

      if (!userId) {
        addToConversation(
          "system",
          "Error: Unable to identify user. Please try again."
        );
        return;
      }

      console.log("Starting chat mode with userId:", userId);
      console.log("User answers:", userAnswers);

      // Generate personalized message based on user's quiz responses
      const customMessage = generateCustomInitialMessage();
      console.log("Generated custom message:", customMessage);

      // Send the personalized initial message (show as user message)
      await handleSendMessage(customMessage, false);
    } catch (error) {
      console.error("Error starting chat mode:", error);
      addToConversation(
        "system",
        "Something went wrong while starting the analysis. Please try again later."
      );
    }
  };

  // New chat message handler with streaming
  const handleSendMessage = async (message, isInitialMessage = false) => {
    try {
      setLoading(true);

      // Add user message immediately (only if it's not the initial automated message)
      if (!isInitialMessage) {
        addToConversation("answer", message);
      }

      // Add an empty assistant message that will be updated during streaming
      addToConversation("system", "");

      // Mark the last message as streaming
      setConversation((prev) => {
        const newConv = [...prev];
        newConv[newConv.length - 1] = {
          ...newConv[newConv.length - 1],
          isStreaming: true,
        };
        return newConv;
      });

      console.log("Sending message to API:", { userId, message }); // Debug log

      // Prepare for streaming response
      const response = await fetch(
        "https://test-api.retiremate.com/api/chat/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, message }),
        }
      );

      console.log("API Response status:", response.status); // Debug log

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        lines.forEach((line) => {
          if (line.startsWith("data: ")) {
            try {
              const jsonData = line.slice(5).trim();
              if (jsonData === "[DONE]") return; // Handle completion marker

              const data = JSON.parse(jsonData);
              console.log("Received SSE data:", data); // Debug log

              if (data.type === "delta" && data.content) {
                assistantMessage += data.content;
                // Update only the last system message
                setConversation((prev) => {
                  const newMessages = [...prev];
                  for (let i = newMessages.length - 1; i >= 0; i--) {
                    if (
                      newMessages[i].type === "system" &&
                      newMessages[i].hasOwnProperty("isStreaming")
                    ) {
                      newMessages[i] = {
                        type: "system",
                        text: assistantMessage,
                        isStreaming: true,
                      };
                      break;
                    }
                  }
                  return newMessages;
                });
              } else if (data.type === "end" || data.type === "done") {
                // Mark the message as complete when streaming ends
                setConversation((prev) => {
                  const newMessages = [...prev];
                  for (let i = newMessages.length - 1; i >= 0; i--) {
                    if (
                      newMessages[i].type === "system" &&
                      newMessages[i].hasOwnProperty("isStreaming")
                    ) {
                      newMessages[i] = {
                        type: "system",
                        text: assistantMessage,
                        isStreaming: false,
                      };
                      break;
                    }
                  }
                  return newMessages;
                });
              }
            } catch (e) {
              console.error("Error parsing SSE data:", e, "Raw line:", line);
            }
          }
        });
      }

      // Fallback: if no streaming data was received, mark as complete
      if (!assistantMessage) {
        console.warn(
          "No streaming data received, checking for direct response"
        );
        // Try to read response as regular JSON if streaming failed
        const responseText = await response.text();
        console.log("Direct response:", responseText);

        setConversation((prev) => {
          const newMessages = [...prev];
          for (let i = newMessages.length - 1; i >= 0; i--) {
            if (
              newMessages[i].type === "system" &&
              newMessages[i].hasOwnProperty("isStreaming")
            ) {
              newMessages[i] = {
                type: "system",
                text:
                  responseText ||
                  "I received your message but couldn't generate a response. Please try again.",
                isStreaming: false,
              };
              break;
            }
          }
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);

      // Update the streaming message with error
      setConversation((prev) => {
        const newMessages = [...prev];
        for (let i = newMessages.length - 1; i >= 0; i--) {
          if (
            newMessages[i].type === "system" &&
            newMessages[i].hasOwnProperty("isStreaming")
          ) {
            newMessages[i] = {
              type: "system",
              text: `Sorry, there was an error processing your request: ${error.message}. Please try again.`,
              isStreaming: false,
            };
            break;
          }
        }
        return newMessages;
      });
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
        value: value,
      },
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

    setTimeout(
      () => {
        moveToNextQuestion();
        setLoading(false);
      },
      comment && comment.trim() ? 2500 : 1500
    );
  };

  const handleMultiSelectSubmit = (selectedOptions) => {
    addToConversation("question", currentQuestion.questionText);

    const selectedTexts = selectedOptions.map((opt) => opt.text);
    const answerText = selectedTexts.join(", ");
    addToConversation("answer", answerText);

    setLoading(true);

    // Store the multi-select answer with array value
    storeAnswer(
      currentQuestion.questionId,
      currentQuestion.questionText,
      selectedTexts, // Store as array for multi-select
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

    setTimeout(
      () => {
        moveToNextQuestion();
        setLoading(false);
      },
      comment && comment.trim() ? 2500 : 1500
    );
  };

  const handleTextSubmit = async (inputData) => {
    // Handle both regular text input and phone data object
    let displayText = "";
    let storeValue = inputData;

    // Check if this is phone data object from TextInputPhone
    if (inputData && typeof inputData === "object" && inputData.displayNumber) {
      displayText = `${inputData.countryFlag} ${inputData.displayNumber}`;
      storeValue = inputData; // Store the entire phone object
    } else {
      // Regular text input
      displayText = inputData || textInput;
      storeValue = inputData || textInput;
    }

    if (!displayText.trim()) return;

    const questionText = currentQuestion.questionText;

    addToConversation("question", questionText);
    addToConversation("answer", displayText);

    // Store the answer (phone object or regular text)
    storeAnswer(
      currentQuestion.questionId,
      questionText,
      storeValue,
      displayText
    );

    setLastQuestionText(questionText);
    setLastQuestionData(currentQuestion);
    setLastAnswerOption({ text: displayText, value: storeValue });

    setTextInput(""); // Clear input
    setLoading(true);

    const comment = currentQuestion.defaultComment;
    if (comment && comment.trim()) {
      setTimeout(() => {
        addToConversation("comment", comment);
      }, 1000);
    }

    setTimeout(
      () => {
        moveToNextQuestion();
        setLoading(false);
      },
      comment && comment.trim() ? 2500 : 1500
    );
  };

  // New function to handle user input in chat mode
  const handleChatInput = async (message) => {
    if (!message.trim() || loading) return;

    await handleSendMessage(message);
    setTextInput(""); // Clear input after sending
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
      setQuestionNumber((prev) => prev - 1);
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
                canReload={canReload && !isChatMode}
                loading={loading}
                onReload={handleReloadAnswer}
              />
            );
          })}

          <LoadingIndicator loading={loading} />

          {/* Show QuestionDisplay only if not in chat mode and there's a current question */}
          {!isChatMode && currentQuestion && (
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
          )}

          {/* Show text input for chat mode */}
          {isChatMode && !loading && (
            <div className="mt-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleChatInput(textInput);
                    }
                  }}
                  placeholder="Ask me anything about your retirement plan..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={() => handleChatInput(textInput)}
                  disabled={!textInput.trim() || loading}
                  className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </div>
          )}

          <div id="overview" ref={overviewRef} className="scroll-mt-20"></div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
