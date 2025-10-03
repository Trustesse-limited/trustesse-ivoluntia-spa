import React, { useEffect } from "react";
import ProgressBar from "../../components/progressBar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Illustration from "@/components/illustration";
import { motion, AnimatePresence } from "framer-motion";

interface LayoutProps {
  children: React.ReactNode;
  step: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  illustration?: {
    src: string;
    position: "bottom-left" | "bottom-center" | "bottom-right";
    width?: number;
    height?: number;
    className?: string;
  };
}

const Layout: React.FC<LayoutProps> = ({
  children,
  step,
  totalSteps,
  onNext,
  onBack,
  illustration,
}) => {
  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  return (
    <div className="relative lg:max-w-7xl border-[4px] border-[#F0EEEE] my-4 mx-auto rounded-[20px] p-6 overflow-hidden">
      {/* Header */}
      <div className="md:px-8 py-4">
        <h1 className="text-2xl md:text-3xl font-semibold mb-1 text-[#212121]">
          Volunteer Onboarding
        </h1>
        <p className="text-[#2C2C2C] font-semibold text-sm mb-4">
          Your gateway to meaningful impact. Let’s get to know you so we can
          match you with the right opportunities.
        </p>
      </div>

      {/* Progress Bar */}
      <ProgressBar step={step} totalSteps={totalSteps - 1} />

      {/* Main Content with animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="pb-18 pt-8"
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      {step < totalSteps - 1 && (
        <div className="flex justify-end gap-4 mt-6">
          {step > 0 && (
            <Button
              onClick={onBack}
              variant="outline"
              className="lg:w-40 flex items-center justify-center w-1/2 text-lg relative font-semibold h-12 text-[#0E68DC] z-[100] border border-[#0E68DC]"
            >
              <Image
                src="/icons/arrow-left.svg"
                alt="arrow"
                width={14}
                height={14}
                className="left-0"
              />
              Back
            </Button>
          )}
          <Button
            onClick={onNext}
            className="lg:w-68 w-1/2 text-lg relative font-semibold h-12 text-white bg-[#0E68DC] z-[100] flex items-center gap-2"
          >
            Continue
            <Image
              src="/icons/arrow-right.svg"
              alt="arrow"
              width={12}
              height={12}
              className="right-0"
            />
          </Button>
        </div>
      )}

      {/* Illustration */}
      {illustration && (
        <Illustration
          src={illustration.src}
          position={illustration.position}
          width={illustration.width}
          height={illustration.height}
          className={illustration.className}
        />
      )}
    </div>
  );
};

export default Layout;
