import { useContext } from "react";
import styles from "./AddEditRecipe.module.css";
import { ProfileContext } from "../context/ProfileContext";
import { ProfileValidationContext } from "../context/ProfileValidationContext";

const EditProfile = () => {
  const { handleEditProfile, newUserProfile, handlerCancel, handlerInput } =
    useContext(ProfileContext);
  const { validationOnSubmit, validateRealTimeField, formErrors } = useContext(
    ProfileValidationContext
  );

  console.log("new user profile at edit profile: ", newUserProfile);

  return (
    <>
      <div className={styles.form}>
        <div className={styles.main}>
          <h1 className={styles.mainTitle}>Edit Profile</h1>
          <button
            className={styles.button}
            onClick={(e) => handleEditProfile(e, validationOnSubmit)}
            // disabled={isLoading}
          >
            Save
          </button>
          <button
            className={styles.button}
            type="button"
            onClick={() => handlerCancel("profile")}
          >
            Cancel
          </button>
        </div>
        <div className={styles.group}>
          <label className={`form-label ${styles.label}`}> Username: </label>
          <input
            className="form-control"
            name="username"
            type="text"
            onChange={(e) => handlerInput("profile", e, validateRealTimeField)}
            value={newUserProfile.username}
          />
        </div>
        {formErrors.username && (
          <div className={styles.error}>{formErrors.username}</div>
        )}
        <div className={styles.group}>
          <label className={`form-label ${styles.label}`}> Email: </label>
          <input
            className="form-control"
            name="email"
            type="text"
            onChange={(e) => handlerInput("profile", e, validateRealTimeField)}
            value={newUserProfile.email}
          />
        </div>
        {formErrors.email && (
          <div className={styles.error}>{formErrors.email}</div>
        )}

        <div className={styles.group}>
          <label className={`form-label ${styles.label}`}>
            {" "}
            Profile Pic URL:{" "}
          </label>
          <input
            className="form-control"
            name="profilePicture"
            type="text"
            onChange={(e) => handlerInput("profile", e, validateRealTimeField)}
            value={newUserProfile.profilePicture}
          />
        </div>
        {formErrors.profilePic && (
          <div className={styles.error}>{formErrors.profilePic}</div>
        )}

        <div className={styles.group}>
          <label className={`form-label ${styles.label}`}> About me: </label>
          <textarea
            className="form-control"
            name="aboutMe"
            type="text"
            onChange={(e) => handlerInput("profile", e, validateRealTimeField)}
            value={newUserProfile.aboutMe}
          />
        </div>
        {formErrors.AboutMe && (
          <div className={styles.error}>{formErrors.AboutMe}</div>
        )}
      </div>
    </>
  );
};

export default EditProfile;
