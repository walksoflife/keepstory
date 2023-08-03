import { createContext, useState } from "react";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const [isChatting, setIsChatting] = useState(false);
  const [openChatDetails, setOpenChatDetails] = useState(false);
  const [chatSingle, setChatSingle] = useState({});
  const [loadingChat, setLoadingChat] = useState(false);
  const [notifyMsg, setNotifyMsg] = useState({});

  const handleOpenMessage = (members) => {
    setLoadingChat(true);
    setIsChatting(true);
    setChatSingle(members);
    setOpenChatDetails(false);
    setLoadingChat(false);
  };

  return (
    <ChatContext.Provider
      value={{
        isChatting,
        openChatDetails,
        setOpenChatDetails,
        chatSingle,
        setChatSingle,
        handleOpenMessage,
        loadingChat,
        setNotifyMsg,
        notifyMsg,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
