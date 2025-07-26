require("dotenv").config()
const  formidable = require("formidable");
const path = require("path")
const fs = require("fs")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const Student = require("../models/student.model");
module.exports= {

    
registerStudent:  async (req, res) => {
  try {
    const form = new formidable.IncomingForm({ multiples: false });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error parsing form data",
        });
      }

      // Required fields check
      const requiredFields = [
        "name",
        "email",
        "student_class",
        "age",
        "gender",
        "guardian",
        "guardian_phone",
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

      const existingStudent = await Student.findOne({ email: fields.email });
      if (existingStudent) {
        return res.status(409).json({
          success: false,
          message: "Email is already registered.",
        });
      }

      // Check and handle image file
      const imageFile = files.image;
      if (!imageFile) {
        return res.status(400).json({
          success: false,
          message: "Student image is required",
        });
      }

      const photo = imageFile[0]; // formidable always returns array
      const originalFilename = photo.originalFilename.replace(/\s+/g, "_");
      const uploadDir = path.join(__dirname, process.env.STUDENT_IMAGE_PATH);

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const newPath = path.join(uploadDir, originalFilename);
      const fileData = fs.readFileSync(photo.filepath);
      fs.writeFileSync(newPath, fileData);


const password = fields.password?.[0];

if (!password || typeof password !== "string") {
  return res.status(400).json({
    success: false,
    message: "Invalid password. Must be a non-empty string.",
  });
}

const salt = bcrypt.genSaltSync(10);
const hashPassword = bcrypt.hashSync(password, salt);


const newStudent = new Student({
  school: req.user.schoolId,
  email: fields.email?.[0],
  name: fields.name?.[0],
  student_class: fields.student_class?.[0],
  age: fields.age?.[0],
  gender: fields.gender?.[0],
  guardian: fields.guardian?.[0],
  guardian_phone: fields.guardian_phone?.[0],
  student_image: originalFilename,
  password: hashPassword,
});


      const savedStudent = await newStudent.save();

      res.status(200).json({
        success: true,
        data: savedStudent,
        message: "Student Registered Successfully!",
      });
    });
  } catch (error) {
    console.error("Student Registration Error:", error);
    res.status(500).json({
      success: false,
      message: "Student Registration Failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
},



loginStudent :  async(req,res)=>{
    try {
    const student = await Student.findOne({email:req.body.email})
    if (student){
        const isAuth = await bcrypt.compareSync(req.body.password, student.password)
        if (isAuth){
            const jwtSecret = process.env.JWT_SECRET
            const token = jwt.sign({
               
              id:student._id,
             schoolId: student.school,
             name:student.student_name,
              image_url:student.student_image,
                role:"STUDENT",
               }, jwtSecret)

                res.header("Authorization", token)
            res.status(200).json({success: true, message:"Success Login", user:{
                id:student._id,
                schoolId:student.school,
                owner_name: student.owner_name,
                student_name: student.student_name,
                image_url:student.student_image,
                role:"STUDENT", 
            }})

        }else{
        res.status(401).json({success: false, message: "Password is Incorrect"})

        }

    }else{
        res.status(401).json({success: false, message: "Email is not registered. "})
    }
        
    } catch (error) {
         res.status(500).json({success: false, message: "Internal Server Error [Student Login]"})
    }
   }, 
   

getStudentWithQuery: async (req, res) => {
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

    if ('student_class' in req.query) {
      filterQuery['student_class'] = req.query.student_class;
    }

    const students = await Student.find(filterQuery).populate('student_class');
    res.status(200).json({ success: true, message: 'Success in fetching all students', students });

  } catch (error) {
    console.error("Error in getStudentWithQuery:", error);
    res.status(500).json({ success: false, message: "Internal Server Error [All student Data]" });
  }
},



getStudentOwnData: async(req,res)=>{
     try {
        const id = req.user.id
        const schoolId = req.user.schoolId;

         const students = await Student.findOne({_id:id, school:schoolId}).select(['-password']).populate("student_class")
         
         if(students){
            res.status(200).json({success: true, students})
         }else{
        res.status(404).json({success:false, message: "Student Not Found"})

         }
     } catch (error) {
        res.status(500).json({success:false, message: "Internal Server Error [OWN Student Data]."})
     }
   },

   getStudentWithId: async(req,res)=>{
     try {
        const id = req.params.id
        const schoolId = req.user.schoolId;

         const students = await Student.findOne({_id:id, school:schoolId}).select(['-password']);
         
         if(students){
            res.status(200).json({success: true, students})
         }else{
        res.status(404).json({success:false, message: "Student Not Found"})

         }
     } catch (error) {
        res.status(500).json({success:false, message: "Internal Server Error [OWN Student Data]."})
     }
   },

updateStudent : async (req,res)=>{

    try {
        const id = req.params.id
        const schoolId = req.user.schoolId
        const form = new  formidable.IncomingForm();

                form.parse(req, async(err, fields, files)=>{
                    const student = await Student.findOne({_id:id, school:schoolId});
         if (files.image){
            const photo = files.image[0];
            let filepath = photo.filepath;
            let originalFilename = photo.originalFilename.replace(" ","_") // photo one 

            if (student.student_image ){
            let oldImagePath =  path.join(__dirname, process.env.STUDENT_IMAGE_PATH, student.student_image );

             if(fs.existsSync(oldImagePath)){
                fs.unlink(oldImagePath, (err)=>{
                    if(err)console.log("Error deleting old image ",err)
                })
             }
            }
            let newPath = path.join(__dirname, process.env.STUDENT_IMAGE_PATH, originalFilename );
            let photoData = fs.readFileSync(filepath)
            fs.writeFileSync(newPath, photoData);

            Object.keys(fields).forEach((field)=>{
                student[field]= fields[field][0]
            })

           student['student_image'] =  originalFilename
           if(fields.password[0]){
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(fields.password[0], salt);
            student['password'] = hashPassword
           }
        }else{
                 Object.keys(fields).forEach((field)=>{
                student[field]= fields[field][0]
              
            })
        }
          await student.save();
            res.status(200).json({success:true, message:"Student Updated Successfully", student})
    })
}
        
     catch (error) {
        res.status(500).json({success :false, message: "Student Resgistration Failed"})
    }
}, 
 deleteStudentWithId: async(req,res)=>{
    try {
        const id = req.params.id
        const schoolId = req.user.schoolId
        await Student.findOneAndDelete({_id:id, school:schoolId});
         const students = await Student.find({school:schoolId})

         res.status(200).json({success:true, message:"Student Delete Successfully!", students})
        
    } catch (error) {
        res.status(500).json({success :false, message: "Student Deletion Failed"})
    }
 }
}