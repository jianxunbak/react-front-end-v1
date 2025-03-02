import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  deleteUser,
  updateUserDetails,
  updateUserPassword,
} from "../api/userEndPoints";

export const ProfileContext = createContext();

export function ProfileProvider({
  children,
  userProfile,
  setUserProfile,
  setIsLoggedIn,
  setIsEditing,
  setIsLoading,
}) {
  const navigate = useNavigate();
  console.log(
    "inside profile context user profile outside methid: ",
    userProfile
  );

  const [newUserProfile, setNewUserProfile] = useState({
    username: "",
    email: "",
    aboutMe: "",
    profilePicture: "",
  });

  const [newPassword, setNewPassword] = useState({
    password: "",
  });

  const handlerInput = (actionType, e, validateRealTimeField) => {
    if (!e || !e.target) return; // Avoid accessing undefined properties
    const { name, value } = e.target;

    if (actionType === "password") {
      setNewPassword((prevPassword) => ({
        ...prevPassword,
        [name]: value, // Directly update the simple field
      }));
    } else if (actionType === "profile") {
      setNewUserProfile((prevProfile) => ({
        ...prevProfile,
        [name]: value,
      }));
    }
    validateRealTimeField(e);
  };

  const handleEditProfile = async (e, validationOnSubmit) => {
    console.log("updated profile", newUserProfile);
    if (!userProfile.userId) return;
    setIsEditing(true);
    const results = validationOnSubmit(e, newUserProfile);
    if (!results) {
      return;
    }
    console.log("user id from user profile", userProfile.userId);
    try {
      setIsLoading(true);
      const responseEdit = await updateUserDetails(
        userProfile.userId,
        newUserProfile
      );
      if (responseEdit.status == 200) {
        setUserProfile((prev) => ({
          ...prev,
          username: responseEdit.data.username,
          email: responseEdit.data.email,
          aboutMe: responseEdit.data.aboutMe,
          profilePicture: responseEdit.data.profilePicture,
        }));
        alert("Profile edited successful");
        navigate(`/profile/${userProfile.userId}`);
      } else alert("invalid credentials");
    } catch (error) {
      console.error("Error editing profile:", error);
      alert("Failed to edit profile. Please try again."); // Show error alert
    } finally {
      setIsEditing(false);
      setIsLoading(true);
    }
  };

  const handleEditPassword = async (e, validationOnSubmit) => {
    console.log("handleEditPassword triggered");

    console.log("updated password", newPassword);

    if (!userProfile.userId) return;
    setIsEditing(true);
    const results = validationOnSubmit(e, newPassword);
    if (!results) {
      return;
    }
    console.log("entering try block");
    console.log("user id", userProfile.userId);
    console.log("user password", newPassword);

    try {
      setIsLoading(true);
      await updateUserPassword(userProfile.userId, newPassword);
      alert("Profile edited successful");
      navigate(`/profile/${userProfile.userId}`);
    } catch (error) {
      console.error("Error editing password:", error);
      alert("Failed to edit password. Please try again."); // Show error alert
    } finally {
      setIsLoading(false);
      setIsEditing(false);
      setNewPassword({
        password: "",
      });
    }
  };

  const handleDeleteProfile = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const responseDelete = await deleteUser(userProfile.userId);
      if (responseDelete.status == 204) {
        setUserProfile({
          userId: "",
          username: "",
          email: "",
          aboutMe: "",
          profilePicture: "",
        });
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/");
        alert("Profile deleted successful");
      } else alert("invalid credentials");
    } catch (error) {
      console.error("Error editing profile:", error);
      alert("Failed to edit profile. Please try again."); // Show error alert
    } finally {
      setIsLoading(false);
    }
  };

  // to reset all the states inside all input fields when user click cancel
  const handlerCancel = (actionType) => {
    setIsLoading(true);
    if (actionType === "profile") {
      setNewUserProfile({
        username: userProfile.username,
        email: userProfile.email,
        aboutMe: userProfile.aboutMe,
        profilePicture: userProfile.profilePicture,
      });
    } else if (actionType === "password") {
      setNewPassword("");
    }
    setIsLoading(false);
    setIsEditing(false);
    navigate(`/profile/${userProfile.userId}`);
  };

  const contextValue = {
    handleEditProfile,
    handleEditPassword,
    handleDeleteProfile,
    newUserProfile,
    setNewUserProfile,
    newPassword,
    setNewPassword,
    handlerCancel,
    handlerInput,
  };

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
}
