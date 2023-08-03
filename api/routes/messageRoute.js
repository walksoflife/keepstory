const express = require("express");
const {} = require("../controllers/chatController");
const {
  getMessagesOfChat,
  sendMessage,
  seenMessage,
} = require("../controllers/messageController");
const router = express.Router();

router.get("/:chatId", getMessagesOfChat);
router.post("/", sendMessage);
router.put("/", seenMessage);

module.exports = router;
