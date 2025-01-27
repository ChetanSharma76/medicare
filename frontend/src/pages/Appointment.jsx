import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import { RelatedDoctors } from '../components/RelatedDoctors'
import axios from 'axios';
import { toast } from 'react-toastify';

const Appointment = () => {

  const {docId} = useParams();
  const {doctors,currencySymbol,backendUrl,token,getDoctorsData} = useContext(AppContext);
  const daysOfWeek = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

  const [docInfo,setDocInfo] = useState(null);
  const [docSlots,setDocSlots] = useState([]);
  const [slotIndex,setSlotIndex] = useState(0);
  const [slotTime,setSlotTime] = useState("");
  const navigate = useNavigate()

  const fetchDocInfo = async () =>{

    const docInfo =  doctors.find(doc=> doc._id === docId);
    setDocInfo(docInfo);
    console.log(docInfo);
  }

  const getAvailableSlots = async () => {
    setDocSlots([]); // Clear existing slots
    let today = new Date();
  
    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
  
      let endTime = new Date(today);
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0); // End time is 9:00 PM
  
      if (i === 0) {
        // If processing today, check if the time is past 9:30 PM
        let now = new Date();
        if (now >= endTime) {
          continue; // Skip today's block if no slots are available
        }
  
        // Ensure starting time for today
        if (now.getMinutes() > 30) {
          currentDate.setHours(now.getHours() + 1);
          currentDate.setMinutes(0);
        } else {
          currentDate.setMinutes(30);
        }
  
        // Ensure start time is at least 10:00 AM
        if (currentDate.getHours() < 10) {
          currentDate.setHours(10);
          currentDate.setMinutes(0);
        }
      } else {
        // For future dates, start at 10:00 AM
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }
  
      let timeSlots = [];
      while (currentDate < endTime) {

        let day = currentDate.getDate()
        let month = currentDate.getMonth()+1
        let year = currentDate.getFullYear()

        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const slotDate = day+"_"+month+"_"+year 
        const slotTime = formattedTime

        const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true

        if(isSlotAvailable){

          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
          
        }
  
        currentDate.setMinutes(currentDate.getMinutes() + 30); // Increment by 30 minutes
      }
  
      // Add the time slots for this day to the main array
      if (timeSlots.length > 0) {
        setDocSlots((prev) => [...prev, timeSlots]);
      }
    }
  }

  const bookAppointment = async() => {
    if(!token){
      toast.warn({message:'Login to Book Appointment'})
      //sending the user to the login page
      navigate('/login')
    }
    try {
      const date = docSlots[slotIndex][0].datetime
      
      let day = date.getDate()
      let month = date.getMonth()+1              //in order to get the index 1 for january
      let year = date.getFullYear() 

      const slotDate = day+"_"+month+"_"+year

      const {data} = await axios.post(backendUrl+'/api/user/book-appointment',{docId,slotDate,slotTime},{headers:{token}})
      if(data.success){
        toast.success(data.message)
        getDoctorsData()
        navigate('/my-appointments')
      }
      else{
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }
  

  useEffect(()=>{
    fetchDocInfo();
  },[doctors,docId])

  useEffect(()=>{
    getAvailableSlots();
  },[docInfo])

  useEffect(()=>{

  },[docSlots])


  return docInfo && (
    <div>
      {/* ------------Doctor Details---------------- */}

      <div className='flex flex-col sm:flex-row gap-4'>
        <div className="h-40 sm:h-60">
          <img className="h-full w-full object-cover sm:max-w-72 rounded-lg bg-primary" src={docInfo.image} alt="" />
        </div>
        <div className='flex-1 h-40 sm:h-60 border border-gray-400 rounded-lg p-8 py-4 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0 '>
          {/* doc info like name , degree and experience */}
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>{docInfo.name} <img className='w-5' src={assets.verified_icon} alt="" /></p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
          </div>
          {/* {Here i am going to display doctors about section} */}
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>About <img src={assets.info_icon} alt="" /></p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>

          <p className='text-gray-500 font-medium mt-4'>
            Appointment Fee: <span className='text-gray-600 '>{currencySymbol}{docInfo.fees}</span>
          </p>
        </div>
      </div>

      {/* Booking Slots Details */}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking Slots</p>
        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {
            docSlots.length && docSlots.map((item,index)=>(

              <div onClick={()=>setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`} key={index}>

                <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                <p>{item[0] && item[0].datetime.getDate()}</p>

              </div>
            ))
          }
        </div>

        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {
            docSlots.length && docSlots[slotIndex].map((item,index)=>(

              <p onClick={()=>setSlotTime(item.time)} className={`text-sm font-light cursor-pointer flex-shrink-0 px-5 py-2 rounded-full ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`} key = {index}>
                {item.time.toLowerCase()}

              </p>
            ))
          }
        </div>

        <button onClick={bookAppointment} className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'>
          Book an Appointment
        </button>

      </div>

      {/* Listing related doctors */}
      <RelatedDoctors docId = {docId} speciality={docInfo.speciality} />

    </div>
  )
}

export default Appointment