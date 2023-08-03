import { Link } from "react-router-dom";
import { formatTime, handleOpenOptions } from "../../services/fetch";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import PopupOptions from "../modalOptions/PopupOptions";
import { useState } from "react";

const Comment = ({
  item,
  setIsReplying,
  setCommentParent,
  replies,
  postId,
  setContent,
  commentParent,
  postImage,
}) => {
  const [ownComment, setOwnComment] = useState("");
  const [isCommentId, setIsCommentId] = useState("");
  const [openCommentOptions, setOpenCommentOptions] = useState(false);
  const [viewReplyComment, setViewReplyComment] = useState(false);
  const [viewMoreCm, setViewMoreCm] = useState(false);

  const handleReplying = () => {
    setIsReplying(true);
    setContent(`@${item.author?.username} `);
    setCommentParent(commentParent ? commentParent : item._id);
  };

  return (
    <div className="pd-list-item">
      <Link to={`/u/${item.author?.username}`} className="link">
        <img src={item.author?.avatar} alt="" className="pd-comment-img" />
      </Link>
      <div className="pd-comment-title">
        <p className="pd-comment-username">
          <Link to={`/u/${item.author?.username}`} className="link">
            <b style={{ fontSize: "15px" }}>{item.author?.username}</b>
          </Link>
          <span>
            {viewMoreCm ? (
              `${item.content.substring(0, 120)}...`
            ) : item.commentParent ? (
              <Link to={`/u/${item.author?.username}`} className="link">
                <b className="pd-comment-tag">{`${
                  item.content.split(" ")[0]
                }`}</b>
              </Link>
            ) : (
              item.content.split(" ")[0]
            )}
            {item.content.substring(item.content.split(" ")[0].length)}
            {item.content.length > 120 && (
              <b
                className="pd-comment-viewmore"
                onClick={() => setViewMoreCm(!viewMoreCm)}
              >
                {viewMoreCm ? "View more" : "Less more"}
              </b>
            )}
          </span>
        </p>

        <div className="pd-comment-actions">
          <span>{formatTime(item.createdAt)}</span>
          <span style={{ cursor: "pointer" }} onClick={handleReplying}>
            Reply
          </span>
          <HiOutlineDotsHorizontal
            style={{ fontSize: "16px", cursor: "pointer", color: "gray" }}
            onClick={() =>
              handleOpenOptions(
                setOpenCommentOptions,
                item.author?.username,
                item._id,
                setOwnComment,
                setIsCommentId
              )
            }
          />
        </div>
        {replies?.length > 0 && (
          <p
            className="pd-comment-view-reply"
            onClick={() => setViewReplyComment(!viewReplyComment)}
          >
            ------
            <b>
              {viewReplyComment
                ? `Hide replies ( ${replies.length} )`
                : `View replies ( ${replies.length} )`}
            </b>
          </p>
        )}
        {viewReplyComment &&
          replies?.length > 0 &&
          replies.map((c) => (
            <Comment
              key={c._id}
              item={c}
              setIsReplying={setIsReplying}
              postId={postId}
              setContent={setContent}
              setCommentParent={setCommentParent}
              replies={[]}
              postImage={postImage}
              commentParent={item._id}
            />
          ))}
      </div>

      {openCommentOptions && (
        <PopupOptions
          ownComment={ownComment}
          commentId={isCommentId}
          setOpenCommentOptions={setOpenCommentOptions}
          postId={postId}
          author={item.author?._id}
          postImage={postImage}
        />
      )}
    </div>
  );
};

export default Comment;
