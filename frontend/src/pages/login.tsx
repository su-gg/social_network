import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await auth?.login(email, password);
      navigate("/profile"); 
    } catch (error) {
      alert("Erreur de connexion !");
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center mt-5">
      <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Connexion</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn w-100 text-white" style={{ backgroundColor: "#e91e63" }}>
            Connexion
          </button>
        </form>
        <div className="text-center mt-3">
          <Link to="/forgot-password" className="text-decoration-none">
            Mot de passe oublié ?
          </Link>
        </div>
        <button className="btn btn-secondary mt-3 w-100" onClick={handleGoBack}>
          Retour
        </button>
      </div>
    </div>
  );
};

export default Login;
