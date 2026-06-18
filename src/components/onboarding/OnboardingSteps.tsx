export const ONBOARDING_STEPS = [
  {
    step: 1,
    title: 'Account Information',
    description: 'Create your account credentials',
    component: 'AuthInfoStep',
  },
  {
    step: 2,
    title: 'Personal Information',
    description: 'Tell us about yourself',
    component: 'BioDataStep',
  },
  {
    step: 3,
    title: 'Location',
    description: 'Where are you located?',
    component: 'LocationStep',
  },
  {
    step: 4,
    title: 'Interests',
    description: 'What causes interest you?',
    component: 'InterestsStep',
  },
  {
    step: 5,
    title: 'Skills',
    description: 'What skills do you have?',
    component: 'SkillsStep',
  },
  {
    step: 6,
    title: 'Profile',
    description: 'Complete your profile',
    component: 'ProfileStep',
  },
];

export const getStepTitle = (step: number) => {
  return ONBOARDING_STEPS.find(s => s.step === step)?.title || '';
};

export const getStepDescription = (step: number) => {
  return ONBOARDING_STEPS.find(s => s.step === step)?.description || '';
};
