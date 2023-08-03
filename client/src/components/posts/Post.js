import { Link } from "react-router-dom";
import PostActions from "./PostActions";
import PostImage from "./PostImage";
import PostInfo from "./PostInfo";

const Post = ({ post }) => {
  return (
    <div className="post" key={post._id}>
      <PostInfo post={post} />

      <PostImage post={post} />

      <PostActions postId={post._id} post={post} />

      {post.likes.length > 0 && (
        <p className="post-text">
          <b style={{ fontSize: "14px" }}>{post.likes.length} likes</b>
        </p>
      )}

      <div className="post-title">
        <p className="post-title-username">{post.author.username}</p>
        <p className="post-title-caption">
          {post.caption.length > 40
            ? `${post.caption.substring(0, 40)}...`
            : post.caption}
          {post.caption.length > 40 && (
            <Link to={`/p/${post._id}`} className="link">
              <span className="post-viewmore">View more</span>
            </Link>
          )}
        </p>
      </div>
    </div>
  );
};

export default Post;
