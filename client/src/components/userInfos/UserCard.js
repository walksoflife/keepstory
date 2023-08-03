import { AiOutlineCamera } from "react-icons/ai";
import { GetUserProfile, handleOpenOptions } from "../../services/fetch";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { scrollUpToTop } from "../../services/scrollUp";
import EditProfile from "../../pages/EditProfile";
import FollowOptions from "../modalOptions/FollowOptions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import makeRequest from "../../services/makeRequest";
import Loading from "../loadings/Loading";

const UserCard = ({ username }) => {
  const { currentUser, setCurrentUser, socket, errorMessage } =
    useContext(AuthContext);
  const { isLoading, data, error } = GetUserProfile("users", username);
  const [openEdit, setOpenEdit] = useState(false);
  const [openFollow, setOpenFollow] = useState(false);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { avatar } = currentUser;

  // FOLLOW
  const mutation = useMutation(
    async (follow) => {
      setLoading(true);
      await makeRequest
        .post("/users/follow/fl", follow, {
          headers: { Authorization: `Bearer ${currentUser.accessToken}` },
        })
        .then((res) => {
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
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const handleFollow = () => {
    mutation.mutate({ friendId: data?._id });
  };

  if (isLoading || error) return;
  return (
    <div className={data.posts.length > 0 ? "user-card" : "user-card no-posts"}>
      <div className="user-card-top">
        <div className="user-card-info">
          <Link
            to={`/u/${data.username}`}
            className="link"
            onClick={scrollUpToTop}
          >
            <img src={data.avatar} alt="" className="user-card-avatar" />
          </Link>
          <div className="user-card-details">
            <Link
              to={`/u/${data.username}`}
              className="link"
              onClick={scrollUpToTop}
            >
              <p className="user-card-username">{data.username}</p>
            </Link>
            <p className="user-card-name">{data.name}</p>
          </div>
        </div>
        <ul className="user-card-title">
          <li className="user-card-item">
            <b>{data.posts.length}</b>
            <p className="user-card-desc">posts</p>
          </li>
          <li className="user-card-item">
            <b>{data.followers.length}</b>
            <p className="user-card-desc">followers</p>
          </li>
          <li className="user-card-item">
            <b>{data.followings.length}</b>
            <p className="user-card-desc">followings</p>
          </li>
        </ul>
      </div>
      {data.posts.length > 0 ? (
        <div className="user-card-posts">
          {data.posts.map((p, index) => {
            if (index < 3) {
              return (
                <img
                  src={p.image[0]}
                  key={p._id}
                  alt=""
                  className="user-card-posts-img"
                />
              );
            }
          })}
        </div>
      ) : (
        <div className="user-card-notice">
          <div className="user-card-icon">
            <AiOutlineCamera />
          </div>

          <h2>No posts yet</h2>

          <p className="user-card-text">
            When {username} shares photos and reels, you'll see them here.
          </p>
        </div>
      )}

      <div className="user-card-actions">
        {data.followers?.filter((a) => a._id === currentUser.id)?.length > 0 ? (
          <>
            <button className="user-card-btn-msg">Message</button>
            <button
              className="user-card-btn-unfollow"
              onClick={() => handleOpenOptions(setOpenFollow)}
            >
              Following
            </button>
          </>
        ) : currentUser.username === username ? (
          <button
            className="user-card-btn-edit"
            onClick={() => handleOpenOptions(setOpenEdit)}
          >
            Edit profile
          </button>
        ) : (
          <button className="user-card-btn-follow" onClick={handleFollow}>
            {loading ? <Loading /> : "Follow"}
          </button>
        )}
      </div>
      {openEdit && (
        <EditProfile
          setOpenEditProfile={setOpenEdit}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          data={data}
        />
      )}
      {openFollow && (
        <FollowOptions friendId={data?._id} setOpenFollow={setOpenFollow} />
      )}
    </div>
  );
};

export default UserCard;
