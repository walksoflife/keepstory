import { AiOutlinePlus } from "react-icons/ai";

const ProfileStories = () => {
  return (
    <div className="profile-highlight-stories">
      <div className="profile-story">
        <img
          src="https://i.pinimg.com/564x/17/51/d2/1751d2aa3f581b31c2ade112b2a885ae.jpg"
          alt=""
          className="profile-story-img"
        />
        <p className="profile-story-name">Highlight story</p>
      </div>
      <div className="profile-story-create">
        <div className="profile-story-create-icon">
          <AiOutlinePlus style={{ fontSize: "40px" }} />
        </div>
        <p className="profile-story-create-text">New</p>
      </div>
    </div>
  );
};

export default ProfileStories;
