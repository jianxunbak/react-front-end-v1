import { useNavigate, useParams } from "react-router-dom";
import styles from "/src/components/Recipe.module.css";
import { useContext } from "react";
import { IsEditingAndLoadingContext } from "../context/IsLoadingandEditingContext";
import { UserAuthContext } from "../context/UserAuthContext";
import { FavouriteContext } from "../context/FavouriteContext";
import { AddOrEditRecipeContext } from "../context/AddOrEditRecipeContext";
import { PacmanLoader } from "react-spinners";

const Recipe = () => {
  // Get the id from the URL params
  const { id } = useParams();
  const navigate = useNavigate();
  const { setIsEditing, isLoading } = useContext(IsEditingAndLoadingContext);
  const { userProfile } = useContext(UserAuthContext);
  const {
    favouriteList = [],
    handleUnfavourite,
    handleAddFavourites,
  } = useContext(FavouriteContext);
  const { setNewRecipe, items, handlerDelete, handleNavigateToUserProfile } =
    useContext(AddOrEditRecipeContext);
  // Find the selected item based on id passed from params
  const selectedItem = items.find((item) => item.id === Number(id));
  console.log("inside recipe", id);
  console.log("inside recipe selected item: ", selectedItem);

  // return the details of selected item
  if (!selectedItem) {
    return <p>item not found!</p>;
  }
  return (
    <>
      {isLoading ? (
        <PacmanLoader />
      ) : (
        <div className={styles.container}>
          <img src={selectedItem.imgSrc} alt={selectedItem.imgAlt}></img>
          <p>Contributor: {selectedItem.user.username}</p>

          <h1>{selectedItem.title.toUpperCase()}</h1>
          <p className={styles.description}>{selectedItem.description}</p>

          <div className={styles.details}>
            <div>
              <h2>INGREDIENTS</h2>
              <ul className={styles.ingredients}>
                {selectedItem.ingredients.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2>STEPS</h2>
              <ul className={styles.steps}>
                {selectedItem.steps.map((item, index) => (
                  <li key={index}>
                    <div className={styles.stepNo}>Step {index + 1}:</div>
                    <div className={styles.stepDet}>{item}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* buttons to navigate back home, delete entry and edit entry */}
          <div className={styles.buttonGroup}>
            {}
            <button
              className={
                favouriteList.some((item) => item.recipe.id === selectedItem.id)
                  ? styles.unFav
                  : styles.fav
              }
              onClick={
                favouriteList.some((item) => item.recipe.id === selectedItem.id)
                  ? () => handleUnfavourite(selectedItem.id)
                  : () =>
                      handleAddFavourites(selectedItem.id, selectedItem.title)
              }
            >
              {favouriteList.some((item) => item.recipe.id === selectedItem.id)
                ? "Unfavourite"
                : "Favourite"}
            </button>
            <button
              className={styles.button}
              onClick={() => {
                navigate(`/`);
              }}
            >
              Home
            </button>
            {userProfile.userId == selectedItem.user.id ? (
              <>
                <button
                  className={styles.button}
                  onClick={() => handlerDelete(selectedItem, id)}
                >
                  Delete
                </button>
                <button
                  className={styles.button}
                  onClick={() => {
                    setNewRecipe(selectedItem);
                    navigate("/edit");
                    setIsEditing(true);
                  }}
                >
                  Edit
                </button>
              </>
            ) : null}
            {userProfile.userId != selectedItem.user.id ? (
              <>
                <button
                  className={styles.button}
                  onClick={() =>
                    handleNavigateToUserProfile(selectedItem.user.id)
                  }
                >
                  User Profile
                </button>
              </>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};

export default Recipe;
