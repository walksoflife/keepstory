import React from "react";
import { handleCloseOptions } from "../../services/fetch";
import { AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const DiscardOptions = ({ setOpenDiscard, setOpenCreate }) => {
  const navigate = useNavigate();

  const handleDiscard = () => {
    handleCloseOptions(setOpenDiscard);
    handleCloseOptions(setOpenCreate);
    navigate("/");
  };

  return (
    <div
      className="discard"
      onClick={(e) =>
        e.target.className === "discard" && handleCloseOptions(setOpenDiscard)
      }
    >
      <div className="discard-container">
        <div className="discard-top">
          <h2 className="discard-title">Discard post?</h2>
          <p className="discard-desc">
            If you leave, your edits won't be saved.
          </p>
        </div>
        <ul className="discard-list">
          <li className="discard-item" onClick={handleDiscard}>
            Discard
          </li>
          <li
            className="discard-item"
            onClick={() => handleCloseOptions(setOpenDiscard)}
          >
            Cancel
          </li>
        </ul>
      </div>
      <AiOutlineClose
        className="discard-close"
        onClick={() => handleCloseOptions(setOpenDiscard)}
      />
    </div>
  );
};

export default DiscardOptions;
