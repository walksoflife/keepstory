import Skeleton from "react-loading-skeleton";

const StoriesSkeleton = ({ stories }) => {
  return Array(stories)
    .fill(0)
    .map((item, i) => (
      <div className="stories-sk" key={i}>
        <div className="stories-details-sk">
          <Skeleton circle width={32} height={32} />
          <Skeleton width={100} height={10} />
        </div>
      </div>
    ));
};

export default StoriesSkeleton;
