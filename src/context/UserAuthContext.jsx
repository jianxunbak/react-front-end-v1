import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateToken, validateToken } from "../api/AuthEndPoints";
import { addNewUser, getOneUserById } from "../api/UserEndPoints";

export const UserAuthContext = createContext();

export function UserAuthProvider({ children, setIsLoading }) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    email: "",
  });

  //Store Logged In UserName:

  const [userProfile, setUserProfile] = useState({
    userId: "",
    username: "",
    email: "",
    aboutMe: "",
    profilePicture: "",
  });

  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // accesses the jwt token when user reloads the page when user log in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoggedIn(false);
      setUserProfile({
        userId: "",
        username: "",
        email: "",
        aboutMe: "",
        profilePicture: "",
      });
      console.log("no user details avaliable at this moment");
      return;
    }
    if (!isLoggedIn) {
      checkToken();
    }
  }, [isLoggedIn]);

  const checkToken = async () => {
    console.log("checking token");
    try {
      setIsLoading(true);
      const responseToken = await validateToken();
      if (responseToken.status != 200) {
        setIsLoggedIn(false);
        localStorage.removeItem("token");
        console.log("token not valid");
        navigate("/");
        setIsLoading(false);
      }
      console.log("token valid");
      setIsLoggedIn(true);
      console.log("userid from token", responseToken.data.userId);
      setUserProfile((prevprofile) => ({
        ...prevprofile,
        userId: responseToken.data.userId,
      }));

      const responseUser = await getOneUserById(responseToken.data.userId);
      console.log("user profile after setting id", userProfile);

      if (responseUser.status === 200) {
        setUserProfile({
          userId: responseUser.data.id,
          username: responseUser.data.username,
          email: responseUser.data.email,
          aboutMe: responseUser.data.aboutMe,
          profilePicture: responseUser.data.profilePicture,
        });
      }
    } catch (error) {
      setIsLoggedIn(false);
      if (error.response) {
        alert("Token is invalid. Please relogin");
        console.error(error.response.data.message);
      }
    } finally {
      console.log("change set is loging to false");
      setIsLoading(false);
    }
  };

  const handleCredentialsChange = (e, validateRealTimeField = null) => {
    if (!e || !e.target) return; // Avoid accessing undefined properties
    const { name, value } = e.target;

    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));

    if (validateRealTimeField) {
      validateRealTimeField(e);
    }
  };

  // get jwt token from username and password when login
  const handleLogin = async (event) => {
    event.preventDefault(); // prevents reload to allow the async to run if not wont work as it cant run
    try {
      setIsLoading(true);
      const responseToken = await generateToken(credentials);
      if (responseToken.status == 200) {
        setIsLoggedIn(true);
        localStorage.setItem("token", responseToken.data.token);
        const responseUsers = await getOneUserById(responseToken.data.userId);
        if (responseUsers.status == 200) {
          setUserProfile({
            userId: responseUsers.data.userId,
            username: responseUsers.data.username,
            email: responseUsers.data.email,
            aboutMe: responseUsers.data.aboutMe,
            profilePicture: responseUsers.data.profilePicture,
          });
        }
        navigate("/", { replace: true });
        console.log("user logged in");
      } else {
        alert("invalid credentials");
      }
    } catch (error) {
      if (error.response) {
        alert(`login failed: ${error.response.data.message}`);
        console.error(error.response.data.message);
      }
    } finally {
      setIsLoading(false);
      console.log("is logged in at user auth context", isLoggedIn);
    }
  };

  const handleLogout = () => {
    setIsLoading(true);
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserProfile({
      username: "",
      password: "",
      email: "",
    });
    alert("Logged Out!");
    setIsLoading(false);
    navigate("/", { replace: true });
  };

  const handleSignUp = async (e, validationOnSubmit) => {
    setIsLoading(true);
    e.preventDefault();
    const results = validationOnSubmit(e, credentials);
    if (!results) {
      setIsLoading(false);
      return;
    }
    try {
      const response = await addNewUser(credentials);
      if (response.status == 201) {
        alert("Sign up successful");
        handleLogin(e);
      } else alert("invalid credentials");
    } catch (error) {
      console.error("Error getting all recipe:", error);
      alert("Failed to get all favourite recipes. Please try again."); // Show error alert
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue = {
    credentials,
    handleCredentialsChange,
    handleLogin,
    isLoggedIn,
    setIsLoggedIn,
    handleLogout,
    handleSignUp,
    userProfile,
    setUserProfile,
  };

  return (
    <UserAuthContext.Provider value={contextValue}>
      {children}
    </UserAuthContext.Provider>
  );
}
