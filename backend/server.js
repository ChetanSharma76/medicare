import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';

//app config 
const app = express();
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

//middlewares
app.use(express.json())   //parse json string to the json to extract meaningful information
app.use(cors())           //allow frontend to make req with the backend since both have different ports in which they run or different URLs therefore it is required to use cors to allow cross origin access
//In cors we have different options for setting them in order to allow diff methods , auth e.t.c

//api endpoints
app.use('/api/admin',adminRouter)
app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)
//localhost:4000/api/admin/add-doctor



app.get('/',(req,res)=>{
    res.send('API WORKING')
})


app.listen(port,()=>{
    console.log('server started',port);
})



 

