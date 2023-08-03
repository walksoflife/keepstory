const express = require("express");
const router = express.Router();
const {
  createLike,
  removePost,
  createPost,
  getPostById,
  getAllPosts,
  createBookmark,
} = require("../controllers/postController");
const fileUpload = require("../middlewares/fileUpload");

router.get("/", getAllPosts);
router.get("/:postId", getPostById);
router.post("/", fileUpload.array("image"), createPost);
router.delete("/:postId", removePost);
router.post("/like", createLike);
router.post("/bookmark", createBookmark);

module.exports = router;
