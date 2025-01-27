import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors , changeAvailability } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  return (
    <div className='m-4 max-h-[80vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Doctors</h1>
      <div className='flex w-full flex-wrap gap-4 pt-4'>
        {doctors.map((item, index) => (
          <div
            className='border border-indigo-200 rounded-xl w-[18%] h-[250px] overflow-hidden cursor-pointer group'
            key={index}
          >
            {/* Increased image height */}
            <img
              className='bg-indigo-50 group-hover:bg-primary transition-all duration-500 w-full h-[180px] object-cover'
              src={item.image}
              alt=''
            />
            {/* Reduced information height */}
            <div className='p-2'>
              <p className='text-neutral-800 text-sm font-medium'>{item.name}</p>
              <p className='text-zinc-600 text-xs'>{item.speciality}</p>
              <div className='mt-1 flex items-center gap-1 text-xs'>
                <input onChange={()=>changeAvailability(item._id)} type='checkbox' checked={item.available} />
                <p>Available</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;
