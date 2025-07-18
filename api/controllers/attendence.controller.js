const Attendance  = require("../models/attendance.model")

module.exports = {
    markAttendance: async(req, res)=>{
        try {
             const {studentId, data , status, classId} = req.body;
             const schoolId = req.user.schoolId
             const newAttendance = new Attendance({
                student: studentId, 
                date, 
                status, 
                class: classId,
                school: schoolId
             })
             await  newAttendance.save();
             res.status(201).json(newAttendance)
        } catch (error) {
             res.status(500).json({success:false, message:"Error in marking Attendance"})
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

    checkAttendance: async(req, res)=>{
        try {
            const today = moment.startOf('day')
            const {studentId} = req.params
            const attendanceForToday  = await Attendance.findOne({
                class: req.params.classId,
                date:{
                    // 00:00 hrs to 23:59
                    $gte:today.toDate(),
                    $lt: moment(today).endOf('day').toDate()
                }
            })
            if( attendanceForToday){
                return res.status(200).json({attendanceTaken: true, message:"Attendance already Taken!"})
            }else{
                return res.status(400).json({attendanceTaken: false, message:"No Attendance for Today!"})

            }
            
        } catch (error) {
            console.log(error)
            res.status(500).json({success: false, message:"Error in Checking Attendance"})
            
        }
    }
}