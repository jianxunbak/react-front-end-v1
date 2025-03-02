import { createContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// Step 1: Create a context object
export const MapsContext = createContext();

// Step 2: Set up a Context Provider
export function MapsProvider({ children, setIsLoading, isLoading }) {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    city: "Unknown city",
    country: "Unknown Country",
    road: "Unknown Road",
    error: "Location is not supported or permission not given",
  });

  const currentRoute = useLocation();
  const locationRoutes = ["/map", "/add"];
  useEffect(() => {
    console.log(currentRoute.pathname);
    if (locationRoutes.includes(currentRoute.pathname)) {
      getLocation();
    }
  }, [currentRoute.pathname]);

  // Inside your MapsProvider component
  useEffect(() => {
    console.log("Inside maps context: isLoading changed to", isLoading);
  }, [isLoading]); // This will log whenever `isLoading` changes

  const getLocation = async () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );

          const data = await response.json();

          setLocation((prevLocation) => ({
            ...prevLocation,
            latitude: latitude,
            longitude: longitude,
            city: data.address.city,
            country: data.address.country,
            road: data.address.road,
            error: null,
          }));
        } catch (error) {
          setLocation((prevLocation) => ({
            ...prevLocation,
            error: error.message,
          }));
          setIsLoading(false);
        } finally {
          setIsLoading(false);
        }
      });
    } else {
      setIsLoading(false);
    }
  };

  const contextValue = { location, setLocation };

  return (
    <MapsContext.Provider value={contextValue}>{children}</MapsContext.Provider>
  );
}
