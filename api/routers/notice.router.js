const express = require("express");
const authMiddleware = require("../auth/auth");
const { createNotice, getAllNotices, updateNotice, deleteNoticeWithId } = require("../controllers/notice.controller");

const router = express.Router();

router.post("/create", authMiddleware(['SCHOOL']), createNotice)
router.get("/all", authMiddleware(['SCHOOL']), getAllNotices)
router.patch("/update/:id", authMiddleware(['SCHOOL']), updateNotice)
router.delete("/delete/:id",authMiddleware(['SCHOOL']),deleteNoticeWithId)


module.exports = router;