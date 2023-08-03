import Skeleton from "react-loading-skeleton";

const PostsSkeleton = ({ posts }) => {
  return Array(posts)
    .fill(0)
    .map((item, i) => (
      <div className="skeleton" key={i}>
        <div className="post-sk">
          <div className="post-info-sk">
            <Skeleton circle width={32} height={32} />
            <div className="post-info-details-sk">
              <Skeleton width={120} height={10} />
              <Skeleton width={90} height={10} />
            </div>
          </div>
          <div className="post-img-sk">
            <Skeleton width={480} height={500} />
          </div>
        </div>
      </div>
    ));
};

export default PostsSkeleton;
