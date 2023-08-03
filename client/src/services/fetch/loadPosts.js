import { useContext } from "react";
import makeRequest from "../makeRequest";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";

// GET ALL POSTS
export const GetAllPosts = (QUERY_KEY) => {
  const { currentUser } = useContext(AuthContext);
  try {
    return useQuery([QUERY_KEY], () =>
      makeRequest
        .get("/posts", {
          headers: { Authorization: `Bearer ${currentUser.accessToken}` },
        })
        .then((res) => res.data.posts)
    );
  } catch (error) {}
};

// GET FEED DETAILS
export const GetPostDetails = (QUERY_KEY, postId) => {
  const { currentUser } = useContext(AuthContext);
  try {
    return useQuery([QUERY_KEY, postId], () =>
      makeRequest
        .get(`/posts/${postId}`, {
          headers: { Authorization: `Bearer ${currentUser.accessToken}` },
        })
        .then((res) => res.data.post)
    );
  } catch (error) {}
};
