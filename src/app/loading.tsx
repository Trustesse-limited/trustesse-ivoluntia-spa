import { LoadingSpinner } from '@/components/LoadingSpinner';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full relative p-4 mx-auto bg-white">
      {/* Loading Spinner */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl mx-auto">
        <LoadingSpinner size="lg" />
        
        <p className="text-sm sm:text-base text-[#666666] text-center max-w-md mt-8">
          Please wait while we prepare your experience
        </p>
      </div>

      {/* Illustration - fixed at bottom center */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-0 w-full max-w-[446px] flex justify-center opacity-30">
        <svg
          width="446"
          height="223"
          viewBox="0 0 446 223"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <ellipse cx="223" cy="200" rx="150" ry="20" fill="#E5E7EB" />
          <circle cx="223" cy="120" r="60" fill="#E5E7EB" />
          <rect x="163" y="180" width="120" height="40" rx="20" fill="#E5E7EB" />
        </svg>
      </div>
    </div>
  );
}
