import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Caption = ({ caption, setCaption }) => {
  const { currentUser } = useContext(AuthContext);
  return (
    <div className="create-caption">
      <div className="create-info">
        <img src={currentUser.avatar} alt="" className="create-info-img" />
        <p className="create-info-username">{currentUser.username}</p>
      </div>
      <textarea
        autoFocus
        name="caption"
        id=""
        cols="30"
        rows="10"
        placeholder="Write a caption..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      ></textarea>
    </div>
  );
};

export default Caption;
