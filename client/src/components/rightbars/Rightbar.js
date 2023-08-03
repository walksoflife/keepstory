import { useContext, useEffect, useState } from "react";
import Userinfo from "../userInfos/Userinfo";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { handleOpenOptions } from "../../services/fetch";
import SwitchAccount from "../modalOptions/SwitchAccount";
import makeRequest from "../../services/makeRequest";
import SuggestionUserSkeleton from "../skeleton/SuggestionUserSkeleton";
import Loading from "../loadings/Loading";

const Rightbar = () => {
  const { currentUser, setCurrentUser, successMessage } =
    useContext(AuthContext);
  const [switchAccount, setSwitchAccount] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSg, setLoadingSg] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoadingSg(true);
        const res = await makeRequest.get("/users/suggestions", {
          headers: { Authorization: `Bearer ${currentUser.accessToken}` },
        });

        setSuggestions(res.data.users);
        setLoadingSg(false);
      } catch (error) {
        setLoadingSg(false);
      }
    };

    fetchSuggestions();
  }, [currentUser.accessToken]);

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
    <div className="rightbar">
      {loading && <Loading />}
      <div className="rightbar-container">
        {/* rightbar info top */}
        <div className="rightbar-info">
          <Link to={`/u/${currentUser.username}`} className="link">
            <div className="rightbar-info-details">
              <img
                src={currentUser.avatar}
                alt=""
                className="rightbar-info-img"
              />
              <div className="rightbar-info-fullname">
                <p className="rightbar-info-username">{currentUser.username}</p>
                <p className="rightbar-info-name">{currentUser.name}</p>
              </div>
            </div>
          </Link>
          <p
            className="rightbar-info-btn"
            onClick={() => handleOpenOptions(setSwitchAccount)}
          >
            Switch
          </p>
        </div>

        {/* rightbar info bottom */}
        <div className="rightbar-suggests">
          <p className="rightbar-suggest-text">Suggest for you</p>
          {loadingSg ? (
            <SuggestionUserSkeleton suggests={4} />
          ) : (
            suggestions &&
            suggestions.map((user) => <Userinfo key={user._id} user={user} />)
          )}
        </div>

        <div className="rightbar-foot">
          <p className="rightbar-copyright">© 2023 KEEPSTORY FROM TUAN</p>
        </div>
      </div>
      {switchAccount && (
        <SwitchAccount
          setSwitchAccount={setSwitchAccount}
          handleLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default Rightbar;
