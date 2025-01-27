import { createContext, useEffect, useState} from "react";
import axios from 'axios'
import {toast} from 'react-toastify'

export const AppContext = createContext()

const AppContextProvider=(props)=>{

    const [doctors,setDoctors] = useState([])         //in order to store the doctors data from api call to backendUrl
    //we will check if the token is there in localstorage or not if it is then we will initialize the token with the same token so that the user session can be retained even if the page reloads
    const [token,setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false)               //whenever page reloads dom loads due to which states are intialized by their values
    const currencySymbol='$'
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [userData,setUserData] = useState(false)

    const getDoctorsData = async() => {

        try {
            
            const {data} = await axios.get(backendUrl+'/api/doctor/list')
            if(data.success){
                setDoctors(data.doctors);
            }
            else{
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const loadUserProfileData = async() => {
        try {
            const {data} = await axios.get(backendUrl+'/api/user/get-profile',{headers:{token}})
            if(data.success){
                setUserData(data.userData)
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const value = {

        doctors,getDoctorsData,
        currencySymbol,
        token,setToken,
        backendUrl,
        userData,
        setUserData,
        loadUserProfileData,
    }


    //this will be call each time when the window loads and doctor data is stored in the doctors state
    useEffect(()=>{
        getDoctorsData();
    },[])

    //this will be called every time token changes
    useEffect(()=>{
        if(token)loadUserProfileData()
        else setUserData(false)
    },[token])

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider 