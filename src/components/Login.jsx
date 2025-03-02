import { useContext } from "react";
import { UserAuthContext } from "../context/UserAuthContext";
import styles from "./LoginSignUp.module.css";

const Login = () => {
  const { credentials, handleCredentialsChange, handleLogin } =
    useContext(UserAuthContext);

  return (
    <div>
      <form onSubmit={handleLogin} className={styles.loginContainer}>
        <div>
          <label htmlFor="username" className="form-label">
            Username:{" "}
          </label>
          <input
            id="username"
            className="form-control"
            name="username"
            value={credentials.username}
            onChange={(e) => handleCredentialsChange(e)}
          />
        </div>
        <div>
          <label className="form-label m-2">Password: </label>
          <input
            className="form-control"
            name="password"
            type="password"
            value={credentials.password}
            onChange={(e) => handleCredentialsChange(e)}
          />
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.button} type="submit">
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
