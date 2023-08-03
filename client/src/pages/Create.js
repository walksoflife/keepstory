import { useContext, useEffect, useRef, useState } from "react";
import { FaPhotoVideo } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import makeRequest from "../services/makeRequest";
import { AuthContext } from "../context/AuthContext";
import { handleCloseOptions, handleOpenOptions } from "../services/fetch";
import { AiOutlineClose } from "react-icons/ai";
import { BsArrowLeftShort } from "react-icons/bs";
import DiscardOptions from "../components/modalOptions/DiscardOptions";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import FilterCustom from "../components/formCreate/FilterCustom";
import { filterAdjust } from "../components/formCreate/filterData";
import Caption from "../components/formCreate/Caption";
import Loading from "../components/loadings/Loading";

const Create = () => {
  const { currentUser, successMessage, errorMessage, setOpenCreate } =
    useContext(AuthContext);
  const [fileImg, setFileImg] = useState([]);
  const [caption, setCaption] = useState("");
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [isOpenDiscard, setOpenDiscard] = useState(false);
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(0);
  const lastRef = useRef(null);
  const filterImg = useRef(null);
  const [filterOptions, setFilterOptions] = useState(filterAdjust);
  const [filterClass, setFilterClass] = useState("");

  // crop
  // const [crop, setCrop] = useState({ x: 0, y: 0 });

  const mutation = useMutation(
    async (newPost) => {
      setLoading(true);
      await makeRequest
        .post("/posts", newPost, {
          headers: { Authorization: `Bearer ${currentUser.accessToken}` },
        })
        .then((res) => {
          successMessage(res.data.message);
          setLoading(false);
          handleCloseOptions(setOpenCreate);
        })
        .catch(() => {
          errorMessage("Something went wrong...");
          setLoading(false);
        });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const handleSharePost = async () => {
    setStep(step + 1);

    if (step === 2) {
      let formPost = new FormData();
      formPost.append("caption", caption);

      for (let i = 0; i < fileImg.length; i++) {
        formPost.append("image", fileImg[i]);
      }

      mutation.mutate(formPost);
    }
  };

  const handleSlider = (direction) => {
    if (direction === "left" && index > 0) {
      setIndex((index) => index - 1);
    } else if (direction === "right" && index < fileImg.length - 1) {
      setIndex((index) => index + 1);
    } else {
      return;
    }
  };

  const styleImg = () => {
    const filters = filterOptions.map((f) => {
      return `${f.property}(${f.value}${f.unit})`;
    });

    return { filter: filters.join(" ") };
  };

  useEffect(() => {
    const handleOpenFilter = () => {
      if (step === 1 || step === 2) {
        lastRef.current.style.width = `${320}px`;
      } else {
        lastRef.current.style.width = 0;
      }
    };
    handleOpenFilter();
  }, [step]);

  return (
    <div className="create">
      {loading && <Loading />}
      <div className="create-container">
        <div
          className={
            fileImg.length > 0 ? "create-first-top" : "create-first-top crop"
          }
        >
          {fileImg.length > 0 && (
            <div
              className="create-icon-next-arr"
              onClick={() => handleOpenOptions(setOpenDiscard)}
            >
              <BsArrowLeftShort
                style={{ fontSize: "26px", cursor: "pointer" }}
              />
            </div>
          )}
          <h2 className="create-title">
            {fileImg.length < 1
              ? "Create new post"
              : step === 1
              ? "Edit"
              : step === 2
              ? "Create new post"
              : "Crop"}
          </h2>
          {fileImg.length > 0 && (
            <p className="create-first-btn" onClick={handleSharePost}>
              {step === 2 ? "Share" : "Next"}
            </p>
          )}
        </div>

        <div className="create-main">
          <div className="create-first">
            <div className="create-img">
              {fileImg.length < 1 && (
                <div className="create-desc">
                  <FaPhotoVideo className="create-desc-icon" />
                  <p className="create-desc-text">
                    Drag photos and videos here
                  </p>
                  <label
                    htmlFor="create-file-img"
                    className="create-file-label"
                  >
                    Select from computer
                  </label>
                  <input
                    id="create-file-img"
                    type="file"
                    className="create-file-img"
                    onChange={(e) => setFileImg(e.target.files)}
                    multiple
                  />
                </div>
              )}
              <div className="create-list-files">
                {fileImg.length > 1 && index > 0 && (
                  <MdNavigateBefore
                    className="create-img-prev"
                    onClick={() => handleSlider("left")}
                  />
                )}
                {fileImg.length > 1 && index < fileImg.length - 1 && (
                  <MdNavigateNext
                    className="create-img-next"
                    onClick={() => handleSlider("right")}
                  />
                )}
                <div
                  className="create-img-container"
                  style={{
                    transform: `translateX(${index * -540}px)`,
                  }}
                >
                  {Array.from(fileImg).map((f, i) => (
                    <figure key={i} className={`filter-${filterClass}`}>
                      <img
                        src={URL.createObjectURL(f)}
                        alt=""
                        style={styleImg()}
                        ref={filterImg}
                        className="filterImg"
                      />
                    </figure>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="create-last" ref={lastRef}>
            {step === 1 && (
              <FilterCustom
                filterOptions={filterOptions}
                setFilterOptions={setFilterOptions}
                filterClass={filterClass}
                setFilterClass={setFilterClass}
              />
            )}
            {step === 2 && (
              <Caption caption={caption} setCaption={setCaption} />
            )}
          </div>
        </div>
      </div>
      <AiOutlineClose
        className="create-close"
        onClick={() => handleCloseOptions(setOpenCreate)}
      />
      {isOpenDiscard && (
        <DiscardOptions
          setOpenDiscard={setOpenDiscard}
          setOpenCreate={setOpenCreate}
        />
      )}
    </div>
  );
};

export default Create;
