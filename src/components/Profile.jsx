// components/Profile.js
import { useContext, useEffect } from "react";
import { UserAuthContext } from "../context/UserAuthContext";
import styles from "./Profile.module.css"; // You can create this CSS file to style your profile
import { useNavigate, useParams } from "react-router-dom";
import { ProfileContext } from "../context/ProfileContext";
import { IsEditingAndLoadingContext } from "../context/IsLoadingandEditingContext";
import { AddOrEditRecipeContext } from "../context/AddOrEditRecipeContext";
import { PacmanLoader } from "react-spinners";

const Profile = () => {
  const { id } = useParams();
  const { isLoggedIn, userProfile } = useContext(UserAuthContext);
  const { setIsEditing, isLoading } = useContext(IsEditingAndLoadingContext);
  const { items, handleNavigateToUserRecipe, userRecipesAndId } = useContext(
    AddOrEditRecipeContext
  );
  const { handleDeleteProfile, setNewUserProfile } = useContext(ProfileContext);
  const navigate = useNavigate();
  // const selectedProfile = items.find((item) => {
  //   return item.user.id === Number(id);
  // });
  console.log("selected profile ", userRecipesAndId);
  // Sample user data for demonstration. In a real app, this could be fetched from an API.
  const samplePic =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQG6U7DsIIUVQmkDyihIPWI-aBCmeLli02NQ&s";

  if (!isLoggedIn) {
    return <p>Please log in to view your profile.</p>;
  }
  console.log("user info inside profile", userProfile);
  return (
    <>
      {isLoading ? (
        <PacmanLoader />
      ) : (
        <div className={styles.profileContainer}>
          <h1 className={styles.username}>
            {userRecipesAndId.username}'s Profile
          </h1>
          <div className={styles.profileCard}>
            <img
              src={
                userRecipesAndId.profilePicture === null
                  ? samplePic
                  : userRecipesAndId.profilePicture
              }
              alt="User profile picture"
              className={styles.profileAvatar}
            />

            <p>
              <strong>Username:</strong>
              <br /> {userRecipesAndId.username}
            </p>

            <p>
              <strong>Email:</strong>
              <br /> {userRecipesAndId.email}
            </p>

            <p>
              <strong>About Me:</strong>
              <br />{" "}
              {userRecipesAndId.aboutMe === null
                ? " Please tell us more about yourself!"
                : userRecipesAndId.aboutMe}
            </p>
          </div>
          <div className={styles.buttonGroup}>
            <button
              className={styles.button}
              onClick={() => {
                handleNavigateToUserRecipe(userRecipesAndId.id);
              }}
            >
              My Recipes
            </button>
            {userRecipesAndId.id !== userProfile.userId ? null : (
              <>
                <button
                  className={styles.button}
                  onClick={() => {
                    navigate("/editProfile");
                    setIsEditing(true);
                    setNewUserProfile({
                      username: userRecipesAndId.username,
                      email: userRecipesAndId.email,
                      aboutMe: userRecipesAndId.aboutMe,
                      profilePicture: userRecipesAndId.profilePicture,
                    });
                  }}
                >
                  Edit Profile
                </button>

                <button
                  className={styles.button}
                  onClick={() => {
                    navigate("/editPassword");
                    setIsEditing(true);
                  }}
                >
                  Password
                </button>
                <button className={styles.button} onClick={handleDeleteProfile}>
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
