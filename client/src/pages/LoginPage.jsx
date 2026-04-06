import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pageMessage, setPageMessage] = useState("");

  const navigate = useNavigate();

  function clearForm() {
    setUsername("");
    setPassword("");
  }

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
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("username", data.username);
          localStorage.setItem("role", data.role);

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

  function handleRegister(event) {
    event.preventDefault();

    fetch("http://localhost:5000/api/auth/register", {
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
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("username", data.username);
          localStorage.setItem("role", data.role);
          navigate("/user");
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
      <div className="login-box">
        <div className="login-header">
          <h1>Restaurant Portal</h1>
          <p>Login or create a user account to continue</p>
        </div>

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

        {pageMessage && <p className="login-message">{pageMessage}</p>}

        {isLoginMode ? (
          <form onSubmit={handleLogin} className="login-form">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            <button type="submit" className="main-button">
              Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="login-form">
            <input
              type="text"
              placeholder="Create Username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />

            <input
              type="password"
              placeholder="Create Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            <button type="submit" className="main-button">
              Create Account
            </button>
          </form>
        )}

        <div className="login-note">
          <p>This is the restaurant login page for the project.</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;