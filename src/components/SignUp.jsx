import { useContext } from "react";
import { UserAuthContext } from "../context/UserAuthContext";
import styles from "./LoginSignUp.module.css";
import { ProfileValidationContext } from "../context/ProfileValidationContext";

const SignUp = () => {
  const { credentials, handleCredentialsChange, handleSignUp } =
    useContext(UserAuthContext);

  const { validateRealTimeField, validationOnSubmit, formErrors } = useContext(
    ProfileValidationContext
  );
  return (
    <div>
      <form className={styles.loginContainer}>
        <div>
          <label htmlFor="username" className="form-label">
            Username:
          </label>
          <input
            id="username"
            className="form-control"
            name="username"
            value={credentials.username}
            onChange={(e) => handleCredentialsChange(e, validateRealTimeField)}
          />
        </div>
        {formErrors.username && (
          <div className={styles.error}>{formErrors.username}</div>
        )}
        <div>
          <label htmlFor="email" className="form-label">
            Email:
          </label>
          <input
            id="email"
            className="form-control"
            name="email"
            value={credentials.email}
            onChange={(e) => handleCredentialsChange(e, validateRealTimeField)}
          />
        </div>
        {formErrors.email && (
          <div className={styles.error}>{formErrors.email}</div>
        )}
        <div>
          <label className="form-label m-2">Password: </label>
          <input
            className="form-control"
            name="password"
            type="password"
            value={credentials.password}
            onChange={(e) => handleCredentialsChange(e, validateRealTimeField)}
          />
        </div>
        {formErrors.password && (
          <div className={styles.error}>{formErrors.password}</div>
        )}
        <div className={styles.buttonContainer}>
          <button
            className={styles.button}
            type="button"
            onClick={(e) => handleSignUp(e, validationOnSubmit)}
          >
            Sign up
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
