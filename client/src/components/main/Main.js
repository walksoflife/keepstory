import { useContext, useEffect, useState } from "react";
import Rightbar from "../rightbars/Rightbar";
import Section from "./Section";
import { AuthContext } from "../../context/AuthContext";
import makeRequest from "../../services/makeRequest";
import { GetListFriend } from "../../services/fetch";
import Suggestion from "../suggestions/Suggestion";

const Main = () => {
  const [listUser, setListUser] = useState();
  const { currentUser, setErrorPage } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const { isLoading, data, error } = GetListFriend("friends");

  useEffect(() => {
    const fecthUser = async () => {
      try {
        setLoading(true);
        const res = await makeRequest.get("/users/first-login", {
          headers: { Authorization: `Bearer ${currentUser.accessToken}` },
        });

        setListUser(res.data?.results);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error?.response?.status === 401) {
          setErrorPage(true);
        }
      }
    };

    fecthUser();
  }, [currentUser]);

  const handleStarted = () => {
    window.location.reload();
  };

  return (
    <div className="main">
      {listUser?.length === 0 ? (
        <div className="main-container">
          <Section />
          <Rightbar />
        </div>
      ) : (
        <Suggestion
          loading={loading}
          listUser={listUser}
          data={data}
          currentUser={currentUser}
          handleStarted={handleStarted}
        />
      )}
    </div>
  );
};

export default Main;
