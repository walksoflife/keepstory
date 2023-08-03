const express = require("express");
const {
  getAllNotifications,
  unReadNotification,
} = require("../controllers/notificationController");

const router = express.Router();

router.get("/read", getAllNotifications);
router.get("/unread", unReadNotification);

module.exports = router;
