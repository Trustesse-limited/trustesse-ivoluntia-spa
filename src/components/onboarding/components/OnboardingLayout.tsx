import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AppButton } from "@/components/AppButton";
import Image from "next/image";
import Illustration from "@/components/illustration";
import { motion, AnimatePresence } from "framer-motion";

interface OnboardingLayoutProps {
  children: React.ReactNode;
  step: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  accountType?: "volunteer" | "organization";
  illustration?: {
    src: string;
    position: "bottom-left" | "bottom-center" | "bottom-right";
    width?: number;
    height?: number;
    className?: string;
  };
  isStepValid?: boolean;
  isLoading?: boolean;
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  children,
  step,
  totalSteps,
  onNext,
  onBack,
  accountType = "volunteer",
  illustration,
  isStepValid = true,
  isLoading = false,
}) => {
  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const isOrg = accountType === "organization";
  const progress = totalSteps > 0 ? ((step + 1) / totalSteps) * 100 : 0;

  return (
    <div className="flex flex-col items-center justify-start my-4 mx-auto min-h-screen w-[95%]">
      <div className="relative w-full mx-4 sm:mx-8 border-[4px] border-[#F0EEEE] rounded-[20px] p-4 sm:p-6 overflow-hidden">
        {/* Header - Left aligned */}
        <div className="md:px-8 py-4 text-left">
          <h1 className="text-2xl md:text-3xl font-semibold mb-1 text-[#212121]">
            {isOrg ? "Organization Onboarding" : "Volunteer Onboarding"}
          </h1>
          <p className="text-[#2C2C2C] font-semibold text-sm mb-4">
            {isOrg
              ? "We are excited to help you find passionate volunteers and donors who align with your mission and vision"
              : "Your gateway to meaningful impact. Let's get to know you so we can match you with the right opportunities."}
          </p>
        </div>

        {/* Continuous Progress Bar - Centered, under texts */}
        <div className="md:px-8 pb-4">
          <div className="w-full bg-[#D9EDFD] h-2 rounded-full overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                isOrg ? "bg-[#21537B]" : "bg-[#0E68DC]"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

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
          <div className="flex justify-end gap-4  mt-6">
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
            <AppButton
              text="Continue"
              onClick={onNext}
              isLoading={isLoading}
              disabled={!isStepValid || isLoading}
              className="lg:w-68 w-1/2 text-lg relative font-semibold z-[1000] h-12"
            />
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
    </div>
  );
};

export default OnboardingLayout;