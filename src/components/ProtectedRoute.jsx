import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserAuthContext } from "../context/UserAuthContext";
import { IsEditingAndLoadingContext } from "../context/IsLoadingandEditingContext";
import { PacmanLoader } from "react-spinners";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useContext(UserAuthContext);
  const { isLoading } = useContext(IsEditingAndLoadingContext);
  console.log("ProtectedRoute log in state", isLoggedIn);

  if (!isLoggedIn) {
    console.log("ProtectedRoute log in state", isLoggedIn);
    return <PacmanLoader />;
  } else {
    console.log("ProtectedRoute log in state", isLoggedIn);
    return isLoggedIn ? children : <Navigate to="/" />;
  }
};

export default ProtectedRoute;
