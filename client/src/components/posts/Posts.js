import { GetAllPosts } from "../../services/fetch/loadPosts";
import PostsSkeleton from "../skeleton/PostsSkeleton";
import Post from "./Post";

const Posts = () => {
  const { isLoading, data, error } = GetAllPosts("posts");

  return (
    <div className="posts">
      <div className="posts-container">
        {isLoading ? (
          <PostsSkeleton posts={1} />
        ) : error ? (
          <p
            style={{ textAlign: "center", fontSize: "20px", marginTop: "40px" }}
          >
            Somethings went wrong...
          </p>
        ) : (
          data.map((post) => <Post post={post} key={post._id} />)
        )}
      </div>
    </div>
  );
};

export default Posts;
