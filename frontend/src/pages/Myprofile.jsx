import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext';
import {assets} from '../assets/assets'
import axios from 'axios';
import { toast } from 'react-toastify';

const Myprofile = () => {

  const {userData,setUserData,token,backendUrl,loadUserProfileData} = useContext(AppContext)

  const [isEdit,setisEdit] = useState(false)
  const [image,setImage] = useState(false)

  const updateUserProfileData = async()=>{
    try {
      const formData = new FormData() 
      formData.append('name',userData.name)
      formData.append('phone',userData.phone)
      formData.append('address',JSON.stringify(userData.address))
      formData.append('gender',userData.gender)
      formData.append('dob',userData.dob)
      //here image will come not userData.image because the current state of the userData.image updated or not is stored in the image state
      image && formData.append('image',image)

      const {data} = await axios.post(backendUrl+'/api/user/update-profile',formData,{headers:{token}})

      if(data.success){
        toast.success(data.message)
        await loadUserProfileData()
        setisEdit(false)
        setImage(false)
      }
      else{
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  //if userData is available then only this page is visible
  return userData && (  

  <div className="max-w-md flex flex-col gap-1 text-sm">

    {
      isEdit 
      ?<label htmlFor="image">
        <div className='inline-block relative cursor-pointer'>
          <img className='w-36 rounded opacity-75' src={image ? URL.createObjectURL(image) : userData.image} alt="" />
          <img className='w-10 absolute bottom-12 right-12' src={image ? '' : assets.upload_icon} alt="" />
        </div>
        <input onChange={(e)=>setImage(e.target.files[0])} type="file" id='image' hidden />
        
      </label>
      :<img className='w-36 rounded' src={userData.image} />

    }

    {isEdit ? (
      <input
        className="bg-gray-50 font-medium text-2xl max-w-full mt-2"
        type="text"
        value={userData.name}
        onChange={(e) =>
          setUserData((prev) => ({ ...prev, name: e.target.value }))
        }
      />
    ) : (
      <p className="font-medium text-2xl text-neutral-800 mt-2">{userData.name}</p>
    )}
    <hr className="bg-zinc-400 border-none h-[1px] mt-2" />

    <div className="mt-2">
      <p className="text-neutral-500 underline">CONTACT INFORMATION</p>
      <div className="grid grid-cols-[1fr_2fr] gap-y-1 mt-2 text-neutral-700">
        <p className="font-medium">Email:</p>
        <p className="text-blue-500">{userData.email}</p>
        <p className="font-medium">Phone:</p>
        {isEdit ? (
          <input
            className="bg-gray-100 w-full"
            type="text"
            value={userData.phone}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, phone: e.target.value }))
            }
          />
        ) : (
          <p className="text-blue-400">{userData.phone}</p>
        )}
        <p className="font-medium">Address:</p>
        {isEdit ? (
          <div className="space-y-1">
            <input
              className="bg-gray-50 w-full"
              value={userData.address.line1}
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  address: { ...prev.address, line1: e.target.value },
                }))
              }
              type="text"
            />
            <input
              className="bg-gray-50 w-full"
              value={userData.address.line2}
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  address: { ...prev.address, line2: e.target.value },
                }))
              }
              type="text"
            />
          </div>
        ) : (
          <p className="text-gray-500">
            {userData.address.line1}
            <br />
            {userData.address.line2}
          </p>
        )}
      </div>
    </div>

    <div className="mt-3">
      <p className="text-neutral-500 underline">BASIC INFORMATION</p>
      <div className="grid grid-cols-[1fr_2fr] gap-y-1 mt-2 text-neutral-700">
        <p className="font-medium">Gender:</p>
        {isEdit ? (
          <select
            className="bg-gray-100 w-full"
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, gender: e.target.value }))
            }
            value={userData.gender}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        ) : (
          <p className="text-gray-400">{userData.gender}</p>
        )}
        <p className="font-medium">Birthday:</p>
        {isEdit ? (
          <input
            className="bg-gray-100 w-full"
            type="date"
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, dob: e.target.value }))
            }
            value={userData.dob}
          />
        ) : (
          <p className="text-gray-400">{userData.dob}</p>
        )}
      </div>
    </div>

    <div className="mt-6 flex justify-center">
      {isEdit ? (
        <button
          className="border border-primary px-6 py-1 rounded-full hover:bg-primary hover:text-white transition-all"
          onClick={updateUserProfileData}
        >
          Save
        </button>
      ) : (
        <button
          className="border border-primary px-6 py-1 rounded-full hover:bg-primary hover:text-white transition-all"
          onClick={() => setisEdit(true)}
        >
          Edit
        </button>
      )}
    </div>
  </div>

  )
}

export default Myprofile