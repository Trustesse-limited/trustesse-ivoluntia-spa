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
    <div className="p-4">
      <h1 className="md:text-5xl text-4xl font-[700] pt-[130px] sm:pt-[100px] text-center">
        Welcome
      </h1>
      <p className="pt-[6px] max-sm:mb-8 sm:text-[16px] text-[#000000] text-[14px] text-center">
        Please select the category that aligns with your goals
      </p>
      <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-[22px] px-4 sm:px-6 md:px-8 lg:px-12">
        {userType.map((user, index) => (
          <div key={index} className="flex-shrink-0 cursor-pointer" onClick={index === 0 ? handleVolunteerClick : handleOrganizationClick}>
            <UserTypeCard>
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-[90px] xl:h-[90px] sm:mb-4">
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
      <p className="pt-[30px] text-[16px] text-center sm:px-4">
        Already have an account?{" "}
        <span className="text-primary font-[700]">
          <Link href="/login">Sign In</Link>
        </span>
      </p>
      <Image
        src="/user.svg"
        alt="illustration-svg"
        width={446}
        height={223}
        className="absolute bottom-0 z-[-1]"
      />
    </div>
  );
};

export default Page;
