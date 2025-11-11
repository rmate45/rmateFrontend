import React from "react";
import FeatureItem from "./FeatureItem";

const FeaturesGrid = ({ features }) => (
  <div className="bg-gray-50 text-center py-12">
    <h2 className="text-introPrimary font-medium text-2xl">
      Planning for Retirement should always be this easy.
    </h2>

    <div className="flex gap-4 items-start justify-center my-10 flex-wrap mx-auto">
      {features.map((feature, index) => (
        <FeatureItem
          key={feature.id || index}
          icon={feature.icon}
          description={feature.description}
        />
      ))}
    </div>
  </div>
);

export default FeaturesGrid;
