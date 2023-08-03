import { useContext, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { handleCloseOptions } from "../services/fetch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import makeRequest from "../services/makeRequest";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Loading from "../components/loadings/Loading";

const EditProfile = ({
  setOpenEditProfile,
  currentUser,
  setCurrentUser,
  data,
}) => {
  const [name, setName] = useState(data?.name);
  const [username, setUsername] = useState(data?.username);
  const [email, setEmail] = useState(data?.email);
  const [bio, setBio] = useState(data?.bio);
  const [location, setLocation] = useState(data?.location);
  const [fileImg, setFileImg] = useState();
  const [loading, setLoading] = useState(false);

  let oldUsername = data?.username;
  const navigate = useNavigate();
  const { successMessage, errorMessage } = useContext(AuthContext);

  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (newUser) => {
      setLoading(true);
      await makeRequest
        .patch("/users", newUser, {
          headers: { Authorization: `Bearer ${currentUser.accessToken}` },
        })
        .then((res) => {
          successMessage(res.data.message);
          let { id, username, avatar } = res.data.user;
          setCurrentUser({
            id,
            username,
            avatar,
            accessToken: currentUser.accessToken,
          });
          setLoading(false);
          handleCloseOptions(setOpenEditProfile);
          navigate("/");
        })
        .catch(() => {
          errorMessage("Something went wrong...");
          setLoading(false);
        });
    },
    {
      onSuccess: () => {
        oldUsername !== currentUser.username &&
          queryClient.invalidateQueries(["users", currentUser.username]);
      },
    }
  );

  const handleEditProfile = (e) => {
    e.preventDefault();

    const userData = new FormData();
    userData.append("name", name);
    userData.append("username", username);
    userData.append("email", email);
    bio && userData.append("bio", bio);
    location && userData.append("location", location);
    if (fileImg) userData.append("avatar", fileImg);

    mutation.mutate(userData);
  };

  return (
    <div
      className="edit"
      onClick={(e) =>
        e.target.className === "edit" && handleCloseOptions(setOpenEditProfile)
      }
    >
      {loading && <Loading />}
      <div className="edit-container">
        <h2>Edit profile</h2>
        <form className="edit-profile">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            className="edit-form-input"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="User Name"
            value={username}
            className="edit-form-input"
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="Email"
            value={email}
            className="edit-form-input"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Bio"
            value={bio}
            className="edit-form-input"
            onChange={(e) => setBio(e.target.value)}
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            className="edit-form-input"
            onChange={(e) => setLocation(e.target.value)}
          />
          <div className="form-edit-group">
            <input
              type="file"
              className="edit-profile-img"
              onChange={(e) => setFileImg(e.target.files[0])}
            />
            {fileImg && <img src={URL.createObjectURL(fileImg)} alt="" />}
          </div>
          <button className="edit-btn" onClick={handleEditProfile}>
            Submit
          </button>
        </form>
      </div>
      <AiOutlineClose
        className="edit-close"
        onClick={() => handleCloseOptions(setOpenEditProfile)}
      />
    </div>
  );
};

export default EditProfile;
