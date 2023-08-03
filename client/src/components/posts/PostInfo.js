import { formatTime, handleOpenOptions } from "../../services/fetch";
import UserCard from "../userInfos/UserCard";
import { scrollUpToTop } from "../../services/scrollUp";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import PostOptions from "../modalOptions/PostOptions";
import { AuthContext } from "../../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import makeRequest from "../../services/makeRequest";
import Loading from "../loadings/Loading";

const PostInfo = ({ post }) => {
  const { currentUser, socket, errorMessage } = useContext(AuthContext);
  const [openPostOptions, setOpenPostOptions] = useState(false);
  const [ownPost, setOwnPost] = useState("");
  const [isPostId, setIsPostId] = useState("");
  const [isUserCard, setIsUserCard] = useState(false);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { username, avatar } = currentUser;

  // FOLLOW
  const mutation = useMutation(
    async (follow) => {
      setLoading(true);
      await makeRequest
        .post("/users/follow/fl", follow, {
          headers: { Authorization: `Bearer ${currentUser.accessToken}` },
        })
        .then((res) => {
          setLoading(false);
          if (socket.current) {
            socket.current.emit("send-notifications", {
              sender: { username, avatar },
              receiver: post.author._id,
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
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const handleFollow = () => {
    mutation.mutate({ friendId: post.author._id });
  };

  return (
    <div className="post-info">
      <div
        className="post-info-details"
        onMouseOver={() => setIsUserCard(true)}
        onMouseOut={() => setIsUserCard(false)}
      >
        <Link
          className="link"
          to={`/u/${post.author.username}`}
          onClick={scrollUpToTop}
        >
          <img src={post.author.avatar} alt="" className="post-info-avatar" />
        </Link>
        <Link
          className="link"
          to={`/u/${post.author.username}`}
          onClick={scrollUpToTop}
        >
          <p className="post-info-username">{post.author.username}</p>
        </Link>

        <p className="post-info-created">• {formatTime(post.createdAt)}</p>

        <p className="post-info-btn-fl" onClick={handleFollow}>
          {loading ? (
            <Loading />
          ) : (
            !post.author.followers.includes(currentUser.id) &&
            post.author._id != currentUser.id &&
            "• Follow"
          )}
        </p>

        {isUserCard && <UserCard username={post.author.username} />}
      </div>

      <HiOutlineDotsHorizontal
        className="post-info-options"
        onClick={() =>
          handleOpenOptions(
            setOpenPostOptions,
            post.author.username,
            post._id,
            setOwnPost,
            setIsPostId
          )
        }
      />
      {openPostOptions && (
        <PostOptions
          setOpenPostOptions={setOpenPostOptions}
          ownPost={ownPost}
          postId={isPostId}
        />
      )}
    </div>
  );
};

export default PostInfo;
