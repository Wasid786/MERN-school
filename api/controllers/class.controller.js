const Class = require('../models/class.model')
const Student = require('../models/student.model')
const Exam  = require('../models/examination.model')
const Schedule = require('../models/schedule.model')


module.exports = {
    createClass: async(req,res)=>{
        try {
            console.log("------------School id------------- ", req.user.schoolId,)
 
             const newClass = new Class({
                school: req.user.schoolId,
                class_text: req.body.class_text,
                class_num: req.body.class_num,
                
             })
             await newClass.save();
             res.status(200).json({success: true, message:"Successfully Create Class!"})

            
        } catch (error) {
                   console.log(error)
            res.status(500).json({success:false,  message:"Server error creating Class!"})
        }
    },
    getAllClasses:async(req,res)=>{
        try {
            const schoolId = req.user.schoolId

            const allClasses = await Class.find({ school:schoolId });
            res.status(200).json({success:true, message:"Success in Fetching all Classess", data:allClasses})
            
        } catch (error) {
             console.log(error)
             res.status(411).json({success:false,  message:"Server Error in Getting Class "})
        }

    },
    
    updateClass: async(req, res) =>{
        try {
            let id = req.params.id;
            await Class.findOneAndUpdate({_id:id}, {$set:{...req.body}});
            const classAfterUpdate = await Class.findOne({_id:id});
            res.status(200).json({success:true, message:"Class Updated", data:classAfterUpdate})
        } catch (error) {
            console.log(error)
             res.status(411).json({success:false,  message:"Server Error in Updating Class "})
            
        }
    },
    deleteClassWithId: async(req,res)=>{
        let id = req.params.id;
        try {
            let id = req.params.id;
            let schoolId = req.user.schoolId;
            const classStudentCount =  (await Student.find({student_class:id, school:schoolId})).length;
            const classExamCount = (await Exam.find({class:id, school:schoolId})).length
            const classScheduleCount = (await Schedule.find({class:id, school:schoolId})).length

             if (
  classStudentCount === 0 &&
  classExamCount === 0 &&
  classScheduleCount === 0
) {
                await Class.findOneAndDelete({_id:id, school:schoolId})
                   res.status(200).json({success:true, message:"Class Deleted Successfully! "})
             }else{
                res.status(500).json({success:false,  message:"Class Already in Use, Cannot Delete! "})
             }

            
         
            
        } catch (error) {

            console.log(error)
             res.status(500).json({success:false,  message:"Server Error in Deleting Class "})
        }
    }
}