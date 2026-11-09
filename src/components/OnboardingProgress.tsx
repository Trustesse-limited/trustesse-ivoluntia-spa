'use client';

import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnboardingStore } from '@/store/onboardingStore';
import { useAuthStore } from '@/store/authStore';
import { FiClipboard } from 'react-icons/fi';

export default function OnboardingProgress() {
  const router = useRouter();
  const pathname = usePathname();

  // Read from Zustand stores
  const accountType = useOnboardingStore(state => state.accountType);
  const currentStep = useOnboardingStore(state => state.currentStep);
  const totalSteps = useOnboardingStore(state => state.totalSteps);
  const isComplete = useOnboardingStore(state => state.isComplete);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  // Don't render if not authenticated, onboarding is complete, or on onboarding page
  if (!isAuthenticated || isComplete || pathname.startsWith('/onboarding') || pathname.startsWith('/login') || pathname.startsWith('/signup')) {
    return null;
  }

  // Also don't show if no account type (not logged in)
  if (!accountType) {
    return null;
  }

  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;
  const remainingSteps = totalSteps - currentStep - 1;

  const steps = accountType === 'volunteer'
    ? ['Profile', 'Bio', 'Skills', 'Interests', 'Qualifications', 'Programs']
    : ['Profile', 'Mission', 'Causes', 'Location', 'Review'];

  const currentStepName = steps[currentStep] || 'Start';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed z-50 bottom-6 right-6 left-6 md:left-auto md:w-80"
      >
        <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-4">
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <FiClipboard className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-slate-800">Onboarding Progress</h3>
              <p className="text-xs text-slate-500">{Math.round(progressPercentage)}% complete</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
            <motion.div
              className="h-full bg-blue-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          {/* Current Step Info */}
          <div className="mb-3">
            <p className="text-xs text-slate-600 mb-1">
              Current: <span className="font-medium text-slate-800">{currentStepName}</span>
            </p>
            <p className="text-xs text-slate-500">
              {remainingSteps > 0 ? `${remainingSteps} step${remainingSteps > 1 ? 's' : ''} remaining` : 'Almost done!'}
            </p>
          </div>

          {/* Continue Button */}
          <motion.button
            onClick={() => router.push('/onboarding')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 cursor-pointer text-white text-sm font-medium rounded-lg transition-colors"
          >
            {currentStep === 0 ? 'Start Onboarding' : 'Continue Onboarding'}
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
