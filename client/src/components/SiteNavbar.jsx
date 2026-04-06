import { NavLink, useNavigate } from "react-router-dom";

function SiteNavbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "";
  const isLoggedIn = localStorage.getItem("userId") || "";

  function logoutUser() {
    localStorage.clear();
    navigate("/");
  }

  return (
    <nav className="navbar sticky-top navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <NavLink className="navbar-brand fs-4" to="/home">
          <img
            src="/SunImage.png"
            alt="Logo"
            width="50"
            height="50"
            className="d-inline-block align-text-top"
          />
          Casa del Sol
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/home">
                HOME
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/menu">
                MENU
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/locations">
                LOCATIONS
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/reservations">
                RESERVATIONS
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/online-orders">
                ONLINE ORDERS
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/contact">
                CONTACT US
              </NavLink>
            </li>

            {role === "admin" && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin">
                  ADMIN
                </NavLink>
              </li>
            )}
          </ul>

          {isLoggedIn !== "" && (
            <button className="btn btn-dark" onClick={logoutUser}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default SiteNavbar;