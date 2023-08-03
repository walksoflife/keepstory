const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
const createError = require("http-errors");

// ---------------- GET ALL MESSAGES OF ONE CONVERSATION ----------------
const getMessagesOfChat = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    const messages = await Message.find({
      chat: chatId,
    })
      .populate("sender", ["name", "username", "avatar"])
      .populate("readBy", ["name", "username", "avatar"])
      .populate({
        path: "chat",
        populate: { path: "members", select: ["name", "username", "avatar"] },
      });
    // .sort({ updatedAt: "desc" });

    return res
      .status(200)
      .json({ message: "Get all messages of one conversation", messages });
  } catch (error) {
    return next(error);
  }
};

// ---------------- SEND MESSAGE ----------------
const sendMessage = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { chatId, content } = req.body;

    if (!chatId || !content) throw createError.BadRequest();

    const newMessage = await Message.create({
      sender: userId,
      content,
      chat: chatId,
    });

    const message = await newMessage.save();

    const fullMessage = await Message.findOne({ _id: message._id })
      .populate("sender", ["name", "username", "avatar"])
      .populate("readBy", ["name", "username", "avatar"])
      .populate({
        path: "chat",
        populate: { path: "members", select: ["name", "username", "avatar"] },
      });

    await Chat.findByIdAndUpdate(
      { _id: message.chat },
      { latestMessage: message },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "Create message successfully", msg: fullMessage });
  } catch (error) {
    return next(error);
  }
};

// ---------------- SEND MESSAGE ----------------
const seenMessage = async (req, res, next) => {
  try {
    const { chatId } = req.body;

    const chatSingle = await Chat.findById(chatId).populate("members", [
      "name",
      "username",
      "avatar",
    ]);
    if (!chatSingle) throw createError.NotFound();

    await Message.findOne({ chat: chatId }).then(async (msg) => {
      chatSingle.members?.forEach((mem) => {
        console.log(mem._id);
        console.log(msg.readBy?.includes(mem._id));
        if (mem._id != req.user.userId && !msg.readBy?.includes(mem._id)) {
          msg.readBy.push(mem._id);
          msg.save();
        }
      });
      await msg.save();
    });

    const fullMessage = await Message.findOne({ chat: chatId })
      .populate("sender", ["name", "username", "avatar"])
      .populate("readBy", ["name", "username", "avatar"])
      .populate({
        path: "chat",
        populate: { path: "members", select: ["name", "username", "avatar"] },
      });

    const chats = await Chat.find({
      members: { $elemMatch: { $eq: req.user.userId } },
    })
      .populate("members", ["name", "username", "avatar"])
      .populate("groupAdmin", ["name", "username", "avatar"])
      .populate({
        path: "latestMessage",
        populate: [
          { path: "sender", select: ["name", "username", "avatar"] },
          { path: "readBy", select: ["name", "username", "avatar"] },
        ],
      })
      .sort({ updatedAt: "desc" });

    return res.status(200).json({ message: "Seen message", chats });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getMessagesOfChat, sendMessage, seenMessage };
