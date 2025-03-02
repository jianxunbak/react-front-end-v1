import { createContext, useEffect, useState } from "react";
import {
  addFavourites,
  deleteOneFavourite,
  getAllFavourites,
} from "../api/FavouritesEndPoints";
import { useLocation, useNavigate } from "react-router-dom";

// Step 1: Create a context object
export const FavouriteContext = createContext();

// Step 2: Set up a Context Provider
export function FavouriteProvider({
  children,
  userId,
  isLoggedIn,
  setIsLoading,
}) {
  const [favouriteList, setFavouriteList] = useState([]);
  const location = useLocation();

  const handleAllFavourites = async () => {
    if (!userId || !isLoggedIn) {
      console.log("User not logged in or userId is not available.");
      return { status: 500, data: null };
    }

    console.log("userid at fav context: ", userId);
    console.log("entering try");

    try {
      setIsLoading(true);
      const response = await getAllFavourites(userId);
      console.log("API response inside handleAllFavourits:", response);

      if (response.status === 200) {
        console.log("response at fav", response);
        return response;
      } else {
        throw new Error(
          "Failed to fetch favourites, unexpected response status"
        );
      }
    } catch (error) {
      console.log("didnt even do try");

      console.log("error getting all recipes: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFavourites = async () => {
    console.log("Current pathname:", location.pathname);
    try {
      setIsLoading(true);
      if (location.pathname === "/fav" || location.pathname === "/") {
        const response = await handleAllFavourites();
        console.log("update fav response", response);
        if (response.status === 200) {
          const favResponse = response.data;

          console.log("update fav data", response.data);
          console.log("update fav recipes", response.data.recipes);
          console.log("update fav fav", response.data.favourites);
          console.log("fav response", favResponse);

          setFavouriteList(favResponse);
        } else {
          throw new Error("response.data is undefined or null");
        }
      }
    } catch (e) {
      console.log(
        "Invalid response or response.data is null/undefined",
        e.message
      );

      alert("unable to get all favourites", e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }
    if (!userId) {
      setIsLoading(false);
      console.log("userId is not yet available. Waiting for it to be set.");
      return;
    }
    updateFavourites();
  }, [isLoggedIn, location.pathname]);

  const handleAddFavourites = async (recipeId, recipeTitle) => {
    console.log("addfav itemid: ", recipeId);
    if (!userId || !isLoggedIn) return;
    console.log("before add fav: ", favouriteList);

    try {
      const addResponse = await addFavourites(userId, recipeId);

      if (addResponse.status === 201) {
        setFavouriteList((prevFav) => [...prevFav, addResponse.data]);
        alert(`Item added to favourite: ${recipeTitle}`); // Show alert with the deleted item's title
        console.log("after add fav: ", favouriteList);
      }
    } catch (error) {
      console.error("Error adding recipe to favourites", error);
      alert("Failed to add recipe to favourites. Please try again."); // Show error alert
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnfavourite = async (recipeId) => {
    setIsLoading(true);
    console.log("unfav itemid: ", recipeId);

    if (!userId || !isLoggedIn) return;
    console.log("handleUnfavourite userid outside try", userId);
    console.log("favourite list", favouriteList);
    try {
      console.log("before unfav: ", favouriteList);

      const favitem = favouriteList.find((item) => item.recipe.id === recipeId);

      const favRecipeId = favitem.recipe.id;
      const favTitle = favitem.recipe.title;
      console.log("handleUnfavourite favid", favRecipeId);
      console.log("handleUnfavourite userid", userId);
      const deleteFavResponse = await deleteOneFavourite(userId, favRecipeId);

      if (deleteFavResponse.status === 204) {
        setFavouriteList((prevFav) =>
          prevFav.filter((item) => item.recipe.id !== recipeId)
        );
        alert("Item removed from favourites: " + favTitle);
      }
    } catch (error) {
      console.error("Error getting all recipe:", error);
      alert("Failed to get all favourite recipes. Please try again."); // Show error alert
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue = {
    favouriteList,
    setFavouriteList,
    handleAddFavourites,
    handleUnfavourite,
    handleAllFavourites,
  };

  return (
    <FavouriteContext.Provider value={contextValue}>
      {children}
    </FavouriteContext.Provider>
  );
}
