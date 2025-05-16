import React, { useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const {backendUrl,token,setToken} = useContext(AppContext)
  const [state,setState] = useState('Sign Up');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [name,setName] = useState('');
  const navigate = useNavigate()

  const onSubmitHandler = async(event) => {    //it will not reload the page when form is submitted
    await event.preventDefault();                       //prevent the default nature of submitting the form that is reloading

    try {
      
      if(state==='Sign Up'){
        const data = await axios.post(backendUrl+'/api/user/register',{name,email,password});
        console.log(data)
        if(data.success){
          toast.success('Account Created Successfully')
          navigate('/')
        }
        else{
          toast.error(data.message)
        }
      }
      else{
        const {data} = await axios.post(backendUrl+'/api/user/login',{email,password});
        //if account is successfully created then we will get the token by the server and we have to save it in the local storage
        //saving token in local storage help to manage the user session
        if(data.success){
          localStorage.setItem('token',data.token)
          setToken(data.token)
        }
        else{
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.message)
    }
     
  }

  useEffect(()=>{
    if(token)navigate('/')
  },[token])



  return (
  <form onSubmit={onSubmitHandler} className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col gap-4 items-start p-6 w-[85%] max-w-[350px] border rounded-lg text-zinc-600 text-sm shadow-md bg-white">
      {/* To dynamically show the text login and signup based on the state variable value */}
      <p className="text-2xl font-semibold">{state === "Sign Up" ? "Create Account" : "Login"}</p>
      <p>Please {state === "Sign Up" ? "sign up" : "login"} to book an appointment</p>
      {state === 'Sign Up' ? <div className="w-full"><p>
          Full Name
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </p></div> : ''
      }
      <div className="w-full">
        <p>
          Email
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </p>
      </div>
      <div className="w-full">
        <p>
          Password
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </p>
      </div>
      <button type='submit' className="bg-primary text-white w-full py-2 rounded-md text-base">
        {state === "Sign Up" ? "Create Account" : "Login"}
      </button>
      {state === "Sign Up" ? (
        <p>
          Already have an account?{" "}
          <span onClick={()=>setState('Login')} className="text-primary underline cursor-pointer">Login Here</span>
        </p>
      ) : (
        <p>
          Create a new account?{" "}
          <span onClick={()=>setState('Sign Up')} className="text-primary underline cursor-pointer">Click here</span>
        </p>
      )}
    </div>
  </form>


  )
}

export default Login