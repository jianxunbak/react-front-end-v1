import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";
import styles from "./NavBar.module.css";
import { UserAuthProvider, UserAuthContext } from "../context/UserAuthContext";
import { FavouriteProvider } from "../context/FavouriteContext";
import { useContext } from "react";
import { ProfileProvider } from "../context/ProfileContext";
import { IsEditingAndLoadingContext } from "../context/IsLoadingandEditingContext";
import { SearchProvider } from "../context/SearchContext";
import { AddorEditRecipeProvider } from "../context/AddOrEditRecipeContext";
import { MapsProvider } from "../context/MapsContext";

const Root = () => {
  const { userProfile, isLoggedIn, setUserProfile, setIsLoggedIn } =
    useContext(UserAuthContext);
  const { setIsEditing, setIsLoading, isLoading } = useContext(
    IsEditingAndLoadingContext
  );
  console.log("userprofile at root", userProfile);
  console.log("userid at root: ", userProfile.userId);
  console.log("at root", userProfile);

  return (
    <>
      <NavBar />
      <MapsProvider setIsLoading={setIsLoading} isLoading={isLoading}>
        <AddorEditRecipeProvider
          setIsLoading={setIsLoading}
          setIsEditing={setIsEditing}
          isLoggedIn={isLoggedIn}
        >
          <FavouriteProvider
            userId={userProfile.userId}
            isLoggedIn={isLoggedIn}
            setIsLoading={setIsLoading}
          >
            <ProfileProvider
              userProfile={userProfile}
              setUserProfile={setUserProfile}
              setIsLoggedIn={setIsLoggedIn}
              setIsEditing={setIsEditing}
              setIsLoading={setIsLoading}
            >
              <SearchProvider setIsLoading={setIsLoading}>
                <div className={styles.outlet}>
                  <Outlet />
                </div>
              </SearchProvider>
            </ProfileProvider>
          </FavouriteProvider>
        </AddorEditRecipeProvider>
      </MapsProvider>
    </>
  );
};

export default Root;
