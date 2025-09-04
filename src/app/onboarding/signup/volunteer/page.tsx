'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { InputComponent } from "@/components/input";
import { Checkbox } from "@/components/ui/checkbox"

const OrganisationPage = () => {

  //for the social icons login
  const socialIcons = [
    { img: '/google.svg', alt: 'google-svg', link: '/' },
    { img: '/apple.svg', alt: 'apple-svg', link: '/' },
    { img: '/fb.svg', alt: 'facebook-svg', link: '/' }
  ]

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", form);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <>
      <h1 className='md:text-[32px] pt-8 text-2xl text-center font-medium'>
        Create a Volunteer account
      </h1>
      <p className='text-center'>Join Us and start volunteering</p>

      <form onSubmit={handleSubmit} className='md:w-119 w-70 flex flex-col gap-[24px] mt-9'>
        <InputComponent
          label="Email"
          placeholder="Enter your email address"
          name="email"
          htmlFor="email"
          type="email"
          onChange={handleChange}  
          value={form.email}
        />
        <InputComponent
          label="Password"
          placeholder="Enter password"
          name="password"
          htmlFor="password"
          type="password"
          onChange={handleChange}
          value={form.password}
        />
        <InputComponent
          label="Confirm Password"
          placeholder="Confirm Password"
          name="confirmPassword"
          htmlFor="confirmPassword"
          type="password"
          onChange={handleChange}
          value={form.confirmPassword}
        />

        <div className="flex items-center space-x-2">
          <Checkbox id='terms' className='rounded-full border-black' />
          <label htmlFor="terms" className="text-sm">
            I agree to the <span className='text-[#163752]'><Link href='/'>Terms & Conditions</Link></span>
          </label>
        </div>

        <button
          type='submit'
          className='bg-[#0E68DC] text-white rounded-2xl py-4 font-[600] md:text-2xl text-xl cursor-pointer'
        >
          Sign up
        </button>
      </form>

      <div className="flex items-center md:w-115 w-70 mt-4">
        <div className="flex-grow border-t-2 border-black"></div>
        <span className="mx-3 text-black font-medium">Or use</span>
        <div className="flex-grow border-t-2 border-black"></div>
      </div>

      <div className='flex  gap-5 mt-4 mb-8 justify-center align-center'>
        {socialIcons.map((icons, index) => (
          <Link href={icons.link} key={index}>
            <Image src={icons.img} alt={icons.alt} width={60} height={60} className='cursor-pointer' />
          </Link>
        ))}
      </div>

      <p className='pt-2 pb-3 text-center'>
        Registered already? <span className='cursor-pointer text-[#2C6EA3] pl-1.5 font-medium'>Sign In</span>
      </p>

      <Image src='/pep.svg' alt='pep-svg'  width={1000} height={177} className='fixed bottom-0 z-[-1] sm:block hidden' />
    </>
  )
}

export default OrganisationPage
