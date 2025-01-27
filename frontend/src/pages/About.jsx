import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>
      
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>ABOUT <span className='text-gray-700 font-medium'>US</span></p>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p>At MediCare, we are dedicated to revolutionizing the way you manage your health. Our platform is designed to simplify the process of finding and booking appointments with healthcare professionals, ensuring you get the care you need when you need it. With MediCare, you can explore a comprehensive directory of trusted doctors, clinics, and specialists across a wide range of medical fields. </p>
          <p>At MediCare, your health is our priority. Our team is committed to enhancing the patient experience by leveraging the latest technology and prioritizing security and privacy. We believe in empowering individuals to take control of their health journeys, making healthcare more accessible and stress-free.</p>
          <b className='text-gray-800'>OUR VISION</b>
          <p>
          Our vision at MediCare is to create a world where accessing healthcare is efficient, and stress-free. We aim to empower individuals by connecting them seamlessly with trusted healthcare professionals, fostering a platform that prioritizes convenience, transparency, and quality care for all.</p>
        </div>
      </div>

      <div className='text-xl my-4'>
        <p>
          WHY <span className='text-gray-700 font-semibold'>CHOOSE US</span>
        </p>
      </div>

      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-8 md:px-10 py-6 sm:py-8 flex flex-col gap-3 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer h-auto'>
          <b>Efficiency:</b>
          <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
        </div>
        <div className='border px-8 md:px-10 py-6 sm:py-8 flex flex-col gap-3 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer h-auto'>
          <b>Convenience:</b>
          <p>Access to a network of trusted healthCare professionals in your area.</p>
        </div>
        <div className='border px-8 md:px-10 py-6 sm:py-8 flex flex-col gap-3 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer h-auto'>
          <b>Personalization:</b>
          <p>Tailored recommendations and reminders to help stay on top of your health.</p>
        </div>
      </div>


    </div>
  )
}

export default About