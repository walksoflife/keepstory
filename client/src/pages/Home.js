import { useContext, useEffect, useState } from "react";
import Sidebar from "../components/sidebars/Sidebar";
import { AuthContext } from "../context/AuthContext";
import Main from "../components/main/Main";
import TopSub from "../components/subs/TopSub";
import UnAuthorized from "../UnAuthorized";

const Home = () => {
  const { currentUser, setCurrentUser, errorPage } = useContext(AuthContext);
  const [showTopSub, setShowTopSub] = useState(false);
  const [isPage401, setIsPage401] = useState(false);

  useEffect(() => {
    window.addEventListener("load", () => {
      setShowTopSub(true);

      setTimeout(() => {
        setShowTopSub(false);
      }, 5000);
    });
  }, [currentUser]);

  // unauthorized page
  useEffect(() => {
    if (errorPage) {
      setIsPage401(true);
    }
  }, [errorPage]);

  return (
    <div className={isPage401 ? "home unauthorized" : "home"}>
      {showTopSub && <TopSub />}
      <Sidebar />
      <Main />
      {isPage401 && (
        <UnAuthorized
          setIsPage401={setIsPage401}
          setCurrentUser={setCurrentUser}
        />
      )}
    </div>
  );
};

export default Home;
