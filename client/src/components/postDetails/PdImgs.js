import { useState } from "react";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

const PdImgs = ({ data }) => {
  const [index, setIndex] = useState(0);
  const [postSlide, setPostSlide] = useState("");

  const handleSlider = (direction, post) => {
    if (post.image.length > 1) {
      setPostSlide(post._id);
    }
    if (direction === "left" && index > 0) {
      setIndex((index) => index - 1);
    } else if (direction === "right" && index < post.image.length - 1) {
      setIndex((index) => index + 1);
    } else {
      return;
    }
  };

  return (
    <div className="pd-imgs">
      {data.image.length > 1 && index > 0 && (
        <MdNavigateBefore
          className="pd-img-prev"
          onClick={() => handleSlider("left", data)}
        />
      )}
      {data.image.length > 1 && index < data.image.length - 1 && (
        <MdNavigateNext
          className="pd-img-next"
          onClick={() => handleSlider("right", data)}
        />
      )}
      <div
        className="pd-img-container"
        style={{
          transform: postSlide === data._id && `translateX(${index * -470}px)`,
        }}
      >
        {data.image.map((p, i) => (
          <img src={p} alt="" key={i} />
        ))}
      </div>
      {data.image.length > 1 && (
        <p className="pd-img-count">{`${index + 1} / ${data.image.length}`}</p>
      )}
    </div>
  );
};

export default PdImgs;
