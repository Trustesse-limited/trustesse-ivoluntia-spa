import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface SocialIcon {
    img: string;
    alt: string;
    link: string;
}

interface SocialLoginProps {
    icons: SocialIcon[];
}

const SocialLogin = ({icons}:SocialLoginProps) => {
  return (
    
      <div className='flex  gap-5 mt-4 mb-8 justify-center align-center'>
        {icons.map((icon, index) => (
          <Link href={icon.link} key={index}>
            <Image src={icon.img} alt={icon.alt} width={60} height={60} className='cursor-pointer' />
          </Link>
        ))}
      </div>
  )
}

export default SocialLogin