import { useContext } from "react";
import styles from "./AddEditRecipe.module.css";
import { IsEditingAndLoadingContext } from "../context/IsLoadingandEditingContext";
import { AddOrEditRecipeContext } from "../context/AddOrEditRecipeContext";
import { RecipeValidationContext } from "../context/RecipeValidationContext";

const EditRecipe = () => {
  const { setIsEditing, isLoading } = useContext(IsEditingAndLoadingContext);
  const {
    newRecipe,
    handleCancel,
    handleAddField,
    handleInput,
    handleEditRecipe,
    handleMinusField,
  } = useContext(AddOrEditRecipeContext);

  const { validateRealTimeField, formErrors } = useContext(
    RecipeValidationContext
  );

  return (
    <>
      <div className={styles.form}>
        <div className={styles.main}>
          <h1 className={styles.mainTitle}>Edit Recipe</h1>
          <button
            className={styles.button}
            onClick={() => handleEditRecipe()}
            disabled={isLoading}
          >
            Save
          </button>
          <button
            className={styles.button}
            type="button"
            onClick={() => handleCancel()}
          >
            Cancel
          </button>
        </div>
        <div className={styles.group}>
          <label className={`form-label ${styles.label}`}> Location: </label>
          <input
            className="form-control"
            name="location"
            type="text"
            // onChange={(e) => handleInput(e, validateRealTimeField)}
            value={newRecipe.city || ""}
          />
        </div>
        <div className={styles.group}>
          <label className={`form-label ${styles.label}`}> Title: </label>
          <input
            className="form-control"
            name="title"
            type="text"
            onChange={(e) => handleInput(e, validateRealTimeField)}
            value={newRecipe.title || ""}
          />
        </div>
        {formErrors.title && (
          <div className={styles.error}>{formErrors.title}</div>
        )}
        <div className={styles.group}>
          <label className={`form-label ${styles.label}`}> Description: </label>
          <textarea
            className="form-control"
            name="description"
            type="text"
            onChange={(e) => handleInput(e, validateRealTimeField)}
            value={newRecipe.description}
          />
        </div>
        {formErrors.description && (
          <div className={styles.error}>{formErrors.description}</div>
        )}

        <div className={styles.group}>
          <label className={`form-label ${styles.label}`}> Image URL: </label>
          <textarea
            className="form-control"
            name="imgSrc"
            type="text"
            onChange={(e) => handleInput(e, validateRealTimeField)}
            value={newRecipe.imgSrc}
          />
        </div>
        {formErrors.imgSrc && (
          <div className={styles.error}>{formErrors.imgSrc}</div>
        )}
        <div className={styles.titleGroup}>
          <h2 className={styles.text}>Ingredients</h2>
          <button
            className={styles.addButton}
            type="button"
            onClick={() => handleAddField("ingredients")}
          >
            +
          </button>
        </div>
        {/* map out the array inside ingredients state and display a text area for user to input */}
        {newRecipe.ingredients.map((ingredient, index) => (
          <div key={index}>
            <div className={styles.group}>
              <div>
                <label className={`form-label ${styles.label}`}>
                  Ingredient {index + 1} :
                </label>
                <button
                  className={styles.delButton}
                  type="button"
                  onClick={() => handleMinusField("ingredients", index)}
                >
                  -
                </button>
              </div>
              <textarea
                className="form-control"
                name="ingredients"
                type="text"
                value={ingredient || ""}
                onChange={(e) => handleInput(e, validateRealTimeField, index)}
              />
            </div>
            <div className={styles.error}>
              {formErrors.ingredients && formErrors.ingredients[index] && (
                <div>{formErrors.ingredients[index]}</div>
              )}
            </div>
          </div>
        ))}

        {/* handler to add empty string inside the ingredients array to be map as a new text area field */}
        <div className={styles.titleGroup}>
          <h2 className={styles.text}>Steps</h2>
          <button
            className={styles.addButton}
            type="button"
            onClick={() => handleAddField("steps")}
          >
            +
          </button>
        </div>
        {/* map out the array inside steps state and display a text area for user to input */}
        {newRecipe.steps.map((step, index) => (
          <div key={index}>
            <div className={styles.group}>
              <div>
                <label className={`form-label ${styles.label}`}>
                  Step {index + 1} :
                </label>
                <button
                  className={styles.delButton}
                  type="button"
                  onClick={() => handleMinusField("steps", index)}
                >
                  -
                </button>
              </div>
              <textarea
                className="form-control"
                name="steps"
                type="text"
                value={step || ""}
                onChange={(e) => handleInput(e, validateRealTimeField, index)}
              />
            </div>
            <div className={styles.error}>
              {formErrors.steps && formErrors.steps[index] && (
                <div>{formErrors.steps[index]}</div>
              )}
            </div>
          </div>
        ))}

        {/* handler to add empty string inside the ingredients array to be map as a new text area field */}
      </div>
    </>
  );
};

export default EditRecipe;
