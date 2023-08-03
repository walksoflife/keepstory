import Skeleton from "react-loading-skeleton";

const GroupChatSkeleton = ({ groupchat }) => {
  return Array(groupchat)
    .fill(0)
    .map((item, i) => (
      <div className="skeleton" key={i}>
        <div className="gr-sk">
          <div className="gr-item-sk">
            <div className="gr-img-sk">
              <Skeleton circle width={56} height={56} />
            </div>
            <div className="gr-info-sk">
              <Skeleton width={90} height={12} />
              <Skeleton width={120} height={10} />
            </div>
          </div>
        </div>
      </div>
    ));
};

export default GroupChatSkeleton;
