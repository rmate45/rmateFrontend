import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import logo from "../assets/retiremate-logo.svg";
import { ChatHeader } from "../components/ChatHeader/ChatHeader";
import { ChatMessage } from "../components/ChatMessage/ChatMessage";
import { LoadingIndicator } from "../components/LoadingIndicator/LoadingIndicator";
import { QuestionDisplay } from "../components/QuestionDisplay/QuestionDisplay";
import api from "../api/api.js";
import sendIcon from "../assets/send.svg";
import PlotChart from "../components/PlotChart/PlotChart.jsx";

function buildPayload(response) {
  const parseMedian = (str) => {
    if (!str) return null;
    const nums = str
      .replace(/\$|,/g, "")
      .replace(/–|—/g, "-") // normalize en dash/em dash to regular dash
      .split("-")
      .map((n) => parseInt(n.trim(), 10))
      .filter((n) => !isNaN(n))
      .sort((a, b) => a - b);

    if (nums.length === 0) return null;

    const mid = Math.floor(nums.length / 2);
    return nums.length % 2 === 1 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
  };

  const age = parseInt(response?.Q3?.value, 10) || null;
  const householdIncome = parseMedian(response?.Q9?.value);
  const retirementSavings = parseMedian(response?.Q10?.value);

  return {
    age,
    householdIncome,
    retirementSavings,
  };
}

const Quiz = () => {
  const location = useLocation();
  const initialText = location.state?.title || "";

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [textInput, setTextInput] = useState("");
  const chatRef = useRef(null);
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

  // New states for chat functionality
  const [isChatMode, setIsChatMode] = useState(false);
  const [userId, setUserId] = useState(null);

  // New state for chart data
  const [chartData, setChartData] = useState(null);
  const [showChart, setShowChart] = useState(false);

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
      setCanReload(true);
    } else {
      // All questions completed
      setCurrentQuestion(null);
      setIsLastQuestion(true);
      setCanReload(false);
      setLoading(true);
      // Call save API first, then start chat mode
      saveUserResponses().then(() => {
        startChatMode();
      });
    }
  };

  // New function to save user responses
  const saveUserResponses = async () => {
    try {
      setLoading(true);
      // Format the payload according to the required structure
      const payload = formatSavePayload();

      console.log("Saving user responses:", payload);

      const response = await api.post("/save", payload);

      console.log("Save response:", response.data);

      return response.data;
    } catch (error) {
      console.error("Error saving user responses:", error);
      setLoading(false);
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

  const fetchChartData = async (data) => {
    try {
      const response = await api.post("/calculate-saving-projection", data);
      return response;
    } catch (error) {
      console.error("Error fetching chart data:", error);
      throw error;
    }
  };

  // New function to start chat mode after quiz completion
  const startChatMode = async () => {
    try {
      setLoading(true);

      // Show completion message
      setTimeout(() => {
        addToConversation(
          "system",
          "Thank you for completing the quiz! Let me analyze your responses and provide personalized retirement insights..."
        );
      }, 2000);

      if (!userId) {
        addToConversation(
          "system",
          "Error: Unable to identify user. Please try again."
        );
        return;
      }

      console.log("Starting chat mode with userId:", userId);
      console.log("User answers:", userAnswers);

      const chartPayload = buildPayload(userAnswers);

      const response = await fetchChartData(chartPayload);

      // Set chart data and show it
      if (response?.data?.data) {
        setChartData(response.data.data);
        setShowChart(true);

        // Add chart message to conversation
        addToConversation(
          "system",
          "Based on your responses, here's your personalized retirement savings projection:"
        );

        // Add chart component to conversation
        addToConversation("chart", response.data?.data?.data);

        // Wait a bit, then show the chat assistance message
        setTimeout(() => {
          addToConversation(
            "system",
            "Now you can ask me anything about your retirement plan, savings strategies, or any financial questions you might have!"
          );
          setLoading(false);
          setIsChatMode(true);
        }, 2000);
      } else {
        addToConversation(
          "system",
          "I couldn't generate your chart data, but I'm ready to help with any retirement planning questions you have!"
        );
        setLoading(false);
        setIsChatMode(true);
      }
    } catch (error) {
      console.error("Error starting chat mode:", error);
      addToConversation(
        "system",
        "Something went wrong while generating your analysis, but I'm still here to help with your retirement planning questions!"
      );
      setLoading(false);
      setIsChatMode(true);
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
        console.warn("No streaming data received");

        setConversation((prev) => {
          const newMessages = [...prev];
          for (let i = newMessages.length - 1; i >= 0; i--) {
            if (
              newMessages[i].type === "system" &&
              newMessages[i].hasOwnProperty("isStreaming")
            ) {
              newMessages[i] = {
                type: "system",
                text: "I received your message but couldn't generate a response. Please try again.",
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
    console.log(inputData, "displayText");

    // Handle both regular text input and phone data object
    let displayText = "";
    let storeValue = inputData;

    if (
      inputData &&
      typeof inputData === "object" &&
      (inputData.displayNumber || inputData.fullNumber)
    ) {
      // Prefer displayNumber if available, else fallback to fullNumber
      displayText = inputData.displayNumber || inputData.fullNumber;
      storeValue = inputData; // keep full object for backend
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
    }

    setCanReload(false);
    setLoading(false);
  };

  const addToConversation = (type, text) => {
    if (type == "chart") {
      console.log(text, type);
    }
    setConversation((prev) => [...prev, { type, text }]);
  };

  const scrollUp = () => {
    const chat = chatRef.current;
    if (chat) {
      chatRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToBottom = () => {
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

            // Render chart if the message type is 'chart'
            if (item.type === "chart") {
              return (
                <div key={idx} className="mb-4 flex justify-start">
                  <div className="px-2 py-2 rounded-xl border-2 border-secondary bg-white w-full max-w-full">
                    <PlotChart data={item.text} />
                  </div>
                </div>
              );
            }

            return (
              <ChatMessage
                key={idx}
                message={item}
                isLastAnswer={isLastAnswer}
                canReload={canReload && !isChatMode}
                loading={loading}
                onReload={handleReloadAnswer}
                chatMode={isChatMode}
              />
            );
          })}

          <LoadingIndicator loading={loading && !isChatMode} />

          {/* Show QuestionDisplay only if not in chat mode and there's a current question */}
          {!isChatMode && currentQuestion && (
            <QuestionDisplay
              onValidationError={scrollUp}
              scrollUp={scrollToBottom} // This was already scrollToBottom in your code
              scrollToBottom={scrollToBottom} // Add this new prop for error scrolling
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
              <div className="flex gap-2 relative">
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
                  className={`w-full px-4 py-2 pr-10 border-2 jost rounded-xl text-sm focus:outline-none border-gray-300 focus:border-secondary`}
                />
                <button
                  onClick={() => handleChatInput(textInput)}
                  disabled={!textInput.trim() || loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <img src={sendIcon} alt="send" className="w-6 mt-4 mb-4" />
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
