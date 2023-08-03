import { useContext, useEffect, useRef, useState } from "react";
import { BsTelephone, BsCameraVideo } from "react-icons/bs";
import { HiOutlineInformationCircle } from "react-icons/hi";
import makeRequest from "../../services/makeRequest";
import { AuthContext } from "../../context/AuthContext";
import { getInfoChat } from "../../services/fetch";
import Typing from "./Typing";
import { ChatContext } from "../../context/ChatContext";
import { Link } from "react-router-dom";
import moment from "moment";
import FormMessage from "./FormMessage";
import Loading from "../loadings/Loading";

const Message = () => {
  const { setOpenChatDetails, openChatDetails, chatSingle, loadingChat } =
    useContext(ChatContext);
  const { currentUser, socket } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const msgsRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);

  // FETCH ALL MESSAGES OF CHAT
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const res = await makeRequest.get(`/messages/${chatSingle._id}`, {
          headers: { Authorization: `Bearer ${currentUser.accessToken}` },
        });

        setMessages(res.data.messages);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chatSingle]);

  useEffect(() => {
    socket.current && socket.current.emit("join-room", chatSingle._id);
  }, [chatSingle]);

  useEffect(() => {
    socket.current.on("typing", () => setIsTyping(true)); // all users of room can see
    socket.current.on("stop typing", () => setIsTyping(false));
  }, [socket]);

  useEffect(() => {
    msgsRef.current &&
      msgsRef.current.scrollTo({
        top: msgsRef.current.scrollHeight,
        behavior: "smooth",
      });
  }, [messages]);

  if (loadingChat) return <Loading />;

  return (
    <div className="message">
      <div className="message-header">
        <div className="message-header-info">
          <img
            src={getInfoChat(chatSingle, currentUser).avatar}
            alt=""
            className="message-header-img"
          />
          <div className="message-header-detail">
            <p className="message-header-friendName">
              {chatSingle.isGroupChat
                ? chatSingle.name
                : getInfoChat(chatSingle, currentUser).name}
            </p>
            {/* <p className="message-header-active">Active 1h ago</p> */}
          </div>
        </div>

        <div className="message-icons">
          <BsTelephone style={{ fontSize: "24px", cursor: "pointer" }} />
          <BsCameraVideo
            style={{ margin: "0 15px", fontSize: "24px", cursor: "pointer" }}
          />
          <HiOutlineInformationCircle
            style={{ fontSize: "24px", cursor: "pointer" }}
            onClick={() => setOpenChatDetails(!openChatDetails)}
          />
        </div>
      </div>

      <div className="message-container" ref={msgsRef}>
        <div className="message-friend-info">
          <img
            src={getInfoChat(chatSingle, currentUser).avatar}
            alt=""
            className="message-friend-info-img"
          />
          <p className="message-friend-info-name">
            {getInfoChat(chatSingle, currentUser).name}
          </p>
          <p className="message-friend-info-username">
            {getInfoChat(chatSingle, currentUser).username} • Keepstory
          </p>
          {chatSingle.groupAdmin?._id === currentUser.id ? (
            <p>You created this group.</p>
          ) : (
            <Link
              to={`/u/${
                chatSingle.members.filter((m) => m._id !== currentUser.id)[0]
                  .username
              }`}
              className="link"
            >
              <button className="message-friend-info-btn">View profile</button>
            </Link>
          )}
        </div>

        {loading ? (
          <Loading />
        ) : (
          messages.map((item, index) => (
            <div
              className={
                item.sender._id === currentUser.id ? "msg myself" : "msg"
              }
              key={item._id}
            >
              {item.sender._id !== messages[index + 1]?.sender._id && (
                <img src={item.sender.avatar} alt="" className="msg-avatar" />
              )}
              <p
                className="msg-text"
                style={{
                  marginLeft:
                    item.sender._id === messages[index + 1]?.sender._id
                      ? "36px"
                      : "0",
                }}
              >
                {item.content}
                <p
                  className={
                    item.sender._id === currentUser.id
                      ? "msg-time myself"
                      : "msg-time"
                  }
                >
                  {moment(item.createdAt).format("h:mm A")}
                </p>
              </p>
              {/* <div
                className={
                  item.sender._id === currentUser.id
                    ? "msg-options myself"
                    : "msg-options"
                }
              >
                <HiOutlineDotsHorizontal className="msg-icon" />
                <ul className="msg-select">
                  <li className="msg-item">Copy</li>
                  <li className="msg-item">Unsend</li>
                  <li className="msg-item">Cancel</li>
                </ul>
              </div> */}
            </div>
          ))
        )}
        {isTyping ? <Typing /> : null}
      </div>

      <FormMessage
        chatSingle={chatSingle}
        setMessages={setMessages}
        messages={messages}
      />
    </div>
  );
};

export default Message;
