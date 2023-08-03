import { Link } from "react-router-dom";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useContext, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import makeRequest from "../../services/makeRequest";
import { AuthContext } from "../../context/AuthContext";
import Loading from "../loadings/Loading";

const PdHeader = ({ data, postId }) => {
  const { currentUser, successMessage, errorMessage, socket } =
    useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { username, avatar } = currentUser;

  // FOLLOW
  const mutation = useMutation(
    async (follow) => {
      setLoading(true);
      await makeRequest
        .post("/users/follow", follow, {
          headers: { Authorization: `Bearer ${currentUser.accessToken}` },
        })
        .then((res) => {
          successMessage(res.data.message);
          setLoading(false);
          if (socket.current) {
            socket.current.emit("send-notifications", {
              sender: { username, avatar },
              receiver: data?.author?._id,
              type: "follow",
            });
          }
        })
        .catch(() => {
          errorMessage("Something went wrong...");
          setLoading(false);
        });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["posts", postId]);
      },
    }
  );

  const handleFollow = () => {
    mutation.mutate({ friendId: data?.author?._id });
  };

  return (
    <div className="pd-top">
      <div className="pd-top-left">
        <Link to={`/u/${data.author.username}`} className="link">
          <img src={data.author.avatar} alt="" />
        </Link>
        <Link to={`/u/${data.author.username}`} className="link">
          <p className="pd-top-left-username">{data.author.username}</p>
        </Link>
        <p className="pd-top-btn" onClick={handleFollow}>
          {loading ? (
            <Loading />
          ) : (
            !data.author.followers.includes(currentUser.id) &&
            data.author.username !== currentUser.username &&
            "Follow"
          )}
        </p>
      </div>
      <HiOutlineDotsHorizontal style={{ fontSize: "24px" }} />
    </div>
  );
};

export default PdHeader;
