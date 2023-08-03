import { Link } from "react-router-dom";
import { formatTime, handleOpenOptions } from "../../services/fetch";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import PopupOptions from "../modalOptions/PopupOptions";

const CommentInfo = ({
  item,
  viewMoreCm,
  setViewMoreCm,
  handleReplying,
  setOpenCommentOptions,
  setOwnComment,
  setIsCommentId,
  replyComments,
  setViewReplyComment,
  viewReplyComment,
  openCommentOptions,
  ownComment,
  isCommentId,
  postId,
}) => {
  return (
    <div className="pd-list-item">
      <Link to={`/u/${item.author?.username}`} className="link">
        <img src={item.author?.avatar} alt="" className="pd-comment-img" />
      </Link>
      <div className="pd-comment-title">
        <p className="pd-comment-username">
          <Link to={`/u/${item.author?.username}`} className="link">
            <b>{item.author?.username}</b>
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
          <span
            style={{ cursor: "pointer" }}
            onClick={() => handleReplying(item._id)}
          >
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
        {replyComments?.length > 0 && (
          <p
            className="pd-comment-view-reply"
            onClick={() => setViewReplyComment(!viewReplyComment)}
          >
            ------
            <b style={{ fontSize: "12px", marginLeft: "14px" }}>
              {viewReplyComment
                ? `Hide replies ( ${replyComments.length} )`
                : `View replies ( ${replyComments.length} )`}
            </b>
          </p>
        )}
      </div>
      {openCommentOptions && (
        <PopupOptions
          ownComment={ownComment}
          commentId={isCommentId}
          setOpenCommentOptions={setOpenCommentOptions}
          postId={postId}
          author={item.author?.username}
        />
      )}
    </div>
  );
};

export default CommentInfo;
