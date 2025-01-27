import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    image:{type:String,required:true},
    speciality:{type:String,required:true},
    degree:{type:String,required:true},
    experience:{type:String,required:true},
    about:{type:String,required:true},
    available:{type:Boolean,default:true},
    fees:{type:Number,required:true},
    address:{type:Object,required:true},
    date:{type:Number,required:true},
    slots_booked:{type:Object,default:{}},

},{minimize:false})          //minimize:false is used to save the empty object for that field by default minimize is true that if the object is empty then it will remove that object and wouldn't save it in the db

const doctorModel = mongoose.models.doctor || mongoose.model('doctor',doctorSchema)

export default doctorModel