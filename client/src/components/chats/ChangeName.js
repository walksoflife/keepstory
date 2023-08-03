import { AiOutlineClose } from "react-icons/ai";
import { handleCloseOptions } from "../../services/fetch";
import { useContext, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import makeRequest from "../../services/makeRequest";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import Loading from "../loadings/Loading";

const ChangeName = ({ setOpenChangeName }) => {
  const { chatSingle, setOpenChatDetails } = useContext(ChatContext);
  const { currentUser, successMessage, errorMessage } = useContext(AuthContext);
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (changeNamed) => {
      setLoading(true);
      chatSingle &&
        (await makeRequest
          .patch(`/chats/name/${chatSingle?._id}`, changeNamed, {
            headers: { Authorization: `Bearer ${currentUser.accessToken}` },
          })
          .then((res) => {
            successMessage(res.data.message);
            setLoading(false);
          })
          .catch(() => {
            errorMessage("Something went wrong...");
            setLoading(false);
          }));
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["chats"]);
        queryClient.invalidateQueries(["message", chatSingle._id]);
      },
    }
  );

  const handleChangeName = () => {
    mutation.mutate({ groupName });
    if (!loading) {
      handleCloseOptions(setOpenChangeName);
      setOpenChatDetails(false);
    }
  };

  return (
    <div
      className="change-name"
      onClick={(e) =>
        e.target.className === "change-name" &&
        handleCloseOptions(setOpenChangeName)
      }
    >
      <div className="change-name-container">
        <h2 className="change-name-title">Change group name</h2>
        <p className="change-name-desc">
          Changing the name of a group chat changes it for everyone.
        </p>
        <input
          type="text"
          placeholder="Add a name"
          className="change-name-input"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          autoFocus
        />
        <button className="change-name-btn" onClick={handleChangeName}>
          {loading ? <Loading /> : "Save"}
        </button>
        <AiOutlineClose
          className="change-name-close"
          onClick={() => handleCloseOptions(setOpenChangeName)}
        />
      </div>
    </div>
  );
};

export default ChangeName;
