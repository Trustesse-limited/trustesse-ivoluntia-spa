'use client';

import React, { useState, useEffect } from "react";
import Layout from "@/components/onboarding/components/OnboardingLayout";
import { useOnboardingStore } from "@/store";
import { useAuthStore } from "@/store";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import logger from '@/lib/logger';
import { VolunteerFormData, OrganizationFormData } from "@/types";
import { OrganizationOnboardingData } from "@/types/onboarding";
import { PartialVolunteerSignUpDto, VolunteerOnboardingRequest, OrganizationOnboardingRequest } from "@/types/api";
import { validateBioDataForm, validateLocationForm, validateOrgAboutForm, ValidationResult } from "@/lib/formValidation";


// Import volunteer forms
import BioDataForm from "@/components/volunteer/onboardingScreens/bioDataForm";
import LocationForm from "@/components/volunteer/onboardingScreens/locationForm";
import InterestAndCauseForm from "@/components/volunteer/onboardingScreens/InterestAndCauseForm";
import SetupProfileForm from "@/components/volunteer/onboardingScreens/SetupProfileForm";
import SkillsAndStrengthForm from "@/components/volunteer/onboardingScreens/SkillsAndStrengthForm";
import Congratulations from "@/components/volunteer/onboardingScreens/congratulations";

// Import org forms
import AboutOrgForm from "@/components/organization/onboardingScreens/about-org";
import LocationOrgForm from "@/components/organization/onboardingScreens/locationForm";
import InterestAndCauseOrgForm from "@/components/organization/onboardingScreens/InterestAndCauseForm";
import SetupProfileOrgForm from "@/components/organization/onboardingScreens/SetupProfileForm";
import Disclaimer from "@/components/organization/onboardingScreens/disclaimer";

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
      className: "",
    },
  },
  {
    key: "orgCongratulations",
    isVolunteer: false,
    Component: Congratulations as VolunteerStepComponent,
    illustration: {
      src: "/illustrations/Frame 44.svg",
      position: "bottom-center",
      width: 1038,
      height: 150,
      className: "",
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

interface OnboardingClientProps {
  accountTypeFromCookie?: string;
}

const OnboardingContent: React.FC<OnboardingClientProps> = ({ accountTypeFromCookie }) => {
  const router = useRouter();
  const { formData: onboardingFormData, switchAccountType, setCurrentStep, setComplete, updateFormData, volunteerData, organizationData, currentStep: storeCurrentStep } = useOnboardingStore();
  const { user } = useAuthStore();
  const { volunteerOnboarding, organizationOnboarding, isLoading } = useAuthActions();

  // Determine account type from cookie (most accurate), then auth store, then store
  const accountType = (accountTypeFromCookie?.toLowerCase() || user?.accountType?.toLowerCase() || onboardingFormData.metaData?.accountType?.toLowerCase() || "volunteer") as "volunteer" | "organization";
  
  logger.log('[Onboarding Client] accountTypeFromCookie prop:', accountTypeFromCookie);
  logger.log('[Onboarding Client] accountType from cookie (lowercased):', accountTypeFromCookie?.toLowerCase());
  logger.log('[Onboarding Client] accountType from auth store:', user?.accountType);
  logger.log('[Onboarding Client] accountType from store:', onboardingFormData.metaData?.accountType);
  logger.log('[Onboarding Client] final accountType:', accountType);
  logger.log('[Onboarding Client] store currentStep:', storeCurrentStep);
  
  // Filter steps based on account type
  const filteredSteps = steps.filter(s => s.isVolunteer === (accountType !== "organization"));

  const [step, setStep] = useState<number>(() => {
    // Initialize step from store's currentStep
    // Store's currentStep: 0 = signup, 1-5 = onboarding screens
    // UI step index: 0-4 for onboarding screens (excluding signup)
    const initialStep = storeCurrentStep > 0 ? storeCurrentStep - 1 : 0;
    logger.log('[Onboarding Client] Initial step from store:', initialStep, '(store currentStep:', storeCurrentStep, ')');
    return initialStep;
  });
  const [formData, setFormData] = useState<VolunteerFormData | OrganizationFormData>(
    accountType === "organization"
      ? {
          name: "",
          category: "",
          website: "",
          mission: "",
          country: "",
          countryName: "",
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
          countryName: "",
          state: "",
          city: "",
          zip: "",
          address: "",
          interests: [],
          skills: [],
        }
  );
  
  // Track if we've initialized form data from store to prevent overwriting
  const hasInitializedRef = React.useRef(false);

  // On mount, restore form data from localStorage for the current step
  useEffect(() => {
    switchAccountType(accountType as "volunteer" | "organization");
    
    // Get the account-specific data from localStorage
    const accountSpecificData = accountType === "organization" ? organizationData : volunteerData;
    
    // Restore form data from store ONLY on first mount
    // This prevents overwriting user's selections when they navigate back to a step
    if (!hasInitializedRef.current) {
      if (accountType === "volunteer") {
        const volunteerData = accountSpecificData.formData as PartialVolunteerSignUpDto;
        if (volunteerData.bioData) {
          setFormData({
            firstName: volunteerData.bioData.firstName || "",
            lastName: volunteerData.bioData.lastName || "",
            otherNames: "",
            sex: volunteerData.bioData.gender === 1 ? "male" : volunteerData.bioData.gender === 2 ? "female" : "",
            dob: volunteerData.bioData.dateOfBirth || "",
            country: volunteerData.locationDto?.countryId || "",
            countryName: volunteerData.locationDto?.countryName || "",
            state: volunteerData.locationDto?.stateId || "",
            city: volunteerData.locationDto?.city || "",
            zip: volunteerData.locationDto?.zipCode || "",
            address: volunteerData.locationDto?.address || "",
            interests: volunteerData.interest?.names || [],
            skills: volunteerData.skill?.names || [],
          });
        }
      } else if (accountType === "organization") {
        const orgData = (accountSpecificData.formData as OrganizationOnboardingData).orgData || {};
        setFormData({
          name: orgData.name || "",
          category: orgData.category || "",
          website: orgData.website || "",
          mission: orgData.mission || "",
          country: accountSpecificData.formData?.locationDto?.countryId || "",
          countryName: accountSpecificData.formData?.locationDto?.countryName || "",
          state: accountSpecificData.formData?.locationDto?.stateId || "",
          city: accountSpecificData.formData?.locationDto?.city || "",
          zip: accountSpecificData.formData?.locationDto?.zipCode || "",
          address: accountSpecificData.formData?.locationDto?.address || "",
          causes: orgData.causes || [],
          logo: null,
          disclaimerAgreed: orgData.disclaimerAgreed || false,
        });
      }
      hasInitializedRef.current = true;
    }
  }, [accountType, switchAccountType, volunteerData, organizationData]);

  // Check if current step is valid
  const isStepValid = () => {
    if (accountType === "volunteer") {
      const volunteerData = formData as VolunteerFormData;
      
      switch (filteredSteps[step].key) {
        case "bio":
          return (volunteerData.firstName?.trim() || "") !== "" &&
                 (volunteerData.lastName?.trim() || "") !== "" &&
                 (volunteerData.sex || "") !== "" &&
                 (volunteerData.dob || "") !== "";
        case "location":
          return (volunteerData.address?.trim() || "") !== "" &&
                 (volunteerData.city?.trim() || "") !== "" &&
                 (volunteerData.country?.trim() || "") !== "" &&
                 (volunteerData.state?.trim() || "") !== "";
        case "interest":
          return (volunteerData.interests?.length || 0) > 0;
        case "skills":
          return (volunteerData.skills?.length || 0) > 0;
        default:
          return true;
      }
    } else {
      const orgData = formData as OrganizationFormData;
      
      switch (filteredSteps[step].key) {
        case "about":
          return (orgData.name?.trim() || "") !== "" &&
                 (orgData.category?.trim() || "") !== "" &&
                 (orgData.mission?.trim() || "") !== "";
        case "orgLocation":
          return (orgData.address?.trim() || "") !== "" &&
                 (orgData.city?.trim() || "") !== "" &&
                 (orgData.country?.trim() || "") !== "" &&
                 (orgData.state?.trim() || "") !== "";
        case "causes":
          return (orgData.causes?.length || 0) > 0;
        case "disclaimer":
          return orgData.disclaimerAgreed === true;
        default:
          return true;
      }
    }
  };

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
            website: orgData.website,
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
        case "disclaimer":
          if (!orgData.disclaimerAgreed) {
            validationResult = {
              isValid: false,
              errors: { disclaimerAgreed: "You must agree to the disclaimer to continue" }
            };
          }
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
          'onboardingMetaData.AccountType': "volunteer",
          'onboardingMetaData.CurrentPage': step + 1,
          'BioData.FirstName': volunteerData.firstName,
          'BioData.LastName': volunteerData.lastName,
          'BioData.Gender': volunteerData.sex === "male" ? 1 : volunteerData.sex === "female" ? 2 : 0,
          'BioData.DateOfBirth': volunteerData.dob,
          'LocationDto.Address': volunteerData.address,
          'LocationDto.City': volunteerData.city,
          'LocationDto.ZipCode': volunteerData.zip,
          'LocationDto.Country': volunteerData.countryName,
          'LocationDto.State': volunteerData.state,
          'Interest.Names': volunteerData.interests || [],
          'Skill.Names': volunteerData.skills || [],
          'ProfileAndBioData.Bio': volunteerData.bio || "",
          'ProfileAndBioData.ProfileImage': volunteerData.photo ? [volunteerData.photo] : undefined,
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
            logo: orgData.logo ? [orgData.logo] : undefined,
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
          'onboardingMetaData.AccountType': "volunteer",
          'onboardingMetaData.CurrentPage': 6,
          'BioData.FirstName': volunteerData.firstName,
          'BioData.LastName': volunteerData.lastName,
          'BioData.Gender': volunteerData.sex === "male" ? 1 : volunteerData.sex === "female" ? 2 : 0,
          'BioData.DateOfBirth': volunteerData.dob,
          'LocationDto.Address': volunteerData.address,
          'LocationDto.City': volunteerData.city,
          'LocationDto.ZipCode': volunteerData.zip,
          'LocationDto.Country': volunteerData.countryName,
          'LocationDto.State': volunteerData.state,
          'Interest.Names': volunteerData.interests || [],
          'Skill.Names': volunteerData.skills || [],
          'ProfileAndBioData.Bio': volunteerData.bio || "",
          'ProfileAndBioData.ProfileImage': volunteerData.photo ? [volunteerData.photo] : undefined,
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
            logo: orgData.logo ? [orgData.logo] : undefined,
          },
          disclaimer: {
            hasAgreedToDisclaimer: orgData.disclaimerAgreed,
          },
        };
        await organizationOnboarding(orgRequest);
      }
      
      // Redirect based on account type
      if (accountType === "volunteer") {
        router.push('/home');
      } else {
        router.push('/org/dashboard');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const CurrentComponent = filteredSteps[step].Component as React.ElementType;
  const isCongratulations = filteredSteps[step].key === "congratulations" || filteredSteps[step].key === "orgCongratulations";

  return (
    <Layout
      step={step}
      totalSteps={filteredSteps.length}
      onNext={handleNext}
      onBack={handleBack}
      accountType={accountType}
      illustration={filteredSteps[step].illustration}
      isStepValid={isStepValid()}
      isLoading={isLoading}
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

export default OnboardingContent;
