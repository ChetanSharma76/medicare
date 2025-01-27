import doctorModel from "../models/doctorModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"

const changeAvailability = async(req,res)=>{

    try {

        const {docId} = req.body
        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId,{available:!docData.available})
        res.json({success:true,message:'Availablity Changed!'})
          
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//function in order to get the doctors list
const doctorList = async(req,res) => {

    //select is used to select the desired data based on some condition
    try {
        const doctors = await doctorModel.find({}).select(['-password','-email'])
        res.json({success:true,doctors})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}


//api to login doctor
const loginDoctor = async (req,res) => {
    try {
        
        const {email,password} = req.body
        // console.log(password)
        const doctor = await doctorModel.findOne({email})
        if(!doctor)return res.json({success:false,message:'Invalid credentials!'})
        // console.log(doctor.password)
        const isMatch = (password===doctor.password)
        // console.log(isMatch)
        //if the password got matched then just create token for the doctor and send it to the frontend
        if(isMatch){
            const token = jwt.sign({id:doctor._id},process.env.JWT_SECRET)
            res.json({success:true,token})
        }
        else{
            res.json({success:false,message:'Incorrect password!'})
        }


    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//api to get all the appointments for the doctor panel
const appointmentsDoctor = async (req,res) => {
    
    try {
        
        const {docId} = req.body
        //getting all the appointments of a doctor in appointments array
        const appointments = await appointmentModel.find({docId})

        res.json({success:true,appointments})


    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//api to make appointment completed for doctor panel
const appointmentComplete = async(req,res)=>{
    try {
        const{docId,appointmentId} = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)
        if(appointmentData && appointmentData.docId === docId){

            await appointmentModel.findByIdAndUpdate(appointmentId,{isCompleted:true})
            return res.json({success:true,message:'Appointment completed'})
        }
        else{
            return res.json({success:false,message:'Mark failed'})
        }

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}


//api to cancel appointment for doctor panel
const appointmentCancel = async(req,res)=>{
    try {
        const{docId,appointmentId} = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)
        if(appointmentData && appointmentData.docId === docId){

            await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
            return res.json({success:true,message:'Appointment cancelled'})
        }
        else{
            return res.json({success:false,message:'Cancellation failed'})
        }

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//api to get the doctor profile for doctor panel
const doctorProfile = async (req,res) => {
    
    try {
        
        const {docId} = req.body
        const profileData = await doctorModel.findById(docId).select('-password')
        res.json({success:true,profileData})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//api to update doctor profile data from doctor panel
const updateDoctorProfile = async (req,res) => {
    try {
        const {docId,fees,address,available} = req.body

        await doctorModel.findByIdAndUpdate(docId,{fees,address,available})

        res.json({success:true,message:'Profile updated'})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

export {changeAvailability,doctorList,loginDoctor,
    appointmentsDoctor,appointmentCancel,appointmentComplete,doctorProfile,updateDoctorProfile}