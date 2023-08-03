import { useMutation, useQueryClient } from "@tanstack/react-query";
import makeRequest from "../../services/makeRequest";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import NewChat from "./NewChat";
import { handleOpenOptions } from "../../services/fetch";
import ChangeName from "./ChangeName";
import { ChatContext } from "../../context/ChatContext";
import { AiOutlineClose } from "react-icons/ai";
import Loading from "../loadings/Loading";

const ChatDetails = () => {
  const { chatSingle, handleOpenMessage } = useContext(ChatContext);
  const { currentUser, successMessage, errorMessage } = useContext(AuthContext);
  const [openNewchat, setOpenNewchat] = useState(false);
  const [openChangeName, setOpenChangeName] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutationChat = useMutation(
    async (chatRemoved) => {
      setLoading(true);
      chatSingle &&
        (await makeRequest
          .delete(`/chats/${chatSingle?._id}`, {
            headers: { Authorization: `Bearer ${currentUser.accessToken}` },
          })
          .then((res) => {
            successMessage(res.data.message);
            setLoading(false);
            setTimeout(() => {
              window.location.reload();
            }, 800);
          })
          .catch(() => {
            errorMessage("Something went wrong...");
            setLoading(false);
          }));
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["chats"]);
      },
    }
  );

  const handleRemovedChat = () => {
    mutationChat.mutate();
  };

  const mutationMember = useMutation(
    async (memberRemoved) => {
      setLoading(true);
      chatSingle &&
        (await makeRequest
          .put(`/chats/${chatSingle?._id}`, memberRemoved, {
            headers: { Authorization: `Bearer ${currentUser.accessToken}` },
          })
          .then((res) => {
            successMessage(res.data.message);
            handleOpenMessage(res.data.chat);
            setLoading(false);
          })
          .catch(() => {
            errorMessage("Something went wrong...");
            setLoading(false);
          }));
    },
    {
      onSuccess: () => {
        // queryClient.invalidateQueries(["message", chatSingle._id]);
        queryClient.invalidateQueries(["chats"]);
      },
    }
  );

  const handleRemovedMember = (userRemoved) => {
    mutationMember.mutate({ userRemoved });
  };

  return (
    <div className="chat-details">
      {loading && <Loading />}
      <p className="chat-details-title">Details</p>
      {chatSingle.isGroupChat && (
        <div className="chat-group">
          <p className="chat-group-name">{chatSingle.name}</p>
          <button
            className="chat-group-btn"
            onClick={() => handleOpenOptions(setOpenChangeName)}
          >
            Change
          </button>
        </div>
      )}

      <div className="chat-members">
        <div className="chat-members-top">
          <p className="chat-members-title">Members</p>
          <p
            className="chat-members-btn"
            onClick={() => handleOpenOptions(setOpenNewchat)}
          >
            {chatSingle.isGroupChat && "Add people"}
          </p>
        </div>
        <ul className="chat-members-list">
          {chatSingle.members.map((item) => (
            <li className="chat-members-item" key={item._id}>
              <div className="chat-members-info">
                <img src={item.avatar} alt="" className="chat-members-img" />
                <div className="chat-members-info-details">
                  <p className="chat-members-username">{item.username}</p>
                  <span className="chat-members-role">
                    {item._id === chatSingle.groupAdmin?._id
                      ? "Admin"
                      : "Member"}
                  </span>
                  <span className="chat-members-name">• {item.name}</span>
                </div>
              </div>
              {chatSingle.isGroupChat && (
                <div
                  className="chat-members-remove-btn"
                  onClick={() => handleRemovedMember(item._id)}
                >
                  <AiOutlineClose />
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="chat-details-more">
        <p className="chat-details-text">
          You won't get messages from this group unless someone adds you back to
          the chat
        </p>
        <p className="chat-details-btn-delete" onClick={handleRemovedChat}>
          Delete chat
        </p>
      </div>
      {openNewchat && (
        <NewChat
          setOpenNewchat={setOpenNewchat}
          type="Add to group"
          title="Add people"
        />
      )}
      {openChangeName && <ChangeName setOpenChangeName={setOpenChangeName} />}
    </div>
  );
};

export default ChatDetails;
