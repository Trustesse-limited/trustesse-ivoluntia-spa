// components/ProgressBar.tsx
import React from "react";

interface ProgressBarProps {
  step: number;
  totalSteps: number;
  isOrg?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ step, totalSteps, isOrg }) => {
  const progress = ((step) / totalSteps) * 100;

  return (
    <div className="sm:w-[90%] w-full mx-auto bg-[#D9EDFD] h-2 rounded">
      <div
        className={` h-2 rounded transition-all duration-300 ${isOrg ? "bg-[#21537B]" : "bg-[#0E68DC]"}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;
