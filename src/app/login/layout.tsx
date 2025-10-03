import React from 'react'
import { BRAND_NAME } from '../data';

export const metadata = {
  title: `${BRAND_NAME} | Login`,
  description: `${BRAND_NAME} login page`,
};


export default function loginLayout({
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