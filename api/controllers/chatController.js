const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const { Types } = require("mongoose");
const createError = require("http-errors");
const Message = require("../models/messageModel");

// ---------------- CREATE A SINGLE CHAT ----------------
const createChat = async (req, res, next) => {
  try {
    if (!req.params.members) throw createError.BadRequest();

    let members = await JSON.parse(req.params.members).map(
      (m) => new Types.ObjectId(m)
    );

    if (members.length < 2) {
      let friendUser = await User.findOne({ _id: members[0] }).select("name");
      let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
          { members: { $elemMatch: { $eq: req.user.userId } } },
          { members: { $elemMatch: { $eq: members[0] } } },
        ],
      })
        .populate("members", ["name", "username", "avatar"])
        .populate({
          path: "latestMessage",
          populate: [
            { path: "sender", select: ["name", "username", "avatar"] },
            { path: "readBy", select: ["name", "username", "avatar"] },
          ],
        });

      if (isChat.length > 0) {
        return res
          .status(200)
          .json({ message: "Get a single chat.", chat: isChat[0] });
      } else {
        try {
          const newChat = await Chat.create({
            name: friendUser.name,
            isGroupChat: false,
            members: [req.user.userId, members[0]],
          });
          const createdChat = await newChat.save();
          const fullChat = await Chat.findOne({
            _id: createdChat._id,
          }).populate("members", ["name", "username", "avatar"]);

          return res
            .status(200)
            .json({ message: "Create a chat.", chat: fullChat });
        } catch (error) {
          return next(error);
        }
      }
    } else {
      // is group chat
      let isGroupChat = await Chat.find({
        members: { $elemMatch: { $all: members } },
      })
        .populate("members", ["name", "username", "avatar"])
        .populate("groupAdmin", ["name", "username", "avatar"])
        .populate({
          path: "latestMessage",
          populate: [
            { path: "sender", select: ["name", "username", "avatar"] },
            { path: "readBy", select: ["name", "username", "avatar"] },
          ],
        });

      if (isGroupChat.length > 0) {
        return res
          .status(200)
          .json({ message: "Get a single group chat.", chat: isGroupChat[0] });
      } else {
        let myUser = await User.findOne({ _id: req.user.userId }).select(
          "name"
        );
        members.push(req.user.userId);
        try {
          const newGroupChat = await Chat.create({
            name: myUser.name,
            isGroupChat: true,
            members,
            groupAdmin: req.user.userId,
          });
          const groupChat = await newGroupChat.save();
          const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("members", ["name", "username", "avatar"])
            .populate("groupAdmin", ["name", "username", "avatar"])
            .populate({
              path: "latestMessage",
              populate: [
                { path: "sender", select: ["name", "username", "avatar"] },
                { path: "readBy", select: ["name", "username", "avatar"] },
              ],
            });

          return res.status(200).json({
            message: "Create a single group chat",
            chat: fullGroupChat,
          });
        } catch (error) {
          return next(error);
        }
      }
    }
  } catch (error) {
    return next(error);
  }
};

// ---------------- GET ALL CHAT CONVERSATIONS ----------------
const getAllChat = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const chats = await Chat.find({ members: { $elemMatch: { $eq: userId } } })
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

    return res
      .status(200)
      .json({ message: "Get all chat conversations", chats });
  } catch (error) {
    return next(error);
  }
};

// ---------------- REMOVE CHAT CONVERSATIONS ----------------
const deleteChat = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    await Chat.findByIdAndDelete({ _id: chatId });

    const msgOfChat = await Message.findOne({ chat: chatId });
    if (msgOfChat) {
      await Message.findByIdAndDelete({ _id: msgOfChat._id });
    }

    return res.status(200).json({ message: "Chat has been removed." });
  } catch (error) {
    return next(error);
  }
};

// ---------------- ADD MEMBER TO CHAT CONVERSATIONS ----------------
const addToGroup = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    if (!req.body.people) throw createError.BadRequest();

    let members = await JSON.parse(req.body.people).map(
      (m) => new Types.ObjectId(m)
    );

    const newChat = await Chat.findByIdAndUpdate(
      { _id: chatId },
      { members },
      { new: true }
    )
      .populate("members", ["name", "username", "avatar"])
      .populate("groupAdmin", ["name", "username", "avatar"])
      .populate({
        path: "latestMessage",
        populate: {
          path: "sender",
          select: ["name", "username", "avatar"],
        },
      });

    return res
      .status(200)
      .json({ message: "Add member to group successfully  ", chat: newChat });
  } catch (error) {
    return next(error);
  }
};

// ---------------- REMOVE MEMBER TO CHAT CONVERSATIONS ----------------
const removeOutGroup = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    if (!req.body.userRemoved) throw createError.BadRequest();

    const chatGroup = await Chat.findById(chatId);
    if (!chatGroup) throw createError.NotFound();

    if (req.user.userId != chatGroup.groupAdmin?._id) {
      throw createError.Unauthorized();
    } else {
      await chatGroup.members.pull(req.body.userRemoved);
      await chatGroup.save();
    }

    let chatUpdated = await Chat.findById(chatId)
      .populate("members", ["name", "username", "avatar"])
      .populate("groupAdmin", ["name", "username", "avatar"])
      .populate({
        path: "latestMessage",
        populate: {
          path: "sender",
          select: ["name", "username", "avatar"],
        },
      });

    return res.status(200).json({
      message: "You have been removed one person out group.",
      chat: chatUpdated,
    });
  } catch (error) {
    return next(error);
  }
};

// ---------------- CHANGE NAME CHAT CONVERSATIONS ----------------
const changeGroupName = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    await Chat.findByIdAndUpdate(
      { _id: chatId },
      { name: req.body.groupName },
      { new: true }
    );

    return res.status(200).json({ message: "Group name has been renamed." });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createChat,
  getAllChat,
  deleteChat,
  addToGroup,
  removeOutGroup,
  changeGroupName,
};
