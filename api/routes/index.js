const express = require("express");
const router = express.Router();

const authRoute = require("./authRoute");
const userRoute = require("./userRoute");
const postRoute = require("./postRoute");
const commentRoute = require("./commentRoute");
const chatRoute = require("./chatRoute");
const messageRoute = require("./messageRoute");
const notificationRoute = require("./notificationRoute");
const { verifyAccessToken } = require("../middlewares/verifyToken");

const routes = () => {
  router.use("/api/auth", authRoute);
  router.use(verifyAccessToken);  
  router.use("/api/posts", postRoute);
  router.use("/api/comments", commentRoute);
  router.use("/api/users", userRoute);
  router.use("/api/chats", chatRoute);
  router.use("/api/messages", messageRoute);
  router.use("/api/notifications", notificationRoute);

  return router;
};

module.exports = routes;
