import validator from "validator"
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from "../models/doctorModel.js"
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"
import userModel from "../models/userModel.js"

//api for adding doctor
const addDoctor = async(req,res)=>{

    try{
        const {name,email,password,speciality,degree,fees,experience,about,address} = req.body
        const imageFile = req.file  

        // console.log({imageFile})

        //checking if all the fields to add doctor
        if(!name || !email || !password || !degree || !speciality || !fees || !experience || !about || !address){
            return res.json({success:false,message:'Missing Details'})
        }

        // //if data not missing then validating the email format
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Incorrect Email Format"})
        }

        // //validating the password
        if(password.length < 8)return res.json({success:false,message:"Please Enter a Strong Password"})

        //now encrypting the password using bcrypt.js

        //hashing doctor password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        //upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})
        const imageUrl = imageUpload.secure_url      //this is cloudinary image url


        //now adding all the information to the db
        const doctorData = {
            name,
            email,
            image:imageUrl,
            password,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address),
            date:Date.now()
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save();
        res.json({success:true,message:"New Doctor Added!"})
    }
    catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//api for the admin login

const loginAdmin = async(req,res)=>{

    try{
        //matching the email id and password for the admin
        const {email,password} = req.body;
        if(email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success:true,token})
        }
        else{
            res.json({success:false,message:"Invalid Credentials"})
        }

    }catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//api to get all doctors list for admin panel
const allDoctors = async(req,res) =>{

    try {
        const doctors = await doctorModel.find({}).select('-password')   ///for removing the password properties from the doctors database so that all other info can be shown 
        res.json({success:true,doctors})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//api to get all appointments list 
const appointmentAdmin = async(req,res)=>{
    try {
        const appointments = await appointmentModel.find({})
        res.json({success:true,appointments})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// api for appointment cancellation
const appointmentCancel = async (req,res) => {
    try {

        //taken from the frontend
        const {appointmentId} = req.body

        //taken from the db of appointment
        const appointmentData = await appointmentModel.findById(appointmentId)

        //making changes in the database
        await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})

        //***if the appointment is cancelled then that slot time is available***
        const {docId,slotDate,slotTime} = appointmentData
        const doctorData = await doctorModel.findById(docId)
        let slots_booked = doctorData.slots_booked          //bcoz let can be redefined
        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e!==slotTime)
        await doctorModel.findByIdAndUpdate(docId,{slots_booked})
        res.json({success:true,message:'Appointment cancelled'})


    } catch (error) {
        console.error(error)
        res.json({success:false,message:error.message})
    }
}

//api to get the dashboard data for admin panel
const adminDashboard = async (req,res) => {
    try {
        
        //we'll use total users and total appointments with latest five appointments
        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData = {
            doctors:doctors.length,
            appointments:appointments.length,
            patients:users.length,
            latestAppointments:appointments.reverse().slice(0,5)       //in order to get the latest 5 appointments
        }

        res.json({success:true,dashData})

    } catch (error) {
        console.error(error)
        res.json({success:false,message:error.message})
    }
}

export {addDoctor,loginAdmin,allDoctors,appointmentAdmin,appointmentCancel,adminDashboard}