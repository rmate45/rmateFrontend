import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import logo from "../assets/retiremate-logo.svg";
import { ChatHeader } from "../components/ChatHeader/ChatHeader";
import { ChatMessage } from "../components/ChatMessage/ChatMessage";
import { LoadingIndicator } from "../components/LoadingIndicator/LoadingIndicator";
import { QuestionDisplay } from "../components/QuestionDisplay/QuestionDisplay";
import api from "../api/api.js";
import PlotChart from "../components/PlotChart/PlotChart.jsx";
import PrivacyTrustModal from "../components/PrivacyTrustModal/PrivacyTrustModal.jsx";
import RetirementQa from "../components/RetiremateQa/RetiremateQa.jsx";
import { isDesktop } from "react-device-detect";
import UserCard from "../components/UserCard/UserCard.jsx";
import ChartRecommendation from "../components/ChartRecommendation/ChartRecommendation.jsx";

const chatApiUrl = import.meta.env.VITE_CHAT_API_URL;

function buildPayload(response) {
  console.log(response, "response");
  const parseMedian = (str) => {
    if (!str) return null;

    const normalized = str.trim().toLowerCase();

    // Special cases
    if (normalized.includes("nothing") || normalized.includes("no income")) {
      return 0;
    }

    if (normalized.includes("less than")) {
      const max = parseInt(str.replace(/\D/g, ""), 10);
      return isNaN(max) ? 0 : Math.round(max / 2); // midpoint between 0 and max
    }

    if (normalized.includes("plus")) {
      if (normalized.includes("million")) {
        // "1 Million Plus" -> pick between 1M and 2M
        const min = 1_000_000;
        const max = 2_000_000;
        return Math.floor(Math.random() * (max - min + 1)) + min;
      } else {
        // "$500,000 +" -> pick between 500k and 1M
        const min = parseInt(str.replace(/\$|,|\+/g, ""), 10) || 500_000;
        const max = 1_000_000;
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
    }

    // Normal ranges like "$51,000 - $100,000"
    const nums = str
      .replace(/\$|,|\+/g, "")
      .replace(/–|—/g, "-") // normalize en dash/em dash
      .split("-")
      .map((n) => parseInt(n.trim(), 10))
      .filter((n) => !isNaN(n))
      .sort((a, b) => a - b);

    if (nums.length === 0) return null;
    if (nums.length === 1) return nums[0];

    const mid = Math.floor(nums.length / 2);
    return nums.length % 2 === 1 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
  };

  const age = parseInt(response?.Q1?.value, 10) || null;
  const householdIncome = parseMedian(response?.Q3?.value);
  const retirementSavings = parseMedian(response?.Q4?.value);
  const otherSavings = parseMedian(response?.Q5?.value);

  return {
    age,
    householdIncome,
    retirementSavings,
    otherSavings,
  };
}

// Predefined starter questions
const STARTER_QUESTIONS = {
  main: "What is your top concern for retirement planning?",
  options: [
    {
      id: "behind_savings",
      text: "Am I behind on retirement savings at my age?",
    },
    {
      id: "spouse_kids",
      text: "Am I saving enough to support a spouse and kids in retirement?",
    },
    {
      id: "tax_implications",
      text: "What are the tax implications of withdrawing retirement funds early?",
    },
    {
      id: "healthcare_budget",
      text: "How much should I budget for healthcare in retirement?",
    },
  ],
};

const Quiz = ({ initialCard, initialId, initialType }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  console.log(params, "params");

  // Detect if this is a persona URL by checking the pathname
  const isPersonaUrl = location.pathname.startsWith('/p/') || 
                       location.pathname.includes('/persona/');

  const urlData = {
    id: initialId || params.get("id") || "",
    isPersona: isPersonaUrl || false,
    isCustomPersona: params.get("isCustomPersona") === "true" || false,
    type: initialType || params.get("type") || "",
  };
console.log(urlData,"urlData");

  const initialText = location.state?.title || params.get("title") || "";
  console.log(initialText, "initialText");

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [conversation, setConversation] = useState([]);
  console.log(conversation, "conversation");

  const [loading, setLoading] = useState(true);
  const [textInput, setTextInput] = useState("");
  const chatRef = useRef(null);
  const [lastAnswerOption, setLastAnswerOption] = useState(null);
  const [lastQuestionText, setLastQuestionText] = useState(null);
  const [lastQuestionData, setLastQuestionData] = useState(null);
  const [canReload, setCanReload] = useState(false);
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const overviewRef = useRef(null);
  const chatInputRef = useRef(null);
  const [isScroll, setIsScroll] = useState(false);
  const [personaData, setPersonaData] = useState(null);

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
  const [isMobile, setIsMobile] = useState(false);

  // New states for structured Q&A flow
  const [showStarterQuestions, setShowStarterQuestions] = useState(false);
  const [selectedStarterQuestion, setSelectedStarterQuestion] = useState(null);
  const [followUpQuestions, setFollowUpQuestions] = useState([]);
  const [showFollowUpQuestions, setShowFollowUpQuestions] = useState(false);
  const [userName, setUserName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [pendingQuestions, setPendingQuestions] = useState([]);
  const [chartAlreadyShown, setChartAlreadyShown] = useState(false);
  // item passed from TestimonialCard via navigate('/quiz', { state: { item } })
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  console.log(pendingQuestions, "pendingQuestions");
  const [showPendingItems, setShowPeningItems] = useState(false)
  // console.log(showPendingItems, "showPendingItems");
  const [item, setItem] = useState(null)
  console.log(item,"item");
  
  const [graphTitleQuestion, SetGraphTitleQuestion] = useState("")
  const [userAge, setUserAge] = useState("")
  // const [userName, SetuserName] = useState("")
  console.log(showPendingItems, 'showPendingItems');
  console.log(showStarterQuestions, 'showStarterQuestions');

  useEffect(() => {

    initializeFlow();
  }, []);

  // Track mobile / desktop based on width <= 767
  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateIsMobile = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);

    return () => {
      window.removeEventListener("resize", updateIsMobile);
    };
  }, []);

  // Show mobile-only intro message when pending items (extra questions) are activated
  // This should only apply for persona flows, and should react to resize via isMobile
  useEffect(() => {
    if (!showPendingItems && !urlData.isPersona) {
      setShowPeningItems(true)
      return;
    }

    // setConversation((prev) => [
    //   ...prev,
    //   {
    //     type: "system",
    //     text: "Let's get started with a few basic questions.",
    //     // isMobile: true
    //   },
    // ]);  
  }, [showPendingItems, urlData.isPersona]);

  useEffect(() => {
    if (chatInputRef && chatInputRef?.current) {
      chatInputRef.current.focus();
    }
  }, [chatInputRef, isChatMode, loading]);

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

    const ageAnswer = userAnswers["Q1"];
    if (ageAnswer) {
      let uniqueId = "User";
      if (ageAnswer.value) {
        uniqueId +=
          `_${ageAnswer.value}` + `_${Math.floor(Math.random() * 10000)}`;
      }

      setUserId(uniqueId);
    }
  }, [userAnswers]);

  // Extract user name from Q1 answer
  // useEffect(() => {
  //   const nameAnswer = userAnswers["Q1"];
  //   if (nameAnswer?.answer) {
  //     setUserName(nameAnswer.answer);
  //   }
  // }, [userAnswers]);

  const fetchPersonaById = async (id) => {
    if (!id) return null;
    try {
      const res = await api.get(`/get-persona/${id}`);
      if (res.data?.type === "success" && res.data?.data) {
        setPersonaData(res.data.data);
        setItem(res.data.data);
        return res.data.data;
      }
      return null;
    } catch (err) {
      console.error("Error fetching persona:", err);
      return null;
    }
  };

  // Used by mobile chart view (Tap here to view the analysis)
  const handleTapAnalysis = () => {
    if (pendingQuestions.length > 0) {
      continueWithPendingQuestions();
    } else {
      setShowStarterQuestions(true);
      setLoading(false);
    }
  };

  const fetchSavedPersonaById = async (id) => {
    if (!id) return null;
    try {
      const res = await api.get(`/get-demographic/${id}`);
      if (res.data?.type === "success" && res.data?.data) {
        setPersonaData(res.data.data);
        return res.data.data;
      }
      return null;
    } catch (err) {
      console.error("Error fetching persona:", err);
      return null;
    }
  };
  const fetchQuestionFinancialById = async (id) => {
    if (!id) return null;
    try {
      const res = await api.get(`/get-financial-planning/${id}`);
      if (res.data?.type === "success" && res.data?.data) {
        setItem(res.data.data);
        return res.data.data;
      }
      return null;
    } catch (err) {
      console.error("Error fetching persona:", err);
      return null;
    }
  };

  const fetchQuestionExploreById = async (id) => {
    if (!id) return null;
    try {
      const res = await api.get(`/get-explore-question/${id}`);
      if (res.data?.type === "success" && res.data?.data) {
        return res.data.data;
      }
      return null;
    } catch (err) {
      console.error("Error fetching persona:", err);
      return null;
    }
  };

  const fetchQuestionRothById = async (id) => {
    if (!id) return null;
    try {
      const res = await api.get(`/get-roth-question/${id}`);
      if (res.data?.type === "success" && res.data?.data) {
        setItem(res.data.data);
        return res.data.data;
      }
      return null;
    } catch (err) {
      console.error("Error fetching persona:", err);
      return null;
    }
  };
  const fetchQuestionMedicareById = async (id) => {
    if (!id) return null;
    try {
      const res = await api.get(`/get-medicare-question/${id}`);
      if (res.data?.type === "success" && res.data?.data) {
        setItem(res.data.data);
        return res.data.data;
      }
      return null;
    } catch (err) {
      console.error("Error fetching persona:", err);
      return null;
    }
  };

  // Fetch question by ID without knowing the type
  const fetchQuestionByIdAuto = async (id) => {
    if (!id) return null;

    // Try each endpoint until one succeeds
    const endpoints = [
      { name: 'roth', fetch: () => fetchQuestionRothById(id) },
      { name: 'explore', fetch: () => fetchQuestionExploreById(id) },
      { name: 'financial', fetch: () => fetchQuestionFinancialById(id) },
      { name: 'medicare', fetch: () => fetchQuestionMedicareById(id) },
    ];

    for (const endpoint of endpoints) {
      try {
        const result = await endpoint.fetch();
        if (result) {
          console.log(`Question found in ${endpoint.name} endpoint`);
          return result;
        }
      } catch (err) {
        // Continue to next endpoint
        console.log(`Question not found in ${endpoint.name}, trying next...`);
      }
    }

    console.error('Question not found in any endpoint');
    return null;
  };

  const initializeFlow = async () => {
    try {
      setLoading(true);

      // Handle different question types based on URL parameters
      if (!urlData?.isPersona && urlData.id) {
        // Auto-detect question type by trying all endpoints
        const fetchedData = await fetchQuestionByIdAuto(urlData.id);

        if (fetchedData) {
          SetGraphTitleQuestion(fetchedData?.question)
          setUserName(fetchedData?.name)
          setUserAge(fetchedData?.age)
          // First message - question
          setTimeout(() => {
            setConversation([{ type: "answer", text: fetchedData?.question }]);
          }, 1000);
          // Wait 1 second before showing answer(s)
          await new Promise((resolve) => setTimeout(resolve, 2500));

          // Check if answer is an array or a string

          if (fetchedData?.answers) {
            // Join all answers with newlines and show in single box
            const combinedAnswer = fetchedData.answers.join("\n");
            setConversation((prev) => [
              ...prev,
              { type: "system", text: combinedAnswer },
            ]);
            setIsScroll(true);
          } else {
            // Single answer - show it directly
            setConversation((prev) => [
              ...prev,
              {
                type: "system",
                text: fetchedData?.answer
                  ?.replace(/<br\s*\/?>/gi, "\n") // replace <br> or <br/> with line breaks
                  ?.trim(),
              },
            ]);

            setIsScroll(true);
          }

          // Wait another second before continuing
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      if (urlData?.isPersona && urlData.id) {
        const fetched = await fetchPersonaById(urlData.id);
        console.log("fetched", fetched)
        await initialChartMessage(fetched);
      }

      if (urlData?.isCustomPersona && urlData.id) {
        const fetched = await fetchSavedPersonaById(urlData.id);
        await initialCustomChartMessage(fetched);
      }

      if (initialText) {
        // Show the user's selected question/text first
        setConversation([{ type: "answer", text: initialText }]);
      }

      // Call first API to get statements
      const statementsResponse = await api.get("/get-statements");

      if (
        statementsResponse.data?.data &&
        statementsResponse.data.data.length > 0 &&
        !urlData?.isPersona &&
        !urlData?.isCustomPersona
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
        setTimeout(fetchAppropriateQuestions, 1000);
        return;
      }

      if (
        statement?.question ==
        "You're in control of what you share. Your answers stay private and only help personalize your results. Learn more here."
      ) {
        setConversation((prev) => [
          ...prev,
          {
            type: "system",
            text: (
              <p className="jost">
                You're in control of what you share. Your answers stay private and only help personalize your results. Learn more {" "}
                <span
                  onClick={() => setShowModal(true)}
                  className="jost text-primary hover:!underline cursor-pointer"
                >
                  {" "}
                  here.
                </span>
              </p>
            ),
          },
        ]);
      } else {
        setConversation((prev) => [
          ...prev,
          { type: "system", text: statement.question },
        ]);
      }

      index++;

      if (index < statementsData.length) {
        setTimeout(showNext, 1000);
      } else {
        setTimeout(fetchAppropriateQuestions, 1000);
      }
    };

    setTimeout(showNext, 1000);
  };

  const fetchMedicareQuestions = async () => {
    try {
      const questionsResponse = await api.get("/get-medi-questions");

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
          { type: "system", text: "No Medicare questions available." },
        ]);
      }
    } catch (error) {
      console.error("Error fetching Medicare questions:", error);
      setConversation((prev) => [
        ...prev,
        { type: "system", text: "Error loading Medicare questions. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
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
        const sortWithoutEmailPhone = sortedQuestions.slice(0, 6)
        console.log(sortWithoutEmailPhone, "sortWithoutEmailPhone");

        setPendingQuestions(sortedQuestions.slice(6))

        setAllQuestions(sortWithoutEmailPhone);
        setCurrentQuestion(sortWithoutEmailPhone[0]);
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

  // Helper function to call the appropriate fetch function based on quiz type
  const fetchAppropriateQuestions = () => {
    if (urlData.type === "medicareQuiz") {
      return fetchMedicareQuestions();
    } else {
      return fetchQuestions();
    }
  };

  // Function to continue with pending questions after chart is loaded
  const continueWithPendingQuestions = () => {
    if (pendingQuestions.length > 0) {
      // Add pending questions to the current questions list
      setAllQuestions(prev => [...prev, ...pendingQuestions]);

      // Continue from where we left off
      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < allQuestions.length + pendingQuestions.length) {
        setCurrentQuestionIndex(nextIndex);
        setCurrentQuestion(pendingQuestions[0]);
        setLoading(false);
        setIsChatMode(false); // Go back to question mode

        // Clear pending questions since we're now using them
        setPendingQuestions([]);
      } else {
        // No more questions, show starter questions
        setShowStarterQuestions(true);
        setLoading(false);
      }
    } else {
      setShowStarterQuestions(true);
      setLoading(false);
    }
  };

  // Function to skip current question (for pending questions like email/phone)
  const handleSkipQuestion = (questionId) => {
    // Add "Skipped" to conversation
    addToConversation("answer", "Skipped");
    
    // Store skipped answer
    const skippedAnswer = {
      questionId: questionId,
      answer: "Skipped",
      value: "",
      skipped: true,
    };
    
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: skippedAnswer,
    }));
    
    // Clear text input
    setTextInput("");
    
    // Move to next question
    moveToNextQuestion({
      ...userAnswers,
      [questionId]: skippedAnswer,
    });
  };

  const moveToNextQuestion = (answers) => {
    console.log(answers, "answerss");
    if (currentQuestionIndex == 0) {
      setIsScroll(true);
    }

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

      // If chart has already been shown (we're completing pending questions) OR it's a Medicare quiz, go directly to starter questions
      console.log("chartAlreadyShown:", chartAlreadyShown, "urlData.type:", urlData.type);
      if (chartAlreadyShown || urlData.type === "medicareQuiz") {
        console.log("Calling saveUserResponses for Medicare quiz or after pending questions");
        // Save data after ALL questions are completed (including pending)
        saveUserResponses(answers).then(() => {
          setShowStarterQuestions(true);
          setLoading(false);
          setIsChatMode(true);
        });
      } else {
        console.log("Calling startStructuredQA for first time");
        // First time completing questions, show chart and then continue
        startStructuredQA(answers);
      }
    }
  };

  // New function to save user responses
  const saveUserResponses = async (answers) => {
    try {
      setLoading(true);
      // Format the payload according to the required structure
      const payload = formatSavePayload(answers);

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
  const formatSavePayload = (answers) => {
    // Determine phone number question ID based on quiz type
    const phoneQuestionId = urlData.type === "medicareQuiz" ? "MQ9" : "Q8";
    const phoneNumberAnswer = answers[phoneQuestionId];
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
    const responses = Object.entries(answers).map(
      ([questionId, answerData]) => {
        let answer = answerData.answer;

        // Handle phone number specially - use full number for API
        if (
          questionId === phoneQuestionId &&
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

  const initialChartMessage = async (personaData) => {
    console.log(personaData, "personaData");
    const chartPayload = {
      age: personaData?.age,
      householdIncome: personaData?.annual_income || 0,
      retirementSavings: personaData?.total_savings || 0,
      otherSavings: personaData?.otherSavings || 0,
    };
    const statementsResponse = await api.get("/get-statements");
    const intialStartMessages = statementsResponse?.data?.data
    console.log(intialStartMessages, "statementsResponse")
    SetGraphTitleQuestion(personaData?.persona_question)
    setUserName(personaData?.name)
    setUserAge(personaData?.age)
    setConversation([{ type: "system", text: intialStartMessages[0].question }]);
    console.log(statementsResponse, "statementsResponse")
    // Second message after 1 second
    setTimeout(() => {
      setConversation((prev) => [
        ...prev,
        {
          type: "system",
          text: `${intialStartMessages[1].question}`,
        },
      ]);
    }, 1000);

    // Third message (persona specific) after 2 seconds

    setTimeout(() => {
      setConversation((prev) => [
        ...prev,
        {
          type: "system",
          text: (
            <p className="jost">
              Your privacy matters! Anything you share stays private and is only
              used to improve your results. Learn more{" "}
              <span
                onClick={() => setShowModal(true)}
                className="jost text-primary hover:underline! cursor-pointer"
              >
                {" "}
                here.
              </span>
            </p>
          ),
        },
      ]);
      setIsScroll(true);
    }, 2000);
    // Fourth message about the plot after 3 seconds
    setTimeout(() => {
      setConversation((prev) => [
        ...prev,
        {
          type: "system",
          text: personaData?.persona_description,
        },
      ]);
    }, 3000);
    // Fifth message about the plot after 4 seconds
    setTimeout(() => {
      setConversation((prev) => [
        ...prev,
        {
          type: "system",
          text: "Here is the plot on how long shall savings last in retirement.",
        },
      ]);
      setIsScroll(true);
    }, 4000);

    try {
      setLoading(true);
      // Delay the chart data fetch to allow messages to display
      setTimeout(async () => {
        const response = await fetchChartData(chartPayload);
        if (response?.data?.data) {
          setChartData(response.data.data);
          setShowChart(true);
          // Initial persona chart should NOT show the disclaimer
          addToConversation("chart", response.data?.data, { showDisclaimer: false });
          setLoading(false);
          setShowDisclaimer(false)

          // On larger screens, show the intro message here
          // if (typeof window !== "undefined" && window.innerWidth > 767) {
          //   setConversation((prev) => [
          //     ...prev,
          //     {
          //       type: "system",
          //       text: "Let's get started with a few basic questions.",
          //       isDesktop: false
          //     },
          //   ]);
          // }

          setTimeout(fetchAppropriateQuestions, 1000);
        } else {
          addToConversation(
            "system",
            "I couldn't generate your chart data, but let's continue with your retirement planning questions!"
          );
          setLoading(false);
        }
      }, 5000);
    } catch (error) {
      console.error("Error starting structured Q&A:", error);
      addToConversation(
        "system",
        "Something went wrong while generating your analysis, but let's continue with your retirement planning questions!"
      );
      scrollUp();
      setLoading(false);
    }
  };

  const initialCustomChartMessage = async (personaData) => {
    const chartPayload = {
      age: personaData?.age,
      householdIncome: personaData?.income || 0,
      retirementSavings: personaData?.savings || 0,
      otherSavings: personaData?.otherSavings || 0,
    };
    const statementsResponse = await api.get("/get-statements");
    const intialStartMessages = statementsResponse?.data?.data
    // Initial greeting with loading delay
    setConversation([{ type: "system", text: intialStartMessages[0].question }]);

    // Second message after 1 second
    setTimeout(() => {
      setConversation((prev) => [
        ...prev,
        {
          type: "system",
          text: `${intialStartMessages[1].question}`,
        },
      ]);
    }, 1000);

    // Fourth message about the plot after 3 seconds
    setTimeout(() => {
      setConversation((prev) => [
        ...prev,
        {
          type: "system",
          text: "Here is the plot on how long shall savings last in retirement.",
        },
      ]);
      setIsScroll(true);
    }, 3000);

    try {
      setLoading(true);
      // Delay the chart data fetch to allow messages to display
      setTimeout(async () => {
        const response = await fetchChartData(chartPayload);
        if (response?.data?.data) {
          setChartData(response.data.data);
          setShowChart(true);
          addToConversation("chart", response.data?.data);
          setLoading(false);

          setTimeout(fetchAppropriateQuestions, 1000);
        } else {
          addToConversation(
            "system",
            "I couldn't generate your chart data, but let's continue with your retirement planning questions!"
          );
          setLoading(false);
        }
      }, 4000);
    } catch (error) {
      console.error("Error starting structured Q&A:", error);
      addToConversation(
        "system",
        "Something went wrong while generating your analysis, but let's continue with your retirement planning questions!"
      );
      scrollUp();
      setLoading(false);
    }
  };

  // Modified function to start structured Q&A instead of open chat
  const startStructuredQA = async (answers) => {
    try {
      setLoading(true);

      // Show completion message
      setTimeout(() => {
        addToConversation(
          "system",
          "Thank you for completing the quiz! Let me analyze your responses and provide personalized retirement insights..."
        );
      }, 0);

      // if (!userId) {
      //   addToConversation(
      //     "system",
      //     "Error: Unable to identify user. Please try again."
      //   );
      //   return;
      // }

      console.log("Starting structured Q&A with userId:", userId);
      console.log("User answers:", answers);

      // Skip chart generation for Medicare quiz
      if (urlData.type === "medicareQuiz") {
        setIsChatMode(true);
        setShowStarterQuestions(true);
        setLoading(false);
        return;
      }

      const chartPayload = buildPayload(answers);

      const response = await fetchChartData(chartPayload);

      setIsChatMode(true);

      // Set chart data and show it
      if (response?.data?.data) {
        setChartData(response.data.data);
        setShowChart(true);

        // Add chart message to conversation
        addToConversation(
          "system",
          "Based on your responses, here's your personalized retirement savings projection:"
        );

        // Add chart component to conversation and show disclaimer ONLY for this chart
        addToConversation("chart", response.data?.data, { showDisclaimer: true });
        setShowDisclaimer(true)
        console.log("inside")
        // Mark that chart has been shown
        setChartAlreadyShown(true);

        // Stop loading and wait for user action (e.g. tap on mobile CTA)
        setLoading(false);

        // Wait a bit, then show the structured questions
        // setTimeout(() => {
        //   addToConversation(
        //     "system",
        //     "Now, let's dive deeper into your retirement planning concerns:"
        //   );
        //   setShowStarterQuestions(true);
        //   setLoading(false);
        // }, 2000);
      } else {
        addToConversation(
          "system",
          "I couldn't generate your chart data, but you can still continue with your retirement planning questions."
        );
        // Stop loading and wait for user action even if chart fails
        setLoading(false);
      }
    } catch (error) {
      console.error("Error starting structured Q&A:", error);
      addToConversation(
        "system",
        "Something went wrong while generating your analysis, but you can still continue with your retirement planning questions."
      );
      // Stop loading and wait for user action on error
      setLoading(false);
    }
  };

  // Handle starter question selection
  const handleStarterQuestionSelect = async (questionOption) => {
    setSelectedStarterQuestion(questionOption);
    setShowStarterQuestions(false);
    setLoading(true);

    // Add the selected question to conversation
    addToConversation("answer", questionOption.text);

    // Create the prompt for Suze Orman style answer
    const prompt = `Answer the question for **${userName}**. ${questionOption.text} Answer suze orman style. Give concise answer under 4 lines`;

    try {
      await handleSendMessage(prompt, true);
    } catch (error) {
      console.error("Error handling starter question:", error);
      addToConversation(
        "system",
        "Sorry, there was an error processing your question. Please try again."
      );
      setLoading(false);
    }
  };

  // Handle follow-up question selection
  const handleFollowUpQuestionSelect = async (questionText) => {
    setShowFollowUpQuestions(false);
    setLoading(true);

    // Add the selected question to conversation
    addToConversation("answer", questionText);

    // Create the prompt for Suze Orman style answer
    const prompt = `Answer the question for **${userName}**. ${questionText} Answer suze orman style. Give concise answer under 4 lines`;

    try {
      await handleSendMessage(prompt, true);
    } catch (error) {
      console.error("Error handling follow-up question:", error);
      addToConversation(
        "system",
        "Sorry, there was an error processing your question. Please try again."
      );
      setLoading(false);
    }
  };

  // Modified chat message handler with streaming and follow-up question generation
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

      // Prepare for streaming response
      const response = await fetch(`${chatApiUrl}/chat/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, message }),
      });

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

      // After the answer is complete, generate follow-up questions
      if (assistantMessage) {
        setLoading(true);
        setIsChatMode(false);
        setTimeout(async () => {
          await generateFollowUpQuestions();
        }, 1000);
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

  // Generate follow-up questions
  const generateFollowUpQuestions = async () => {
    try {
      const followUpPrompt =
        "Based on the previous response, give me two follow-up questions that lead into broader aspects of retirement planning such as taxes planning, insurance, 401K, type retirement plans government benefits, social security. Provide only the questions from the first word to the ending question mark, separated by * with no commentary.";

      setLoading(true);
      setIsChatMode(false);

      const response = await fetch(`${chatApiUrl}/chat/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, message: followUpPrompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let questionsResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        lines.forEach((line) => {
          if (line.startsWith("data: ")) {
            try {
              const jsonData = line.slice(5).trim();
              if (jsonData === "[DONE]") return;

              const data = JSON.parse(jsonData);

              if (data.type === "delta" && data.content) {
                questionsResponse += data.content;
              }
            } catch (e) {
              console.error("Error parsing follow-up questions:", e);
            }
          }
        });
      }

      // Parse the questions (separated by *)
      if (questionsResponse) {
        const questions = questionsResponse
          .split("*")
          .map((q) => q.trim())
          .filter((q) => q.length > 0 && q.includes("?"))
          .slice(0, 2); // Take only first 2 questions

        if (questions.length > 0) {
          setFollowUpQuestions(questions);
          setShowFollowUpQuestions(true);
        }
      }

      setLoading(false);
      setIsChatMode(true);
    } catch (error) {
      setLoading(false);
      setIsChatMode(true);
      console.error("Error generating follow-up questions:", error);
    }
  };

  const storeAnswer = (questionId, questionText, value, displayLabel) => {
    console.log(questionId, "userAnswers questionId");
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

    const answer = {
      questionText: currentQuestion.questionText,
      answer: option.text,
      value: option.text,
    };

    const updatedAnswers = {
      ...userAnswers,
      [currentQuestion.questionId]: {
        ...answer,
      },
    };

    setUserAnswers(updatedAnswers);

    setLastAnswerOption(option);
    setLastQuestionText(currentQuestion.questionText);
    setLastQuestionData(currentQuestion);

    // Show comment if available
    let comment = option.comment || currentQuestion.defaultComment;

    // If comment is an array, pick one random
    if (Array.isArray(comment)) {
      comment = comment[Math.floor(Math.random() * comment.length)] || "";
    }

    console.log(comment, "comment");

    if (comment && comment.trim()) {
      setTimeout(() => {
        addToConversation("comment", comment);
      }, 800);
    }

    setTimeout(
      () => {
        moveToNextQuestion(updatedAnswers);
        setLoading(false);
      },
      comment && comment.trim() ? 2000 : 1000
    );
  };

  const handleMultiSelectSubmit = (selectedOptions) => {
    addToConversation("question", currentQuestion.questionText);

    const selectedTexts = selectedOptions.map((opt) => opt.text);
    const answerText = selectedTexts.join(", ");
    addToConversation("answer", answerText);

    setLoading(true);

    // Store the multi-select answer with array value
    // storeAnswer(
    //   currentQuestion.questionId,
    //   currentQuestion.questionText,
    //   selectedTexts,
    //   answerText
    // );

    const answer = {
      questionText: currentQuestion.questionText,
      answer: selectedTexts,
      value: answerText,
    };

    const updatedAnswers = {
      ...userAnswers,
      [currentQuestion.questionId]: {
        ...answer,
      },
    };

    setUserAnswers(updatedAnswers);

    setLastAnswerOption({ text: answerText, selectedOptions });
    setLastQuestionText(currentQuestion.questionText);
    setLastQuestionData(currentQuestion);

    const comment = currentQuestion.defaultComment;
    if (comment && comment.trim()) {
      setTimeout(() => {
        addToConversation("comment", comment);
      }, 800);
    }

    setTimeout(
      () => {
        moveToNextQuestion(updatedAnswers);
        setLoading(false);
      },
      comment && comment.trim() ? 2000 : 1000
    );
  };

  const handleTextSubmit = async (inputData) => {
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
    // storeAnswer(
    //   currentQuestion.questionId,
    //   questionText,
    //   storeValue,
    //   displayText
    // );

    const answer = {
      questionText: questionText,
      answer: displayText,
      value: storeValue,
    };

    const updatedAnswers = {
      ...userAnswers,
      [currentQuestion.questionId]: {
        ...answer,
      },
    };

    setUserAnswers(updatedAnswers);

    setLastQuestionText(questionText);
    setLastQuestionData(currentQuestion);
    setLastAnswerOption({ text: displayText, value: storeValue });

    setTextInput(""); // Clear input
    setLoading(true);

    // Choose an appropriate comment
    let comment = currentQuestion.defaultComment;

    // For Q1 (age free_text), map typed age into the matching option range
    if (currentQuestion.questionId === "Q1" && Array.isArray(currentQuestion.options)) {
      const ageNum = parseInt(displayText, 10);

      if (!isNaN(ageNum)) {
        const match = currentQuestion.options.find((opt) => {
          if (!opt.text) return false;
          const label = String(opt.text).trim();

          // Handle formats like "18-24" and "65+"
          if (label.includes("-")) {
            const [minStr, maxStr] = label.split("-");
            const min = parseInt(minStr.replace(/\D/g, ""), 10);
            const max = parseInt(maxStr.replace(/\D/g, ""), 10);
            if (isNaN(min) || isNaN(max)) return false;
            return ageNum >= min && ageNum <= max;
          }

          if (label.includes("+")) {
            const min = parseInt(label.replace(/\D/g, ""), 10);
            if (isNaN(min)) return false;
            return ageNum >= min;
          }

          return false;
        });

        if (match && match.comment) {
          if (Array.isArray(match.comment)) {
            // Pick a random comment from the array
            const randomIdx = Math.floor(Math.random() * match.comment.length);
            comment = match.comment[randomIdx] || comment;
          } else if (typeof match.comment === "string") {
            comment = match.comment;
          }
        }
      }
    }

    if (comment && typeof comment === "string" && comment.trim()) {
      setTimeout(() => {
        addToConversation("comment", comment);
      }, 1000);
    }

    setTimeout(
      () => {
        moveToNextQuestion(updatedAnswers);
        setLoading(false);
      },
      comment && comment.trim() ? 2000 : 1000
    );
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

  const addToConversation = (type, text, extra = {}) => {
    if (type == "chart") {
      console.log(text, type);
    }
    setConversation((prev) => [...prev, { type, text, ...extra }]);
  };

  const scrollUp = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (isScroll) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [
    conversation,
    currentQuestion,
    showStarterQuestions,
    showFollowUpQuestions,
    loading,
    isScroll,
  ]);


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
    <div className="bg-white flex flex-col items-center relative">
      <ChatHeader logo={logo} />
      <div
        ref={chatRef}
        className="bg-white rounded-lg min-h-[98vh] max-h-[98vh] 
        pb-4 w-full max-w-3xl  flex flex-col relative"
      >
        <div
          className={`flex flex-col flex-1 grow mt-24 ${currentQuestion?.inputType == "free_text" || isChatMode
            ? "pb-24"
            : "pb-4"
            }`}
        >
          {/* {userdatacard} */}
          {item && <UserCard item={item} />}
          {conversation.map((item, idx) => {
            const isLastAnswer =
              item.type === "answer" &&
              (idx === conversation.length - 1 ||
                (idx === conversation.length - 2 &&
                  conversation[idx + 1]?.type === "comment"));

            // Render chart if the message type is 'chart'
            if (item.type === "chart") {
              return (
                <div key={idx} className="mb-4 px-4 ">
                  <PlotChart
                    questionTitle={graphTitleQuestion}
                    userName={userName}
                    data={item}
                    showDisclaimer={item.showDisclaimer}
                    setShowPeningItems={setShowPeningItems}
                    onTapAnalysis={handleTapAnalysis}
                    userAge={userAge}
                    setConversation={setConversation}
                    conversation={conversation}
                  />
                </div>
              );
            }

            return (
              <>
                {item && <ChatMessage
                  key={idx}
                  message={item}
                  isLastAnswer={isLastAnswer}
                  canReload={canReload && !isChatMode}
                  loading={loading}
                  onReload={handleReloadAnswer}
                  chatMode={isChatMode}
                />}
              </>
            );
          })}

          <LoadingIndicator
            loading={
              loading &&
              !isChatMode &&
              !showStarterQuestions &&
              !showFollowUpQuestions
            }
          />

          {showStarterQuestions && (
            <div className="mx-4">

              <RetirementQa />
            </div>
          )}

          {/* Show starter questions after quiz completion */}
          {/* {showStarterQuestions && (
            <div className="mx-4 mt-4">
              <div className="mb-4 jost text-sm border-2 border-green-300 px-4 py-2 text-center rounded-xl text-gray-800 font-semibold max-w-sm">
                {STARTER_QUESTIONS.main}
              </div>
              <div className="space-y-2">
                {STARTER_QUESTIONS.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleStarterQuestionSelect(option)}
                    className="w-full py-2 px-3 text-left jost border-2 border-gray-300 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </div>
          )} */}

          {/* Show follow-up questions */}
          {/* {showFollowUpQuestions && followUpQuestions.length > 0 && (
            <div className="mx-4 mt-4">
              <div className="mb-4 jost text-sm border-2 border-green-300 px-4 py-2 text-center rounded-xl text-gray-800 font-semibold">
                Choose your next question:
              </div>
              <div className="space-y-2">
                {followUpQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleFollowUpQuestionSelect(question)}
                    className="w-full py-2 px-3 text-left jost border-2 border-gray-300 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )} */}

          {/* Show QuestionDisplay only if not in structured Q&A mode and there's a current question.
              On mobile (<= 767px), also require showPendingItems; on larger screens, always show. */}
          {!showStarterQuestions &&
            !showFollowUpQuestions &&
            showPendingItems &&
            currentQuestion && (
              <QuestionDisplay
                type={urlData.type}
                onValidationError={scrollUp}
                scrollUp={scrollToBottom}
                scrollToBottom={scrollToBottom}
                currentQuestion={currentQuestion}
                loading={loading}
                textInput={textInput}
                onTextChange={setTextInput}
                onOptionClick={handleOptionClick}
                onTextSubmit={handleTextSubmit}
                onMultiSelectSubmit={handleMultiSelectSubmit}
                onSkip={handleSkipQuestion}
                setUserAge={setUserAge}
              />
            )}

          <div id="overview" ref={overviewRef} className="scroll-mt-20"></div>
        </div>
      </div>
      <PrivacyTrustModal show={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default Quiz;
