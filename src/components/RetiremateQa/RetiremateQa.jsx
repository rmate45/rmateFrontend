import React, { useState, useEffect } from 'react';
import { LoadingIndicator } from '../LoadingIndicator/LoadingIndicator';
import api from '../../api/api';

const RetirementQa = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeQuestion, setActiveQuestion] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [revealing, setRevealing] = useState(false);
    const [pendingQuestionId, setPendingQuestionId] = useState(null);

    console.log("questions", questions);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            // Replace with your actual API endpoint
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
                } else if (Array.isArray(payload) && payload.length >= 0) {
                    // If API returns an array directly (even empty), use it
                    setQuestions(payload);
                } else {
                    setError('Failed to load questions');
                }
            } else if (items.length > 0) {
                setQuestions(items);
            } else {
                setError('Failed to load questions');
            }
        } catch (err) {
            setError('Error fetching questions: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleQuestionClick = (questionId) => {
        if (activeQuestion === questionId) {
            setActiveQuestion(null);
        } else {
            setRevealing(true);
            setPendingQuestionId(questionId);
            // 1.5 second pause before revealing answer
            setTimeout(() => {
                setActiveQuestion(questionId);
                setRevealing(false);
                setPendingQuestionId(null);
            }, 1500);
        }
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setActiveQuestion(null);
            setPendingQuestionId(null);
        }
    };

    const handleSkip = () => {
        handleNext();
    };
    if (loading) {
        return (
            <>
            </>
        )
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


    const currentQuestion = questions[currentIndex];

    return (
        <div className="">
            <div className="max-w-4xl mx-auto mt-2">
                <div className="mb-6">
                    <div
                        onClick={() => handleQuestionClick(currentQuestion.questionId)}
                        className="w-full py-2 px-3 cursor-pointer  border-1 border-green-300 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all"
                    >
                        <h2 className="text-left jost">
                            {currentQuestion.question}
                        </h2>

                    </div>
                    <div
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${activeQuestion === currentQuestion.questionId || pendingQuestionId === currentQuestion.questionId
                                ? 'max-h-96 opacity-100'
                                : 'max-h-0 opacity-0'
                            }`}
                    >
                        <div >

                            {revealing && pendingQuestionId === currentQuestion.questionId ? (
                                <div className="-ml-4 mt-2"><LoadingIndicator loading={true} /></div>
                            ) : (
                                <div className="border-1 border-green-300 rounded-lg py-2 px-3 mt-2">
                                    <div className={`transition-opacity duration-300 ${revealing ? 'opacity-0' : 'opacity-100'}`}>
                                        {(currentQuestion.answers || []).map((answer, idx) => (
                                            <p
                                                key={idx}
                                                className="text-left jost"
                                                style={{
                                                    transitionDelay: `${idx * 100}ms`,
                                                }}
                                            >
                                                {answer}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex gap-4 justify-end flex-wrap">
                   {questions.length - 1 !== currentIndex && <button
                        onClick={handleSkip}
                        className="px-6 py-3 text-xs bg-green-50 border-green-300 border rounded-lg font-semibold shadow-md transition-all"
                    >
                        Skip
                    </button>}
                </div>
            </div>
        </div>
    );
};

export default RetirementQa;