import { useContext } from "react";
import makeRequest from "../makeRequest";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";

export const GetMessagesChatSingle = (QUERY_KEY, chatId) => {
  const { currentUser } = useContext(AuthContext);
  try {
    return useQuery([QUERY_KEY, chatId], () =>
      makeRequest
        .get(`/messages/${chatId}`, {
          headers: { Authorization: `Bearer ${currentUser.accessToken}` },
        })
        .then((res) => res.data.messages)
    );
  } catch (error) {
    console.log(error);
  }
};

export const GetRoomWithFriend = (QUERY_KEY, friendId) => {
  try {
    return useQuery([QUERY_KEY, friendId], () =>
      makeRequest
        .get(`/messages/rooms/${friendId}`)
        .then((res) => res.data.room)
    );
  } catch (error) {
    console.log(error);
  }
};
