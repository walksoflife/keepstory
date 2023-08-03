import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BsEmojiSmile } from "react-icons/bs";
import makeRequest from "../../services/makeRequest";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Loading from "../loadings/Loading";

const AddComment = ({
  postId,
  isReplying,
  setIsReplying,
  commentParent,
  author,
  postImage,
  content,
  setContent,
}) => {
  const { currentUser, successMessage, errorMessage, socket } =
    useContext(AuthContext);
  const { username, avatar } = currentUser;
  const queryClient = useQueryClient();
  const contentRef = useRef();
  const [loading, setLoading] = useState(false);

  const mutation = useMutation(
    async (newComment) => {
      setLoading(true);
      await makeRequest
        .post("/comments", newComment, {
          headers: { Authorization: `Bearer ${currentUser.accessToken}` },
        })
        .then((res) => {
          successMessage(res.data.message);
          setLoading(false);
          if (socket.current) {
            socket.current.emit("send-notifications", {
              sender: { username, avatar },
              receiver: author,
              post: { postId, postImage },
              type: "comment",
            });
          }
        })
        .catch((err) => {
          console.log(err);
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

  useEffect(() => {
    isReplying && contentRef.current.focus();
  }, [isReplying]);

  const handleAddComment = (e) => {
    e.preventDefault();

    if (isReplying) {
      mutation.mutate({
        content,
        post: postId,
        commentParent,
        isReply: isReplying,
      });
    } else {
      mutation.mutate({ content, post: postId });
    }
    setContent("");
    setIsReplying(false);
  };

  return (
    <form className="pd-add-comment">
      <BsEmojiSmile style={{ fontSize: "24px" }} />
      {loading && <Loading />}
      <input
        type="text"
        placeholder="Add a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        autoFocus
        ref={contentRef}
      />
      <button className="pd-add-submit" onClick={handleAddComment}>
        Post
      </button>
    </form>
  );
};

export default AddComment;
