import React,{useContext, useState} from 'react'
import {assets} from '../assets/assets'
import { NavLink,useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Navbar = () => {

    const navigate = useNavigate();

    // token is used to identify whether the user is loged in or not if the user is loged in then the token is true
    const [showMenu , setShowMenu] = useState(false);
    const {token,setToken,userData} = useContext(AppContext)

    //to create logout functionality
    const logout = () => {
        setToken(false)
        localStorage.removeItem('token')
    }

  return (
    <div className='flex items-center justify-between text-sm py-1 mb-5 border-b border-b-gray-400'>
        <img onClick={()=>navigate('/')} className='w-44 cursor-pointer ' src={assets.logo} alt="" />
        <ul className='hidden md:flex items-start gap-5 font-medium'>
            <NavLink to="/">
                <li className='py-1'>HOME</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
            </NavLink>
            <NavLink to="/doctors">
                <li className='py-1'>ALL DOCTORS</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
            </NavLink>
            <NavLink to="/about">
                <li className='py-1'>ABOUT</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
            </NavLink>
            <NavLink to="/contact">
                <li className='py-1'>CONTACT</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
            </NavLink>
        </ul>
        <div className='flex items-center gap-4'>
            {   
                //ternary operator to check if the user is losgged in or not if the user is not logged in then we'll show the create account button else its profile picture with drop down is shown
                token && userData
                ?<div className='flex items-center gap-2 cursor-pointer group relative'>
                    <img className='w-8 rounded-full' src={userData.image} alt="" />
                    <img className='w-2.5' src={assets.dropdown_icon} alt="" />
                    <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                        <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                            <p onClick={()=>navigate('/my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                            <p onClick={()=>navigate('/my-appointments')}className='hover:text-black cursor-pointer'>My Appointments</p>
                            <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
                        </div>
                    </div>
                </div>
                :<button onClick={()=>navigate('/login')} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'>Create Account</button>
            }
            <img onClick={()=>setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="" />
            {/* mobile menu */}
            <div className={` ${showMenu ? 'fixed w-full' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all `}>
                <div className='flex items-center justify-between px-5 py-6'>
                    <img className='w-36' src={assets.logo} alt="" /><img className='w-7' onClick={()=>setShowMenu(false)} src={assets.cross_icon} alt="" />
                </div>
                <ul className='flex flex-col gap-2 items-center mt-5 px-5 text-lg font-medium'>
                    <NavLink onClick={()=>setShowMenu(false)} to="/"><p className='px-4 py-2 rounded inline-block'>Home</p></NavLink>
                    <NavLink onClick={()=>setShowMenu(false)} to='/doctors'><p className='px-4 py-2 rounded inline-block'>All Doctors</p></NavLink>
                    <NavLink onClick={()=>setShowMenu(false)} to='/about'><p className='px-4 py-2 rounded inline-block'>About</p></NavLink>
                    <NavLink onClick={()=>setShowMenu(false)} to='/contact'><p className='px-4 py-2 rounded inline-block'>Contact Us</p></NavLink>
                </ul>
            </div>
            
            
        </div>
    </div>
  )
}

export default Navbar
