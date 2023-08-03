import { AiOutlineClose } from "react-icons/ai";
import { handleCloseOptions } from "../../services/fetch";
import { useContext, useState } from "react";
import makeRequest from "../../services/makeRequest";
import { AuthContext } from "../../context/AuthContext";
import { MdRadioButtonUnchecked, MdRadioButtonChecked } from "react-icons/md";
import { useQueryClient } from "@tanstack/react-query";
import { ChatContext } from "../../context/ChatContext";
import Loading from "../loadings/Loading";

const NewChat = ({ setOpenNewchat, type, title }) => {
  const { handleOpenMessage, chatSingle } = useContext(ChatContext);
  const { currentUser, successMessage } = useContext(AuthContext);
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingNewChat, setLoadingNewChat] = useState(false);
  const [selectedUser, setSelectedUser] = useState(
    type === "Chat" ? [] : type === "Send" ? [] : chatSingle?.members
  );

  const handleSearch = async (keyword) => {
    setKeyword(keyword);
    if (!keyword) return;

    setLoadingSearch(true);
    try {
      const res = await makeRequest.get(`/users/search?keyword=${keyword}`, {
        headers: { Authorization: `Bearer ${currentUser.accessToken}` },
      });

      setResults(res.data.results);
      setLoadingSearch(false);
    } catch (error) {
      console.log(error);
      setLoadingSearch(false);
    }
  };

  const handleRemoveFriend = (userRemove) => {
    setSelectedUser(selectedUser.filter((s) => s._id !== userRemove._id));
  };
  const handleChooseFriend = (userAdd) => {
    if (selectedUser.map((s) => s._id).includes(userAdd._id)) {
      return;
    }

    setSelectedUser([...selectedUser, userAdd]);
  };

  // create new chat
  const queryClient = useQueryClient();
  const handleChatGroup = async () => {
    let members = JSON.stringify(selectedUser.map((s) => s._id));

    setLoadingNewChat(true);
    if (type === "Chat") {
      // create new chat or get chat created
      const res = await makeRequest.get(`/chats/${members}`, {
        headers: { Authorization: `Bearer ${currentUser.accessToken}` },
      });
      handleOpenMessage(res.data.chat);
    } else if (type === "Add to group" && chatSingle) {
      // add member to group chat
      const res = await makeRequest.patch(
        `/chats/${chatSingle?._id}`,
        { people: members },
        {
          headers: { Authorization: `Bearer ${currentUser.accessToken}` },
        }
      );

      handleOpenMessage(res.data.chat);
      successMessage(res.data.message);
    } else if (type === "Send") {
      console.log("Send");
    } else return;
    queryClient.invalidateQueries(["chats"]);
    setOpenNewchat(false);
    setLoadingNewChat(false);
  };

  return (
    <div
      className="newchat"
      onClick={(e) =>
        e.target.className === "newchat" && handleCloseOptions(setOpenNewchat)
      }
    >
      <div className="newchat-container">
        {loadingNewChat && <Loading />}
        <p className="newchat-title">{title}</p>

        <div className="newchat-search">
          <div className="newchat-friend-choose">
            {selectedUser.map((item) => (
              <div className="newchat-friend-item" key={item._id}>
                <p className="newchat-friend-name">{item.name}</p>
                <AiOutlineClose
                  style={{ cursor: "pointer" }}
                  onClick={() => handleRemoveFriend(item)}
                />
              </div>
            ))}
          </div>
          <span>To:</span>
          <input
            type="text"
            placeholder="Search..."
            className="newchat-input"
            value={keyword}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <div className="newchat-search-results">
          {loadingSearch ? (
            <Loading />
          ) : keyword && results?.length > 0 ? (
            results.map((item) => (
              <div className="newchat-user" key={item._id}>
                <div className="newchat-user-info">
                  <img src={item.avatar} alt="" className="newchat-img" />
                  <div className="newchat-user-name">
                    <p className="newchat-name">{item.name}</p>
                    <p className="newchat-username">{item.username}</p>
                  </div>
                </div>
                {selectedUser.map((s) => s._id).includes(item._id) ? (
                  <MdRadioButtonChecked
                    className="newchat-choose-user"
                    onClick={() => handleChooseFriend(item)}
                  />
                ) : (
                  <MdRadioButtonUnchecked
                    className="newchat-choose-user"
                    onClick={() => handleChooseFriend(item)}
                  />
                )}
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center", color: "gray" }}>
              No search results found
            </p>
          )}
        </div>

        <div className="newchat-btn">
          <button className="newchat-btn-chat" onClick={handleChatGroup}>
            {type}
          </button>
        </div>

        <AiOutlineClose
          className="newchat-close"
          onClick={() => handleCloseOptions(setOpenNewchat)}
        />
      </div>
    </div>
  );
};

export default NewChat;
