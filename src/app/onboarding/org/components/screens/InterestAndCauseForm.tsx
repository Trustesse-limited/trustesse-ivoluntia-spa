"use client";
import React, { useState } from "react";
import Image from "next/image";
import { OrganizationFormProps } from "@/types";

const initialInterests = [
  "Education",
  "Health & Wellness",
  "Environment",
  "Boy Child",
  "Girl Child",
  "Arts & Culture",
  "Disability Inclusion",
  "Animal Welfare",
  "Community Development",
  "Technology",
  "Mental Health",
  "Sports & Recreation",
];

const moreInterests = [
  "Gender Equality",
  "Refugee Support",
  "Food Security",
  "Clean Water Access",
  "Youth Empowerment",
  "Senior Care",
  "Human Rights",
  "Economic Development",
  "Emergency Response",
  "Peacebuilding",
  "Civic Engagement",
  "Digital Literacy",
  "Public Safety",
  "Climate Action",
  "Crisis Counseling",
];

const InterestAndCauseForm: React.FC<OrganizationFormProps> = ({ formData, setFormData }) => {
  const [selected, setSelected] = useState<string[]>(formData.causes || []);
  const [showMore, setShowMore] = useState<boolean>(false);

  const toggleInterest = (interest: string) => {
    const updated = selected.includes(interest)
      ? selected.filter((item) => item !== interest)
      : [...selected, interest];
    setSelected(updated);
    setFormData({ ...formData, causes: updated });
  };

  const displayedInterests = showMore
    ? [...initialInterests, ...moreInterests]
    : initialInterests;

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
        <div className="flex flex-wrap justify-center gap-3">
          {displayedInterests.map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => toggleInterest(interest)}
              className={`flex items-center cursor-pointer gap-2 px-4 py-2 rounded-[6px] text-sm font-normal ${
                selected.includes(interest)
                  ? "bg-blue-100 text-blue-700"
                  : "bg-[#F3F3F3] text-[#212121]"
              }`}
            >
              <span>{interest}</span>
              <Image src="/icons/plus.svg" alt="plus" width={12} height={12} />
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setShowMore((prev) => !prev)}
            className="text-sm text-[#21537B] font-medium hover:underline cursor-pointer"
          >
            {showMore ? "Show less" : "Show more"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default InterestAndCauseForm;

