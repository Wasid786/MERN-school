const Schedule = require('../models/schedule.model')


module.exports = {
createSchedule: async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log incoming data
    
    // Ensure dates are proper Date objects
    const startTime = new Date(req.body.startTime);
    const endTime = new Date(req.body.endTime);
    
    // Validate dates
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid date format" });
    }

    const newSchedule = new Schedule({
      school: req.user.schoolId,
      teacher: req.body.teacher,
      subject: req.body.subject,
      class: req.body.selectedClass,
      startTime: startTime,
      endTime: endTime,
    });

    await newSchedule.save();
    
    // Populate before returning if needed
    const populatedSchedule = await Schedule.findById(newSchedule._id)
      .populate('teacher')
      .populate('subject');

    return res.status(200).json({ 
      success: true, 
      message: "Successfully created schedule!",
      data: populatedSchedule
    });
    
  } catch (error) {
    console.error("Error creating schedule:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error creating schedule!",
      error: error.message 
    });
  }
},

getAllSchedulesWithClass: async(req, res) => {
  try {
    const classId = req.params.id;
    const schoolId = req.user.schoolId;

    const schedules = await Schedule.find({ 
      school: schoolId, 
      class: classId 
    })
    .populate({
      path: 'teacher',
      select: 'name' // Only get name if that's all you need
    })
    .populate({
      path: 'subject',
      select: 'subject_name'
    })
    .lean(); // Convert to plain JS objects

    // Convert dates to ISO strings for consistent handling
    const formattedSchedules = schedules.map(schedule => ({
      ...schedule,
      startTime: schedule.startTime.toISOString(),
      endTime: schedule.endTime.toISOString()
    }));

    res.status(200).json({
      success: true,
      message: "Success in Fetching all Schedules",
      data: formattedSchedules
    });
    
  } catch (error) {
    console.error("Error getting schedules:", error);
    res.status(500).json({
      success: false,
      message: "Server Error in Getting Schedule",
      error: error.message
    });
  }
},
    
    updateSchedule: async(req, res) =>{
        try {
            let id = req.params.id;
            await Schedule.findOneAndUpdate({_id:id}, {$set:{...req.body}});
            const scheduleAfterUpdate = await Schedule.findOne({_id:id});
            res.status(200).json({success:true, message:"Schedule Updated", data:scheduleAfterUpdate})
        } catch (error) {
            console.log(error)
             res.status(500).json({success:false,  message:"Server Error in Updating Schedule "})
            
        }
    },
    deleteScheduleWithId: async(req,res)=>{
        let id = req.params.id;
        try {
            let id = req.params.id;
            let schoolId = req.user.schoolId;           
            
                await Schedule.findOneAndDelete({_id:id, school:schoolId})
                   res.status(200).json({success:true, message:"Schedule Deleted Successfully! "})
            
        } catch (error) {

            console.log(error)
             res.status(500).json({success:false,  message:"Server Error in Deleting Schedule "})
        }
    }
}