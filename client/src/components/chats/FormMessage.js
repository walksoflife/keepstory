import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import makeRequest from "../../services/makeRequest";
import { BsEmojiSmile, BsFileImage } from "react-icons/bs";
import { HiOutlineMicrophone } from "react-icons/hi";
import { AiOutlineHeart } from "react-icons/ai";
import Loading from "../loadings/Loading";

const FormMessage = ({ chatSingle, setMessages }) => {
  const { socket, currentUser } = useContext(AuthContext);
  const [content, setContent] = useState("");
  const [loadingMsg, setLoadingMsg] = useState(false);
  const [openEmojis, setOpenEmojis] = useState(false);
  const [typingContent, setTypingContent] = useState(false);

  // SEND MESSAGE
  const handelSendMessage = async (e) => {
    e.preventDefault();
    if ((e.key === "Enter" || e.type === "submit") && content) {
      socket.current && socket.current.emit("stop typing", chatSingle._id);

      try {
        setLoadingMsg(true);
        if (!content) return;
        let newMsg = { content, chatId: chatSingle._id };
        const res = await makeRequest.post("/messages", newMsg, {
          headers: { Authorization: `Bearer ${currentUser.accessToken}` },
        });

        socket.current && socket.current.emit("send-message", res.data.msg);
        setMessages((prev) => [...prev, res.data.msg]);
        setLoadingMsg(false);
        setContent("");
      } catch (error) {
        setLoadingMsg(false);
      }
    }
  };

  useEffect(() => {
    socket.current &&
      socket.current.on("get-message", (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
  }, [socket]);

  // HANDLE TYPING
  const handleTyping = (e) => {
    setContent(e.target.value);
    if (!typingContent && socket.current) {
      setTypingContent(true);
      socket.current.emit("typing", chatSingle._id);
    }
    let lastTypingTime = new Date().getTime();
    let timeDelay = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeChange = timeNow - lastTypingTime;
      if (timeChange >= timeDelay && typingContent) {
        setTypingContent(false);
        socket.current && socket.current.emit("stop typing", chatSingle._id);
      }
    }, timeDelay);
  };
  
  return (
    <div className="message-form">
      <form onSubmit={handelSendMessage}>
        <div className="message-form-left">
          <BsEmojiSmile
            style={{ fontSize: "24px", cursor: "pointer" }}
            onClick={() => setOpenEmojis(!openEmojis)}
          />
          {loadingMsg && <Loading />}
          <input
            type="text"
            placeholder="Message..."
            className="message-input"
            value={content}
            onChange={handleTyping}
          />
        </div>
        {content ? (
          <button type="submit" className="message-send-btn">
            Send
          </button>
        ) : (
          <div className="message-actions">
            <HiOutlineMicrophone
              style={{ fontSize: "24px", cursor: "pointer" }}
            />
            <BsFileImage
              style={{
                margin: "0 15px",
                fontSize: "24px",
                cursor: "pointer",
              }}
            />
            <AiOutlineHeart style={{ fontSize: "24px", cursor: "pointer" }} />
          </div>
        )}
      </form>
    </div>
  );
};

export default FormMessage;
