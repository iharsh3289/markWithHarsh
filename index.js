const express=require("express")
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const path = require('path');
require("dotenv").config()
const connection=require("./Connection/db");
const userRoute=require("./Route/userRoute")
const clientRoute = require("./Route/clientRoute")

const app=express()

app.set('views', __dirname + '/public/views');
app.set('view engine', 'hbs');

// Set static path to public
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json())
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use("/user",userRoute)
app.use("/",clientRoute)

app.listen(process.env.PORT,async()=>{
    try {
        await connection;
        console.log("connected to DATABASE");
    } catch (error) {
        console.log(error);
        
        
    }
    console.log(`server is running on port ${process.env.PORT}`);
})
