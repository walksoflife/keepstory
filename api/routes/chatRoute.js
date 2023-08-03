const express = require("express");
const {
  createChat,
  getAllChat,
  deleteChat,
  addToGroup,
  changeGroupName,
  removeOutGroup,
} = require("../controllers/chatController");
const router = express.Router();

router.get("/all", getAllChat);
router.get("/:members", createChat);
router.delete("/:chatId", deleteChat);
router.patch("/name/:chatId", changeGroupName);
router.patch("/:chatId", addToGroup);
router.put("/:chatId", removeOutGroup);

module.exports = router;
