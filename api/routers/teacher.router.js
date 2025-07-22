const express = require("express");
const authMiddleware = require("../auth/auth");
const { getTeacherWithQuery, updateTeacher, getTeacherOwnData, getTeacherWithId, deleteTeacherWithId, registerTeacher, loginTeacher } = require("../controllers/teacher.controller");

const router = express.Router();

router.post("/register",authMiddleware(['SCHOOL']), registerTeacher)
router.get("/fetch-query",authMiddleware(['SCHOOL']), getTeacherWithQuery)
router.post("/login", loginTeacher)
router.patch("/update/:id", authMiddleware(['SCHOOL']), updateTeacher)
router.get("/fetch-single",authMiddleware(['TEACHER']),getTeacherOwnData)
router.get("/fetch/:id",authMiddleware(['SCHOOL']),getTeacherWithId)
router.delete("/delete/:id",authMiddleware(['SCHOOL']),deleteTeacherWithId)




module.exports = router;