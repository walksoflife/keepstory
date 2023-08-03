import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AiOutlineClose } from "react-icons/ai";
import { Link } from "react-router-dom";
import makeRequest from "../../services/makeRequest";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { handleCloseOptions } from "../../services/fetch";
import Loading from "../loadings/Loading";

const PostOptions = ({ setOpenPostOptions, ownPost, postId }) => {
  const { currentUser, successMessage, errorMessage } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const mutation = useMutation(
    async (postRemove) => {
      setLoading(true);
      await makeRequest
        .delete(`/posts/${postId}`, {
          headers: { Authorization: `Bearer ${currentUser.accessToken}` },
        })
        .then((res) => {
          successMessage(res.data.message);
          setLoading(false);
          handleCloseOptions(setOpenPostOptions);
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

  const handleRemovePost = () => {
    mutation.mutate();
  };

  const copyUrl = (url) => {
    navigator?.clipboard
      ?.writeText(url)
      .then(() => successMessage("Link copied to clipboard"))
      .catch(() => errorMessage("Can not copy to link"));

    handleCloseOptions(setOpenPostOptions);
  };

  return (
    <div
      className="po"
      onClick={(e) =>
        e.target.className === "po" && handleCloseOptions(setOpenPostOptions)
      }
    >
      {loading && <Loading />}
      <div className="po-container">
        <ul className="po-list">
          {ownPost === currentUser.username && (
            <li
              className="po-item"
              style={{ color: "#ed4956", fontWeight: 500 }}
              onClick={handleRemovePost}
            >
              Remove post
            </li>
          )}

          <li className="po-item">
            <Link
              to={`/p/${postId}`}
              className="link"
              onClick={() => handleCloseOptions(setOpenPostOptions)}
            >
              Go to post
            </Link>
          </li>

          <li
            className="po-item"
            onClick={() => copyUrl(`${process.env.REACT_APP_API}/p/${postId}`)}
          >
            Copy link
          </li>
          <li className="po-item">Share to...</li>

          <li className="po-item">
            <Link
              to={`/u/${ownPost}`}
              className="link"
              onClick={() => handleCloseOptions(setOpenPostOptions)}
            >
              About this account
            </Link>
          </li>

          <li
            className="po-item"
            onClick={() => handleCloseOptions(setOpenPostOptions)}
          >
            Cancel
          </li>
        </ul>
      </div>
      <AiOutlineClose
        className="po-close"
        onClick={() => handleCloseOptions(setOpenPostOptions)}
      />
    </div>
  );
};

export default PostOptions;
