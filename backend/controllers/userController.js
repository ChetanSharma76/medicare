import userModel from "../models/userModel.js"
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from "../models/doctorModel.js"
import appointmentModel from "../models/appointmentModel.js"
import razorpay from 'razorpay'

//function to create and register new user using email , name and password
const registerUser = async(req,res)=>{
    try {
        const {name,email,password} = req.body
        if(!name || !email || !password)return res.json({success:false,message:'Missing Details'})
        
        //validating email format
        if(!validator.isEmail(email))return res.json({success:false,message:'Enter Valid Email'})
        
        //validating password
        if(password.length < 8)return res.json({success:false,message:"Enter a strong password"})


        //after validating the users form data now store it in the db but before storing the password use hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt)  //through hash function password is getting hashed

        //these three data is passing because these properties are required by the userModel
        const userData = {
            name,
            email,
            password:hashedPassword,  
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        //creating token using id of the user so that it can create session and login for the user
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET )
        
        res.json({success:true , token})
            
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}


//api for login 

const loginUser = async (req,res) => {
    try {
        const {email,password} = req.body
        const user = await userModel.findOne({email})

        if(!user)return res.json({success:false,message:'User does not exist'})
        
        const isMatch = await bcrypt.compare(password,user.password)

        if(isMatch){
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
            res.json({success:true,token})
        }
        else{
            res.json({success:false,message:"Incorrect Password"})
        }

    } catch (error) {
        res.json({success:false,message:error.message})
    }
}

//api to create the user profile data

const getProfile = async(req,res) => {
    try {
        const {userId} = req.body
        //selecting the corresponding user except its password
        const userData = await userModel.findById(userId).select('-password')

        res.json({success:true,userData})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//api to update user profile

const updateProfile = async(req,res) => {
    try {
        
        const {userId,name,phone,dob,gender,address} = req.body
        const imageFile = req.file

        if(!name || !phone || !dob || !gender){
            return res.json({success:false,message:'Data Missing'})
        }
        await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),dob,gender})
        if(imageFile){

            //upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId,{image:imageURL})
        }

        res.json({success:true,message:'Profile Updated'})



    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//api to book appointment
const bookAppointment = async(req,res)=>{
    try {
        const {userId,docId,slotDate,slotTime} = req.body

        //getting the data of the doctor that user has booked using the docId
        const docData = await doctorModel.findById(docId).select('-password')

        if (!docData.available) {
            return res.json({success:false,message:'Doctor not available'})
        }

        let slots_booked=docData.slots_booked

        //checking for the slots availability of that doctor
        //by checking does that slot already present in the slots_booked array for doctor
        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                return res.json({success:false,message:'Slot Not available'})
            }
            else{
                slots_booked[slotDate].push(slotTime)
            }
        }
        else{
            slots_booked[slotDate]=[]
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select('-password')

        delete docData.slots_booked

        const appointmentData = {
            
            userId,
            docId,
            userData,
            docData,
            amount:docData.fees,
            slotTime,
            slotDate,
            date:Date.now()

        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save() 

        //now updating the slots_booked property for the doctor with the new slot begin considered
        await doctorModel.findByIdAndUpdate(docId,{slots_booked})

        res.json({success:true,message:'Appointment booked'})


    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//api to get user appointment for frontend my appointment page
const listAppointment = async(req,res)=>{
    
    try {

        const {userId} = req.body
        const appointments = await appointmentModel.find({userId})
        res.json({success:true,appointments})

    } catch (error) {
        
        console.error(error)
        res.json({success:false,message:error.message})
    }
}

//api to cancel the appointment
const cancelAppointment = async (req,res) => {
    try {

        //taken from the frontend
        const {userId,appointmentId} = req.body

        //taken from the db of appointment
        const appointmentData = await appointmentModel.findById(appointmentId)

        //verify appointment userid and the current user
        if(appointmentData.userId!==userId)return res.json({success:false,message:'Unauthorized Access'})

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

// const razorpay = new razorpay({
//     key_id:'',
//     key_secret:''
// })
// //api to make appointment payment using razorpay gateway
// const paymentRazorpay = async (req,res) => {
    
// }

export {registerUser,loginUser,getProfile,updateProfile,bookAppointment,listAppointment,cancelAppointment}