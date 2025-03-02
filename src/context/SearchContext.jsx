import { object } from "joi";
import { createContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export const SearchContext = createContext();

export function SearchProvider({ children, setIsLoading }) {
  const location = useLocation();
  const [search, setSearch] = useState([]);
  // const [searchRecipe, setSearchRecipe] = useState([]);
  const [filteredFavRecipe, setFilteredFavRecipe] = useState([]);
  const [searching, setsearching] = useState(false);
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  const isNavigating = useRef(false);

  //   const [prevPath, setPrevPath] = useState(location.pathname);

  useEffect(() => {
    if (!isNavigating.current) {
      setIsLoading(true);
      console.log("locartion.path", location.pathname);
      setSearch("");
      setsearching(false);
      // setSearchRecipe([]);
      setIsLoading(false);
    }
    isNavigating.current = false;
  }, [location.pathname]);

  // const handleHomeSearch = (e, items) => {
  //   console.log(items);
  //   setIsLoading(true);
  //   setsearching(true);
  //   e.preventDefault();
  //   setSearch(""); // Reset search state before filtering
  //   setSearchRecipe([]);

  //   const searchRecipe = items.filter((keys) =>
  //     Object.values(keys).some((value) => {
  //       if (typeof value === "string") {
  //         return value.toLowerCase().includes(search.toLowerCase());
  //       }
  //       if (Array.isArray(value)) {
  //         return value.some((arrayItem) => {
  //           return arrayItem.toLowerCase().includes(search.toLowerCase());
  //         });
  //       }
  //       if (typeof value === "object") {
  //         return Object.values(value).some((nestValue) => {
  //           if (typeof nestValue === "string" && value !== null) {
  //             return nestValue.toLowerCase().includes(search.toLowerCase());
  //           }
  //         });
  //       }
  //       return false;
  //     })
  //   );

  //   setSearchRecipe(searchRecipe);
  //   setIsLoading(false);
  // };

  const handleCancel = () => {
    setIsLoading(true);
    // setSearchRecipe([]);
    setsearching(false);
    setIsLoading(false);
  };

  const handleInput = (e) => {
    setSearch(e.target.value.toLowerCase());
  };
  const contextValue = {
    search,
    // handleHomeSearch,
    handleInput,
    handleCancel,
    // searchRecipe,
    searching,
    setsearching,
    filteredFavRecipe,
    setFilteredFavRecipe,
    filteredRecipes,
    setFilteredRecipes,
  };

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
}
