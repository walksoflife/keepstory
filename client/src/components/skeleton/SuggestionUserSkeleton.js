import Skeleton from "react-loading-skeleton";

const SuggestionUserSkeleton = ({ suggests }) => {
  return Array(suggests)
    .fill(0)
    .map((item, i) => (
      <div className="skeleton" key={i}>
        <div className="suggest-sk">
          <div className="suggest-details-sk">
            <Skeleton circle width={32} height={32} />
            <Skeleton width={100} height={10} />
          </div>
        </div>
      </div>
    ));
};

export default SuggestionUserSkeleton;
