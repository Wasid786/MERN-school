const express = require("express");
const authMiddleware = require("../auth/auth");
const { newExamination, getAllExamination, getExaminationByClass, updateExaminationWithId, deleteExaminationWithId } = require("../controllers/Examination.controller");

const router = express.Router();

router.post("/create", authMiddleware(['SCHOOL']), newExamination)
router.get("/all", authMiddleware(['SCHOOL']), getAllExamination)
router.get("/class/:id", authMiddleware(['SCHOOL', 'TEACHER', 'STUDENT']), getExaminationByClass)

router.post("/update/:id", authMiddleware(['SCHOOL']), updateExaminationWithId)
router.delete("/delete/:id",authMiddleware(['SCHOOL']),deleteExaminationWithId)


module.exports = router;