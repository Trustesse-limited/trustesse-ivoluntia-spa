'use client'

import React from 'react'
import OtpInput from './OtpComponent'
import Button from '@/components/button'
import Image from 'next/image'


const page = () => {
 const handleOtpChange = (otp: string) => {
    console.log("OTP value:", otp);
  };
  return (
    <>
    <div className='flex flex-col justify-start mt-46 items-center w-75 sm:w-116 h-auto'>
        <h1 className='text-3xl text-center font-medium'>Verify email</h1>
        <p className='text-sm text-[#424242] text-center pt-3'>We sent an OTP code to A**********@gmail.com Please enter it below to continue</p>
     
        <OtpInput length={6}  onChangeOtp={handleOtpChange} />
           <div className='md:w-100 w-70 flex flex-col justify-center mt-9'>
          <Button text='Verify'  />
          </div>
        <p className='text-sm font-light text-center pt-4 '>Yet to receive? <span className='font-medium text-[#319F43] cursor-pointer '>Resend OTP</span></p>
      
    </div>
      <Image src='/bgframe.svg' alt='bgframe' width={1000} height={219}  className=' fixed bottom-0 sm:block hidden z-[-1]'/>
      </>
  )
}

export default page