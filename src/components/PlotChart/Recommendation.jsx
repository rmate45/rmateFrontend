const Recommendation = ({data}) =>{
  console.log(data,"data--data")
    return(
      <div className=" text-sm sm:px-4">
        <p className="jost text-lg text-gray-700 leading-relaxed ">
          Recommendations from RetireMate:
        </p>
              <ul className="max-w-xl mt-2 pl-4 sm:pl-6">
          {(() => {
            const recommendations = data?.text?.recommendations;
            const scenario = recommendations?.scenario;
            const depletionAge = recommendations?.savingsDepletionAge;
            const alternativeScenarios = recommendations?.alternativeScenarios;
            const recTexts = recommendations?.recommendations || [];

            // Check if we need custom rendering for scenario 3 with depletion age < 90
            if (scenario === 3 && depletionAge < 90) {
              const increasedContributions =
                alternativeScenarios?.increasedContributions || [];
              const alternativeGrowth =
                alternativeScenarios?.alternativeGrowth || [];

              return (
                <>
                  {/* 1. Projected Longevity of Savings */}
                  <li className="jost text-left text-gray-700 leading-relaxed mb-2">
                    <span className="  font-semibold mr-1">1.</span>
                    <strong>Projected Longevity of Savings:</strong>
                    <ul className=" mt-1">
                      <li className="text-gray-700 jost">
                        <span className="mr-1">•</span>
                        {recTexts[0] ||
                          `Your total savings are projected to last until approximately age ${
                            depletionAge - 3
                          } to ${depletionAge + 2}.`}
                      </li>
                    </ul>
                  </li>

                  {/* 2. Impact of Monthly Contributions */}
                  <li className="jost text-left text-gray-700 leading-relaxed mb-2">
                    <span className=" font-semibold mr-1">2.</span>
                    <strong>Impact of Monthly Contributions:</strong>
                    <ul className=" mt-1">
                      <li className="text-gray-700 mb-1 jost">
                        <span className="mr-1">•</span>
                        {recTexts[1] ||
                          "Current model assumes a 10% contribution from household income."}
                      </li>
                      <li className="text-gray-700 mb-1 jost">
                        <span className="mr-1">•</span>
                        {recTexts[2] ||
                          "Increasing contributions can significantly extend your savings horizon:"}
                      </li>
                      {increasedContributions.map((contrib, idx) => (
                        <li key={idx} className="text-gray-700 ml-4 text-sm jost">
                          <span className="mr-1">○</span>
                          At {contrib.contributionRate}% contribution ($
                          {contrib.monthlyContribution?.toLocaleString()}/month)
                          → lasts until age {contrib.projectedAgeRange.min} to{" "}
                          {contrib.projectedAgeRange.max}
                        </li>
                      ))}
                    </ul>
                  </li>

                  {/* 3. Impact of Market Conditions */}
                  <li className="jost text-left text-gray-700 leading-relaxed mb-2">
                    <span className=" font-semibold mr-1">3.</span>
                    <strong>Impact of Market Conditions:</strong>
                    <ul className=" mt-1">
                      <li className="text-gray-700 mb-1 jost">
                        <span className="mr-1">•</span>
                        Current model assumes a 6% nominal annual growth rate
                        (moderate growth).
                      </li>
                      <li className="text-gray-700 mb-1 jost">
                        <span className="mr-1">•</span>
                        Under alternative growth assumptions:
                      </li>
                      {alternativeGrowth.map((growth, idx) => (
                        <li key={idx} className="text-gray-700 ml-4 text-sm jost">
                          <span className="mr-1">○</span>
                          {growth.growthRate}% ({growth.riskLevel}) → lasts
                          until age {growth.projectedAgeRange.min} to{" "}
                          {growth.projectedAgeRange.max}
                        </li>
                      ))}
                    </ul>
                  </li>

                  {/* 4. Monthly Savings Recommendation */}
                  <li className="jost text-left text-gray-700 leading-relaxed mb-2">
                    <span className=" font-semibold mr-1">4.</span>
                    <strong>Monthly Savings Recommendation:</strong>
                    <ul className=" mt-1">
                      <li className="text-gray-700 mb-1 jost">
                        <span className="mr-1">•</span>
                        {recTexts[3] || "You are currently saving per month."}
                      </li>
                      <li className="text-gray-700 jost">
                        <span className="mr-1">•</span>
                        {recTexts[4] ||
                          "Our model recommends increasing this to 15% to 25% per month to stay on track."}
                      </li>
                    </ul>
                  </li>
                </>
              );
            } else {
              // Default rendering for other scenarios
              return recTexts?.map((rec, index) => (
                <li
                  key={index}
                  className="jost text-left text-gray-700 leading-relaxed "
                >
                  <span className="text-lg font-semibold mr-1">•</span> {rec}
                </li>
              ));
            }
          })()}
        </ul>
        </div>
    )
}

export default Recommendation