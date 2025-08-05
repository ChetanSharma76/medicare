import userModel from "../models/userModel.js"
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from "../models/doctorModel.js"
import appointmentModel from "../models/appointmentModel.js"
import dotenv from 'dotenv'
import razorpay from 'razorpay'
dotenv.config();


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
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;

    //Atomically push slotTime if it's not already booked
    const pushResult = await doctorModel.updateOne(
      {
        _id: docId,
        available: true,
        [`slots_booked.${slotDate}`]: { $ne: slotTime }
      },
      {
        $push: { [`slots_booked.${slotDate}`]: slotTime }
      }
    );

    if (pushResult.modifiedCount === 0) {
      return res.json({ success: false, message: 'Slot Not available or Doctor unavailable' });
    }

    //Fetch data for user and doctor
    const userData = await userModel.findById(userId).select('-password');
    const docData = await doctorModel.findById(docId).select('-password');

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now()
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    res.json({ success: true, message: 'Appointment booked' });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

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

//api to make appointment payment using razorpay gateway

const razorpayInstance = new razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
})

const paymentRazorpay = async(req,res) => {

    try {
        const {appointmentId} = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if(!appointmentData || appointmentData.cancelled){
            return res.json({success:false,message:'Appointment cancelled or not found'})
        }

        //creating options for razorpay payment
        const options  = {
            amount : appointmentData.amount * 100,
            currency : process.env.CURRENCY,
            receipt : appointmentId,
        }

        //creation of an order
        const order = await razorpayInstance.orders.create(options)

        res.json({success:true,order})

    } catch (error) {

        console.error(error)
        res.json({success:false,message:error.message})
        
    }
    
}

//api to verify payment of razorpay

const verifyRazorpay = async(req,res) => {

    try {
        const {razorpay_order_id} = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        console.log(orderInfo)

        if(orderInfo.status === 'paid'){
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})
            res.json({success:true,message:'Payment successful'})
        }
        else{
            res.json({success:false,message:'Payment failed'})
        }
    } catch (error) {
        
    }
}




export {registerUser,loginUser,getProfile,updateProfile,bookAppointment,listAppointment,cancelAppointment,paymentRazorpay,verifyRazorpay}
