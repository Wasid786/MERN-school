const Notice = require('../models/notice.model')


module.exports = {
    createNotice: async(req,res)=>{
        try {
            console.log("------------Noticess id------------- ", req.user.schoolId,)

            const {title, message, audience} = req.body 
 
             const newNotice = new Notice({
                school: req.user.schoolId,
                title: title,
                message: message,
                audience: audience
                
             })
             await newNotice.save();
             res.status(200).json({success: true, message:"Successfully Create Notice!"})

            
        } catch (error) {
                   console.log(error)
            res.status(500).json({success:false,  message:"Server error creating Notice!"})
        }
    },
    getAllNotices:async(req,res)=>{
        try {
            const schoolId = req.user.schoolId

            const allNotices = await Notice.find({ school:schoolId });
            res.status(200).json({success:true, message:"Success in Fetching all Notices", data:allNotices})
            
        } catch (error) {
             console.log(error)
             res.status(411).json({success:false,  message:"Server Error in Getting Notice "})
        }

    },


      getTeacherNotices:async(req,res)=>{
        try {
            const schoolId = req.user.schoolId

            const allNotices = await Notice.find({ school:schoolId, audience:'teacher' });
            res.status(200).json({success:true, message:"Success in Fetching all Notices", data:allNotices})
            
        } catch (error) {
             console.log(error)
             res.status(411).json({success:false,  message:"Server Error in Getting Notice "})
        }

    },
      getStudentNotices:async(req,res)=>{
        try {
            const schoolId = req.user.schoolId

            const allNotices = await Notice.find({ school:schoolId, audience:"student" });
            res.status(200).json({success:true, message:"Success in Fetching all Notices", data:allNotices})
            
        } catch (error) {
             console.log(error)
             res.status(411).json({success:false,  message:"Server Error in Getting Notice "})
        }

    },


    updateNotice: async(req, res) =>{
        try {
            let id = req.params.id;
            await Notice.findOneAndUpdate({_id:id}, {$set:{...req.body}});
            const noticeAfterUpdate = await Notice.findOne({_id:id});
            res.status(200).json({success:true, message:"Notice Updated", data:noticeAfterUpdate})
        } catch (error) {
            console.log(error)
             res.status(411).json({success:false,  message:"Server Error in Updating Notice "})
            
        }
    },
    deleteNoticeWithId: async(req,res)=>{
        let id = req.params.id;
        try {
            let id = req.params.id;
            let schoolId = req.user.schoolId;
                await Notice.findOneAndDelete({_id:id, school:schoolId})
                   res.status(200).json({success:true, message:"Notice Deleted Successfully! "})
             }
             catch (error) {

            console.log(error)
             res.status(500).json({success:false,  message:"Server Error in Deleting Notice "})
        }
    },


}