import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
  // Track if the page is in login mode or register mode
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Store the form values
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  // Store messages for the page
  const [pageMessage, setPageMessage] = useState("");

  // Used to move the user to a new page after login
  const navigate = useNavigate();

  // Clear the form values
  function clearForm() {
    setUsername("");
    setPassword("");
    setRole("user");
  }

  // Handle login
  function handleLogin(event) {
    event.preventDefault();

    fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.userId) {
          // Save the login info so the dashboards can use it
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("username", data.username);
          localStorage.setItem("role", data.role);

          // Send the user to the correct dashboard
          if (data.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/user");
          }
        } else {
          setPageMessage(data.message);
        }
      })
      .catch(() => {
        setPageMessage("Could not log in");
      });
  }

  // Handle register
  function handleRegister(event) {
    event.preventDefault();

    fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        password: password,
        role: role
      })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.userId) {
          // Save the new user info right away
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("username", data.username);
          localStorage.setItem("role", data.role);

          // Send the user to the correct dashboard
          if (data.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/user");
          }
        } else {
          setPageMessage(data.message);
        }
      })
      .catch(() => {
        setPageMessage("Could not create account");
      });
  }

  return (
    <div className="login-page">
      {/* Main login box */}
      <div className="login-box">
        {/* Restaurant title section */}
        <div className="login-header">
          <h1>Restaurant Portal</h1>
          <p>Login or create an account to continue</p>
        </div>

        {/* Toggle buttons */}
        <div className="login-toggle">
          <button
            className={isLoginMode ? "active-button" : ""}
            onClick={() => {
              setIsLoginMode(true);
              setPageMessage("");
              clearForm();
            }}
          >
            Login
          </button>

          <button
            className={!isLoginMode ? "active-button" : ""}
            onClick={() => {
              setIsLoginMode(false);
              setPageMessage("");
              clearForm();
            }}
          >
            Register
          </button>
        </div>

        {/* Show page message */}
        {pageMessage && <p className="login-message">{pageMessage}</p>}

        {/* Login form */}
        {isLoginMode ? (
          <form onSubmit={handleLogin} className="login-form">
            {/* Username input */}
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />

            {/* Password input */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            {/* Submit button */}
            <button type="submit" className="main-button">
              Login
            </button>
          </form>
        ) : (
          /* Register form */
          <form onSubmit={handleRegister} className="login-form">
            {/* Username input */}
            <input
              type="text"
              placeholder="Create Username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />

            {/* Password input */}
            <input
              type="password"
              placeholder="Create Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            {/* Role select */}
            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              <option value="user">Standard User</option>
              <option value="admin">Administrator</option>
            </select>

            {/* Submit button */}
            <button type="submit" className="main-button">
              Create Account
            </button>
          </form>
        )}

        {/* Small note section */}
        <div className="login-note">
          <p>This is the restaurant login page for the project.</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;