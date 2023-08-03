import { AiOutlineTags } from "react-icons/ai";
import { BiGridAlt } from "react-icons/bi";
import { CiBookmark } from "react-icons/ci";

const ProfilePosts = ({
  setPostSaved,
  setPostCreated,
  setPostTaged,
  postCreated,
  postSaved,
  postTaged,
}) => {
  const handleCliked = (item) => {
    if (item === "created") {
      setPostCreated(true);
      setPostSaved(false);
      setPostTaged(false);
    }
    if (item === "saved") {
      setPostSaved(true);
      setPostCreated(false);
      setPostTaged(false);
    }
    if (item === "tagged") {
      setPostTaged(true);
      setPostSaved(false);
      setPostCreated(false);
    }
  };

  return (
    <div className="profile-posts">
      <div className="profile-posts-header">
        <div
          className={
            postCreated
              ? "profile-posts-header-item active"
              : "profile-posts-header-item"
          }
          onClick={() => handleCliked("created")}
        >
          <BiGridAlt className="profile-post-header-icon" />
          <p className="profile-posts-header-text">POSTS</p>
        </div>
        <div
          className={
            postSaved
              ? "profile-posts-header-item active"
              : "profile-posts-header-item"
          }
          onClick={() => handleCliked("saved")}
        >
          <CiBookmark className="profile-post-header-icon" />
          <p className="profile-posts-header-text">SAVED</p>
        </div>
        <div
          className={
            postTaged
              ? "profile-posts-header-item active"
              : "profile-posts-header-item"
          }
          onClick={() => handleCliked("tagged")}
        >
          <AiOutlineTags className="profile-post-header-icon" />
          <p className="profile-posts-header-text">TAGGED</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePosts;
