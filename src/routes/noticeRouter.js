const express = require("express")
const router = express.Router()
const noticeController = require("../controllers/noticeController")

router.post("/createNotice", noticeController.createNotice)
router.get("/allNotice", noticeController.getAllNotices)
router.get("/singleNotice/:id", noticeController.getNoticeById)
router.delete("/deleteNoticeById/:id", noticeController.deleteNoticeById)
router.put("/updateNoticeById/:id", noticeController.updateNoticeById)

module.exports = router