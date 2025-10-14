'use client'
import React from 'react'
import DashboardLayout from '@/app/org/programs/DashboardLayout'
import ImageUpload from '@/app/org/programs/create/ImageUpload'
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiCast,
  FiStar,
  FiHelpCircle,
  FiSettings,
} from "react-icons/fi";
import { FaHandHoldingUsd } from "react-icons/fa"; 
import { MdWifiTethering } from "react-icons/md";

const navLinks = [
  {
    label: "Dashboard",
    href: "/org/dashboard",
    icon: <FiHome className="text-black" />,
  },
  {
    label: "Programs",
    href: "/org/programs",
    icon: <FiCalendar className="text-black" />,
  },
  {
    label: "Volunteers",
    href: "/org/volunteers",
    icon: <FiUsers className="text-black" />,
  },
  {
    label: "Donations",
    href: "/org/donations",
    icon: <FaHandHoldingUsd className="text-black" />,
  },
  {
    label: "Broadcast",
    href: "/org/broadcast",
    icon: <MdWifiTethering className="text-black" />,
  },
  {
    label: "Reviews",
    href: "/org/reviews",
    icon: <FiStar className="text-black" />,
  },
  {
    label: "Help & Support",
    href: "/org/help",
    icon: <FiHelpCircle className="text-black" />,
  },
  {
    label: "Settings",
    href: "/org/settings",
    icon: <FiSettings className="text-black" />,
  },
];


const page = () => {
  return (
    <DashboardLayout  navLinks={navLinks}>
        <div className='bg-white h-full'>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">Create a Program</h1>
        <p className="text-lg font-semibold">Programs Details</p>
      </div>
      <form className=''>
        <div className='grid md:grid-cols-2 grid-cols-1 gap-15 px-6'>
        <div className='w-full '>
          <div className=''>
          <label htmlFor='program-title' className='mb-2 text-xs'>Program Title<span className='text-[#EF5350]'>*</span></label>
          <input className='w-full border-[2px] border-[#A0A0A0] rounded-md p-3 ' name='program-title' placeholder=''/>
          </div>
       
            <div className='my-4.5'>
          <label htmlFor='description' className='mb-2 text-xs'>Description<span className='text-[#EF5350]'>*</span></label>
          <textarea className='w-full border-[2px] border-[#A0A0A0] rounded-md p-2 ' name='description' rows={4} placeholder=''></textarea>
          </div>

          <ImageUpload/>

            </div>
        <div className="w-50%">
            <div className='grid md:grid-cols-2 grid-cols-1 gap-4'>
        <div className=''>
          <label htmlFor='start-date' className='mb-2 text-xs'>Start Date<span className='text-[#EF5350]'>*</span></label>
          <input type='date' className='w-full border-[2px] border-[#A0A0A0] rounded-md p-3 ' name='start-date'/>
          </div>
          <div className=''>
          <label htmlFor='end-date' className='mb-2 text-xs'>End Date<span className='text-[#EF5350]'>*</span></label>
          <input type='date' className='w-full border-[2px] border-[#A0A0A0] rounded-md p-3 ' name='end-date' />
          </div>
          <div className=''>
          <label htmlFor='location' className='mb-2 text-xs'>Location</label>
          <input type='text' className='w-full border-[2px] border-[#A0A0A0] rounded-md p-3 ' name='location' />
          </div>
          <div className='flex flex-col'>
          <label htmlFor='category' className='mb-2 text-xs'>Program Category</label>
          <select name='category' className='w-full border-[2px] border-[#A0A0A0] rounded-md p-3 '>
            <option value="">Select Category</option>
            <option value="education">Education</option>
            <option value="health">Health</option>  
          </select>
          </div>
          </div>
           <div className='mt-7'>
          <label htmlFor='donation' className='mb-2.5 text-xl font-semibold'>Donation Target (optional)</label>
          <input className='w-full border-[2px] border-[#A0A0A0] rounded-md p-3 ' name='donation'/>
          </div>
        </div>
        </div>
        <div className='flex justify-between items-start px-6 mt-6 mb-6 gap-15'>
             <div className='mt-7 w-[50%]'>
          <label htmlFor='goals' className='mb-2.5 text-xl font-semibold'>goals (optional)</label>
          <input className='w-full border-[2px] border-[#A0A0A0] rounded-md p-3 ' name='goals'/>
          <button className='bg-[#B3DBFB] py-2 px-4.5 rounded-sm mt-2.5'>Add Goal</button>
          </div>
           <div className='mt-7 w-[50%]'>
          <label htmlFor='skills' className='mb-2.5 text-xl font-semibold'>Skills Required (optional)</label>
          <input className='w-full border-[2px] border-[#A0A0A0] rounded-md p-3 ' name='skills'/>
          </div>
        </div>
      </form>
      </div>
    </DashboardLayout>
  )
}

export default page