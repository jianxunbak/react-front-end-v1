import { useContext, useEffect } from "react";
import styles from "./Card.module.css";
import { useNavigate } from "react-router-dom";
import { FavouriteContext } from "../context/FavouriteContext";
import { SearchContext } from "../context/SearchContext";
import { IsEditingAndLoadingContext } from "../context/IsLoadingandEditingContext";
import { PacmanLoader } from "react-spinners";

const Fav = () => {
  const navigate = useNavigate();
  const { favouriteList = [], handleUnfavourite } =
    useContext(FavouriteContext);
  const {
    search,
    handleInput,
    searching,
    filteredFavRecipe,
    setFilteredFavRecipe,
  } = useContext(SearchContext);

  // const recipesToShow = !searching ? favouriteList : searchFavRecipe;
  const { isLoading } = useContext(IsEditingAndLoadingContext);

  // console.log("fav list at /fav", favouriteList);
  // console.log("searchrecipe", searchFavRecipe);
  // console.log("recipesToShow", recipesToShow);

  const title =
    favouriteList.length == 0
      ? "You do not have any favourites yet"
      : "Your Favorite Recipes";
  console.log("fav list", favouriteList);

  useEffect(() => {
    if (favouriteList) {
      const filtered = favouriteList.filter((recipe) => {
        const lowerCaseSearch = search.toLowerCase();
        return (
          recipe.recipe.title.toLowerCase().includes(lowerCaseSearch) ||
          recipe.recipe.cuisine.toLowerCase().includes(lowerCaseSearch) ||
          recipe.recipe.user.username.toLowerCase().includes(lowerCaseSearch) ||
          recipe.recipe.ingredients.some((ingredient) =>
            ingredient.toLowerCase().includes(lowerCaseSearch)
          )
        );
      });
      setFilteredFavRecipe(filtered);
    }
  }, [search, favouriteList]);

  console.log("filtered recipes", filteredFavRecipe);
  return (
    <>
      {!searching ? (
        <h1 className={styles.username}>{title}</h1>
      ) : (
        <h1 className={styles.username}>Searched Favorites </h1>
      )}

      <div className={styles.searchGroup}>
        <input
          className={styles.searchBar}
          placeholder="Search..."
          name="search"
          onChange={(e) => handleInput(e)}
          value={search}
        ></input>
      </div>

      {isLoading ? (
        <div className={styles.loadingCenter}>
          <PacmanLoader />
        </div>
      ) : (
        <div className="container mb-5 ">
          <div className="justify-content-center row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
            {filteredFavRecipe.length === 0 ? (
              <div className={styles.card}>No favourites found</div>
            ) : (
              filteredFavRecipe.map((item) => (
                <div key={item.recipe.id} className={styles.card}>
                  <div className="card h-100">
                    <img
                      src={item.recipe.imgSrc}
                      alt={item.recipe.title}
                      className={`card-img-top ${styles.cardContainerImage}`}
                    />
                    <div className="card-body">
                      <h5 className={styles.title}>{item.recipe.title}</h5>
                      <p className={styles.cuisine}>{item.recipe.cuisine}</p>
                      <p className={styles.description}>
                        {item.recipe.description}
                      </p>
                      <div className={styles.buttonGroup}>
                        <button
                          className={styles.button}
                          onClick={(event) => {
                            event.preventDefault();
                            navigate(`/recipe/${item.recipe.id}`);
                          }}
                          type="button"
                        >
                          View
                        </button>
                        <button
                          className={styles.unFav}
                          onClick={() => handleUnfavourite(item.recipe.id)}
                        >
                          Unfavorite
                        </button>
                      </div>
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

export default Fav;
