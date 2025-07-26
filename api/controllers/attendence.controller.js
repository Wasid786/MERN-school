const Attendance  = require("../models/attendance.model")
const moment = require('moment');


module.exports = {
markAttendance: async (req, res) => {
  try {
    const { studentId, date, status, classId } = req.body;
    const schoolId = req.user?.schoolId; // use optional chaining for safety

    console.log("REQ.BODY:", req.body);
    console.log("REQ.USER:", req.user);

    const newAttendance = new Attendance({
      student: studentId,
      date,
      status,
      class: classId,
      school: schoolId
    });

    await newAttendance.save();
    res.status(201).json(newAttendance);
  } catch (error) {
    console.error("Error in markAttendance:", error); 
    res.status(500).json({
      success: false,
      message: "Error in marking Attendance",
      error: error.message 
    });
  }
},

    getAttendance: async(req,res)=>{
        try {
        const {studentId} = req.params;
        const attendance = await Attendance.find({student:studentId}).populate('student')
        res.status(200).json(attendance)
        } catch (error) {
            res.status(500).json({success: false, message:"Error in Getting Attendance"})
            
        }
    }, 

  checkAttendance : async (req, res) => {
  try {
    const today = moment().startOf('day');

    const attendanceForToday = await Attendance.findOne({
      class: req.params.classId,
      date: {
        $gte: today.toDate(),
        $lt: moment(today).endOf('day').toDate()
      }
    });

    if (attendanceForToday) {
      return res.status(200).json({
        attendanceTaken: true,
        message: "Attendance already Taken!"
      });
    } else {
      return res.status(200).json({
        attendanceTaken: false,
        message: "Attendance not yet taken."
      });
    }

  } catch (error) {
    console.log("checkAttendance ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error in Checking Attendance",
      error: error.message
    })
  }
},
}