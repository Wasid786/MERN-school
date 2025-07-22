const express = require("express");
const authMiddleware = require("../auth/auth");
const { createNotice, getAllNotices, updateNotice, deleteNoticeWithId, getTeacherNotices, getStudentNotices } = require("../controllers/notice.controller");

const router = express.Router();

router.post("/create", authMiddleware(['SCHOOL']), createNotice)
router.get("/all", authMiddleware(['SCHOOL', 'TEACHER']), getAllNotices)
router.get("/teacher", authMiddleware([ 'TEACHER']), getTeacherNotices)
router.get("/student", authMiddleware([ 'STUDENT']), getStudentNotices)

router.patch("/update/:id", authMiddleware(['SCHOOL']), updateNotice)
router.delete("/delete/:id",authMiddleware(['SCHOOL']),deleteNoticeWithId)


module.exports = router;