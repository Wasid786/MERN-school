require("dotenv").config()
const  formidable = require("formidable");
const path = require("path")
const fs = require("fs")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const dotenv = require( "dotenv");
const cloudinary  = require("../utils/cloudnary")
dotenv.config();

const School = require("../models/school.model");
module.exports= {

registerSchool: async (req, res) => {
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
      const requiredFields = ["school_name", "email", "owner_name", "password"];
      for (let key of requiredFields) {
        if (!fields[key] || !fields[key][0]) {
          return res.status(400).json({
            success: false,
            message: `${key} is required`,
          });
        }
      }

      const email = fields.email[0];

      // Check existing school
      const existingSchool = await School.findOne({ email });
      if (existingSchool) {
        return res.status(409).json({
          success: false,
          message: "Email is already registered.",
        });
      }

      // Handle school image
      const imageFile = files.image;
      if (!imageFile) {
        return res.status(400).json({
          success: false,
          message: "School image is required",
        });
      }

      const photo = imageFile[0]; // formidable returns array

      // ✅ Upload directly to Cloudinary
      const cloudinaryResult = await cloudinary.uploader.upload(photo.filepath, {
        folder: "school_images", // Cloudinary folder for schools
        use_filename: true,
        unique_filename: false,
      });

      // Hash password
      const password = fields.password[0];
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(password, salt);

      // Create new School entry with Cloudinary URL
      const newSchool = new School({
        school_name: fields.school_name[0],
        email: email,
        owner_name: fields.owner_name[0],
        school_image: cloudinaryResult.secure_url, // ✅ Cloudinary URL
        password: hashPassword,
      });

      const savedSchool = await newSchool.save();

      res.status(200).json({
        success: true,
        data: savedSchool,
        message: "School registered successfully!",
      });

      console.log("School Registration Successfully");
    });

  } catch (error) {
    console.log("Error in School Registration:", error);
    res.status(500).json({
      success: false,
      message: "School registration failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
},


   loginSchool :  async(req,res)=>{
    try {
    const school = await School.findOne({email:req.body.email})
    if (school){
        const isAuth = await bcrypt.compareSync(req.body.password, school.password)
        if (isAuth){
            const jwtSecret = process.env.JWT_SECRET
            const token = jwt.sign({
                schoolId: school._id,
              id:school._id,
                owner_name: school.owner_name,
                school_name: school.school_name,
                image_url:school.school_image,
                role:"SCHOOL", }, jwtSecret)

                res.header("Authorization", token)
            res.status(200).json({success: true, message:"Success Login", user:{
                id:school._id,
                owner_name: school.owner_name,
                school_name: school.school_name,
                image_url:school.school_image,
                role:"SCHOOL", 
            }})

        }else{
        res.status(401).json({success: false, message: "Password is Incorrect"})

        }

    }else{
        res.status(401).json({success: false, message: "Email is not registered. "})
    }
        
    } catch (error) {
         res.status(500).json({success: false, message: "Internal Server Error [School Login]"})
    }
   }, 

   getAllSchool: async(req, res)=>{
    try {
        const schools = await School.find().select(['-password', '-_id', '-email', '-owner_name','-createdAt']);
        res.status(200).json({success: true, message:'Success in fetching all schools', schools})
        
    } catch (error) {
         res.status(500).json({success: false, message: "Internal Server Error [All School Data]"})
        
    }
   }, 
   getSchoolOwnData: async(req,res)=>{
     try {
        const id = req.user.id
         const school = await School.findOne({_id:id}).select(['-password']);
         if(school){
            res.status(200).json({success: true, school})
         }else{
        res.status(404).json({success:false, message: "School Not Found"})

         }
     } catch (error) {
        res.status(500).json({success:false, message: "Internal Server Error [OWN School Data]."})
     }
   },

       updateSchool : async (req,res)=>{

    try {
        const id = req.user.id
        const form = new  formidable.IncomingForm();

                form.parse(req, async(err, fields, files)=>{
                    const school = await School.findOne({_id:id});
         if (files.image){
            const photo = files.image[0];
            let filepath = photo.filepath;
            let originalFilename = photo.originalFilename.replace(" ","_") // photo one 

            if (school.school_image ){
            let oldImagePath =  path.join(__dirname, process.env.SCHOOL_IMAGE_PATH, school.school_image );

             if(fs.existsSync(oldImagePath)){
                fs.unlink(oldImagePath, (err)=>{
                    if(err)console.log("Error deleting old image ",err)
                })
             }
            }
            let newPath = path.join(__dirname, process.env.SCHOOL_IMAGE_PATH, originalFilename );
            let photoData = fs.readFileSync(filepath)
            fs.writeFileSync(newPath, photoData);

            Object.keys(fields).forEach((field)=>{
                school[field]= fields[field][0]
            })

           school['school_image'] =  originalFilename
        }else{
            school['school_name'] =  fields.school_name[0]
        }
          await school.save();
            res.status(200).json({success:true, message:"School Updated Successfully", school})
    })
}
        
     catch (error) {
        res.status(500).json({success :false, message: "School Resgistration Failed"})
    }
}, 
}