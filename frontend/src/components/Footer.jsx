import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            {/* left section */}
            <div>
                <img className='mb-5 w-40' src={assets.logo} alt="" />
                <p className='w-full md:w-2/3 text-gray-600 leading-5'>Whether you're exploring Medicare plans, looking for top healthcare providers, or seeking expert guidance on your healthcare journey, we are here to help.</p>
            </div>

            {/* center section */}
            <div>
                <p className='text-xl font-medium mb-4'>COMPANY</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>Home</li>
                    <li>About Us</li>
                    <li>Contact Us</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>

            {/* right section */}
            <div>
                <p className='text-xl font-medium mb-4'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>+1-121-144-5760</li>
                    <li>medicareatservice@gmail.com</li>
                </ul>
            </div>

        </div>

        {/* Copyright text */}
        <div>
            <hr /> 
            <p className='py-3 text-sm mr-8 text-center'>Copyright @2024 Medicare - All Rights Reserved.</p>
        </div>
    </div>
  )
}

export default Footer