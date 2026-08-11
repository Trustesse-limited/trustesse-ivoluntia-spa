'use client';

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Layout from "./components/OnboardingLayout";
import { useOnboardingStore } from "@/store";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { VolunteerFormData, OrganizationFormData } from "@/types";
import { OrganizationOnboardingData } from "@/types/onboarding";
import { PartialVolunteerSignUpDto, VolunteerOnboardingRequest, OrganizationOnboardingRequest } from "@/types/api";
import { validateBioDataForm, validateLocationForm, validateOrgAboutForm, ValidationResult } from "@/lib/formValidation";
import { volunteerOnboarding, organizationOnboarding } from "@/lib/server-api";

// Import volunteer forms
import BioDataForm from "./volunteer/components/screens/bioDataForm";
import LocationForm from "./volunteer/components/screens/locationForm";
import InterestAndCauseForm from "./volunteer/components/screens/InterestAndCauseForm";
import SetupProfileForm from "./volunteer/components/screens/SetupProfileForm";
import SkillsAndStrengthForm from "./volunteer/components/screens/SkillsAndStrengthForm";
import Congratulations from "./volunteer/components/screens/congratulations";

// Import org forms
import AboutOrgForm from "./org/components/screens/about-org";
import LocationOrgForm from "./org/components/screens/locationForm";
import InterestAndCauseOrgForm from "./org/components/screens/InterestAndCauseForm";
import SetupProfileOrgForm from "./org/components/screens/SetupProfileForm";
import Disclaimer from "./org/components/screens/disclaimer";

type VolunteerStepComponent = React.FC<{ formData: VolunteerFormData; setFormData: (data: VolunteerFormData) => void }>;
type OrgStepComponent = React.FC<{ formData: OrganizationFormData; setFormData: (data: OrganizationFormData) => void }>;

type StepConfig = {
  key: string;
  isVolunteer: boolean;
  Component: VolunteerStepComponent | OrgStepComponent;
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
    isVolunteer: true,
    Component: BioDataForm as VolunteerStepComponent,
    illustration: {
      src: "/illustrations/Group 51.svg",
      position: "bottom-left",
      width: 283,
      height: 157,
    },
  },
  {
    key: "location",
    isVolunteer: true,
    Component: LocationForm as VolunteerStepComponent,
    illustration: {
      src: "/illustrations/Frame 2147223985.svg",
      position: "bottom-left",
      height: 177,
      width: 386,
    },
  },
  {
    key: "interest",
    isVolunteer: true,
    Component: InterestAndCauseForm as VolunteerStepComponent,
    illustration: {
      src: "/illustrations/Frame 4.svg",
      position: "bottom-left",
      width: 425,
      height: 167,
    },
  },
  {
    key: "skills",
    isVolunteer: true,
    Component: SkillsAndStrengthForm as VolunteerStepComponent,
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
    isVolunteer: true,
    Component: SetupProfileForm as VolunteerStepComponent,
    illustration: {
      src: "/illustrations/6.svg",
      position: "bottom-left",
      width: 226,
      height: 196,
      className: "",
    },
  },
  {
    key: "about",
    isVolunteer: false,
    Component: AboutOrgForm as OrgStepComponent,
    illustration: {
      src: "/illustrations/Group 51.svg",
      position: "bottom-left",
      width: 283,
      height: 157,
    },
  },
  {
    key: "orgLocation",
    isVolunteer: false,
    Component: LocationOrgForm as OrgStepComponent,
    illustration: {
      src: "/illustrations/Frame 2147223985.svg",
      position: "bottom-left",
      height: 177,
      width: 386,
    },
  },
  {
    key: "causes",
    isVolunteer: false,
    Component: InterestAndCauseOrgForm as OrgStepComponent,
    illustration: {
      src: "/illustrations/Frame 4.svg",
      position: "bottom-left",
      width: 425,
      height: 167,
    },
  },
  {
    key: "logo",
    isVolunteer: false,
    Component: SetupProfileOrgForm as OrgStepComponent,
    illustration: {
      src: "/illustrations/6.svg",
      position: "bottom-left",
      width: 226,
      height: 196,
      className: "",
    },
  },
  {
    key: "disclaimer",
    isVolunteer: false,
    Component: Disclaimer as OrgStepComponent,
    illustration: {
      src: "/illustrations/Frame 26.svg",
      position: "bottom-left",
      width: 500,
      height: 183,
      className: "md:w-1/3 lg:w-1/2",
    },
  },
  {
    key: "congratulations",
    isVolunteer: true,
    Component: Congratulations as VolunteerStepComponent,
    illustration: {
      src: "/illustrations/Frame 44.svg",
      position: "bottom-center",
      width: 1038,
      height: 150,
      className: "",
    },
  },
];

const OnboardingContent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { formData: onboardingFormData, switchAccountType, setCurrentStep, setComplete, updateFormData } = useOnboardingStore();
  const { volunteerOnboarding, organizationOnboarding, isLoading } = useAuthActions();

  // Determine account type from onboarding store (set during signup)
  const accountType = (onboardingFormData.metaData?.accountType?.toLowerCase() || "volunteer") as "volunteer" | "organization";
  
  // Filter steps based on account type
  const filteredSteps = steps.filter(s => s.isVolunteer === (accountType !== "organization"));

  const [step, setStep] = useState<number>(0);
  const [formData, setFormData] = useState<VolunteerFormData | OrganizationFormData>(
    accountType === "organization"
      ? {
          name: "",
          category: "",
          website: "",
          mission: "",
          country: "",
          state: "",
          city: "",
          zip: "",
          address: "",
          causes: [],
          logo: null,
          disclaimerAgreed: false,
        }
      : {
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
        }
  );

  // On mount, restore the user's last step from query param or store
  useEffect(() => {
    switchAccountType(accountType as "volunteer" | "organization");
    
    // Check for step query param first, then fall back to store
    const queryStep = searchParams.get('step');
    if (queryStep) {
      const stepNum = parseInt(queryStep, 10);
      setStep(Math.max(0, Math.min(stepNum - 1, filteredSteps.length - 1)));
    } else {
      const storedStep = onboardingFormData.metaData?.currentPage || 0;
      setStep(Math.max(0, storedStep - 1));
    }
    
    // Restore form data from store
    if (accountType === "volunteer") {
      const volunteerData = onboardingFormData as PartialVolunteerSignUpDto;
      if (volunteerData.bioData) {
        setFormData({
          firstName: volunteerData.bioData.firstName || "",
          lastName: volunteerData.bioData.lastName || "",
          otherNames: "",
          sex: volunteerData.bioData.gender === 1 ? "male" : volunteerData.bioData.gender === 2 ? "female" : "",
          dob: volunteerData.bioData.dateOfBirth || "",
          country: volunteerData.locationDto?.countryId || "",
          state: volunteerData.locationDto?.stateId || "",
          city: volunteerData.locationDto?.city || "",
          zip: volunteerData.locationDto?.zipCode || "",
          address: volunteerData.locationDto?.address || "",
        });
      }
    } else if (accountType === "organization") {
      const orgData = (onboardingFormData as OrganizationOnboardingData).orgData || {};
      setFormData({
        name: orgData.name || "",
        category: orgData.category || "",
        website: orgData.website || "",
        mission: orgData.mission || "",
        country: onboardingFormData.locationDto?.countryId || "",
        state: onboardingFormData.locationDto?.stateId || "",
        city: onboardingFormData.locationDto?.city || "",
        zip: onboardingFormData.locationDto?.zipCode || "",
        address: onboardingFormData.locationDto?.address || "",
        causes: orgData.causes || [],
        logo: orgData.logo,
        disclaimerAgreed: orgData.disclaimerAgreed || false,
      });
    }
  }, [accountType, onboardingFormData, switchAccountType, searchParams, filteredSteps.length]);

  const handleNext = async () => {
    // Validate current step before proceeding
    let validationResult: { isValid: boolean; errors: Record<string, string> } = { isValid: true, errors: {} };
    
    // Perform validation based on current step
    if (accountType === "volunteer") {
      const volunteerData = formData as VolunteerFormData;
      
      switch (filteredSteps[step].key) {
        case "bio":
          validationResult = validateBioDataForm({
            firstName: volunteerData.firstName,
            lastName: volunteerData.lastName,
            sex: volunteerData.sex,
            dob: volunteerData.dob,
          });
          break;
        case "location":
          validationResult = validateLocationForm({
            address: volunteerData.address,
            city: volunteerData.city,
            zip: volunteerData.zip,
            country: volunteerData.country,
            state: volunteerData.state,
          });
          break;
        // Add more validations for other steps as needed
        default:
          break;
      }
    } else {
      const orgData = formData as OrganizationFormData;
      
      switch (filteredSteps[step].key) {
        case "about":
          validationResult = validateOrgAboutForm({
            name: orgData.name,
            category: orgData.category,
            mission: orgData.mission,
          });
          break;
        case "orgLocation":
          validationResult = validateLocationForm({
            address: orgData.address,
            city: orgData.city,
            zip: orgData.zip,
            country: orgData.country,
            state: orgData.state,
          });
          break;
        // Add more validations for other steps as needed
        default:
          break;
      }
    }
    
    // If validation failed, show errors and don't proceed
    if (!validationResult.isValid) {
      const errorMessages = Object.values(validationResult.errors);
      toast.error(errorMessages[0] || "Please fill in all required fields correctly");
      return;
    }
    
    saveFormDataToStore();
    
    // Call onboarding API for current step before proceeding
    try {
      if (accountType === "volunteer") {
        const volunteerData = formData as VolunteerFormData;
        const volunteerRequest: VolunteerOnboardingRequest = {
          onboardingMetaData: {
            accountType: "volunteer",
            currentPage: step + 1,
          },
          bioData: {
            firstName: volunteerData.firstName,
            lastName: volunteerData.lastName,
            gender: volunteerData.sex === "male" ? 1 : volunteerData.sex === "female" ? 2 : 0,
            dateOfBirth: volunteerData.dob,
          },
          locationDto: {
            address: volunteerData.address,
            city: volunteerData.city,
            zipCode: volunteerData.zip,
            countryId: volunteerData.country,
            stateId: volunteerData.state,
          },
          interest: {
            names: [],
          },
          skill: {
            names: [],
          },
          profileAndBioData: {
            bio: "",
          },
        };
        await volunteerOnboarding(volunteerRequest);
      } else {
        const orgData = formData as OrganizationFormData;
        const orgRequest: OrganizationOnboardingRequest = {
          metaData: {
            accountType: "organization",
            currentPage: step + 1,
          },
          foundationBioData: {
            name: orgData.name,
            foundationCategory: orgData.category,
            website: orgData.website,
            mission: orgData.mission,
          },
          foundationLocationDto: {
            address: orgData.address,
            city: orgData.city,
            zipcode: orgData.zip,
            foundationCountry: orgData.country,
            foundationState: orgData.state,
            countryId: orgData.country,
            stateId: orgData.state,
          },
          causeDto: {
            names: orgData.causes || [],
          },
          profileLogo: {
            logo: orgData.logo as string | undefined,
          },
          disclaimer: {
            hasAgreedToDisclaimer: orgData.disclaimerAgreed,
          },
        };
        await organizationOnboarding(orgRequest);
      }
    } catch (error) {
      toast.error("Failed to save progress. Please try again.");
      return;
    }
    
    if (step < filteredSteps.length - 1) {
      const newStep = step + 1;
      setStep(newStep);
      setCurrentStep(newStep + 1);
      updateFormData({
        metaData: {
          accountType,
          currentPage: newStep + 1,
        },
      });
      // Update URL without reloading
      router.push(`/onboarding?step=${newStep + 1}`);
    } else {
      await handleSubmit();
    }
  };

  const handleBack = () => {
    saveFormDataToStore();
    
    if (step > 0) {
      const newStep = step - 1;
      setStep(newStep);
      setCurrentStep(newStep + 1);
      updateFormData({
        metaData: {
          accountType,
          currentPage: newStep + 1,
        },
      });
      router.push(`/onboarding?step=${newStep + 1}`);
    }
  };

  const saveFormDataToStore = () => {
    if (accountType === "volunteer") {
      const volunteerData = formData as VolunteerFormData;
      updateFormData({
        bioData: {
          firstName: volunteerData.firstName,
          lastName: volunteerData.lastName,
          gender: volunteerData.sex === "male" ? 1 : volunteerData.sex === "female" ? 2 : 0,
          dateOfBirth: volunteerData.dob,
        },
        locationDto: {
          address: volunteerData.address,
          city: volunteerData.city,
          zipCode: volunteerData.zip,
          countryId: volunteerData.country,
          stateId: volunteerData.state,
        },
      });
    } else {
      const orgData = formData as OrganizationFormData;
      updateFormData({
        orgData: {
          name: orgData.name,
          category: orgData.category,
          website: orgData.website,
          mission: orgData.mission,
          causes: orgData.causes,
          logo: orgData.logo,
          disclaimerAgreed: orgData.disclaimerAgreed,
        },
        locationDto: {
          address: orgData.address,
          city: orgData.city,
          zipCode: orgData.zip,
          countryId: orgData.country,
          stateId: orgData.state,
        },
      });
    }
  };

  const handleSubmit = async () => {
    try {
      setComplete();
      
      if (accountType === "volunteer") {
        const volunteerData = formData as VolunteerFormData;
        const volunteerRequest: VolunteerOnboardingRequest = {
          onboardingMetaData: {
            accountType: "volunteer",
            currentPage: 6,
          },
          bioData: {
            firstName: volunteerData.firstName,
            lastName: volunteerData.lastName,
            gender: volunteerData.sex === "male" ? 1 : volunteerData.sex === "female" ? 2 : 0,
            dateOfBirth: volunteerData.dob,
          },
          locationDto: {
            address: volunteerData.address,
            city: volunteerData.city,
            zipCode: volunteerData.zip,
            countryId: volunteerData.country,
            stateId: volunteerData.state,
          },
          interest: {
            names: [],
          },
          skill: {
            names: [],
          },
          profileAndBioData: {
            bio: "",
          },
        };
        await volunteerOnboarding(volunteerRequest);
      } else {
        const orgData = formData as OrganizationFormData;
        const orgRequest: OrganizationOnboardingRequest = {
          metaData: {
            accountType: "organization",
            currentPage: 6,
          },
          foundationBioData: {
            name: orgData.name,
            foundationCategory: orgData.category,
            website: orgData.website,
            mission: orgData.mission,
          },
          foundationLocationDto: {
            address: orgData.address,
            city: orgData.city,
            zipcode: orgData.zip,
            foundationCountry: orgData.country,
            foundationState: orgData.state,
            countryId: orgData.country,
            stateId: orgData.state,
          },
          causeDto: {
            names: orgData.causes || [],
          },
          profileLogo: {
            logo: orgData.logo as string | undefined,
          },
          disclaimer: {
            hasAgreedToDisclaimer: orgData.disclaimerAgreed,
          },
        };
        await organizationOnboarding(orgRequest);
      }
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const CurrentComponent = filteredSteps[step].Component as React.ElementType;
  const isCongratulations = filteredSteps[step].key === "congratulations";

  return (
    <Layout
      step={step}
      totalSteps={filteredSteps.length}
      onNext={handleNext}
      onBack={handleBack}
      accountType={accountType}
      illustration={filteredSteps[step].illustration}
    >
      {isCongratulations ? (
        <Congratulations 
          onLaunch={handleSubmit}
          isLoading={isLoading}
        />
      ) : accountType === "volunteer" ? (
        <CurrentComponent 
          formData={formData as VolunteerFormData} 
          setFormData={setFormData as unknown as (data: VolunteerFormData) => void}
        />
      ) : (
        <CurrentComponent 
          formData={formData as OrganizationFormData} 
          setFormData={setFormData as unknown as (data: OrganizationFormData) => void}
        />
      )}
    </Layout>
  );
};

const OnboardingPage: React.FC = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <OnboardingContent />
    </Suspense>
  );
};

export default OnboardingPage;