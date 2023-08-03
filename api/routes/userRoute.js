const express = require("express");
const router = express.Router();
const {
  getUserByUsername,
  updateUser,
  followUser,
  searchUser,
  getListFriend,
  suggestionUser,
  getUsersFristLogin,
  flUser,
  unFlUser,
} = require("../controllers/userController");
const fileUpload = require("../middlewares/fileUpload");

router.get("/first-login", getUsersFristLogin);
router.get("/suggestions", suggestionUser);
router.get("/search", searchUser);
router.get("/friends", getListFriend);
router.get("/:username", getUserByUsername);
router.patch("/", fileUpload.single("avatar"), updateUser);
router.post("/follow", followUser);
router.post("/follow/fl", flUser);
router.post("/follow/unfl", unFlUser);

module.exports = router;
