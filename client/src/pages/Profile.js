import Sidebar from "../components/sidebars/Sidebar";
import { GetUserProfile } from "../services/fetch";
import { useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import EditProfile from "./EditProfile";
import { AuthContext } from "../context/AuthContext";
import ListFollow from "../components/profiles/ListFollow";
import ProfileInfo from "../components/profiles/ProfileInfo";
import ProfileStories from "../components/profiles/ProfileStories";
import ProfilePosts from "../components/profiles/ProfilePosts";
import PostCreated from "../components/profiles/PostCreated";
import Loading from "../components/loadings/Loading";
import Footer from "../components/footer/Footer";

const Profile = () => {
  const isUsername = useLocation().pathname?.split("/")[2];
  const { currentUser, setCurrentUser, openCreate, setOpenCreate } =
    useContext(AuthContext);

  const { isLoading, data, error } = GetUserProfile("users", isUsername);

  const [openFollowers, setOpenFollowers] = useState(false);
  const [openFollowings, setOpenFollowings] = useState(false);
  const [openEditProfile, setOpenEditProfile] = useState(false);

  const [postTaged, setPostTaged] = useState(false);
  const [postSaved, setPostSaved] = useState(false);
  const [postCreated, setPostCreated] = useState(true);

  return (
    <div className="profile">
      <Sidebar openCreate={openCreate} setOpenCreate={setOpenCreate} />
      <div className="profile-container">
        {isLoading ? (
          <Loading />
        ) : error ? (
          <p
            style={{
              textAlign: "center",
              fontSize: "20px",
              marginTop: "40px",
            }}
          >
            Something went wrongs...
          </p>
        ) : (
          <div className="profile-main">
            <ProfileInfo
              data={data}
              isUsername={isUsername}
              currentUser={currentUser}
              setOpenFollowers={setOpenFollowers}
              setOpenFollowings={setOpenFollowings}
              setOpenEditProfile={setOpenEditProfile}
            />
            <ProfileStories />

            <ProfilePosts
              setPostSaved={setPostSaved}
              setPostCreated={setPostCreated}
              setPostTaged={setPostTaged}
              postTaged={postTaged}
              postSaved={postSaved}
              postCreated={postCreated}
            />

            {postCreated && (
              <PostCreated posts={data?.posts} typePost="postCreated" />
            )}
            {postSaved && (
              <PostCreated posts={data?.bookmarks} typePost="postSaved" />
            )}
            {postTaged && <PostCreated posts={[]} typePost="postTaged" />}
          </div>
        )}
        <Footer />
      </div>
      {openEditProfile && (
        <EditProfile
          setOpenEditProfile={setOpenEditProfile}
          currentUser={currentUser}
          data={data}
          setCurrentUser={setCurrentUser}
        />
      )}
      {openFollowers && (
        <ListFollow
          openFollowers={openFollowers}
          setOpenFollowers={setOpenFollowers}
          followers={data.followers}
        />
      )}

      {openFollowings && (
        <ListFollow
          openFollowings={openFollowings}
          setOpenFollowings={setOpenFollowings}
          followings={data.followings}
        />
      )}
    </div>
  );
};

export default Profile;
