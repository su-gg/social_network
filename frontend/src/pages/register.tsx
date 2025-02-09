import React,{ useState, useContext } from "react";

import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


const Register = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = useContext(AuthContext);
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await auth?.register(name, username, email, password);
    } catch (error) {
      alert("Erreur d'inscription !");
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <h2>Inscription</h2>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Nom complet" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="Nom d'utilisateur" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">S'inscrire</button>
      </form>
      <button onClick={handleGoBack}>Retour</button>
    </div>
  );
};

export default Register;
