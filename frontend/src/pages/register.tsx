import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response= (await auth?.register(firstName, lastName, username, email, password)) 
      
      if (response?.message) {
        setSuccessMessage("Votre compte a été crée avec succès !");
        setTimeout(() => {
          navigate("/login"); 
        }, 4500);
      } else {
        setSuccessMessage("Une erreur est survenue. Veuillez réessayer !");
      }
      
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
    {successMessage && (
 <div 
 style={{
   backgroundColor: "#e91e63",
   color: "white",
   padding: "10px",
   borderRadius: "5px",
   textAlign: "center",
   fontWeight: "bold",
   marginBottom: "15px"
 }}
 role="alert"
>       {successMessage}
          </div>
            )}
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
