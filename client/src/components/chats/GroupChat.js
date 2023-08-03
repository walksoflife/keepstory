import { useContext, useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import {
  formatTime,
  getInfoChat,
  handleOpenOptions,
} from "../../services/fetch";
import NewChat from "./NewChat";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import makeRequest from "../../services/makeRequest";
import { ChatContext } from "../../context/ChatContext";
import GroupChatSkeleton from "../skeleton/GroupChatSkeleton";

const GroupChat = () => {
  const { handleOpenMessage, chatSingle } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);
  const [openNewchat, setOpenNewchat] = useState(false);

  const { isLoading, data, error } = useQuery(["chats"], () =>
    makeRequest
      .get("/chats/all", {
        headers: { Authorization: `Bearer ${currentUser.accessToken}` },
      })
      .then((res) => res.data.chats)
  );

  useEffect(() => {
    const readMsg = async () => {
      try {
        if (chatSingle._id) {
          await makeRequest.put(
            "/messages",
            { chatId: chatSingle._id },
            {
              headers: { Authorization: `Bearer ${currentUser.accessToken}` },
            }
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

    readMsg();
  }, [chatSingle]);

  return (
    <div className="group-chat">
      <div className="group-chat-header">
        <div className="group-chat-top">
          <h2 className="group-chat-myname">{currentUser.username}</h2>
          <FaRegEdit
            style={{ fontSize: "24px", cursor: "pointer" }}
            onClick={() => handleOpenOptions(setOpenNewchat)}
          />
        </div>

        <div className="group-chat-title">
          <p style={{ fontWeight: 700 }}>Messages</p>
          <p style={{ color: "gray", fontSize: "14px", fontWeight: 500 }}>
            Requests
          </p>
        </div>
      </div>

      {isLoading ? (
        <GroupChatSkeleton groupchat={5} />
      ) : error ? (
        <p>Somethings went wrong...</p>
      ) : (
        <ul className="group-chat-list">
          {data.map((item) => (
            <li
              key={item._id}
              onClick={() => handleOpenMessage(item)}
              className={
                chatSingle === item
                  ? "group-chat-item active"
                  : "group-chat-item"
              }
            >
              <img
                src={getInfoChat(item, currentUser).avatar}
                alt=""
                className="group-chat-img"
              />
              <div className="group-chat-info">
                <p className="group-chat-username">
                  {item.isGroupChat
                    ? item.name
                    : getInfoChat(item, currentUser).name}
                </p>
                <div className="group-chat-latest-msg">
                  <p
                    className={
                      item.latestMessage?.readBy.filter(
                        (mem) => mem._id != currentUser.id
                      )
                        ? "group-chat-latest-msg-text active"
                        : "group-chat-latest-msg-text"
                    }
                  >
                    {!item.latestMessage
                      ? ""
                      : currentUser.id === item.latestMessage?.sender?._id
                      ? `You: ${item.latestMessage?.content} `
                      : item.latestMessage?.content}
                  </p>
                  <span className="group-chat-latest-msg-time">
                    {item.latestMessage &&
                      `• ${formatTime(item.latestMessage?.createdAt)}`}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {openNewchat && (
        <NewChat
          type="Chat"
          setOpenNewchat={setOpenNewchat}
          title="New message"
        />
      )}
    </div>
  );
};

export default GroupChat;
