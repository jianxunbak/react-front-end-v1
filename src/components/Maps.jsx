import { useContext, useEffect, useState } from "react";
import { MapsContext } from "../context/MapsContext";
import { IsEditingAndLoadingContext } from "../context/IsLoadingandEditingContext";
import { PacmanLoader } from "react-spinners";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css"; // Make sure Leaflet CSS is imported
import styles from "./Maps.module.css";
import { AddOrEditRecipeContext } from "../context/AddOrEditRecipeContext";
import L from "leaflet"; // Import leaflet for custom icons
import { useLocation, useNavigate } from "react-router-dom";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { useMap } from "react-leaflet";

const MapEventHandler = ({ lat, lng, MapLoaded }) => {
  const map = useMap();

  useEffect(() => {
    if (lat && lng && MapLoaded) {
      map.flyTo([lat, lng, 15]);
    }
  }, [lat, lng, map, MapLoaded]);
  return null;
};

const Maps = () => {
  const { location } = useContext(MapsContext);
  const { isLoading } = useContext(IsEditingAndLoadingContext);
  const { items = [] } = useContext(AddOrEditRecipeContext);
  const navigate = useNavigate();
  const [MapLoaded, setMapLoaded] = useState(false);
  const routerLocation = useLocation();
  const lat = routerLocation.state?.lat;
  const lng = routerLocation.state?.lng;

  useEffect(() => {
    if (lat && lng) {
      setMapLoaded(true);
    }
  }, [lat, lng]);

  console.log("items inside maps", items);
  // Create a custom icon (adjust the size and image source as needed)
  const customIcon = (imgSrc) =>
    new L.DivIcon({
      html: `<div class=${styles.circleIcon} style="background-image: url('${imgSrc}');"></div>`,
      iconSize: [50, 50], // Size of the icon (in pixels)
      iconAnchor: [25, 50], // Anchor the icon at the bottom center
      popupAnchor: [0, -50], // Adjust popup position
      className: "", // Remove the default Leaflet className to avoid default styling
    });

  const createClusterCustomIcon = (cluster) => {
    const count = cluster.getChildCount();

    return L.divIcon({
      html: `<div class="${styles.clusterIcon}">${count}</div>`, // Custom CSS class
      className: "", // Remove default Leaflet styles
      iconSize: [40, 40], // Adjust size
    });
  };
  return (
    <div className={styles.container}>
      <h1 className={styles.mainTitle}>Recipes of the World </h1>

      <>
        {location.latitude && location.longitude ? (
          <MapContainer
            center={[location.latitude, location.longitude]}
            zoom={15}
            maxZoom={17} // Prevent zooming in past this level
            minZoom={2} // Prevent zooming out past this level
            className={styles.map}
            attributionControl={false}
            maxBounds={[
              [-85, -180], // Southwest corner (bottom-left)
              [85, 180], // Northeast corner (top-right)
            ]}
            maxBoundsViscosity={1.0} // Fully restricts map within bounds
          >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
            <MapEventHandler lat={lat} lng={lng} MapLoaded={MapLoaded} />
            <Marker position={[location.latitude, location.longitude]}>
              <Popup>
                You are at {location.road}, {location.city}
              </Popup>
            </Marker>
            <MarkerClusterGroup
              iconCreateFunction={createClusterCustomIcon}
              maxClusterRadius={80}
              spiderfyDistanceMultiplier={2} // Spread markers more when clicked
              disableClusteringAtZoom={8} // Stops clustering when zoomed in past level 14
            >
              {items.map((recipe) => {
                return (
                  <Marker
                    key={recipe.id}
                    position={[recipe.latitude, recipe.longitude]}
                    icon={customIcon(recipe.imgSrc)}
                  >
                    <Popup>
                      <div className={styles.markerDetails}>
                        <div className={styles.imgContainer}>
                          <img
                            src={recipe.imgSrc}
                            alt="image of recipe"
                            className={styles.img}
                          />
                        </div>

                        <div className={styles.textContainer}>
                          <div className={styles.textInnerContainer}>
                            <p className={styles.title}> {recipe.title}</p>
                            <p className={styles.text}>{recipe.city}</p>
                            <p className={styles.text}>{recipe.description}</p>
                          </div>
                          <button
                            className={styles.button}
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(`/recipe/${recipe.id}`);
                            }}
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MarkerClusterGroup>
          </MapContainer>
        ) : (
          <div className={styles.loadingCenter}>
            <PacmanLoader />
          </div>
        )}
      </>
    </div>
  );
};

export default Maps;
