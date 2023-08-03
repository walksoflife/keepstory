let onlineUsers = [];

const addUser = (userId, socketId) => {
  !onlineUsers.some((user) => user.userId === userId) &&
    onlineUsers.push({ userId, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`User ${socket.id} connected to socket.io`);
    // set up
    socket.on("addUser", ({ userId }) => {
      addUser(userId, socket.id);
      socket.join(userId); // add every user to new room
    });

    // send notification
    socket.on("send-notifications", (data) => {
      let receiverUser = getUser(data.receiver);
      socket.to(receiverUser?.socketId).emit("get-notifications", data);
    });

    // join room
    socket.on("join-room", (room) => {
      socket.join(room);
      console.log(`User ${socket.id} joined room: ${room}`);
    });

    // send message
    socket.on("send-message", (msg) => {
      if (!msg.chat.members) return;

      msg.chat.members.forEach((mem) => {
        if (mem._id === msg.sender._id) return;
        socket.to(mem._id).emit("get-message", msg);
      });
    });

    // typing
    socket.on("typing", (room) => socket.to(room).emit("typing"));
    socket.on("stop typing", (room) => socket.to(room).emit("stop typing"));

    // ---------------------------------------------------

    // disconnected
    socket.on("disconnect", () => {
      console.log(`User ${socket.id} disconnected...`);
      removeUser(socket.id);
    });
  });
};

module.exports = { socketHandler };
