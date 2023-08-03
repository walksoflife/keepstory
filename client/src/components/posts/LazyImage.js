import React, { useEffect, useRef, useState } from "react";

const LazyImage = (props) => {
  const [inView, setInView] = useState(false);
  const refLazyImg = useRef();

  let callback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setInView(true);
      }
    });
  };

  useEffect(() => {
    let observer = new IntersectionObserver(callback);

    if (refLazyImg?.current) {
      observer.observe(refLazyImg.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return inView ? (
    <img {...props} alt="" />
  ) : (
    <img
      alt=""
      ref={refLazyImg}
      className="lazy-img"
    />
  );
};

export default LazyImage;
