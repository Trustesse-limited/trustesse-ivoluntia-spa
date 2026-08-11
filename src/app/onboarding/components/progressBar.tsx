// components/ProgressBar.tsx
import React from "react";

interface ProgressBarProps {
  step: number;
  totalSteps: number;
  isOrg?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ step, totalSteps, isOrg }) => {
  const progress = totalSteps > 0 ? ((step + 1) / totalSteps) * 100 : 0;

  return (
    <div className="w-full bg-[#D9EDFD] h-2 rounded-full overflow-hidden">
      <div
        className={`h-2 rounded-full transition-all duration-500 ${
          isOrg ? "bg-[#21537B]" : "bg-[#0E68DC]"
        }`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;