require("dotenv").config()
const  formidable = require("formidable");
const path = require("path")
const fs = require("fs")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cloudinary  = require("../utils/cloudnary")

const Teacher = require("../models/teacher.model");
module.exports= {

    

registerTeacher: async (req, res) => {
  try {
    const form = new formidable.IncomingForm({ multiples: false });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error parsing form data",
        });
      }

      // Required fields
      const requiredFields = [
        "name",
        "email",
        "age",
        "gender",
        "phone",
        "qualification",
        "password",
      ];

      for (let key of requiredFields) {
        if (!fields[key]) {
          return res.status(400).json({
            success: false,
            message: `${key} is required`,
          });
        }
      }

      // Check if teacher already exists
      const existingTeacher = await Teacher.findOne({ email: fields.email });
      if (existingTeacher) {
        return res.status(409).json({
          success: false,
          message: "Email is already registered.",
        });
      }

      // Handle image upload to Cloudinary
      const imageFile = files.image;
      if (!imageFile) {
        return res.status(400).json({
          success: false,
          message: "Teacher image is required",
        });
      }

      const photo = imageFile[0]; // formidable gives array
      const cloudinaryResult = await cloudinary.uploader.upload(photo.filepath, {
        folder: "teacher_images", // Cloudinary folder
        use_filename: true,
        unique_filename: false,
      });

      // Password handling
      const password = fields.password?.[0];
      if (!password || typeof password !== "string") {
        return res.status(400).json({
          success: false,
          message: "Invalid password. Must be a non-empty string.",
        });
      }

      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(password, salt);

      // Save new teacher with Cloudinary image URL
      const newTeacher = new Teacher({
        school: req.user.schoolId,
        email: fields.email?.[0],
        name: fields.name?.[0],
        age: fields.age?.[0],
        gender: fields.gender?.[0],
        phone: fields.phone?.[0],
        qualification: fields.qualification?.[0],
        teacher_image: cloudinaryResult.secure_url, // Cloudinary URL
        password: hashPassword,
      });

      const savedTeacher = await newTeacher.save();

      res.status(200).json({
        success: true,
        data: savedTeacher,
        message: "Teacher Registered Successfully!",
      });
    });
  } catch (error) {
    console.error("Teacher Registration Error:", error);
    res.status(500).json({
      success: false,
      message: "Teacher Registration Failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
},


loginTeacher :  async(req,res)=>{
    try {
    const teacher = await Teacher.findOne({email:req.body.email})
    if (teacher){
        const isAuth = await bcrypt.compareSync(req.body.password, teacher.password)
        if (isAuth){
            const jwtSecret = process.env.JWT_SECRET
            const token = jwt.sign({
               
              id:teacher._id,
             schoolId: teacher.school,
             name:teacher.name,
              image_url:teacher.teacher_image,
                role:"TEACHER",
               }, jwtSecret)

                res.header("Authorization", token)
            res.status(200).json({success: true, message:"Success Login", user:{
                id:teacher._id,
                schoolId:teacher.school,
                name: teacher.name,
                image_url:teacher.teacher_image,
                role:"TEACHER", 
            }})

        }else{
        res.status(401).json({success: false, message: "Password is Incorrect"})

        }

    }else{
        res.status(401).json({success: false, message: "Email is not registered. "})
    }
        
    } catch (error) {
         res.status(500).json({success: false, message: "Internal Server Error [Teacher Login]"})
    }
   }, 
   

getTeacherWithQuery: async (req, res) => {
  try {
    const filterQuery = {};
    const schoolId = req.user.schoolId;

    if (!schoolId) {
      return res.status(401).json({ success: false, message: "Unauthorized: Missing schoolId" });
    }

    filterQuery['school'] = schoolId;

    if ('search' in req.query) {
      filterQuery['name'] = { $regex: req.query.search, $options: "i" };
    }



    const teachers = await Teacher.find(filterQuery)
    res.status(200).json({ success: true, message: 'Success in fetching all teachers', teachers });

  } catch (error) {
    console.error("Error in getTeacherWithQuery:", error);
    res.status(500).json({ success: false, message: "Internal Server Error [All Teacher Data]" });
  }
},



getTeacherOwnData: async(req,res)=>{
     try {
        const id = req.user.id
        const schoolId = req.user.schoolId;

         const teachers = await Teacher.findOne({_id:id, school:schoolId}).select(['-password']);
         
         if(teachers){
            res.status(200).json({success: true, teachers})
         }else{
        res.status(404).json({success:false, message: "Teacher Not Found"})

         }
     } catch (error) {
        res.status(500).json({success:false, message: "Internal Server Error [OWN Teacher Data]."})
     }
   },

   getTeacherWithId: async(req,res)=>{
     try {
        const id = req.params.id
        const schoolId = req.user.schoolId;

         const teachers = await Teacher.findOne({_id:id, school:schoolId}).select(['-password']);
         
         if(teachers){
            res.status(200).json({success: true, teachers})
         }else{
        res.status(404).json({success:false, message: "Teacher Not Found"})

         }
     } catch (error) {
        res.status(500).json({success:false, message: "Internal Server Error [OWN Teacher Data]."})
     }
   },

updateTeacher : async (req,res)=>{

    try {
        const id = req.params.id
        const schoolId = req.user.schoolId
        const form = new  formidable.IncomingForm();

                form.parse(req, async(err, fields, files)=>{
                    const teacher = await Teacher.findOne({_id:id, school:schoolId});
         if (files.image){
            const photo = files.image[0];
            let filepath = photo.filepath;
            let originalFilename = photo.originalFilename.replace(" ","_") // photo one 

            if (teacher.teacher_image ){
            let oldImagePath =  path.join(__dirname, process.env.TEACHER_IMAGE_PATH, teacher.teacher_image );

             if(fs.existsSync(oldImagePath)){
                fs.unlink(oldImagePath, (err)=>{
                    if(err)console.log("Error deleting old image ",err)
                })
             }
            }
            let newPath = path.join(__dirname, process.env.TEACHER_IMAGE_PATH, originalFilename );
            let photoData = fs.readFileSync(filepath)
            fs.writeFileSync(newPath, photoData);

            Object.keys(fields).forEach((field)=>{
                teacher[field]= fields[field][0]
            })

           teacher['teacher_image'] =  originalFilename
           if(fields.password[0]){
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(fields.password[0], salt);
            teacher['password'] = hashPassword
           }
        }else{
                 Object.keys(fields).forEach((field)=>{
                teacher[field]= fields[field][0]
              
            })
        }
          await teacher.save();
            res.status(200).json({success:true, message:"Teacher Updated Successfully", teacher})
    })
}
        
     catch (error) {
        res.status(500).json({success :false, message: "Teacher Resgistration Failed"})
    }
}, 
 deleteTeacherWithId: async(req,res)=>{
    try {
        const id = req.params.id
        const schoolId = req.user.schoolId
        await Teacher.findOneAndDelete({_id:id, school:schoolId});
         const teachers = await Teacher.find({school:schoolId})

         res.status(200).json({success:true, message:"Teacher Delete Successfully!", teachers})
        
    } catch (error) {
        res.status(500).json({success :false, message: "Teacher Deletion Failed"})
    }
 }
}