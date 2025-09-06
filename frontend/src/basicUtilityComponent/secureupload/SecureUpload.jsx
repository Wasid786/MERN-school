import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinaryConfig.js";

const schoolStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "school_images",   // instead of ../../frontend/public/images/uploaded/school
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const studentStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "student_images",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const teacherStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "teacher_images",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

export const uploadSchoolImage = multer({ storage: schoolStorage });
export const uploadStudentImage = multer({ storage: studentStorage });
export const uploadTeacherImage = multer({ storage: teacherStorage });
