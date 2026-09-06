"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AppButton } from "@/components/AppButton";
import { OrganizationFormProps } from "@/types";
import { getCausesAction } from "@/app/actions/auth";
import { Cause } from "@/types/api";
import { motion } from "framer-motion";

const InterestAndCauseForm: React.FC<OrganizationFormProps> = ({ formData, setFormData }) => {
  const [selected, setSelected] = useState<string[]>(formData.causes || []);
  const [showMore, setShowMore] = useState<boolean>(false);
  const [causes, setCauses] = useState<Cause[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCauses = async () => {
      setIsLoading(true);
      try {
        const result = await getCausesAction();
        if (result.success && result.data) {
          setCauses(result.data);
        } else {
          setError(result.error || 'Failed to fetch causes');
        }
      } catch (err) {
        setError('Failed to fetch causes');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCauses();
  }, []);

  const toggleInterest = (interest: string) => {
    const updated = selected.includes(interest)
      ? selected.filter((item) => item !== interest)
      : [...selected, interest];
    setSelected(updated);
    setFormData({ ...formData, causes: updated });
  };

  const displayedCauses = showMore ? causes : causes.slice(0, 24);

  if (isLoading) {
    return (
      <form className="space-y-6 max-w-6xl pb-16 mx-auto">
        <div className="mx-auto w-fit text-center">
          <h2 className="text-2xl font-normal text-[#161616]">
            Causes you support
          </h2>
          <p className="text-sm font-normal mt-1 text-[#161616]">
            This helps potential volunteers find you based on shared interests and values, making every collaboration more impactful.
          </p>
        </div>
        <div className="max-w-2xl mx-auto space-y-4">
          <fieldset>
            <legend className="text-xs w-fit mx-auto font-semibold text-[#818181]">
              (Select all that apply)
            </legend>
            <div className="flex flex-wrap gap-3 justify-center mt-2">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 w-32 bg-[#F3F3F3] rounded-[6px] animate-pulse"
                />
              ))}
            </div>
          </fieldset>
        </div>
      </form>
    );
  }

  if (error) {
    return (
      <form className="space-y-6 max-w-6xl pb-16 mx-auto">
        <div className="mx-auto w-fit text-center">
          <h2 className="text-2xl font-normal text-[#161616]">
            Causes you support
          </h2>
          <p className="text-sm font-normal mt-1 text-red-500">
            {error}
          </p>
        </div>
      </form>
    );
  }

  return (
    <form className="space-y-6 max-w-6xl pb-16 mx-auto">
      <div className="mx-auto w-fit text-center">
        <h2 className="text-2xl font-normal text-[#161616]">
          Causes you support
        </h2>
        <p className="text-sm font-normal mt-1 text-[#161616]">
          This helps potential volunteers find you based on shared interests and values, making every collaboration more impactful.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <fieldset>
          <legend className="text-xs w-fit mx-auto font-semibold text-[#818181]">
            (Select all that apply)
          </legend>

          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {displayedCauses.map((cause) => {
              const isSelected = selected.includes(cause.name);

              return (
                <AppButton
                  key={cause.name}
                  type="button"
                  onClick={() => toggleInterest(cause.name)}
                  isLoading={false}
                  className={`flex items-center justify-center cursor-pointer gap-2 px-3 py-1.5 rounded-[6px] text-xs font-normal transition-colors duration-200 ${
                    isSelected
                      ? "bg-blue-100 text-blue-700"
                      : "bg-[#F3F3F3] text-[#212121]"
                  }`}
                  aria-pressed={isSelected}
                  aria-label={`Toggle ${cause.name}`}
                >
                  <span className={`text-sm pr-2.5 font-normal ${
                    isSelected
                      ? "text-blue-700"
                      : "text-[#161616]"
                  }`}>{cause.name}</span>
                  <motion.div
                    initial={false}
                    animate={{ 
                      scale: isSelected ? [1, 0.8, 1] : [1, 0.8, 1],
                      rotate: isSelected ? [0, 180] : [180, 0]
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src={isSelected ? "/icons/minus.svg" : "/icons/plus.svg"}
                      alt={isSelected ? "minus" : "plus"}
                      width={12}
                      height={12}
                      loading="lazy"
                    />
                  </motion.div>
                </AppButton>
              );
            })}
          </div>
        </fieldset>

        {causes.length > 24 && (
          <div className="flex justify-center">
            <AppButton
              type="button"
              onClick={() => setShowMore((prev) => !prev)}
              isLoading={false}
              className="text-sm text-[#21537B] bg-transparent shadow-none font-medium hover:underline"
              aria-expanded={showMore ? true : false}
            >
              {showMore ? "Show less" : "Show more"}
            </AppButton>
          </div>
        )}
      </div>
    </form>
  );
};

export default InterestAndCauseForm;

