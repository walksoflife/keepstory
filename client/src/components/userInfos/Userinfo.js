import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import makeRequest from "../../services/makeRequest";
import { AuthContext } from "../../context/AuthContext";
import Loading from "../loadings/Loading";
import UserCard from "./UserCard";

const Userinfo = ({ user }) => {
  // FOLLOW
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [typeBtn, setTypeBtn] = useState("Follow");
  const [isUserCard, setIsUserCard] = useState(false);
  const { currentUser, successMessage, errorMessage } = useContext(AuthContext);

  const mutation = useMutation(
    async (follow) => {
      setLoading(true);
      await makeRequest
        .post("/users/follow", follow, {
          headers: { Authorization: `Bearer ${currentUser.accessToken}` },
        })
        .then((res) => {
          successMessage(res.data.message);
          setTypeBtn("");
          setLoading(false);
        })
        .catch(() => errorMessage("Something went wrong..."));
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const handleFollow = (friendId) => {
    mutation.mutate({ friendId });
  };

  return (
    <div className="userinfo">
      <Link to={`/u/${user.username}`} className="link">
        <div
          className="userinfo-details"
          onMouseOver={() => setIsUserCard(true)}
          onMouseOut={() => setIsUserCard(false)}
        >
          <img src={user.avatar} alt="" className="userinfo-img" />
          <p className="userinfo-username">{user.username}</p>
          {isUserCard && <UserCard username={user.username} />}
        </div>
      </Link>
      <div className="userinfo-btn" onClick={() => handleFollow(user._id)}>
        {loading ? <Loading /> : typeBtn}
      </div>
    </div>
  );
};

export default Userinfo;
