"use client";
import React, { useState } from "react";
import Image from "next/image";

const skills = [
  "Public Speaking",
  "Teaching",
  "Mentoring",
  "Time Management",
  "Program Management",
  "Writing & Editing",
  "Fundraising",
  "Event Planning",
  "Conflict Resolution",
  "Team Leadership",
  "Graphic Design",
  "Photography",
  "Social Media",
  "Data Analysis",
  "Web Development",
  "Mobile App Development",
  "Translation",
  "Customer Service",
  "Project Coordination",
  "Community Outreach",
  "Training & Facilitation",
  "Research",
  "Advocacy",
  "Strategic Planning",
  "Financial Literacy",
];

const SkillsAndStrengthForm: React.FC = () => {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSkill = (skill: string) => {
    setSelected((prev) =>
      prev.includes(skill)
        ? prev.filter((item) => item !== skill)
        : [...prev, skill]
    );
  };

  return (
    <form className="space-y-6 max-w-6xl mx-auto">
      <div className="mx-auto w-fit text-center">
        <h2 className="text-2xl font-normal text-[#161616]">
          Skills and Strength
        </h2>
        <p className="text-sm font-normal mt-1 text-[#161616]">
         {` Tell us what you're good at, and we’ll help you find the right place
          to use it for good.`}
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <p className="text-xs w-fit mx-auto font-semibold text-[#818181]">
          (Select all that apply)
        </p>

        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => toggleSkill(skill)}
              className={`flex items-center justify-center cursor-pointer gap-2 px-4 py-2 rounded-[6px] text-sm font-normal ${
                selected.includes(skill)
                  ? "bg-blue-100 text-blue-700"
                  : "bg-[#F3F3F3] text-[#212121]"
              }`}
            >
              <span>{skill}</span>
              <Image src="/icons/plus.svg" alt="plus" width={12} height={12} />
            </button>
          ))}
        </div>
      </div>
    </form>
  );
};

export default SkillsAndStrengthForm;
