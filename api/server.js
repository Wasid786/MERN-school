require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

// Routers import 
const schoolRouter = require("./routers/school.router")
const classRouter = require('./routers/class.router')

const corsOption = {exposedHeaders: "Authorization" }

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors(corsOption));
app.use(cookieParser());




mongoose.connect("mongodb://localhost:27017/schoolManagement")
    .then(() => {
        console.log("MongoDB is connected successfully!");
    })
    .catch(e => {
        console.log("MongoDB connection error:", e);
    });


    app.get("/test", (req, res)=>{
         res.send({id:1,message:"welcome it is working"})
    })
//// Routers

app.use("/api/school", schoolRouter)
app.use("/api/class", classRouter)

const PORT = process.env.PORT 

app.listen(PORT, () => {
    console.log("Server is running at port", PORT);
});
