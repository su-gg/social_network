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
      const response = await auth?.register(firstName, lastName, username, email, password);
      
      if (response?.message) {
        setSuccessMessage("Votre compte a été créé avec succès !");
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
    <div className="container mt-5">
      {successMessage && (
        <div className="alert text-white text-center fw-bold" style={{ backgroundColor: "#e91e63" }} role="alert">
          {successMessage}
        </div>
      )}
      <div className="card p-4 shadow-lg">
        <h2 className="text-center mb-4">Sign up</h2>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <input type="text" className="form-control" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </div>
          <div className="mb-3">
            <input type="text" className="form-control" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </div>
          <div className="mb-3">
            <input type="text" className="form-control" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="mb-3">
            <input type="email" className="form-control" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <input type="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn text-white w-100" style={{ backgroundColor: "#e91e63" }}>Sign up</button>
        </form>
        <button className="btn btn-secondary w-100 mt-2" onClick={handleGoBack}>Return</button>
      </div>
    </div>
  );
};

export default Register;