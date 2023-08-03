import moment from "moment";

export * from "./loadPosts";

export * from "./loadUsers";

export * from "./loadComments";

export * from "./loadMessages";

export const handleCloseOptions = (setOpenOptions) => {
  document.body.style.overflow = "visible";
  setOpenOptions(false);
};

export const handleOpenOptions = (
  setOpenOptions,
  username,
  modelId,
  setOwnModel,
  setIsModelId
) => {
  document.body.style.overflow = "hidden";
  setOpenOptions(true);
  if (username) setOwnModel(username);
  if (modelId) setIsModelId(modelId);
};

export const handleSidebar = (openSidebar, subRef, sub) => {
  let widthSBsub = 400,
    disOpenSB = 76.8,
    disCloseSB = 246.14;
  if (openSidebar) {
    subRef.current.style.width = `${disOpenSB}px`;
    sub.current.style.width = `${widthSBsub}px`;
    sub.current.style.overflow = `visible`;
    sub.current.style.borderRight = `1px solid #dbdbdb`;
  } else {
    subRef.current.style.width = `${disCloseSB}px`;
    sub.current.style.width = 0;
    sub.current.style.overflow = `hidden`;
    sub.current.style.borderRight = `unset`;
  }
};

// chats
export const getInfoChat = (item, myUser) => {
  if (item.groupAdmin) return item.groupAdmin;
  else
    return item.members[0]._id === myUser.id
      ? item.members[1]
      : item.members[0];
};

export const isLatestMessage = (messages, index, curId) => {
  return (
    index === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== curId &&
    messages[messages.length - 1].sender._id
  );
};

export const formatTime = (time) => {
  const now = moment();
  const duration = moment.duration(now.diff(time));
  const seconds = duration.asSeconds();
  const minutes = duration.asMinutes();
  const hours = duration.asHours();
  const weeks = duration.asWeeks();

  if (seconds < 60) {
    return Math.round(seconds) == 0 ? "Now" : Math.round(seconds) + "s";
  } else if (minutes < 60) {
    return Math.round(minutes) + "m";
  } else if (hours < 24) {
    return Math.round(hours) + "h";
  } else if (weeks < 1) {
    return Math.round(hours / 24) + "d";
  } else if (weeks < 52) {
    return Math.round(weeks) + "w";
  } else {
    return Math.round(weeks / 52) + "y";
  }
};

export const textNotification = (type, username) => {
  let msg;

  if (type === "liked") {
    msg = `${username} liked your post.`;
  } else if (type === "commented") {
    msg = `${username} commented you post.`;
  } else if (type === "message") {
    msg = `${username} send you message.`;
  } else return;

  return msg;
};

export const handleMsgTime = (data) => {
  if (data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      const msg = data[i];
      const nextMsg = data[i + 1];

      // const dataTime = new Date(msg.createdAt);
      // const nextDataTime = new Date(nextMsg.createdAt);

      const timeDiff = (nextMsg - msg) / 1000 / 60;

      if (timeDiff > 30) {
        return msg.createdAt;
      }
    }
  }
};
