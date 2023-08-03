import { AiOutlineHeart, AiFillHeart, AiOutlineSend } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { RxBookmark, RxBookmarkFilled } from "react-icons/rx";
import { Link } from "react-router-dom";
import { scrollUpToTop } from "../../services/scrollUp";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import makeRequest from "../../services/makeRequest";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import NewChat from "../chats/NewChat";

const PostActions = ({ postId, post, isPostDetails }) => {
  const { currentUser, successMessage, errorMessage, socket } =
    useContext(AuthContext);
  const queryClient = useQueryClient();
  const { username, avatar } = currentUser;
  const [openSend, setSend] = useState(false);

  // LIKE / DISLIKE POST
  const mutationLiked = useMutation(
    async (liked) =>
      await makeRequest
        .post("/posts/like", liked, {
          headers: { Authorization: `Bearer ${currentUser.accessToken}` },
        })
        .then((res) => {
          if (socket.current) {
            socket.current.emit("send-notifications", {
              sender: { username, avatar },
              receiver: post.author?._id,
              post: { postId, postImage: post.image[0] },
              type: "like",
            });
          }
        })
        .catch(() => errorMessage("Something went wrong...")),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const handleLiked = () => {
    mutationLiked.mutate({ postLiked: postId });
  };

  // BOOKMARK POST
  const mutationBookmark = useMutation(
    async (bookmarked) =>
      await makeRequest
        .post("/posts/bookmark", bookmarked, {
          headers: { Authorization: `Bearer ${currentUser.accessToken}` },
        })
        .then((res) => successMessage(res.data.message))
        .catch(() => errorMessage("Something went wrong...")),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const handleBookmark = () => {
    mutationBookmark.mutate({ postBookmark: postId });
  };

  return (
    <div className="post-actions">
      <div className="post-actions-left">
        {post?.likes.includes(currentUser.id) ? (
          <AiFillHeart
            className="post-icon"
            style={{ color: "#ff3040" }}
            onClick={handleLiked}
          />
        ) : (
          <AiOutlineHeart className="post-icon" onClick={handleLiked} />
        )}
        {isPostDetails ? (
          <FaRegComment className="post-icon" />
        ) : (
          <Link className="link" to={`/p/${postId}`} onClick={scrollUpToTop}>
            <FaRegComment className="post-icon" />
          </Link>
        )}
        <AiOutlineSend className="post-icon" onClick={() => setSend(true)} />
      </div>
      <div className="post-actions-right">
        {post?.bookmarks.includes(currentUser.id) ? (
          <RxBookmarkFilled className="post-icon" onClick={handleBookmark} />
        ) : (
          <RxBookmark className="post-icon" onClick={handleBookmark} />
        )}
      </div>
      {openSend && (
        <NewChat setOpenNewchat={setSend} type="Send" title="Share" />
      )}
    </div>
  );
};

export default PostActions;
