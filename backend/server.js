// load env variables
import dotenv from "dotenv"

// import dependencies
import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import connectToDb from './config/connectToDb.js';
import {signup, login, logout} from './controllers/userController.js'


// configure app
dotenv.config();
const app = express();
const port =  process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: true,
    credentials: true,
}));

// connect to DB
connectToDb();

app.get('/',(req,res)=>{
    res.send('this is homepage')
})

// Routing
app.post("/signup", signup);
app.post("/login", login);
app.get("/logout", logout);



app.listen( port ,()=>{
    console.log(`server is running at port number ${process.env.PORT}`)
});