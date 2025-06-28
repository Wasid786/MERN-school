const Subject = require('../models/subject.model')
const Student = require('../models/student.model')
const Exam  = require('../models/examination.model')
const Schedule = require('../models/schedule.model')


module.exports = {
    createSubject: async(req,res)=>{
        try {
            console.log("------------School id------------- ", req.user.schoolId,)
 
             const newSubject = new Subject({
                school: req.user.schoolId,
                subject_name: req.body.subject_name,
                subject_codename: req.body.subject_codename,
                
             })
             await newSubject.save();
             res.status(200).json({success: true, message:"Successfully Create subject!"})

            
        } catch (error) {
                   console.log(error)
            res.status(500).json({success:false,  message:"Server error creating subject!"})
        }
    },
    getAllSubjects:async(req,res)=>{
        try {
            const schoolId = req.user.schoolId

            const allSubjects = await Subject.find({ school:schoolId });
            res.status(200).json({success:true, message:"Success in Fetching all subjects", data:allSubjects})
            
        } catch (error) {
             console.log(error)
             res.status(411).json({success:false,  message:"Server Error in Getting Subject "})
        }

    },
    
    updateSubject: async(req, res) =>{
        try {
            let id = req.params.id;
            await Subject.findOneAndUpdate({_id:id}, {$set:{...req.body}});
            const subjectAfterUpdate = await Subject.findOne({_id:id});
            res.status(200).json({success:true, message:"Subject Updated", data:subjectAfterUpdate})
        } catch (error) {
            console.log(error)
             res.status(411).json({success:false,  message:"Server Error in Updating Subject "})
            
        }
    },
    deleteSubjectWithId: async(req,res)=>{
        let id = req.params.id;
        try {
            let id = req.params.id;
            let schoolId = req.user.schoolId;
            // const subjectStudentCount =  (await Student.find({student_Subject:id, school:schoolId})).length;
            const subjectExamCount = (await Exam.find({subject:id, school:schoolId})).length
            const subjectScheduleCount = (await Schedule.find({subject:id, school:schoolId})).length

             if (
//   subjectStudentCount === 0 &&
  subjectExamCount === 0 &&
  subjectScheduleCount === 0
) {
                await Subject.findOneAndDelete({_id:id, school:schoolId})
                   res.status(200).json({success:true, message:"Subject Deleted Successfully! "})
             }else{
                res.status(500).json({success:false,  message:"Subject Already in Use, Cannot Delete! "})
             }

            
         
            
        } catch (error) {

            console.log(error)
             res.status(500).json({success:false,  message:"Server Error in Deleting Subject "})
        }
    }
}