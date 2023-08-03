import { useContext, useState } from "react";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import LazyImage from "./LazyImage";
import { AuthContext } from "../../context/AuthContext";

const PostImage = ({ post }) => {
  const [index, setIndex] = useState(0);
  const [postSlide, setPostSlide] = useState("");
  const { openCreate } = useContext(AuthContext);

  const handleSlider = (direction, post) => {
    setPostSlide(post._id);

    if (direction === "left" && index > 0) {
      setIndex((index) => index - 1);
    } else if (direction === "right" && index < post.image.length - 1) {
      setIndex((index) => index + 1);
    } else {
      setIndex(0);
    }
  };
  return (
    <div className="post-img">
      {post.image.length > 1 && index > 0 && (
        <MdNavigateBefore
          className={
            openCreate ? "post-img-btn prev hidden" : "post-img-btn prev"
          }
          onClick={() => handleSlider("left", post)}
        />
      )}
      {post.image.length > 1 && index < post.image.length - 1 && (
        <MdNavigateNext
          className={
            openCreate ? "post-img-btn next hidden" : "post-img-btn next"
          }
          onClick={() => handleSlider("right", post)}
        />
      )}
      <div
        className="post-img-container"
        style={{
          transform: postSlide === post._id && `translateX(${index * -470}px)`,
        }}
      >
        {post.image.map((p, i) => (
          <LazyImage id={i + "post-img-lazy"} key={i} src={p} />
        ))}
        {post.image.length > 1 && (
          <p className="post-img-count">{`${index + 1} / ${
            post.image.length
          }`}</p>
        )}
      </div>
    </div>
  );
};

export default PostImage;
