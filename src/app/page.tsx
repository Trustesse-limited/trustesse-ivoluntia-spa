'use client';

import React from "react";
import UserTypeCard from "@/components/UserTypeCard";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/store";

//usertypecard details
const userType = [
  {
    text: "Volunteer",
    img: "/Man.svg",
    alt: "Volunteer",
  },
  {
    text: "Organisation",
    img: "/People.svg",
    alt: "Organisation",
  },
];

//for the styling of the volunteer and org text
const styleItem = "text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-[28px] font-[400] text-[#0D0D0D] text-center";

const Page = () => {
  const router = useRouter();
  const { switchAccountType } = useOnboardingStore();

  const handleVolunteerClick = () => {
    switchAccountType('volunteer');
    router.push('/onboarding/signup/volunteer');
  };

  const handleOrganizationClick = () => {
    switchAccountType('organization');
    router.push('/onboarding/signup/org');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full relative p-4 mx-auto">
      {/* Main Content - centered */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-[700] text-center mb-2">
          Welcome
        </h1>
        <p className="text-sm sm:text-base text-[#000000] text-center mb-8">
          Please select the category that aligns with your goals
        </p>

        {/* User Type Cards - uniform width, 2 columns on ≥320px, wraps only on <320px */}
        <div className="flex flex-row flex-wrap justify-center items-center gap-4 w-full">
          {userType.map((user, index) => (
            <div
              key={index}
              className="cursor-pointer"
              onClick={index === 0 ? handleVolunteerClick : handleOrganizationClick}
            >
              <UserTypeCard>
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-[90px] xl:h-[90px] mb-2">
                  <Image
                    src={user.img}
                    fill
                    sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, (max-width: 1024px) 96px, (max-width: 1280px) 112px, 90px"
                    style={{ objectFit: "contain", objectPosition: "center" }}
                    alt={user.alt}
                  />
                </div>
                <h2 className={styleItem}>{user.text}</h2>
              </UserTypeCard>
            </div>
          ))}
        </div>

        <p className="pt-[20px] text-sm sm:text-[16px] text-center">
          Already have an account?{" "}
          <span className="text-primary font-[700]">
            <Link href="/login">Sign In</Link>
          </span>
        </p>
      </div>

      {/* Illustration - fixed at bottom center */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-0 w-full max-w-[446px] flex justify-center">
        <Image
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

export default Page;
