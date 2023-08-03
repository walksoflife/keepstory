import { useContext } from "react";
import makeRequest from "../makeRequest";
import { AuthContext } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";

// GET INFO USER PROFILE
export const GetUserProfile = (QUERY_KEY, username) => {
  const { currentUser } = useContext(AuthContext);
  try {
    return useQuery([QUERY_KEY, username], () =>
      makeRequest
        .get(`/users/${username}`, {
          headers: { Authorization: `Bearer ${currentUser.accessToken}` },
        })
        .then((res) => res.data.user[0])
    );
  } catch (error) {
    // console.log(error);
  }
};

// GET LIST FOLLOWINGS, FOLLOWERS
export const GetListFriend = (QUERY_KEY) => {
  const { currentUser, setErrorPage } = useContext(AuthContext);
  try {
    return useQuery([QUERY_KEY], () =>
      makeRequest
        .get(`/users/friends`, {
          headers: { Authorization: `Bearer ${currentUser.accessToken}` },
        })
        .then((res) => res.data.users)
        .catch((error) => {
          if (error?.response?.status === 401) {
            setErrorPage(true);
          }
        })
    );
  } catch (error) {
    // console.log(error);
  }
};
