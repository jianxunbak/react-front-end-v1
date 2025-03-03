import { createContext, useEffect, useState } from "react";
import {
  addOneRecipe,
  deleteOneRecipe,
  getAllRecipes,
  updateOneRecipe,
} from "../api/RecipeEndPoints";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getOneUserById } from "../api/userEndPoints";

// Step 1: Create a context object
export const AddOrEditRecipeContext = createContext();

// Step 2: Set up a Context Provider
export function AddorEditRecipeProvider({
  children,
  setIsLoading,
  setIsEditing,
  isLoggedIn,
}) {
  const [newRecipe, setNewRecipe] = useState({
    imgSrc: "",
    title: "",
    description: "",
    ingredients: [""],
    steps: [""],
    location: "",
    latitude: 0.0,
    longitude: 0.0,
  });

  const [items, setItems] = useState([]);
  const [userRecipesAndId, setuserRecipesAndId] = useState([]);
  // const [currentId, setCurrentId] = useState([]);

  // const [selectedUserDetails, setSelectedUserDetails] = useState([]);
  const { id: userIdParams } = useParams();
  console.log("Rendering Recipe with ID:", userIdParams); // This should always log when the component renders

  const navigate = useNavigate();

  const getRecipes = async () => {
    try {
      setIsLoading(true);
      const response = await getAllRecipes();
      if (response.status === 200) setItems(response.data);
      return response;
    } catch (error) {
      console.error("Error getting recipes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("getting all recipes unside use effect");
    const updateRecipes = async () => {
      await getRecipes();
    };
    updateRecipes();
  }, []);

  const currentRoute = useLocation();
  const locationRoutes = "/map";
  useEffect(() => {
    console.log(currentRoute.pathname);
    const mapRoute = async () => {
      if (locationRoutes.includes(currentRoute.pathname)) {
        await getRecipes();
      }
    };
    mapRoute();
  }, [currentRoute.pathname]);

  useEffect(() => {
    const updateRecipes = async () => {
      await getRecipes();
    };
    updateRecipes();
  }, []);

  const handleInput = (e, validateRealTimeField, index = null) => {
    if (!e || !e.target) return; // Avoid accessing undefined properties
    validateRealTimeField(e, index, newRecipe);
    const { name, value } = e.target;

    // update the newRecipe state
    setNewRecipe((prevRecipe) => {
      let newRecipe;

      // Handle array fields like 'ingredients' and 'steps'
      if (name === "ingredients" || name === "steps") {
        const updatedArray = [...prevRecipe[name]]; // Create a copy of the array

        if (index !== null) {
          updatedArray[index] = value; // Update the specific index
        }

        newRecipe = {
          ...prevRecipe,
          [name]: updatedArray, // Update the array in state
        };
      } else {
        // for nonarray fields
        newRecipe = {
          ...prevRecipe,
          [name]: value,
        };
      }
      return newRecipe;
    });
  };

  // to reset all the states inside all input fields when user click cancel
  const handleCancel = () => {
    setIsLoading(true);
    setNewRecipe({
      imgSrc: "",
      title: "",
      description: "",
      ingredients: [""],
      steps: [""],
      location: "",
      latitude: 0.0,
      longitude: 0.0,
    });
    navigate("/");
    setIsEditing(false);
    setIsLoading(false);
  };

  const handlerDelete = async (selectedItem, recipeId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this recipe?"
    );

    if (confirmDelete) {
      setIsLoading(true);
      try {
        const deletedTitle = selectedItem.title;
        const response = await deleteOneRecipe(recipeId);
        if (response.status === 204) {
          await getRecipes();
          alert(`Item deleted: ${deletedTitle}`); // Show alert with the deleted item's title
        }
      } catch (error) {
        console.error("Error deleting recipe:", error);
        alert("Failed to delete the recipe. Please try again."); // Show error alert
      } finally {
        navigate(`/`);
        setIsLoading(false);
      }
    }
  };

  const handleAddField = (field) => {
    setNewRecipe((prevRecipe) => ({
      ...prevRecipe,
      [field]: [...prevRecipe[field], ""],
    }));
  };

  const handleMinusField = (field, itemToRemove) => {
    setNewRecipe((prevRecipe) => ({
      ...prevRecipe,
      [field]: prevRecipe[field].filter((_, index) => index != itemToRemove),
    }));
  };

  const handleAddRecipe = async (e, validationOnSubmit, userId) => {
    e.preventDefault();
    const results = validationOnSubmit(e, newRecipe);
    if (!results) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const response = await addOneRecipe(userId, newRecipe);
      if (response.status === 201) {
        const updatedRecipes = await getRecipes();
        alert(
          `item added:\nTitle: ${newRecipe.title}\nDescription: ${newRecipe.description}\nIngredients: ${newRecipe.ingredients}\nRecipe: ${newRecipe.steps}`
        );
        const createdRecipeId = updatedRecipes.data.find(
          (item) => item.title === newRecipe.title
        ).id;
        if (!createdRecipeId) throw new Error("Newly added recipe not found");
        navigate(`/recipe/${createdRecipeId}`);
      }
    } catch (error) {
      console.error("Error adding recipe:", error);
      alert("Error adding recipe:", error);
    } finally {
      setIsLoading(false);
      setNewRecipe({
        imgSrc: "",
        title: "",
        description: "",
        ingredients: [""],
        steps: [""],
        location: "",
        latitude: 0.0,
        longitude: 0.0,
      });
    }
  };

  const handleEditRecipe = async () => {
    try {
      setIsLoading(true);
      const response = await updateOneRecipe(newRecipe.id, newRecipe);
      if (response.status === 200) {
        await getRecipes();
        alert(
          `item edited:\nTitle: ${newRecipe.title}\nDescription: ${newRecipe.description}\nIngredients: ${newRecipe.ingredients}\nRecipe: ${newRecipe.steps}`
        );
        navigate(`/recipe/${newRecipe.id}`);
      }
    } catch (error) {
      console.error("Error adding recipe:", error);
    } finally {
      setNewRecipe({
        imgSrc: "",
        title: "",
        description: "",
        ingredients: [""],
        steps: [""],
        location: "",
        latitude: 0.0,
        longitude: 0.0,
      });
      setIsLoading(false);
      setIsEditing(false);
    }
  };

  useEffect(() => {
    const id = window.location.pathname.split("/").pop();
    // setCurrentId(id);
    handleGetOneUserRecipes(id);
    console.log("Recipe ID from window.location:", id);
  }, [window.location.pathname]); // Depend on the URL path

  const handleGetOneUserRecipes = async (userId) => {
    console.log("clicking user profile");
    try {
      setIsLoading(true);
      const response = await getOneUserById(userId);
      console.log(response.status);
      if (response.status === 200) {
        setuserRecipesAndId(response.data);
        console.log("user response id ", response.data.id);
        console.log("user response data ", response.data);
      }
    } catch (error) {
      console.error("Error getting recipe:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToUserProfile = async (userId) => {
    await handleGetOneUserRecipes(userId);
    console.log("userRecipesAndId", userRecipesAndId);
    navigate(`/profile/${userId}`);
  };

  const handleNavigateToUserRecipe = async () => {
    // await handleGetOneUserRecipes(userId);
    console.log("navigating to user recipes page");
    console.log("userRecipesAndId", userRecipesAndId);
    navigate(`/userRecipes/${userRecipesAndId.id}`);
  };
  const contextValue = {
    newRecipe,
    setNewRecipe,
    handleCancel,
    handleAddField,
    handleAddRecipe,
    handleInput,
    handleEditRecipe,
    handlerDelete,
    handleMinusField,
    items,
    userRecipesAndId,
    setuserRecipesAndId,
    handleNavigateToUserProfile,
    handleNavigateToUserRecipe,
  };

  return (
    <AddOrEditRecipeContext.Provider value={contextValue}>
      {children}
    </AddOrEditRecipeContext.Provider>
  );
}
