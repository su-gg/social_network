import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await auth?.register(firstName, lastName, username, email, password);
      navigate("/login"); 
    } catch (error) {
      alert("Erreur d'inscription !");
      console.error("Erreur lors de l'inscription :", error);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <h2>Inscription</h2>
      <form onSubmit={handleRegister}>
        <input 
          type="text" 
          placeholder="Prénom" 
          value={firstName} 
          onChange={(e) => setFirstName(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Nom" 
          value={lastName} 
          onChange={(e) => setLastName(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Nom d'utilisateur" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Mot de passe" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit">S'inscrire</button>
      </form>
      <button onClick={handleGoBack}>Retour</button>
    </div>
  );
};

export default Register;
