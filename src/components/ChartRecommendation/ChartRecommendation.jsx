import React, { useState, useEffect, useMemo } from "react";
import logo from "../../assets/retiremate-logo-favicon.svg";
import { LoadingIndicator } from "../LoadingIndicator/LoadingIndicator";

const ChartRecommendation = ({ setShowTapQuestions, data, handlePandingItems }) => {
    console.log(data?.text?.recommendations, "datarecomend");

    /**
     * ✅ Dynamic analysis data from API
     * Fallback to empty object to avoid crashes
     */
    const analysisData = useMemo(() => {
        return data?.text?.recommendations ?? {};
    }, [data]);

    /**
     * Sections configuration (unchanged) 
     */
    const sections = [
        { key: "yourSnapShot", title: "Your Snapshot" },
        { key: "whatsShapingYourOutlook", title: "What's Shaping Your Outlook" },
        { key: "howToStrengthenYourPlan", title: "How To Strengthen Your Plan" },
        { key: "whatThisDoesntInclude", title: "What This Doesn't Include" },
    ];

    const [history, setHistory] = useState([]);
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [revealing, setRevealing] = useState(false);
    const [strengthenExpanded, setStrengthenExpanded] = useState(false);

    const currentSection =
        currentSectionIndex !== null ? sections[currentSectionIndex] : null;

    /**
     * Handle tap reveal
     */
    const handleSectionClick = () => {
        setRevealing(true);

        setTimeout(() => {
            setHistory((prev) => [...prev, currentSectionIndex]);

            if (currentSectionIndex < sections.length - 1) {
                setCurrentSectionIndex((prev) => prev + 1);
            } else {
                setCurrentSectionIndex(null);
                handlePandingItems()
                setShowTapQuestions(true);
            }

            setRevealing(false);
        }, 1500);
    };

    /**
     * Auto-scroll on section change
     */
    useEffect(() => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
        });
    }, [currentSectionIndex,strengthenExpanded]);

    useEffect(() => {
        setStrengthenExpanded(false);
    }, [analysisData]);
    const parseTextToArray = (text = "") => {
        return text
            .split(/<br\s*\/?>/gi) // split on every <br>
            .map(item => item.trim())
            .filter(Boolean);
    };

    if (!data?.text?.recommendations) {
        return (
            <div className="flex justify-center mt-6">
                <LoadingIndicator loading />
            </div>
        );
    }

    const strengthenText = analysisData?.howToStrengthenYourPlan;
    const strengthenHasMoreThanThree =
        !!strengthenText && parseTextToArray(strengthenText).length > 3;
    const blockWhatDoesntIncludeUntilExpanded =
        currentSection?.key === "whatThisDoesntInclude" &&
        strengthenHasMoreThanThree &&
        !strengthenExpanded;

    return (
        <div>
            <div className="max-w-4xl mx-auto mt-2">
                <div className="space-y-2">
                    {/* 🔁 History Sections */}
                    {history.map((sectionIdx) => {
                        const section = sections[sectionIdx];
                        const text = analysisData?.[section.key];
                        if (!text) return null;

                        const items = parseTextToArray(text);
                        const isStrengthenYourPlan = section.key === "howToStrengthenYourPlan";
                        const shouldShowMoreCta =
                            isStrengthenYourPlan && !strengthenExpanded && items.length > 3;
                        const itemsToRender = shouldShowMoreCta ? items.slice(0, 3) : items;

                        return (
                            <div key={`history-${sectionIdx}`} className="space-y-3">
                                <div className="w-full">
                                    {/* <img src={logo} alt="logo" className="pt-1" /> */}

                                    <div className="">
                                        <div className="whitespace-pre-line space-y-2">
                                            <h2 className="text-left  jost text-base font-medium bg-introPrimary p-3 rounded-xl text-white">
                                                {section.title}
                                            </h2>

                                            {/* ✅ Handles \n\n and <br> safely */}
                                            {itemsToRender.map((item, idx) => (
                                                <div key={idx} className="px-4  py-2 min-h-10 text-sm  rounded-xl w-fit jost border border-green-300 text-black">
                                                    {/* <span className="font-medium">{idx + 1}.</span> */}
                                                    <p className="text-left jost">
                                                        {item.replace(/\\n|\n/g, " ").replace(/\s+/g, " ").trim()}
                                                    </p>
                                                </div>
                                            ))}

                                            {shouldShowMoreCta && (
                                                <div
                                                    onClick={() => setStrengthenExpanded(true)}
                                                    className="w-full py-2 mb-2 px-3 text-white bg-introPrimary rounded-lg cursor-pointer"
                                                >
                                                    <h2 className="text-left jost">
                                                        Tap for more ways to "Strengthen Your Plan"
                                                    </h2>
                                                </div>
                                            )}


                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* 👉 Current Section CTA */}
                    {currentSection && !blockWhatDoesntIncludeUntilExpanded && (
                        <div className="space-y-2">
                            <div className="mb-3 flex justify-end">
                                <div
                                    onClick={handleSectionClick}
                                    className="w-full py-2 mb-2 px-3 text-white bg-introPrimary rounded-lg cursor-pointer"
                                >
                                    <h2 className="text-left jost">
                                        Tap to view "{currentSection.title}"
                                    </h2>
                                </div>
                            </div>

                            {revealing && (
                                <div className="-ml-4 mt-2">
                                    <LoadingIndicator loading />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChartRecommendation;
