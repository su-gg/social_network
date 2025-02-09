import React from "react";
import { useState, useContext } from "react";

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
    } catch (error) {
      alert("Erreur de connexion !");
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <h2>Connexion</h2>
      
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Se connecter</button>
      </form>
      <button onClick={handleGoBack}>Retour</button>
      <p>
        <Link to="/forgot-password"> Mot de passe oublié ?</Link>
      </p>
    </div>
  );
};

export default Login;
