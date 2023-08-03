import { Link } from "react-router-dom";
import { scrollUpToTop } from "../../services/scrollUp";
import { AiFillHeart, AiOutlineCamera } from "react-icons/ai";
import { FaComment, FaImages } from "react-icons/fa";

const PostCreated = ({ posts, typePost }) => {
  return (
    <div className="profile-view-posts">
      {posts?.length > 0 ? (
        <div className="profile-posts-myself">
          {posts.map((post) => (
            <Link
              className="link"
              key={post._id}
              to={`/p/${post._id}`}
              onClick={scrollUpToTop}
            >
              <div className="profile-posts-myself-item">
                {post.image.length > 1 && (
                  <FaImages className="profile-posts-myself-files" />
                )}
                <img
                  src={post.image[0]}
                  alt=""
                  className="profile-posts-myself-img"
                />
                <ul className="profile-posts-myself-info">
                  <li className="profile-posts-myself-info-item">
                    <AiFillHeart className="profile-posts-myself-icon" />
                    <span>{post.likes?.length}</span>
                  </li>
                  <li className="profile-posts-myself-info-item">
                    <FaComment className="profile-posts-myself-icon" />
                    <span>{post.comments?.length}</span>
                  </li>
                </ul>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="profile-text">
          <div className="profile-text-icon">
            <AiOutlineCamera />
          </div>
          {typePost === "postCreated" && <h1>Share Posts</h1>}
          {typePost === "postSaved" && <h1>Saved Posts</h1>}
          {typePost === "postTaged" && <h1>Photos Of You</h1>}

          {typePost === "postCreated" && (
            <p className="profile-text-suggest">
              When you share posts, they will appear on your profile.
            </p>
          )}
          {typePost === "postSaved" && (
            <p className="profile-text-suggest">
              Only you can see what you've saved.
            </p>
          )}
          {typePost === "postTaged" && (
            <p className="profile-text-suggest">
              When people tag you in photos, they'll appear here.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCreated;
