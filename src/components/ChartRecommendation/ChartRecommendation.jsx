import React, { useState, useEffect } from "react";
import logo from "../../assets/retiremate-logo-favicon.svg";
import { LoadingIndicator } from "../LoadingIndicator/LoadingIndicator";

const ChartRecommendation = ({ setShowTapQuestions }) => {
    const analysisData = {
        yourSnapShot:
            "Your savings are projected to last well past 95 - a strong and resilient trajectory. You've built a solid foundation, and with a few strategic choices, you can expand optionality even further. Let's take a look at what's driving your outlook and the adjustments that can enhance it.",
        whatsShapingYourOutlook:
            "Your contributions of 10% ($3500/mo) help your savings grow to about $14056677 before retirement. Retiring around age 67 sets the point where saving stops and withdrawals begin. Starting Social Security at 67 provides roughly $85610/yr, reducing how much you need to withdraw. A long-term growth rate of 6.7% shapes how quickly your balance builds and how long it lasts.",
        howToStrengthenYourPlan:
            "1. Increase your monthly contribution to 15-20% ($5250–$7000/mo): +5-8 years\n\nA higher contribution rate compounds over time and meaningfully extends how long your balance lasts.\n\n\n2. Delay collecting Social Security 1–3 years (start at age 68-70): +2-4 years\n\nDelaying increases your monthly benefit by up to 24%, reducing the amount you need to withdraw each year.\n\n\n3. Shift your transition away from full-time work by 2-4 years: +1-3 years\n\nEach additional working year adds income and shortens the withdrawal period, buying you more retirement time.\n\n\n4. Improve your long-term growth rate to 7.5%–9%: +3-6 years\n\nHigher long-term returns can significantly increase your peak savings and slow down future drawdowns.\n\n\n5. Reduce long-term costs by 10-15%: +2-4 years\n\nLower ongoing expenses decrease annual withdrawals and help your savings last longer.\n\n\n6. Explore location flexibility: +2-5 years\n\nLiving in a lower-cost area reduces required withdrawals and stretches both Social Security and savings.",
        whatThisDoesntInclude:
            "This is a clear starting point based on your answers. A few meaningful factors aren't included yet, but they can influence your long-term outlook:\n\nLong-term care needs or long-term care insurance\nMajor health events or medical shocks\nUnexpected changes in your ability to work\nDivorce, remarriage, or large inheritances\nHome equity decisions (downsizing, relocating, or renting)\nFuture changes to Social Security or tax policy.\n\nAs you refine your goals and add more details, your plan will become more personalized and precise.",
    };

    const sections = [
        { key: "yourSnapShot", title: "Your Snapshot" },
        { key: "whatsShapingYourOutlook", title: "What's Shaping Your Outlook" },
        { key: "howToStrengthenYourPlan", title: "How To Strengthen Your Plan" },
        { key: "whatThisDoesntInclude", title: "What This Doesn't Include" },
    ];

    const [history, setHistory] = useState([]);
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [revealing, setRevealing] = useState(false);


    const currentSection =
        currentSectionIndex !== null ? sections[currentSectionIndex] : null;

    const handleSectionClick = () => {
        setRevealing(true);

        setTimeout(() => {
            setHistory((prev) => [...prev, currentSectionIndex]);

            if (currentSectionIndex < sections.length - 1) {
                setCurrentSectionIndex((prev) => prev + 1);
            } else {
                // ✅ LAST TAP – console only


                setCurrentSectionIndex(null);
                setShowTapQuestions(true)
            }

            setRevealing(false);
        }, 1500);
    };

    useEffect(() => {

        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
        });

    }, [currentSectionIndex]);

    return (
        <div>
            <div className="max-w-4xl mx-auto mt-2">
                <div className="space-y-2">
                    {/* History Sections */}
                    {history.map((sectionIdx) => {
                        const section = sections[sectionIdx];
                        const text = analysisData[section.key];

                        return (
                            <div key={`history-${sectionIdx}`} className="space-y-3">
                                <div className="flex items-start gap-1">
                                    {/* <img src={logo} alt="logo" className="pt-1" /> */}
                                    <div className="px-4 py-2 min-h-10 text-sm max-w-full w-full rounded-xl flex justify-center items-center jost border border-green-300 text-black">
                                        <div className="whitespace-pre-line space-y-2">
                                            <h2 className="text-left jost text-base font-medium">
                                                {section.title}
                                            </h2>
                                            {text.split("\n\n").map((paragraph, idx) => (
                                                <p key={idx} className="text-left jost ml-2">
                                                    {paragraph}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Current Section */}
                    {currentSection && (
                        <div className="space-y-2">
                            <div className="mb-3 flex justify-end">
                                <div
                                    onClick={handleSectionClick}
                                    className="w-full py-2 mb-2 px-3 border border-green-300 rounded-lg cursor-pointer"
                                >
                                    <h2 className="text-left jost">Tap to view "{currentSection.title}"</h2>
                                </div>
                            </div>

                            {revealing && (
                                <div className="-ml-4 mt-2">
                                    <LoadingIndicator loading />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Completion Message */}
                    {/* {currentSectionIndex === null && history.length > 0 && (
            <div className="mb-3 px-4 flex justify-center">
              <div className="px-4 py-3 rounded-xl bg-green-300 text-black text-center max-w-xs">
                <p className="text-left jost">
                  You've completed all sections of your retirement analysis!
                </p>
              </div>
            </div>
          )} */}
                </div>
            </div>
        </div>
    );
};

export default ChartRecommendation;
