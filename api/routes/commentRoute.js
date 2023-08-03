const express = require("express");
const router = express.Router();
const { createComment, removeComment } = require("../controllers/commentController");

router.post("/", createComment);
router.delete("/:commentId", removeComment)

module.exports = router;
