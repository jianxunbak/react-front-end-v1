import { NavLink } from "react-router-dom";
import styles from "./NavBar.module.css";
import { useContext, useEffect, useRef, useState } from "react";
import { UserAuthContext } from "../context/UserAuthContext";
import { IsEditingAndLoadingContext } from "../context/IsLoadingandEditingContext";

const NavBar = () => {
  const { isLoggedIn, handleLogout, userProfile } = useContext(UserAuthContext);
  const { isEditing } = useContext(IsEditingAndLoadingContext);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen((prevState) => !prevState);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };
  console.log("NavBar - isLoggedIn:", isLoggedIn); // Log the isLoggedIn value here
  console.log("NavBar - handleLogout:", handleLogout); // Log the isLoggedIn value here
  console.log("NavBar - userprofile:", userProfile); // Log the isLoggedIn value here

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <>
      <div className={styles.bar}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? styles.isActive : styles.notActive
          }
        >
          Home
        </NavLink>

        {isLoggedIn === false ? (
          <NavLink
            to="login"
            className={({ isActive }) =>
              isActive ? styles.isActive : styles.notActive
            }
          >
            Log in
          </NavLink>
        ) : (
          <button className="btn btn-outline-dark" onClick={handleLogout}>
            Log Out
          </button>
        )}

        {isLoggedIn === false ? (
          <NavLink
            to="signup"
            className={({ isActive }) =>
              isActive ? styles.isActive : styles.notActive
            }
          >
            Sign up
          </NavLink>
        ) : null}

        <div className={styles.dropdown} ref={dropdownRef}>
          <button className={styles.dropdownButton} onClick={toggleDropdown}>
            More
          </button>
          {dropdownOpen && (
            <div className={styles.dropdownContent}>
              {isLoggedIn && (
                <NavLink
                  to="add"
                  className={({ isActive }) =>
                    isActive ? styles.isActive : styles.notActive
                  }
                >
                  {!isEditing ? "Add Recipe" : "Edit Recipe"}
                </NavLink>
              )}

              {isLoggedIn && (
                <NavLink
                  to="fav"
                  className={({ isActive }) =>
                    isActive ? styles.isActive : styles.notActive
                  }
                >
                  Fav List
                </NavLink>
              )}
              {isLoggedIn && (
                <NavLink
                  to="map"
                  className={({ isActive }) =>
                    isActive ? styles.isActive : styles.notActive
                  }
                >
                  Map
                </NavLink>
              )}
              {isLoggedIn && (
                <NavLink
                  to={`profile/${userProfile.userId}`}
                  className={({ isActive }) =>
                    isActive ? styles.isActive : styles.notActive
                  }
                >
                  Profile Settings
                </NavLink>
              )}
              {/* <NavLink
                to="about"
                className={({ isActive }) =>
                  isActive ? styles.isActive : styles.notActive
                }
              >
                About
              </NavLink> */}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NavBar;
