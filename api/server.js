require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

// Routers import 
const schoolRouter = require("./routers/school.router")
const classRouter = require('./routers/class.router')
const subjectRouter = require('./routers/subject.router')
const studentRouter = require("./routers/student.router")
const teacherRouter = require("./routers/teacher.router")
const attendanceRouter = require("./routers/attendance.router")
const ExaminationRouter = require("./routers/examination.router")
const NoticeRouter = require("./routers/notice.router")




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
app.use("/api/subject", subjectRouter)
app.use("/api/student", studentRouter)
app.use("/api/teacher", teacherRouter)
app.use("/api/attendance", attendanceRouter)
app.use("/api/examination", ExaminationRouter)
app.use("/api/notice", NoticeRouter)







const PORT = process.env.PORT 

app.listen(PORT, () => {
    console.log("Server is running at port", PORT);
});
