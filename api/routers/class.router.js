const express = require("express");
const authMiddleware = require("../auth/auth");
const { createClass, getAllClasses, updateClass, deleteClassWithId, getSingleClass, getAttendeeClass } = require("../controllers/class.controller");

const router = express.Router();

router.post("/create", authMiddleware(['SCHOOL']), createClass)
router.get("/all", authMiddleware(['SCHOOL','TEACHER']), getAllClasses)
router.get("/single/:id", authMiddleware(['SCHOOL']), getSingleClass)
router.get("/attendee", authMiddleware(['TEACHER']), getAttendeeClass)

router.patch("/update/:id", authMiddleware(['SCHOOL']), updateClass)
router.delete("/delete/:id",authMiddleware(['SCHOOL']),deleteClassWithId)


module.exports = router;