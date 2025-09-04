// components/ProgressBar.tsx
import React from "react";

interface ProgressBarProps {
  step: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ step, totalSteps }) => {
  const progress = ((step + 1) / totalSteps) * 100;

  return (
    <div className="w-[90%] mx-auto bg-[#D9EDFD] h-2 rounded">
      <div
        className="bg-[#0E68DC] h-2 rounded transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;
