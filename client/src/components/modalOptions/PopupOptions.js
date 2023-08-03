import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AiOutlineClose } from "react-icons/ai";
import makeRequest from "../../services/makeRequest";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { handleCloseOptions } from "../../services/fetch";
import Loading from "../loadings/Loading";

const PopupOptions = ({
  setOpenCommentOptions,
  commentId,
  ownComment,
  postId,
  author,
  postImage
}) => {
  const { currentUser, errorMessage, successMessage, socket } =
    useContext(AuthContext);
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const { username, avatar } = currentUser;

  const mutation = useMutation(
    async (commentRemove) => {
      setLoading(true);
      await makeRequest
        .delete(`/comments/${commentId}`, {
          headers: { Authorization: `Bearer ${currentUser.accessToken}` },
        })
        .then((res) => {
          successMessage(res.data.message);
          setLoading(false);
          socket.current.emit("send-notifications", {
            sender: { username, avatar },
            receiver: author,
            post: { postId, postImage },
            type: "comment",
          });
        })
        .catch(() => errorMessage("Something went wrong..."));
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["posts", postId]);
      },
    }
  );

  const handleRemoveComment = () => {
    mutation.mutate();
    handleCloseOptions(setOpenCommentOptions);
  };
  return (
    <div
      className="pu-options"
      onClick={(e) =>
        e.target.className === "pu-options" &&
        handleCloseOptions(setOpenCommentOptions)
      }
    >
      {loading && <Loading />}
      <div className="pu-options-container">
        <ul className="pu-options-list">
          <li
            className="pu-options-item"
            onClick={() => handleCloseOptions(setOpenCommentOptions)}
          >
            Report
          </li>
          {ownComment === currentUser.username && (
            <li
              className="pu-options-item"
              style={{ color: "#ed4956", fontWeight: 500 }}
              onClick={handleRemoveComment}
            >
              Remove comment
            </li>
          )}

          <li
            className="pu-options-item"
            onClick={() => handleCloseOptions(setOpenCommentOptions)}
          >
            Cancel
          </li>
        </ul>
      </div>
      <AiOutlineClose
        className="pu-options-close"
        onClick={() => handleCloseOptions(setOpenCommentOptions)}
      />
    </div>
  );
};

export default PopupOptions;
