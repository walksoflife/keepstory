import { useState } from "react";

export const BackToTopEvent = () => {
  const [backToTop, setBackToTop] = useState(false);

  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      setBackToTop(true);
    } else {
      setBackToTop(false);
    }
  });

  return backToTop;
};

export const scrollUp = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
