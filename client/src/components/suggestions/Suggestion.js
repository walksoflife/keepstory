import Footer from "../footer/Footer";
import Loading from "../loadings/Loading";
import SgItem from "./SgItem";

const Suggestion = ({
  loading,
  listUser,
  currentUser,
  data,
  handleStarted,
}) => {
  return (
    <div className="sg">
      <div className="sg-container">
        <h2>Suggested for you</h2>
        <ul className="sg-list load">
          {loading ? (
            <Loading />
          ) : (
            listUser?.map((item) => (
              <SgItem
                item={item}
                key={item._id}
                currentUser={currentUser}
                data={data}
              />
            ))
          )}
          {data?.followings.length > 0 && (
            <button className="sg-btn-get-started" onClick={handleStarted}>
              Get started
            </button>
          )}
        </ul>
      </div>
      <Footer />
    </div>
  );
};

export default Suggestion;
