import "./styles/index.scss";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { Suspense, lazy, useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import NotFound from "./NotFound";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import PostDetails from "./pages/PostDetails";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";

// const Home = lazy(() => import("./pages/Home"));
// const Login = lazy(() => import("./pages/Login"));
// const Register = lazy(() => import("./pages/Register"));
// const Profile = lazy(() => import("./pages/Profile"));
// const PostDetails = lazy(() => import("./pages/PostDetails"));
// const Chat = lazy(() => import("./pages/Chat"));

const App = () => {
  const { currentUser } = useContext(AuthContext);

  const PrivateRoute = () => {
    return currentUser?.accessToken ? <Outlet /> : <Navigate to="/login" />;
  };

  return (
    <SkeletonTheme baseColor="#dbdbdb" highlightColor="#dbdbdb" enableAnimation>
      <BrowserRouter>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/" exact element={<Home />} />
            <Route path="/u/:username" element={<Profile />} />
            <Route path="/p/:postId" element={<PostDetails />} />
            <Route path="/chat" element={<Chat />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </SkeletonTheme>
  );
};

export default App;
