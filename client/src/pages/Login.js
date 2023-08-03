import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineFacebook } from "react-icons/ai";
import makeRequest from "../services/makeRequest";
import Loading from "../components/loadings/Loading";
import Footer from "../components/footer/Footer";

const Login = () => {
  const { setCurrentUser, successMessage, errorMessage } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const inputs = [
    {
      name: "email",
      type: "email",
      placeholder: "Email",
      errorMessage: "It should be a valid email address!",
    },
    {
      name: "password",
      type: "password",
      placeholder: "Password",
      errorMessage:
        "Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!",
      pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
    },
  ];

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleFocus = () => {
    setFocused(true);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    await makeRequest
      .post("/auth/login", values)
      .then((res) => {
        setCurrentUser(res.data.user);
        successMessage(res.data.message);
        navigate("/");
      })
      .catch((res) => {
        let err = res.response?.data?.error;
        if (err?.status === 404) {
          errorMessage("This account doesn't exist.");
        } else if (err?.status === 401) {
          errorMessage("Invalid email or password.");
        } else {
          errorMessage("Something went wrong...");
        }
        setLoading(false);
      });
  };

  const imgs = [
    "https://res.cloudinary.com/djqxdscwh/image/upload/v1687596237/screenshot1_tauclg.png",
    "https://res.cloudinary.com/djqxdscwh/image/upload/v1687596251/screenshot3_hdpmrk.png",
    "https://res.cloudinary.com/djqxdscwh/image/upload/v1687596244/screenshot2_z0fucx.png",
    "https://res.cloudinary.com/djqxdscwh/image/upload/v1687596257/screenshot4_btlvy0.png",
  ];

  const slideRef = useRef(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      index === imgs.length - 1 ? setIndex(0) : setIndex(index + 1);
    }, 1500);
  }, [imgs.length, index]);

  return (
    <div className="login">
      <div className="login-container">
        {loading && <Loading />}
        <div className="login-left" ref={slideRef}>
          <img src={imgs[index]} alt="" />
        </div>
        <div className="login-right">
          <div className="login-right-top">
            <h2>Keepstory</h2>
            <form className="form-login" onSubmit={handleLogin}>
              {inputs.map((input, index) => (
                <div className="form-login-group" key={index}>
                  <input
                    type={input.type}
                    placeholder={input.placeholder}
                    pattern={input.pattern}
                    name={input.name}
                    onBlur={handleFocus}
                    value={values[input.name]}
                    onChange={onChange}
                    onFocus={() =>
                      input.name === "password" && setFocused(true)
                    }
                    focused={focused.toString()}
                    required
                  />

                  <p className="form-err">{input.errorMessage}</p>
                </div>
              ))}
              <button type="submit" className="login-btn">
                Log in
              </button>
            </form>
            <p className="form-or">OR</p>

            <p className="login-with-fb">
              <AiOutlineFacebook
                style={{
                  background: "#385185",
                  color: "#fff",
                  fontSize: "20px",
                }}
              />
              Log in with Facebook
            </p>

            <p className="form-forgot-pw">Forgot password?</p>
          </div>

          <div className="login-right-bottom">
            <span>Don't have an account?</span>
            <Link to="/signup" className="link">
              <span>Sign up</span>
            </Link>
          </div>

          <p
            style={{ fontSize: "14px", textAlign: "center", margin: "20px 0" }}
          >
            Get the app.
          </p>

          <div className="login-app">
            <img
              src="https://static.cdninstagram.com/rsrc.php/v3/yz/r/c5Rp7Ym-Klz.png"
              alt=""
            />
            <img
              src="https://static.cdninstagram.com/rsrc.php/v3/yu/r/EHY6QnZYdNX.png"
              alt=""
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
