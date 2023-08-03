import { Link } from "react-router-dom";
import { formatTime } from "../../services/fetch";
import { useEffect, useState } from "react";
import makeRequest from "../../services/makeRequest";
import Loading from "../loadings/Loading";

const Notification = ({ currentUser }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getUnreadNotifications = async () => {
      try {
        setLoading(true);
        const res = await makeRequest.get("/notifications/read", {
          headers: {
            Authorization: `Bearer ${currentUser.accessToken}`,
          },
        });

        setNotifications(res.data.notifications);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    getUnreadNotifications();
  }, [currentUser.accessToken]);

  return (
    <div className="notification-container">
      <h2>Notifications</h2>
      <ul className="notification-list">
        {loading ? (
          <Loading />
        ) : notifications?.length < 1 ? (
          <p>No notification yet.</p>
        ) : (
          notifications.map((item, index) => (
            <Link
              key={index}
              className="link"
              to={
                item.type !== "follow"
                  ? `/p/${item.post._id}`
                  : `/u/${item.sender.username}`
              }
            >
              <li className="notification-item">
                <div className="notification-info">
                  <Link className="link" to={`/u/${item.sender.username}`}>
                    <img
                      src={item.sender.avatar}
                      alt=""
                      className="notification-user"
                    />
                  </Link>
                  <p className="notification-text">
                    <Link className="link" to={`/u/${item.sender.username}`}>
                      <b>{item.sender.username}</b>
                    </Link>{" "}
                    {item.type === "like"
                      ? "liked your photo."
                      : item.type === "comment"
                      ? `commented : ${item.comment.content.substring(
                          item.comment.content.split(" ")[0]
                        )}`
                      : item.type === "follow"
                      ? " started following you"
                      : ""}
                    <span className="notification-time">
                      {formatTime(item.createdAt)}
                    </span>
                  </p>
                </div>
                {item.type !== "follow" && (
                  <img
                    src={item.post.image[0]}
                    alt=""
                    className="notification-img"
                  />
                )}
              </li>
            </Link>
          ))
        )}
      </ul>
    </div>
  );
};

export default Notification;
