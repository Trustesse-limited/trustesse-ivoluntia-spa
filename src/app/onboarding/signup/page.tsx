import React from 'react'
import UserTypeCard from './components/UserTypeCardProps'
import Image from 'next/image'
import Link from 'next/link'


//usertypecard details
const userType = [
    {'text':'Volunteer', 'img':'/Man.svg', 'alt':'Volunteer' , 'link':'/onboarding/signup/volunteer'},
    {'text':'Organisation', 'img':'/People.svg', 'alt':'Organisation', 'link':'/onboarding/signup/org'}
]

//for the styling of the volunteer and org text
 const styleItem = 'sm:text-[32px]  font-[400] text-[#ODODOD]]'

const page = () => {
  return (
   <>
        <h1 className='md:text-6xl  text-4xl font-[700] pt-[130px] sm:pt-[100px] text-center'>Welcome</h1>
        <p className='pt-[6px] sm:text-[20px] text-[13px] text-center'>Please select the category that aligns with your goals</p>
        <div className='flex gap-[22px] '>
        
    {userType.map((user,index)=>(
      <Link href={user.link} key={index}>
        <UserTypeCard  key={index}>
          <Image src={user.img} width={70}  height={70} className='md:w-[120px] md:h-[120px] sm:w-[100px] sm:h-[100px]' alt={user.alt}/>
          <h2 className={styleItem}>{user.text}</h2>
          </UserTypeCard>
        </Link>
    ))}
   
            </div>
        <p className='pt-[30px] text-[16px]'>Already have an account? <span className='text-primary font-[700]' ><Link href='/login'>Sign In</Link></span></p>
        <Image src='/user.svg' alt='illustration-svg' width={446} height={223} className='fixed bottom-0 z-[-1] sm:block hidden' />
   </>
  )
}

export default page