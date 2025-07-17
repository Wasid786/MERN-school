const express = require("express");
const authMiddleware = require("../auth/auth");
const { createSchedule, getAllSchedulesWithClass, updateSchedule, deleteScheduleWithId } = require("../controllers/schedule.controller");

const router = express.Router();

router.post("/create", authMiddleware(['SCHOOL']), createSchedule)
router.get("/fetch-with-class/:id", authMiddleware(['SCHOOL']), getAllSchedulesWithClass)
router.patch("/update/:id", authMiddleware(['SCHOOL']), updateSchedule)
router.delete("/delete/:id",authMiddleware(['SCHOOL']),deleteScheduleWithId)


module.exports = router;