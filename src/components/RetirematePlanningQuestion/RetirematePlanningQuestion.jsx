import React, { useEffect, useState } from "react";
import api from "../../api/api";
import oneImage from "../../assets/testimonial-2.jpeg"
import twoImage from "../../assets/imageTwo.jpg"
import threeImage from "../../assets/testimonial-2.jpeg"
const RetirematePlanningQuestion = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        getQuestion()
    }, []);

    const getQuestion = async () => {
        setLoading(true);
        const response = await api.get("/get-financial-plannings");
        if (response.data?.type === "success" && response.data?.data) {
            setData(response.data.data);
            setLoading(false);
        } else {
            setError("Failed to load testimonials");
            setLoading(false);
        }
    };
    const handleQuestionClick = (question) => {
        const queryParam = encodeURIComponent(question._id);
        window.open(`/quiz?id=${queryParam}&type=financial`, "_blank");
    };
    if (loading) {
        return (
            <div className="text-center px-6 max-w-7xl mx-auto py-10 sm:py-16">
                <div className="flex flex-col justify-center px-5">
                    <h2 className="text-introPrimary font-medium text-2xl mb-8">
                        Explore retirement through stories like yours
                    </h2>
                    <div className="flex justify-center items-center py-20">
                        <div className="text-lg text-gray-600">Loading Top Finanical Planning questions...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center px-6 max-w-7xl mx-auto py-10 sm:py-16">
                <div className="flex flex-col justify-center px-5">
                    <h2 className="text-introPrimary font-medium text-2xl mb-8">
                        Explore retirement through stories like yours
                    </h2>
                    <div className="flex justify-center items-center py-20">
                        <div className="text-lg text-red-600">{error}</div>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="text-center px-6 pt-10 sm:pt-16">
            <div className="max-w-7xl mx-auto">
                <p className="text-primary font-medium text-xl sm:text-2xl text-center">
                    Top Finanical Planning  questions
                </p>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-10">
                    {
                        data.map((item, index) => (
                            <>
                                <div className="relative border border-primary rounded-2xl p-5 bg-white shadow-sm flex gap-4">
                                    <div className="shrink-0 text-center w-[100px]">
                                        <img
                                            src={index === 0 ? oneImage : index === 1 ? twoImage : index === 2 ? threeImage : oneImage}
                                            alt="Joel"
                                            className="w-16 h-16 rounded-full object-cover mx-auto mb-2"
                                        />
                                        <div className="grow">
                                            <p className="text-primary font-semibold mb-1">
                                                {item?.name}, <span className="text-primary font-normal">{item?.age}</span>
                                            </p>
                                            <p className="text-sm text-black  font-bold break-word max-w-[100px]">{item?.profession}</p>
                                        </div>
                                    </div>
                                    <div className="grow flex flex-col h-[100%]">
                                        <p className="text-black text-left grow">
                                            {item?.question}
                                        </p>
                                        <div className="mt-4 flex justify-between items-center ">
                                            <button onClick={() => handleQuestionClick(item)} className="text-primary border border-primary px-5 py-1.5 rounded-md font-semibold hover:bg-green-50 transition">
                                                Ask RetireMate
                                            </button>

                                        </div>
                                    </div>
                                </div>


                                {/* <p className="text-center text-xs text-gray-500 mt-3">
                                        asked by <span className="font-medium">456 users</span> &nbsp; * * *
                                    </p> */}
                            </>


                        ))
                    }
                </div>
            </div>
        </div>
    );
};
export default RetirematePlanningQuestion;