import { AiFillHome, AiOutlineHeart } from "react-icons/ai";
import { BiMessageRounded, BiSearch } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { RiFolderAddLine } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Search from "./Search";
import Notification from "./Notification";
import { handleOpenOptions, handleSidebar } from "../../services/fetch";
import Create from "../../pages/Create";
import makeRequest from "../../services/makeRequest";

const Sidebar = () => {
  const { currentUser, socket, setErrorPage, openCreate, setOpenCreate } =
    useContext(AuthContext);
  const [openSearch, setOpenSearch] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const subRef = useRef(null);
  const sub = useRef(null);
  const [loading, setLoading] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState([]);

  let checkedProfilePage =
    useLocation().pathname === `/u/${currentUser.username}`;
  let checkedMessagePage = useLocation().pathname === "/chat";
  let checkedHomePage =
    useLocation().pathname === "/" &&
    !checkedProfilePage &&
    !openSearch &&
    !openNotification &&
    !openCreate;

  useEffect(() => {
    handleSidebar(openSearch, subRef, sub);
  }, [openSearch]);

  useEffect(() => {
    handleSidebar(openNotification, subRef, sub);
  }, [openNotification]);

  const handleOpenSubSb = async (item) => {
    if (item === "Search") {
      setOpenNotification(false);
      setOpenSearch(!openSearch);
    } else if (item === "Notifications") {
      setOpenSearch(false);
      setOpenNotification(!openNotification);
      !loading && setUnreadNotifications([]);
    } else {
      return;
    }
  };

  // NOTIFICATION REAL TIME / UN READ
  useEffect(() => {
    const getUnreadNotifications = async () => {
      try {
        setLoading(true);
        const res = await makeRequest.get("/notifications/unread", {
          headers: {
            Authorization: `Bearer ${currentUser.accessToken}`,
          },
        });

        setUnreadNotifications(res.data.notifications);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error?.response?.status === 401) {
          setErrorPage(true);
        }
      }
    };

    getUnreadNotifications();
  }, [currentUser]);

  useEffect(() => {
    socket.current &&
      socket.current.on("get-notifications", (data) => {
        setUnreadNotifications((prev) => {
          return [...prev, data];
        });
      });
  }, [socket]);

  return (
    <div className="sidebar">
      <div className="sidebar-container" ref={subRef}>
        <Link to="/" className="link" reloadDocument>
          <div className="sidebar-logo">
            <img
              src="https://res.cloudinary.com/djqxdscwh/image/upload/v1688117725/keep-1_1_cvqbd7.png"
              alt=""
              className="sidebar-logo-img"
            />
            {!(openSearch || openNotification) && <h2>Keepstory</h2>}
          </div>
        </Link>

        <ul className="sidebar-list">
          <Link to="/" className="link" reloadDocument>
            <li
              className={
                checkedHomePage ? "sidebar-item active" : "sidebar-item"
              }
            >
              <p className="sidebar-item-icon">
                <AiFillHome className="sidebar-icon" />
              </p>
              {!(openSearch || openNotification) && <span>Home</span>}
            </li>
          </Link>
          <li
            className={openSearch ? "sidebar-item active" : "sidebar-item"}
            onClick={() => handleOpenSubSb("Search")}
          >
            <p className="sidebar-item-icon">
              <BiSearch className="sidebar-icon" />
            </p>
            {!(openSearch || openNotification) && <span>Search</span>}
          </li>
          <Link to="/chat" className="link">
            <li
              className={
                checkedMessagePage ? "sidebar-item active" : "sidebar-item"
              }
            >
              <p className="sidebar-item-icon">
                <BiMessageRounded className="sidebar-icon" />
              </p>
              {!(openSearch || openNotification) && <span>Message</span>}
            </li>
          </Link>
          <li
            className={
              openNotification ? "sidebar-item active" : "sidebar-item"
            }
            onClick={() => handleOpenSubSb("Notifications")}
          >
            <p
              className={
                unreadNotifications?.length > 0
                  ? "sidebar-item-icon notification"
                  : "sidebar-item-icon"
              }
            >
              <AiOutlineHeart className="sidebar-icon" />
            </p>
            {!(openSearch || openNotification) && <span>Notifications</span>}
          </li>

          <li
            onClick={() => handleOpenOptions(setOpenCreate)}
            className={openCreate ? "sidebar-item active" : "sidebar-item"}
          >
            <p className="sidebar-item-icon">
              <RiFolderAddLine className="sidebar-icon" />
            </p>
            {!(openSearch || openNotification) && <span>Create</span>}
          </li>

          <Link to={`/u/${currentUser.username}`} className="link">
            <li
              className={
                checkedProfilePage ? "sidebar-item active" : "sidebar-item"
              }
            >
              <p className="sidebar-item-icon">
                <CgProfile className="sidebar-icon" />
              </p>
              {!(openSearch || openNotification) && <span>Profile</span>}
            </li>
          </Link>
        </ul>
      </div>

      <div className="sidebar-sub" ref={sub}>
        {openSearch && <Search />}
        {openNotification && <Notification currentUser={currentUser} />}
        {openCreate && <Create />}
      </div>
    </div>
  );
};

export default Sidebar;
