import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AiOutlineClose } from "react-icons/ai";
import makeRequest from "../../services/makeRequest";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { handleCloseOptions } from "../../services/fetch";
import Loading from "../loadings/Loading";

const FollowOptions = ({ setOpenFollow, friendId }) => {
  const { currentUser, errorMessage, successMessage, socket } =
    useContext(AuthContext);
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const { username, avatar } = currentUser;

  // FOLLOW
  const mutation = useMutation(
    async (follow) => {
      setLoading(true);
      await makeRequest
        .post("/users/follow/unfl", follow, {
          headers: { Authorization: `Bearer ${currentUser.accessToken}` },
        })
        .then((res) => {
          successMessage(res.data.message);
          setLoading(false);
          if (socket.current) {
            socket.current.emit("send-notifications", {
              sender: { username, avatar },
              receiver: friendId,
              type: "follow",
            });
          }
          handleCloseOptions(setOpenFollow);
        })
        .catch(() => {
          errorMessage("Something went wrong...");
          setLoading(false);
        });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["posts"]);
        queryClient.invalidateQueries(["friends"]);
        queryClient.invalidateQueries(["users", username]);
      },
    }
  );

  const handleUnFollow = () => {
    mutation.mutate({ friendId });
  };

  return (
    <div
      className="pu-options"
      onClick={(e) =>
        e.target.className === "pu-options" && handleCloseOptions(setOpenFollow)
      }
    >
      {loading && <Loading />}
      <div className="pu-options-container">
        <ul className="pu-options-list">
          <li
            className="pu-options-item"
            style={{ color: "#ed4956", fontWeight: 500 }}
            onClick={handleUnFollow}
          >
            UnFollow
          </li>

          <li
            className="pu-options-item"
            onClick={() => handleCloseOptions(setOpenFollow)}
          >
            Cancel
          </li>
        </ul>
      </div>
      <AiOutlineClose
        className="pu-options-close"
        onClick={() => handleCloseOptions(setOpenFollow)}
      />
    </div>
  );
};

export default FollowOptions;
