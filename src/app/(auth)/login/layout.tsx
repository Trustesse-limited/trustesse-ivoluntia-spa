import React from 'react'
import { BRAND_NAME } from '../../../../constants';

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
    <div className='w-full'>
      {children}
    </div>
  );
}
