import Joi from "joi";
import { createContext, useState } from "react";

// Step 1: Create a context object
export const RecipeValidationContext = createContext();

// Step 2: Create a context provider
export function RecipeValidationProvider({ children }) {
  const [formErrors, setFormErrors] = useState({
    imgSrc: "",
    title: "",
    description: "",
    ingredients: [],
    steps: [],
  });

  const [errors, setErrors] = useState({
    imgSrc: "",
    title: "",
    description: "",
    ingredients: [],
    steps: [],
  });

  const schema = {
    imgSrc: Joi.string()
      .uri()
      .message("Please insert a valid URL")
      .regex(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)
      .message("Invalid image url")
      .required(),
    title: Joi.string()
      .min(3)
      .message("Title must be at least 3 characters long")
      .max(100)
      .message("Title cannot be more than 100 characters")
      .required(),
    description: Joi.string()
      .min(3)
      .message("Description must be at least 3 characters long")
      .max(200)
      .message("Description cannot be more than 200 characters")
      .required(),
    ingredients: Joi.string()
      .min(3)
      .message("Ingredients must be at least 3 characters long")
      .max(200)
      .message("Ingredients cannot be more than 200 characters")
      .required(),
    steps: Joi.string()
      .min(3)
      .message("Steps must be at least 3 characters long")
      .max(200)
      .message("Steps cannot be more than 200 characters")
      .required(),
    location: Joi.string().allow("").optional(),
    latitude: Joi.number().allow(null).optional(),
    longitude: Joi.number().allow(null).optional(),
  };

  const validateRealTimeField = (e, index, newRecipe) => {
    const { name, value } = e.target;
    if (!value) return null; // Return early if value is null or undefined

    if (name === "ingredients" || name === "steps") {
      const updatedArray = [...newRecipe[name]]; // create a copy of the array
      if (index !== null) {
        updatedArray[index] = value; // Update the specific index
      }
      const errorMessage = updatedArray.map((item) => {
        const objToCompare = { [name]: item };
        const fieldSchema = Joi.object({ [name]: schema[name] });
        const result = fieldSchema.validate(objToCompare);
        const { error } = result;
        if (error) {
          return error.details[0].message; // Return error message
        }
        return null; // No error, return null
      });
      settingFormErrors(name, errorMessage);
    } else {
      const objToCompare = { [name]: value };
      const fieldSchema = Joi.object({ [name]: schema[name] });
      const result = fieldSchema.validate(objToCompare);
      const { error } = result;
      settingFormErrors(name, error ? error.details[0].message : null);
    }
  };

  const settingFormErrors = (name, errorMessage) => {
    setFormErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (errorMessage) {
        newErrors[name] = errorMessage;
      } else {
        delete newErrors[name];
      }
      return newErrors;
    });
  };

  const validationOnSubmit = (e, newRecipe) => {
    e.preventDefault();
    const updatedRecipe = { ...newRecipe };
    const validateResults = {};
    let isValid = false;

    ["ingredients", "steps"].forEach((key) => {
      if (key in updatedRecipe) {
        const fieldErrors = updatedRecipe[key].map((item) => {
          const objToCompare = { [key]: item };
          const fieldSchema = Joi.object({ [key]: schema[key] });
          const results = fieldSchema.validate(objToCompare);
          if (results.error) {
            isValid = false;
            return results.error.details[0].message;
          }
          return null;
          // return Joi.validate({ [key]: item }, { [key]: schema[key] });
        });
        validateResults[key] = fieldErrors;
      }
    });

    ["title", "imgSrc", "description"].forEach((key) => {
      if (key in updatedRecipe) {
        const objToCompare = { [key]: updatedRecipe[key] };
        const fieldSchema = Joi.object({ [key]: schema[key] });
        const results = fieldSchema.validate(objToCompare);
        if (results.error) {
          isValid = false;
          validateResults[key] = results.error.details[0].message;
        }
      }
    });

    setFormErrors((prevErrors) => ({ ...prevErrors, ...validateResults }));
    return true;
  };

  const contextValue = {
    validateRealTimeField,
    validationOnSubmit,
    formErrors,
    setFormErrors,
  };

  return (
    <RecipeValidationContext.Provider value={contextValue}>
      {children}
    </RecipeValidationContext.Provider>
  );
}
