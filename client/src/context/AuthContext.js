import { createContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { io } from "socket.io-client";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [errorPage, setErrorPage] = useState(false);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("userData")) || {}
  );

  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(currentUser));
  }, [currentUser]);

  const options = {
    position: "top-right",
    autoClose: 800,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };

  const successMessage = (message) => toast.success(message, options);

  const errorMessage = (message) => toast.error(message, options);

  // SOCKET CONNECT
  const socket = useRef();

  useEffect(() => {
    if (!socket.current) {
      socket.current = io("http://103.75.186.247");
    }

    if (socket.current && currentUser.id) {
      socket.current.emit("addUser", {
        userId: currentUser.id,
      });
    }

    return () => {
      if (socket.current && !currentUser.id) {
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, [socket, currentUser]);

  const [openCreate, setOpenCreate] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        successMessage,
        errorMessage,
        socket,
        errorPage,
        setErrorPage,
        openCreate,
        setOpenCreate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
