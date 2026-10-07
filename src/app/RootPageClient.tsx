'use client';

import Link from 'next/link';
import { useOnboardingStore } from '@/store';
import logger from '@/lib/logger';

// usertypecard details
const userType = [
  {
    text: 'Volunteer',
    img: '/Man.svg',
    alt: 'Volunteer',
  },
  {
    text: 'Organisation',
    img: '/People.svg',
    alt: 'Organisation',
  },
];

const styleItem = 'text-lg sm:text-xl md:text-2xl font-[500] text-[#0D0D0D] text-center';

// Server component: no client-only hooks required. The <Link> components
// handle all navigation, so useRouter and the onboarding store are not needed
// here (they were causing a heavy client-bundle instantiation on every
// request, which made the root page take minutes to load).
const RootPageClient = () => {
  const { switchAccountType } = useOnboardingStore();

  const handleVolunteerClick = () => {
    logger.log('Volunteer card clicked');
    switchAccountType('volunteer');
  };

  const handleOrganizationClick = () => {
    logger.log('Organization card clicked');
    switchAccountType('organization');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full relative p-4 mx-auto">
      {/* Main Content - centered */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-[700] text-center mb-2">
          Welcome
        </h1>
        <p className="text-sm sm:text-base text-[#000000] text-center mb-8">
          Please select the category that aligns with your goals
        </p>

        {/* User Type Cards - uniform width, 2 columns on ≥320px, wraps only on <320px */}
        <div className="flex flex-row flex-wrap justify-center items-center gap-4 w-full">
          {userType.map((user, index) => (
            <Link
              key={index}
              href={index === 0 ? '/signup?account=volunteer' : '/signup?account=organization'}
              onClick={index === 0 ? handleVolunteerClick : handleOrganizationClick}
              className="block"
            >
              <div className="bg-white border border-[#C0C0C0] rounded-xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer flex-1 aspect-[5/4] min-w-[160px] max-w-[192px] sm:min-w-[240px] sm:max-w-[288px]">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-[90px] xl:h-[90px] mb-2 pointer-events-none">
                  <img src={user.img} alt={user.alt} className="w-full h-full object-contain" />
                </div>
                <h2 className={styleItem}>{user.text}</h2>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-10 text-sm sm:text-[16px] text-center">
          Already have an account?{' '}
          <span className="text-primary font-[700]">
            <Link href="/login">Sign In</Link>
          </span>
        </p>
      </div>

      {/* Illustration - positioned at bottom center, scrolls with page */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-0 w-full max-w-[446px] flex justify-center">
        <img
          src="/user.svg"
          alt="illustration-svg"
          width={446}
          height={223}
          className="w-full h-auto object-contain"
        />
      </div>
    </div>
  );
};

export default RootPageClient;
