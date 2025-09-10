"use client";

import React, { useState } from "react";
import BioDataForm from "./components/screens/bioDataForm";
import LocationForm from "./components/screens/locationForm";
import InterestAndCauseForm from "./components/screens/InterestAndCauseForm";
import SetupProfileForm from "./components/screens/SetupProfileForm";
import SkillsAndStrengthForm from "./components/screens/SkillsAndStrengthForm";
import Congratulations from "./components/screens/congratulations";
import { FormProps, VolunteerFormData } from "@/types";
import Layout from "./components/layout";

type StepConfig = {
  key: string;
  Component: React.FC<FormProps>;
  illustration?: {
    src: string;
    position: "bottom-left" | "bottom-center" | "bottom-right";
    width?: number;
    height?: number;
    className?: string;
  };
};

const steps: StepConfig[] = [
  {
    key: "bio",
    Component: BioDataForm,
    illustration: {
      src: "/illustrations/Group 51.svg",
      position: "bottom-left",
      width: 283,
      height: 157,
    },
  },
  {
    key: "location",
    Component: LocationForm,
    illustration: {
      src: "/illustrations/Frame 2147223985.svg",
      position: "bottom-left",
      height: 177,
      width: 386,
    },
  },
  {
    key: "interest",
    Component: InterestAndCauseForm,
    illustration: {
      src: "/illustrations/Frame 4.svg",
      position: "bottom-left",
      width: 425,
      height: 167,
    },
  },
  {
    key: "skills",
    Component: SkillsAndStrengthForm,
    illustration: {
      src: "/illustrations/Frame 26.svg",
      position: "bottom-left",
      width: 500,
      height: 183,
      className: "md:w-1/3 lg:w-1/2",
    },
  },
  {
    key: "setup",
    Component: SetupProfileForm,
    illustration: {
      src: "/illustrations/6.svg",
      position: "bottom-left",
      width: 226,
      height: 196,
      className: "",
    },
  },
  {
    key: "congratulations",
    Component: Congratulations,
    illustration: {
      src: "/illustrations/Frame 44.svg",
      position: "bottom-center",
      width: 1038,
      height: 150,
      className: "",
    },
  },
];

const VolunteerOnboarding: React.FC = () => {
  const [step, setStep] = useState<number>(0);
  const [formData, setFormData] = useState<VolunteerFormData>({
    firstName: "",
    lastName: "",
    otherNames: "",
    sex: "",
    dob: "",
    country: "",
    state: "",
    city: "",
    zip: "",
    address: "",
  });

  const CurrentComponent = steps[step].Component;

  return (
    <Layout
      step={step}
      totalSteps={steps.length}
      onNext={() => setStep((prev) => Math.min(prev + 1, steps.length - 1))}
      onBack={() => setStep((prev) => Math.max(prev - 1, 0))}
      illustration={steps[step].illustration}
    >
      <CurrentComponent formData={formData} setFormData={setFormData} />
    </Layout>
  );
};

export default VolunteerOnboarding;
