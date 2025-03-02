import { createContext, useEffect, useState } from "react";

// Step 1: Create a context object
export const IsEditingAndLoadingContext = createContext();

// Step 2: Set up a Context Provider
export function IsEditingAndLoadingProvider({ children }) {
  const [isEditing, setIsEditing] = useState(false);
  // const [isLoading, setIsLoading] = useState({
  //   loadProfile: false,
  //   loadRecipes: false,
  //   loadFav: false,
  // });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {}, [isEditing, isLoading]);

  const contextValue = {
    isEditing,
    isLoading,
    setIsEditing,
    setIsLoading,
  };
  return (
    <IsEditingAndLoadingContext.Provider value={contextValue}>
      {children}
    </IsEditingAndLoadingContext.Provider>
  );
}
