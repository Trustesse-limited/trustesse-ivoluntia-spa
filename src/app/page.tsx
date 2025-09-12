"use client";

import React, { useState } from "react";
import BioDataForm from "./onboarding/volunteer/components/bioDataForm";
import LocationForm from "./onboarding/volunteer/components/locationForm";
import { VolunteerFormData } from "./onboarding/volunteer/components/types";
import Layout from "./onboarding/volunteer/components/layout";
import InterestAndCauseForm from "./onboarding/volunteer/components/InterestAndCauseForm";
import SkillsAndStrengthForm from "./onboarding/volunteer/components/SkillsAndStrengthForm";

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

  const screens = [
    <BioDataForm key="bio" formData={formData} setFormData={setFormData} />,
    <LocationForm
      key="location"
      formData={formData}
      setFormData={setFormData}
      />,
      <InterestAndCauseForm key={"interest"} />,
    <SkillsAndStrengthForm key={"skills"} />,

  ];

  return (
    <Layout
      step={step}
      totalSteps={screens.length}
      onNext={() => setStep((prev) => Math.min(prev + 1, screens.length - 1))}
      onBack={() => setStep((prev) => Math.max(prev - 1, 0))}
    >
      {screens[step]}
    </Layout>
  );
};

export default VolunteerOnboarding;
