import { useContext, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BiSearch } from "react-icons/bi";
import makeRequest from "../../services/makeRequest";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import Loading from "../loadings/Loading";

const Search = () => {
  const { currentUser } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [keyword, setKeyword] = useState("");
  const inputRef = useRef(null);
  const [text, setText] = useState("No recent searches");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (keyword) => {
    setKeyword(keyword);
    if (!keyword) return;
    setLoading(true);

    try {
      const res = await makeRequest.get(`/users/search?keyword=${keyword}`, {
        headers: { Authorization: `Bearer ${currentUser.accessToken}` },
      });

      setData(res.data.results);
      setLoading(false);
      if (data?.length < 1) setText("No search results found");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <div className="search-top">
        <h2>Search</h2>
        <div className="search-form">
          <BiSearch style={{ fontSize: "20px", color: "gray" }} />
          <input
            type="text"
            placeholder="Search"
            className="search-input"
            value={keyword}
            onChange={(e) => handleSearch(e.target.value)}
            ref={inputRef}
          />
          <AiOutlineClose
            style={{ fontSize: "20px", color: "gray", cursor: "pointer" }}
            onClick={() => setKeyword("")}
          />
        </div>
      </div>
      <ul className="search-result">
        {loading ? (
          <Loading />
        ) : data?.length > 0 && keyword ? (
          data?.map((item) => (
            <Link className="link" to={`/u/${item.username}`} key={item._id}>
              <li className="search-result-item">
                <img src={item.avatar} alt="" className="search-result-img" />
                <div className="search-result-info">
                  <p className="search-result-username">{item.username}</p>
                  <p className="search-result-name">{item.name && item.name}</p>
                </div>
              </li>
            </Link>
          ))
        ) : (
          <p
            style={{
              textAlign: "center",
              color: "gray",
            }}
          >
            {text}
          </p>
        )}
      </ul>
    </div>
  );
};

export default Search;
