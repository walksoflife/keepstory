import { useMutation, useQueryClient } from "@tanstack/react-query";
import Loading from "../loadings/Loading";
import makeRequest from "../../services/makeRequest";
import { useEffect, useRef, useState } from "react";
import { handleOpenOptions } from "../../services/fetch";
import FollowOptions from "../modalOptions/FollowOptions";

const SgItem = ({ item, currentUser, data }) => {
  const [loadingFl, setLoadingFl] = useState(false);
  const queryClient = useQueryClient();
  const [openFollowing, setOpenFollowing] = useState(false);
  const sgItemRef = useRef();

  const mutaion = useMutation(
    async (followed) => {
      setLoadingFl(true);
      await makeRequest
        .post("/users/follow/fl", followed, {
          headers: { Authorization: `Bearer ${currentUser.accessToken}` },
        })
        .then((res) => {
          setLoadingFl(false);
        })
        .catch(() => {
          setLoadingFl(false);
        });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["friends"]);
      },
    }
  );

  const handleFl = (friendId) => {
    if (friendId) {
      mutaion.mutate({ friendId });
    }
  };

  useEffect(() => {
    if (openFollowing) {
      sgItemRef.current &&
        sgItemRef.current.parentElement.classList.remove("load");
    } else {
      sgItemRef.current &&
        sgItemRef.current.parentElement.classList.add("load");
    }
  }, [openFollowing]);

  return (
    <li className="sg-item" ref={sgItemRef}>
      <div className="sg-info">
        <img src={item.avatar} alt="" className="sg-img" />
        <div className="sg-info-details">
          <p className="sg-username">{item.username}</p>
          <p className="sg-name">{item.name}</p>
        </div>
      </div>
      {!data?.followings?.includes(item._id) && (
        <button className="sg-btn follow" onClick={() => handleFl(item._id)}>
          {loadingFl ? <Loading /> : "Follow"}
        </button>
      )}
      {data?.followings?.includes(item._id) && (
        <button
          className="sg-btn following"
          onClick={() => handleOpenOptions(setOpenFollowing)}
        >
          Following
        </button>
      )}
      {openFollowing && (
        <FollowOptions setOpenFollow={setOpenFollowing} friendId={item._id} />
      )}
    </li>
  );
};

export default SgItem;
