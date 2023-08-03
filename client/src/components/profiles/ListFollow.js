import { AiOutlineClose } from "react-icons/ai";
import { handleCloseOptions, handleOpenOptions } from "../../services/fetch";
import { useState } from "react";
import FollowOptions from "../modalOptions/FollowOptions";

const ListFollow = ({
  setOpenFollowings,
  setOpenFollowers,
  openFollowers,
  openFollowings,
  followings,
  followers,
}) => {
  const [openFollow, setOpenFollow] = useState(false);
  return (
    <div
      className="list-fl"
      // onClick={(e) =>
      //   (e.target.className === "list-fl" &&
      //     handleCloseOptions(setOpenFollowers)) ||
      //   (e.target.className === "list-fl" &&
      //     handleCloseOptions(setOpenFollowings))
      // }
    >
      <div className="list-fl-container">
        <p className="list-fl-title">
          {openFollowers ? "Followers" : openFollowings ? "Followings" : null}
        </p>
        <ul className="list-fl-list">
          {openFollowers &&
            followers?.length > 0 &&
            followers.map((item) => (
              <li className="list-fl-item">
                <div className="list-fl-info">
                  <img src={item.avatar} alt="" className="list-fl-img" />
                  <div className="list-fl-info-name">
                    <p className="list-fl-username">{item.username}</p>
                    <p className="list-fl-name">{item.name}</p>
                  </div>
                </div>
                <button className="list-fl-btn">Remove</button>
              </li>
            ))}
        </ul>

        <ul className="list-fl-list">
          {openFollowings &&
            followings?.length > 0 &&
            followings.map((item) => (
              <li className="list-fl-item">
                <div className="list-fl-info">
                  <img src={item.avatar} alt="" className="list-fl-img" />
                  <div className="list-fl-info-name">
                    <p className="list-fl-username">{item.username}</p>
                    <p className="list-fl-name">{item.name}</p>
                  </div>
                </div>
                <button
                  className="list-fl-btn"
                  onClick={() => handleOpenOptions(setOpenFollow)}
                >
                  Following
                </button>
                {openFollow && (
                  <FollowOptions
                    friendId={item?._id}
                    setOpenFollow={setOpenFollow}
                  />
                )}
              </li>
            ))}
        </ul>
      </div>
      {openFollowers && (
        <AiOutlineClose
          className="list-fl-close"
          onClick={() => handleCloseOptions(setOpenFollowers)}
        />
      )}
      {openFollowings && (
        <AiOutlineClose
          className="list-fl-close"
          onClick={() => handleCloseOptions(setOpenFollowings)}
        />
      )}
    </div>
  );
};

export default ListFollow;
