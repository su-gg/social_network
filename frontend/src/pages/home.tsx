import React from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
  };
  return (
    <div><h1>Bienvenue sur le réseau social</h1>
    <button onClick={handleLoginRedirect}>Se connecter</button>
    <button onClick={handleRegisterRedirect}>Créer un compte</button></div>
    
    
  )
};

export default Home;
