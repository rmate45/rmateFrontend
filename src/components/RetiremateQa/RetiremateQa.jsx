import React, { useState, useEffect } from 'react';
import { LoadingIndicator } from '../LoadingIndicator/LoadingIndicator';
import api from '../../api/api';
import logo from '../../assets/retiremate-logo-favicon.svg';
import { useNavigate } from "react-router-dom";

const RetirementQa = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [qaHistory, setQaHistory] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [revealing, setRevealing] = useState(false);
    const [usedQuestionIds, setUsedQuestionIds] = useState(new Set());
    const[showTappedQuestions, setShowTappedQuestions] = useState(false)
    console.log("questions", questions);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const response = await api.get("/get-explore-questions");
            console.log(response.data, "response");

            const payload = response?.data;
            // Normalize possible API shapes
            const isSuccessFlag = (payload?.type && typeof payload.type === 'string' && payload.type.toLowerCase() === 'success') || payload?.success === true;
            const items = Array.isArray(payload)
                ? payload
                : Array.isArray(payload?.data)
                    ? payload.data
                    : Array.isArray(payload?.result)
                        ? payload.result
                        : [];

            if (isSuccessFlag || Array.isArray(payload)) {
                if (items.length > 0) {
                    setQuestions(items);
                    // Set initial random question
                    const randomQ = items[Math.floor(Math.random() * items.length)];
                    setCurrentQuestion(randomQ);
                    setUsedQuestionIds(new Set([randomQ.questionId]));

                } else if (Array.isArray(payload) && payload.length >= 0) {
                    setQuestions(payload);
                } else {
                    setError('Failed to load questions');
                }
            } else if (items.length > 0) {
                setQuestions(items);
                const randomQ = items[Math.floor(Math.random() * items.length)];
                setCurrentQuestion(randomQ);
                setUsedQuestionIds(new Set([randomQ.questionId]));
            } else {
                setError('Failed to load questions');
            }
        } catch (err) {
            setError('Error fetching questions: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const getRandomQuestion = () => {
        if (questions.length === 0) return null;

        // Get questions not yet used
        const availableQuestions = questions.filter(q => !usedQuestionIds.has(q.questionId));

        // If no available questions, return null (all questions used)
        if (availableQuestions.length === 0) {
            return null;
        }

        // Select random question from available ones
        const randomQ = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];

        return randomQ;
    };

    const handleQuestionClick = () => {
        setRevealing(true);
        // 1.5 second pause before revealing answer
        setTimeout(() => {
            // Add current Q&A to history
            setQaHistory(prev => [...prev, currentQuestion]);

            // Load new random question
            const newQuestion = getRandomQuestion();
            if (newQuestion) {
                setCurrentQuestion(newQuestion);
                setUsedQuestionIds(prev => new Set([...prev, newQuestion.questionId]));

            } else {
                // All questions used
                setCurrentQuestion(null);
            }
            setRevealing(false);
        }, 1500);

    };

    useEffect(() => {
        if (currentQuestion) {
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [currentQuestion])

    const handleSkip = () => {
        const newQuestion = getRandomQuestion();
        if (newQuestion) {
            setCurrentQuestion(newQuestion);
            setUsedQuestionIds(prev => new Set([...prev, newQuestion.questionId]));
        } else {
            // All questions used
            setCurrentQuestion(null);
        }
    };

    if (loading) {
        return (
            <>
            </>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={fetchQuestions}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <p className="text-gray-600">No questions available</p>
            </div>
        );
    }

    return (
        <div className="">
            <div className="max-w-4xl mx-auto mt-2">
                <div className="space-y-6">
                    <div className="cursor-pointer w-full py-2 mb-2 px-3 border border-green-300 rounded-lg">
                        <p className='text-left jost'>
                            Thanks ! Tap below to explore RetireMate

                        </p>
                    </div>
                    <div  onClick={() => window.open("/#questions-to-action", "_blank")} className="cursor-pointer w-full py-2 mb-2 px-3 border border-green-300 rounded-lg">
                        <p className='text-left jost'>
                            Browse popular questions by age and gender

                        </p>
                    </div>
                    <div onClick={() => window.open("/#testimonials", "_blank")} className="cursor-pointer w-full py-2 mb-2 px-3 border border-green-300 rounded-lg">
                        <p className='text-left jost'>
                            Explore stories like yours
                        </p>
                    </div>
                    <div className="cursor-disabled w-full py-2 mb-2 px-3 border border-green-300 rounded-lg">
                        <p className='text-left jost'>
                            Ask a separate question

                        </p>
                    </div>
                    <div onClick={() => window.open("/", "_blank")} className="cursor-pointer w-full py-2 mb-2 px-3 border border-green-300 rounded-lg">
                        <p className='text-left jost'>
                            Return home
                        </p>
                    </div>
                    <div onClick={() => window.location.reload()}className="cursor-pointer w-full py-2 mb-2 px-3 border border-green-300 rounded-lg">
                        <p className='text-left jost'>
                            Restart
                        </p>
                    </div>
                    <div onClick={()=>{setShowTappedQuestions(true)}} className="cursor-pointer w-full py-2 mb-2 px-3 border border-green-300 rounded-lg">
                        <p className='text-left jost'>
                            Continue to explore more questions
                        </p>
                    </div>
                    {/* Previous Q&A History */}
                    {qaHistory.map((qa, index) => (
                        <div key={`qa-${qa.questionId}-${index}`} className="space-y-3">
                            {/* Question */}
                            <div className='mb-3 px-4 flex justify-end'>
                                <div className="px-4 py-2 min-h-10 text-sm max-w-xs rounded-xl flex justify-center items-center jost  rounded-br-none bg-green-300 text-left text-black">
                                    <h2 className="text-left jost">
                                        {qa.question}
                                    </h2>
                                </div>
                            </div>
                            {/* Answer */}
                            <div className='flex items-start gap-1'>
                                <img src={logo} alt="logo" className='pt-1' />
                                <div className="px-4 py-2 min-h-10 text-sm max-w-xs rounded-xl flex justify-center items-center jost  rounded-tl-none border-1 border-green-300 text-black">
                                    <div className="space-y-2">
                                        {(qa.answers || []).map((answer, idx) => (
                                            <p key={idx} className="text-left jost">
                                                {answer}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Current Question Section - Only show if there's a current question */}
                    {showTappedQuestions && currentQuestion && (
                        <div className="space-y-3">
                            {/* Instruction Message */}
                            <div className="w-full py-2 mb-2 px-3 border-1 border-green-300 rounded-lg">
                                <p className='text-left jost'>
                                    Tap to explore a new question, or skip to move on to the next.
                                </p>
                            </div>

                            {/* Current Question Card */}
                            <div className='mb-3 px-4 flex justify-end'>

                                <div
                                    onClick={handleQuestionClick}
                                    className="px-4 py-2 cursor-pointer min-h-10 text-sm max-w-xs rounded-xl flex justify-center items-center jost  rounded-br-none bg-green-300 text-left text-black"
                                >
                                    <h2 className="text-left jost">
                                        {currentQuestion.question}
                                    </h2>
                                </div>
                            </div>

                            {/* Loading State */}
                            {revealing && (
                                <div className="-ml-4 mt-2">
                                    <LoadingIndicator loading={true} />
                                </div>
                            )}

                            {/* Skip Button */}
                            <div className="flex justify-end px-4">
                                <button
                                    onClick={handleSkip}
                                    className="px-6 py-3 text-xs bg-green-50 border-green-300 border rounded-lg font-semibold shadow-md transition-all"
                                >
                                    Skip
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RetirementQa;