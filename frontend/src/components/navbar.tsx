import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthContext } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth?.logout();
    navigate("/"); 
  };

  const handleLogoClick = () => {
    navigate(auth?.user ? "/profile" : "/"); 
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#e91e63" }}>
      <div className="container">
        <span
          className="navbar-brand text-white font-weight-bold"
          style={{ fontSize: "1.5rem", cursor: "pointer" }}
          onClick={handleLogoClick}
        >
          BeyondWords
        </span>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {auth?.user && (
              <li className="nav-item">
                <button className="btn btn-light text-danger" onClick={handleLogout}>Logout</button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
