const Examination = require("../models/examination.model")

module.exports = {
    newExamination :async(req, res)=>{
        try {
            const schoolId = req.user.schoolId
            const {date,  subjectId , examType, classId } = req.body
            const newExamination = new Examination({
                school: schoolId,
                examDate: date, 
                subject: subjectId,
                examType: examType,
                class: classId, 
            })
            const savedData = await newExamination.save();
            res.status(200).json({success:true, message: "Success in Creating new Examination. ", date: savedData})
            
        } catch (error) {
            res.status(500).json({success:false, message:"Error in Creating New Examination "})
        }
    }, 

    getAllExamination: async(req, res)=>{
        try {
            const schoolId = req.user.schoolId;
            const examination = await Examination.find({school: schoolId});

            res.status(200).json({success:true, examination})
            
        } catch (error) {
            res.status(500).json({success: false, message: "Error in Fetching Examination!"})
        }
    },

    getExaminationByClass: async(req, res)=>{
        try {
            const schoolId = req.user.schoolId;
              const classId = req.params.id;
            const examination = await Examination.find({class: classId, school: schoolId}).populate("subject")
          

            res.status(200).json({success:true, examination})
            
        } catch (error) {
            res.status(500).json({success: false, message: "Error in Fetching Examination! By Class "})
        }
    },
    updateExaminationWithId :async(req, res)=>{
        try {
            const schoolId = req.user.schoolId;
            const examinationId = req.params.id
              const { date, subjectId, examType, classId } = req.body;

            await Examination.findOneAndUpdate({_id: examinationId, school: schoolId}, 
                {$set: 
                {
                examDate: date, 
                subject: subjectId,
                examType: examType,
                class: classId, 
                }})
                res.status(200).json({success:true, message: "Examination is Updated Successfully! "})
            
        } catch (error) {
            res.status(500).json({success: false, message: "Error in updating Examination! By Class "})

            
        }
    },
    deleteExaminationWithId: async(req, res)=>{
        try {
          const schoolId = req.user.schoolId
          const examinationId = req.params.id;
          await Examination.findOneAndDelete({_id: examinationId, school: schoolId})
                res.status(200).json({success:true, message: "Examination Deleted Successfully! "})

          
            
        } catch (error) {
            res.status(500).json({success: false, message: "Error in updating Examination! By Class "})
            
        }
    }
}