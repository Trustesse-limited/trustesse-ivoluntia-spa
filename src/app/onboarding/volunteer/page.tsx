"use client";

import React, { useState, useEffect } from "react";
import BioDataForm from "./components/screens/bioDataForm";
import LocationForm from "./components/screens/locationForm";
import InterestAndCauseForm from "./components/screens/InterestAndCauseForm";
import SetupProfileForm from "./components/screens/SetupProfileForm";
import SkillsAndStrengthForm from "./components/screens/SkillsAndStrengthForm";
import Congratulations from "./components/screens/congratulations";
import { FormProps, VolunteerFormData } from "@/types";
import Layout from "./components/layout";
import { useOnboardingStore } from "@/store";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useRouter } from "next/navigation";
import { VolunteerSignUpDto } from "@/types/api";

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
  const { formData: onboardingFormData, updateFormData, setCurrentStep, canProceedToStep, setComplete, switchAccountType, clearOnboarding } = useOnboardingStore();
  const { volunteerSignUp, isLoading } = useAuthActions();
  const router = useRouter();

  // On mount, restore the user's last step
  useEffect(() => {
    switchAccountType('volunteer');
    // Restore the step from store (subtract 1 because store step 1 = onboarding step 0)
    const storedStep = onboardingFormData.metaData?.currentPage || 0;
    setStep(Math.max(0, storedStep - 1));
    
    // Restore form data from store
    if (onboardingFormData.bioData) {
      setFormData({
        firstName: onboardingFormData.bioData.firstName || "",
        lastName: onboardingFormData.bioData.lastName || "",
        otherNames: "",
        sex: onboardingFormData.bioData.gender === 1 ? "male" : onboardingFormData.bioData.gender === 2 ? "female" : "",
        dob: onboardingFormData.bioData.dateOfBirth || "",
        country: onboardingFormData.locationDto?.countryId || "",
        state: onboardingFormData.locationDto?.stateId || "",
        city: onboardingFormData.locationDto?.city || "",
        zip: onboardingFormData.locationDto?.zipCode || "",
        address: onboardingFormData.locationDto?.address || "",
      });
    }
  }, [onboardingFormData, switchAccountType]);

  const handleNext = async () => {
    // Save current form data to store before moving
    saveFormDataToStore();
    
    if (step < steps.length - 1) {
      const newStep = step + 1;
      setStep(newStep);
      // Update store with current progress (step + 1 because store step 1 = onboarding step 0)
      setCurrentStep(newStep + 1);
      updateFormData({
        metaData: {
          accountType: "volunteer",
          currentPage: newStep + 1,
        },
      });
    } else {
      // Submit to backend API on final step
      await handleSubmit();
    }
  };

  const saveFormDataToStore = () => {
    updateFormData({
      bioData: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        gender: formData.sex === "male" ? 1 : formData.sex === "female" ? 2 : 0,
        dateOfBirth: formData.dob || new Date().toISOString().split('T')[0],
      },
      locationDto: {
        address: formData.address,
        city: formData.city,
        zipCode: formData.zip,
        countryId: formData.country,
        stateId: formData.state,
      },
    });
  };

  const handleBack = () => {
    // Save current form data to store before moving back
    saveFormDataToStore();
    
    if (step > 0) {
      const newStep = step - 1;
      setStep(newStep);
      // Update store with current progress
      setCurrentStep(newStep + 1);
      updateFormData({
        metaData: {
          accountType: "volunteer",
          currentPage: newStep + 1,
        },
      });
    }
  };

  const handleSubmit = async () => {
    try {
      // Convert form data to VolunteerSignUpDto format
      const volunteerData: VolunteerSignUpDto = {
        metaData: {
          accountType: "volunteer",
          currentPage: step + 1,
        },
        authInfo: {
          email: onboardingFormData.authInfo?.email || "",
          password: onboardingFormData.authInfo?.password || "",
          confirmPassword: onboardingFormData.authInfo?.confirmPassword || "",
          hasAcceptedTOC: onboardingFormData.authInfo?.hasAcceptedTOC || false,
        },
        bioData: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          gender: formData.sex === "male" ? 1 : formData.sex === "female" ? 2 : 0,
          dateOfBirth: formData.dob || new Date().toISOString().split('T')[0], // Use current date if empty
        },
        locationDto: {
          address: formData.address,
          city: formData.city,
          zipCode: formData.zip,
          countryId: formData.country,
          stateId: formData.state,
        },
        interest: {
          names: [], // Will be populated from interest form
        },
        skill: {
          names: [], // Will be populated from skills form
        },
        profileAndBioData: {
          bio: "", // Will be populated from profile form
          profileImageurl: "",
        },
      };

      const result = await volunteerSignUp(volunteerData);
      
      if (result.success) {
        // Clear onboarding data since account is created
        clearOnboarding();
        // Redirect to login
        router.push('/login');
      }
    } catch (error) {
      console.error('Error submitting volunteer data:', error);
    }
  };

  const CurrentComponent = steps[step].Component;

  return (
    <Layout
      step={step}
      totalSteps={steps.length}
      onNext={handleNext}
      onBack={handleBack}
      illustration={steps[step].illustration}
    >
      {step === steps.length - 1 ? (
        <CurrentComponent 
          formData={formData} 
          setFormData={setFormData}
          onLaunch={handleSubmit}
          isLoading={isLoading}
        />
      ) : (
        <CurrentComponent formData={formData} setFormData={setFormData} />
      )}
    </Layout>
  );
};

export default VolunteerOnboarding;
