import { AiOutlineClose } from "react-icons/ai";
import { handleCloseOptions } from "../../services/fetch";
import { Link } from "react-router-dom";

const SwitchAccount = ({ setSwitchAccount, handleLogout }) => {
  const logout = () => {
    handleCloseOptions(setSwitchAccount);
    handleLogout();
  };

  return (
    <div
      className="sa"
      onClick={(e) =>
        e.target.className === "sa" && handleCloseOptions(setSwitchAccount)
      }
    >
      <div className="sa-container">
        <ul className="sa-list">
          <li
            className="sa-item"
            onClick={() => handleCloseOptions(setSwitchAccount)}
          >
            <Link className="link" to="/login">
              Log in
            </Link>
          </li>
          <li
            className="sa-item"
            onClick={() => handleCloseOptions(setSwitchAccount)}
          >
            <Link className="link" to="/signup">
              Sign up
            </Link>
          </li>
          <li className="sa-item" onClick={logout}>
            Log out
          </li>
          <li
            className="sa-item"
            onClick={() => handleCloseOptions(setSwitchAccount)}
          >
            Cancel
          </li>
        </ul>
      </div>
      <AiOutlineClose
        className="sa-close"
        onClick={() => handleCloseOptions(setSwitchAccount)}
      />
    </div>
  );
};

export default SwitchAccount;
