import { useContext, useState } from "react";
import GroupChat from "../components/chats/GroupChat";
import Sidebar from "../components/sidebars/Sidebar";
import Message from "../components/chats/Message";
import { FaFacebookMessenger } from "react-icons/fa";
import ChatDetails from "../components/chats/ChatDetails";
import { ChatContext } from "../context/ChatContext";
import { handleOpenOptions } from "../services/fetch";
import NewChat from "../components/chats/NewChat";

const Chat = () => {
  const { openChatDetails, isChatting } = useContext(ChatContext);
  const [openNewchat, setOpenNewchat] = useState(false);

  return (
    <div className="chat">
      <Sidebar />
      <div className="chat-container">
        <GroupChat />
        {isChatting ? (
          <Message />
        ) : (
          <div className="chat-guide">
            <div className="chat-guide-icon">
              <FaFacebookMessenger style={{ fontSize: "40px" }} />
            </div>
            <h1>Your Message</h1>
            <p className="chat-guide-text">
              Send private photos and messages to a friend or group.
            </p>
            <button
              className="chat-guide-btn"
              onClick={() => handleOpenOptions(setOpenNewchat)}
            >
              Send Message
            </button>
          </div>
        )}

        {openChatDetails && <ChatDetails />}
        {openNewchat && <NewChat type="Chat" setOpenNewchat={setOpenNewchat} />}
      </div>
    </div>
  );
};

export default Chat;
