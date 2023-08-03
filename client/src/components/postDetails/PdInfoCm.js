import { useState } from "react";
import { Link } from "react-router-dom";
import { formatTime } from "../../services/fetch";

const PdInfoCm = ({ data }) => {
  const [viewMore, setViewMore] = useState(false);

  return (
    <div className="pd-post">
      <Link to={`/u/${data.author.username}`} className="link">
        <img src={data.author.avatar} alt="" className="pd-post-img" />
      </Link>
      <div className="pd-post-title">
        <p className="pd-post-username">
          <Link to={`/u/${data.author.username}`} className="link">
            <b>{data.author.username}</b>
          </Link>
          <span style={{ fontStyle: "italic" }}>
            {viewMore ? `${data.caption.substring(0, 120)}...` : data.caption}
            {data.caption.length > 120 && (
              <b
                className="pd-post-viewmore"
                onClick={() => setViewMore(!viewMore)}
              >
                {viewMore ? "View more" : "Less more"}
              </b>
            )}
          </span>
        </p>

        <span className="pd-post-timeago">{formatTime(data.createdAt)}</span>
      </div>
    </div>
  );
};

export default PdInfoCm;
