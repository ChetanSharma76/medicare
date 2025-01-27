import React, { useContext, useState } from 'react';
import { assets } from '../../assets/assets';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const AddDoctor = () => {

  const [docImg,setDocImg]=useState(false)
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [experience,setExperience]=useState('1 Year')
  const [fees,setFees]=useState('')
  const [about,setAbout]=useState('')
  const [speciality,setSpeciality]=useState('General physician')
  const [degree,setDegree]=useState('')
  const [address1,setAddress1]=useState('')
  const [address2,setAddress2]=useState('')

  const {backendUrl,aToken}=useContext(AdminContext)
  const onSubmitHandler = async(event) =>{
    event.preventDefault()

    try{
      if(!docImg)return toast.error('Image Not Selected')

      //creating a new array for storing the formdata
      const formData = new FormData()
      formData.append('image',docImg)
      formData.append('name',name)
      formData.append('email',email)
      formData.append('password',password)
      formData.append('experience',experience)
      formData.append('fees',Number(fees))
      formData.append('about',about)
      formData.append('speciality',speciality)
      formData.append('degree',degree)
      formData.append('address',JSON.stringify({line1:address1,line2:address2}))

      //console log form data
      formData.forEach((value,key) => {
        console.log(`${key}:${value}`)
      });

      //now adding the formdata in the db
      const {data} = await axios.post(backendUrl+'/api/admin/add-doctor',formData,{headers:{aToken}})

      if(data.success){
        toast.success(data.message)
        setDocImg(false)
        setName('')
        setEmail('')
        setPassword('')
        setAddress1('')
        setAddress2('')
        setFees('')
        setDegree('')
        setAbout('')

      }
      else toast.error(data.message)

    }catch(error){
      toast.error(error.message)
      console.log(error.message)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='m-5 w-full'>
      <p className='mb-3 text-lg font-medium'>Add Doctor</p>
      <div className='bg-white px-6 py-6 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
        <div className='flex items-center gap-3 mb-6 text-gray-500'>
          <label htmlFor="doc-img">
            <img className='w-14 bg-gray-100 rounded-full cursor-pointer' src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="" />
          </label>
          <input onChange={(e)=>setDocImg(e.target.files[0])} type="file" id='doc-img' hidden />
          <p>Upload Doctor <br /> Picture</p>
        </div>
        <div className='flex flex-col lg:flex-row items-start gap-8 text-gray-600'>
          <div className='w-full lg:flex-1 flex flex-col gap-4'>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Doctor Name</p>
              <input onChange={(e)=>setName(e.target.value)} value={name} className='border rounded px-2 py-1 text-sm' type="text" placeholder='Name' required />
            </div>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Doctor Email</p>
              <input onChange={(e)=>setEmail(e.target.value)} value={email} className='border rounded px-2 py-1 text-sm' type="email" placeholder='Email' required />
            </div>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Doctor Password</p>
              <input onChange={(e)=>setPassword(e.target.value)} value={password} className='border rounded px-2 py-1 text-sm' type="password" placeholder='Password' required />
            </div>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Experience</p>
              <select onChange={(e)=>setExperience(e.target.value)} value={experience}  className='border rounded px-2 py-1 text-sm' name="" id="">
                <option value="1">1 Year</option>
                <option value="2">2 Year</option>
                <option value="3">3 Year</option>
                <option value="4">4 Year</option>
                <option value="5">5 Year</option>
                <option value="6">6 Year</option>
                <option value="7">7 Year</option>
                <option value="8">8 Year</option>
                <option value="9">9 Year</option>
                <option value="10">10 Year</option>
              </select>
            </div>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Fees</p>
              <input onChange={(e)=>setFees(e.target.value)} value={fees} className='border rounded px-2 py-1 text-sm' type="number" placeholder='Fees' required />
            </div>
          </div>
          <div className='w-full lg:flex-1 flex flex-col gap-4'>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Speciality</p>
              <select onChange={(e)=>setSpeciality(e.target.value)} value={speciality}  className='border rounded px-2 py-1 text-sm' name="" id="">
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Education</p>
              <input onChange={(e)=>setDegree(e.target.value)} value={degree}  className='border rounded px-2 py-1 text-sm' type="text" placeholder='Education' required />
            </div>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Address</p>
              <input onChange={(e)=>setAddress1(e.target.value)} value={address1} className='border rounded px-2 py-1 text-sm' type="text" placeholder='Address1' required />
              <input onChange={(e)=>setAddress2(e.target.value)} value={address2} className='border rounded px-2 py-1 text-sm' type="text" placeholder='Address2' required />
            </div>
            <div>
              <p className='mt-3 mb-2'>About Doctor</p>
              <textarea onChange={(e)=>setAbout(e.target.value)} value={about} className='w-full px-3 pt-1 text-sm border rounded' type="text" placeholder='Write about doctor...' rows={4} required />
            </div>
          </div>
        </div>
        <button type='submit' className='bg-primary w-32 py-2 mt-6 text-white rounded-full mx-auto block text-center'>Add Doctor</button>
      </div>
    </form>
  );
};

export default AddDoctor;
