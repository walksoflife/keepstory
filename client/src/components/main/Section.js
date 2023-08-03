import Posts from "../posts/Posts";
import Stories from "../stories/Stories";

const Section = () => {
  return (
    <div className="section">
      <div className="section-container">
        <Stories />
        <Posts />
      </div>
    </div>
  );
};

export default Section;
