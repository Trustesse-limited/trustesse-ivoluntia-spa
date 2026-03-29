import { BRAND_NAME } from '../../../../constants';
import React from 'react'



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
      {children}
    </div>
  );
}