import { AiOutlineSetting } from "react-icons/ai";
import { handleOpenOptions } from "../../services/fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import makeRequest from "../../services/makeRequest";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Loading from "../loadings/Loading";
import { useNavigate } from "react-router-dom";
import SwitchAccount from "../modalOptions/SwitchAccount";

const ProfileInfo = ({
  data,
  isUsername,
  setOpenEditProfile,
  setOpenFollowings,
  setOpenFollowers,
}) => {
  const { currentUser, successMessage, errorMessage, socket, setCurrentUser } =
    useContext(AuthContext);
  const { username, avatar } = currentUser;
  const [openSettings, setOpenSettings] = useState(false);

  // FOLLOW
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const mutation = useMutation(
    async (follow) => {
      setLoading(true);
      await makeRequest
        .post("/users/follow", follow, {
          headers: { Authorization: `Bearer ${currentUser.accessToken}` },
        })
        .then((res) => {
          successMessage(res.data.message);
          setLoading(false);
          if (socket.current) {
            socket.current.emit("send-notifications", {
              sender: { username, avatar },
              receiver: data?._id,
              type: "follow",
            });
          }
        })
        .catch(() => {
          errorMessage("Something went wrong...");
          setLoading(false);
        });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["users", data?.username]);
      },
    }
  );

  const handleFollow = () => {
    mutation.mutate({ friendId: data?._id });
  };

  // settings
  const navigate = useNavigate();
  const handleLogout = () => {
    setLoading(true);
    setCurrentUser({});
    successMessage("You have been logged out");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
    setLoading(false);
  };

  return (
    <div className="profile-info">
      <img src={data.avatar} alt="" className="profile-avatar" />
      <div className="profile-details">
        <div className="profile-details-top">
          <p className="profile-username">{data.username}</p>
          {currentUser.username === isUsername ? (
            <button
              className="profile-edit-btn"
              onClick={() => handleOpenOptions(setOpenEditProfile)}
            >
              Edit profile
            </button>
          ) : (
            <button className="profile-edit-btn follow" onClick={handleFollow}>
              {loading ? (
                <Loading />
              ) : data.followers?.filter((a) => a._id === currentUser.id)
                  ?.length > 0 ? (
                "UnFollow"
              ) : (
                "Follow"
              )}
            </button>
          )}
          {data.followers.includes(currentUser.id) && (
            <button className="profile-edit-btn">Message</button>
          )}
          <AiOutlineSetting
            style={{ fontSize: "24px", cursor: "pointer" }}
            onClick={() => handleOpenOptions(setOpenSettings)}
          />
        </div>
        <div className="profile-details-follow">
          <p className="profile-count">
            <b>{data.posts?.length}</b> posts
          </p>
          <p
            className="profile-count"
            style={{ cursor: "pointer" }}
            onClick={() => handleOpenOptions(setOpenFollowers)}
          >
            <b>{data.followers?.length}</b> followers
          </p>
          <p
            className="profile-count"
            style={{ cursor: "pointer" }}
            onClick={() => handleOpenOptions(setOpenFollowings)}
          >
            <b>{data.followings?.length}</b> following
          </p>
        </div>
        <div className="profile-info-more">
          {data.name && <p>{data.name}</p>}
          {data.bio && <p>{data.bio}</p>}
          {data.location && <p>{data.location}</p>}
        </div>
      </div>
      {openSettings && (
        <SwitchAccount
          setSwitchAccount={setOpenSettings}
          handleLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default ProfileInfo;
