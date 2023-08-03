import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { AiOutlineFacebook } from "react-icons/ai";
import makeRequest from "../services/makeRequest";
import Loading from "../components/loadings/Loading";
import Footer from "../components/footer/Footer";

const Register = () => {
  const { successMessage, errorMessage } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [focused, setFocused] = useState(false);
  const [values, setValues] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const inputs = [
    {
      name: "email",
      type: "email",
      placeholder: "Email",
      errorMessage: "It should be a valid email address!",
    },
    {
      name: "name",
      type: "text",
      placeholder: "Full Name",
      errorMessage:
        "Full name should be 4-20 characters and shouldn't include any special character!",
      pattern: "^[A-Za-z0-9]+(?:[\\s][A-Za-z0-9]+)*$",
    },
    {
      name: "username",
      type: "text",
      placeholder: "User Name",
      errorMessage:
        "User name should be 4-14 characters and shouldn't include any special character!",
      pattern: "^[A-Za-z0-9]{4,14}$",
    },
    {
      name: "password",
      type: "password",
      placeholder: "Password",
      errorMessage:
        "Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!",
      pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
    },
    {
      name: "confirmPassword",
      type: "password",
      placeholder: "Confirm Password",
      errorMessage: "Password doesn't match!",
      pattern: values.password,
    },
  ];

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleFocus = () => {
    setFocused(true);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    await makeRequest
      .post("/auth/register", values)
      .then((res) => {
        successMessage(res.data.message);
        setLoading(false);
        navigate("/login");
      })
      .catch((err) => {
        console.log(err)
        errorMessage("Something went wrong...");
        setLoading(false);
      });
  };

  return (
    <div className="register">
      <div className="register-container">
        {loading && <Loading />}
        <div className="register-right-top">
          <h2>Keepstory</h2>
          <p
            style={{
              marginBottom: "20px",
              padding: "0 60px",
              textAlign: "center",
              color: "gray",
              fontWeight: "500",
            }}
          >
            Sign up to see photos and videos from your friends.
          </p>

          <p className="register-with-fb">
            <AiOutlineFacebook
              style={{
                fontSize: "20px",
              }}
            />
            Log in with Facebook
          </p>
          <p className="form-or">OR</p>

          <form className="form-register" onSubmit={handleRegister}>
            {inputs.map((input, index) => (
              <div className="form-register-group" key={index}>
                <input
                  type={input.type}
                  placeholder={input.placeholder}
                  pattern={input.pattern}
                  name={input.name}
                  onBlur={handleFocus}
                  value={values[input.name]}
                  onChange={onChange}
                  onFocus={() =>
                    input.name === "confirmPassword" && setFocused(true)
                  }
                  focused={focused.toString()}
                  required
                />
                <p className="form-err">{input.errorMessage}</p>
              </div>
            ))}

            <p className="form-infor">
              People who use our service may have uploaded your contact
              information to Instagram
            </p>
            <p className="form-infor">
              By signing up, you agree to our Terms , Privacy Policy and Cookies
              Policy .
            </p>
            <button className="register-btn" type="submit">
              Sign up
            </button>
          </form>
        </div>

        <div className="register-right-bottom">
          <span>Have an account?</span>
          <Link to="/login" className="link">
            <span>Log in</span>
          </Link>
        </div>

        <p style={{ fontSize: "14px", textAlign: "center", margin: "20px 0" }}>
          Get the app.
        </p>

        <div className="register-app">
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

      <Footer />
    </div>
  );
};

export default Register;
