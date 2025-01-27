import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
  return (
    <div className='flex flex-col md:flex-row flex-wrap bg-primary rounded-lg px-5 md:px-10 lg:px-10 h-30'>
        {/* lets add the left side part for the text and the button */}
        <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-5 m-auto md:py-[8vw] md:mb-[-30px]'>
            <p className='text-3xl md:text-3xl lg:text-4xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight'>
                Book Appointment <br/> With Trusted Doctors
            </p>
            <div className='flex flex-col md:flex-row items-center gap-2 text-white text-sm font-light'>
                <img className='w-20' src={assets.group_profiles} alt="" />
                <p className='text-xs text-white'>Simply Browse through our extensive List of complete Doctors , <br className='hidden sm:block'/> schedule your appointment hassle-free.</p>
            </div>
            <a href='#speciality' className='flex items-center gap-2 bg-white px-8 py-3 m-auto rounded-full text-gray-600 text-sm md:m-0 hover:scale-105 transition-all duration-300'>Book Appointment
                <img className='w-3' src={assets.arrow_icon} alt="" />
            </a>

        </div>

        {/* lets add the right side image for the header section */}

        <div className='md:w-1/2 relative'>
            <img className='w-full md:absolute bottom-0 h-auto rounded-lg' src={assets.header_img} alt="" />
        </div>


    </div>
  )
}

export default Header