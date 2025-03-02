import { useNavigate } from "react-router-dom";
import styles from "./Card.module.css";
import { useContext, useEffect } from "react";
import { UserAuthContext } from "../context/UserAuthContext";
import { FavouriteContext } from "../context/FavouriteContext";
import { AddOrEditRecipeContext } from "../context/AddOrEditRecipeContext";
import { SearchContext } from "../context/SearchContext";
import { IsEditingAndLoadingContext } from "../context/IsLoadingandEditingContext";
import { PacmanLoader } from "react-spinners";

export const UserRecipes = () => {
  const navigate = useNavigate();
  const { search, handleInput, filteredRecipes, setFilteredRecipes } =
    useContext(SearchContext);

  const { isLoggedIn, userProfile, setIsEditing } = useContext(UserAuthContext);
  const { isLoading } = useContext(IsEditingAndLoadingContext);
  const {
    favouriteList = [],
    handleAddFavourites,
    handleUnfavourite,
  } = useContext(FavouriteContext);
  const {
    setNewRecipe,
    userRecipesAndId,
    // items = [],
    handlerDelete,
  } = useContext(AddOrEditRecipeContext);

  useEffect(() => {
    if (userRecipesAndId && userRecipesAndId.recipes) {
      const filtered = userRecipesAndId.recipes.filter((recipe) => {
        const lowerCaseSearch = search.toLowerCase();
        return (
          recipe.title.toLowerCase().includes(lowerCaseSearch) ||
          recipe.ingredients.some((ingredient) =>
            ingredient.toLowerCase().includes(lowerCaseSearch)
          )
        );
      });
      setFilteredRecipes(filtered);
    }
  }, [search, userRecipesAndId]);

  console.log("arrived at user recipes page");
  console.log("userRecipesAndId at user recipe page", userRecipesAndId);
  return (
    <>
      {isLoading || !userRecipesAndId || !userRecipesAndId.recipes ? (
        <PacmanLoader />
      ) : (
        <div className="container mb-5">
          <p className={styles.username}>
            {userRecipesAndId.username}'s recipes
          </p>
          <div className={styles.searchGroup}>
            <input
              className={styles.searchBar}
              placeholder="Search..."
              name="search"
              onChange={(e) => handleInput(e)}
              value={search}
            ></input>
          </div>

          <div className="justify-content-center row row-cols-1 row-cols-md-3 row-cols-sm-2 g-4">
            {filteredRecipes.length === 0 ? (
              <div className={styles.card}>No Recipes found</div>
            ) : (
              filteredRecipes.map((item, index) => (
                <div key={index} className={styles.card}>
                  <div className="card h-100">
                    <img
                      src={item.imgSrc}
                      alt={item.title}
                      className={`card-img-top ${styles.cardContainerImage}`}
                    />
                    <div className="card-body">
                      <h5 className={styles.title}>{item.title}</h5>
                      <p className={styles.cuisine}>{item.cuisine}</p>
                      <p className={styles.description}>{item.description}</p>
                      {isLoggedIn && (
                        <div className={styles.buttonGroup}>
                          <button
                            className={styles.button}
                            onClick={(event) => {
                              event.preventDefault();
                              navigate(`/recipe/${item.id}`);
                            }}
                            type="button"
                          >
                            View
                          </button>
                          <button
                            className={
                              favouriteList.some(
                                (favitem) => favitem.recipe.id === item.id
                              )
                                ? styles.unFav
                                : styles.fav
                            }
                            onClick={
                              favouriteList.some(
                                (favitem) => favitem.recipe.id === item.id
                              )
                                ? () => handleUnfavourite(item.id)
                                : () => handleAddFavourites(item.id, item.title)
                            }
                          >
                            {favouriteList.some(
                              (favitem) => favitem.recipe.id === item.id
                            )
                              ? "Unfav"
                              : "Fav"}
                          </button>

                          {userProfile.userId == item.id ? (
                            <>
                              <button
                                className={styles.button}
                                onClick={() => handlerDelete(item, item.id)}
                              >
                                Delete
                              </button>
                              <button
                                className={styles.button}
                                onClick={() => {
                                  setNewRecipe(item);
                                  navigate("/edit");
                                  setIsEditing(true);
                                }}
                              >
                                Edit
                              </button>
                            </>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UserRecipes;
