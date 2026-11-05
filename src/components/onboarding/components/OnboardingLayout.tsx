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
  isCongratulations?: boolean;
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
  isCongratulations = false,
}) => {
  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const isOrg = accountType === "organization";
  const progress = totalSteps > 0 ? ((step + 1) / totalSteps) * 100 : 0;

  return (
    <div className="flex items-center justify-center w-full h-screen p-[1vh] overflow-hidden">
      <div className="relative w-full h-full border-4 border-[#F0EEEE] rounded-[20px] p-[1vh] overflow-hidden flex flex-col">
        {/* Top Container: Header + Progress Bar */}
        <div className="md:px-6 py-[1vh] text-left shrink-0 relative">
          <h1 className="text-2xl md:text-3xl font-semibold mb-[0.5vh] text-[#212121]">
            {isOrg ? "Organization Onboarding" : "Volunteer Onboarding"}
          </h1>
          <p className="text-[#2C2C2C] font-semibold text-sm mb-[1vh]">
            {isOrg
              ? "We are excited to help you find passionate volunteers and donors who align with your mission and vision"
              : "Your gateway to meaningful impact. Let's get to know you so we can match you with the right opportunities."}
          </p>

          {/* Continuous Progress Bar - Centered, under texts */}
          <div className="pb-[0.5vh]">
            <div className="w-full bg-[#D9EDFD] h-2 rounded-full overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  isOrg ? "bg-[#21537B]" : "bg-[#0E68DC]"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Top fade indicator - at bottom of top container */}
          <div className="hidden absolute -bottom-8 left-0 right-0 h-8 bg-linear-to-b from-white via-white/95 to-transparent pointer-events-none z-10" />
        </div>

        {/* Main Content with animation - Scrollable area with calculated height */}
        <div className="flex-1 md:overflow-hidden overflow-y-auto scrollbar-hide relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="h-full flex flex-col pt-[1vh] md:px-6"
            >
              {/* Form Content */}
              <div className="flex-1">
                {children}
              </div>

              {/* Illustration - always at bottom, viewport-based height */}
              {illustration && (
                <div className={`${illustration.position === 'bottom-center' ? 'self-center' : 'self-start'} h-[15vh] w-auto`}>
                  <Image
                    src={illustration.src}
                    alt="illustration"
                    width={illustration.width || 283}
                    height={illustration.height || 157}
                    className="object-contain w-full h-full"
                    priority
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Floating Navigation Buttons - Fixed at bottom */}
        {step < totalSteps - 1 && !isCongratulations && (
          <div className="absolute bottom-[1vh] right-[1vh] md:bottom-[1.5vh] md:right-[2vh] flex gap-[0.5vh] sm:gap-[1vh] z-20">
            {step > 0 && (
              <Button
                onClick={onBack}
                variant="outline"
                className="flex items-center justify-center text-sm sm:text-base md:text-base relative font-semibold h-10 sm:h-12 text-[#0E68DC] z-10 border border-[#0E68DC] px-4 sm:px-6 bg-white/25 backdrop-blur-md shadow-lg whitespace-nowrap"
              >
                <Image
                  src="/icons/arrow-left.svg"
                  alt="arrow"
                  width={12}
                  height={12}
                  className="left-0 sm:w-3.5 sm:h-3.5"
                />
                Back
              </Button>
            )}
            <AppButton
              text="Continue"
              onClick={onNext}
              isLoading={isLoading}
              disabled={!isStepValid || isLoading}
              className="text-sm sm:text-base md:text-base relative font-semibold z-10 h-10 sm:h-12 px-4 sm:px-6 whitespace-nowrap"
              icon={
                <Image
                  src="/icons/arrow-right.svg"
                  alt="arrow"
                  width={12}
                  height={12}
                  className="sm:w-3.5 sm:h-3.5"
                />
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingLayout;