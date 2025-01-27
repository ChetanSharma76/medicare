import React from 'react'
import Appointment from '../pages/Appointment'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Banner = () => {
    const navigate = useNavigate();
  return (
    <div className='flex bg-primary rounded-lg px-5 sm:px-9 md:px-12 lg:px-10 my-20 md:mx-8'>
        {/* code for the left side for button and divs */}
        <div className='flex-1 py-6 sm:py-8 md:py-14 lg:py-20 lg:pl-5'>
            <div className='text-xl sm:text-xl  md:text-3xl lg:text-4xl font-semibold text-white'>
                <p> Book Appointment</p>
                <p className='mt-3 text-amber-300 text-3xl'>With 100+ Trusted Doctors</p>
            </div>
            <button onClick={()=>{navigate('/login');scrollTo(0,0)}} className='bg-white text-sm sm:text-base text-gray-600 px-8 py-3 rounded-full mt-6 hover:scale-105 transition-all '>Create Account</button>
        </div>

        {/* code for the right side for button and divs */}
        <div className='hidden md:block md:w-1/2 lg:w-[350px] relative'>
            <img className='w-full absolute bottom-0 right-0 max-w-md' src={assets.appointment_img} alt="" />
        </div>

    </div>
  )
}

export default Banner