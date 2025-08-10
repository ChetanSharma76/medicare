import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();

  const { doctors } = useContext(AppContext);

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  return (
    <div>
      <p className="text-gray-600">Browse through all the doctors specialist.</p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        {/* Filters Button for Mobile */}
        <button
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
            showFilter ? 'bg-primary text-white' : ''
          }`}
          onClick={() => setShowFilter(prev => !prev)}
        >
          Filters
        </button>

        {/* Filters List */}
        <div
          className={`flex-col gap-4 text-sm text-gray-600 ${
            showFilter ? 'flex' : 'hidden sm:flex'
          }`}
        >
          {[
            'General physician',
            'Gynecologist',
            'Dermatologist',
            'Pediatricians',
            'Neurologist',
            'Gastroenterologist'
          ].map(s => (
            <p
              key={s}
              onClick={() =>
                speciality === s
                  ? navigate('/doctors')
                  : navigate(`/doctors/${s}`)
              }
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
                speciality === s ? 'bg-indigo-100 text-black' : ''
              }`}
            >
              {s}
            </p>
          ))}
        </div>

        {/* Doctors Grid */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterDoc.map((item, index) => (
            <div
              onClick={() => navigate(`/appointment/${item._id}`)}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer shadow-blue hover:translate-y-[-10px] transition-all duration-500"
              key={index}
            >
              <img
                className="bg-blue-50 w-full h-48 object-contain sm:h-56"
                src={item.image}
                alt={item.name}
              />
              <div className="p-3">
                <div
                  className={`flex items-center gap-2 text-sm ${
                    item.available ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  <p
                    className={`w-2 h-2 ${
                      item.available ? 'bg-green-500' : 'bg-gray-500'
                    } rounded-full`}
                  ></p>
                  <p>{item.available ? 'available' : 'unavailable'}</p>
                </div>
                <p className="text-gray-900 font-medium text-lg">
                  {item.name}
                </p>
                <p className="text-gray-600 text-sm">{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
