import { BRAND_NAME } from '../../../../constants';
import React from 'react';
import BackButton from '@/components/BackButton';



export const metadata = {
  title: `${BRAND_NAME} | Signup`,
  description: `${BRAND_NAME}  signup page`,
};


export default function onboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='max-w-[1538px] font-openSans min-h-screen flex flex-col justify-start items-center relative  px-2  w-[100%]'>
       <div className="flex w-full items-center justify-start p-4 sm:p-6 md:p-8">
                <BackButton />
                </div>
      {children}
    </div>
  );
}