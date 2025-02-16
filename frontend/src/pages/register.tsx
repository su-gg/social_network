import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface RegisterResponse {
  message?: string;
  errors?:{field:string; message:string} [];
}
const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); // Réinitialiser les erreurs
  
    try {
      const response = await auth?.register(firstName, lastName, username, email, password) as RegisterResponse | undefined;
      
      console.log("📌 Réponse du register :", response); // Debugging
  
      if (!response) {
        setErrors({ global: "Unexpected error occurred. Please try again." });
        return;
      }
  
      if (response.errors && Array.isArray(response.errors)) {
        const fieldErrors: Record<string, string> = {};
  
        response.errors.forEach((err) => {
          if (err.field) fieldErrors[err.field] = err.message;
        });
  
        setErrors(fieldErrors);
      } 
  
      if (response.message === "Registration failed") {
        setErrors((prev) => ({ ...prev, global: "Registration failed. Please check below." }));
      } else {
        setSuccessMessage("Your account has been successfully created!");
        setTimeout(() => navigate("/login"), 4500);
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      setErrors({ global: "An error occurred. Please try again later." });
    }
  };
  
  
  return (
    <div className="container mt-5">
      <div className="card p-4 shadow-lg">
        <h2 className="text-center mb-4">Sign up</h2>
        {errors.global && <div className="alert alert-danger">{errors.global}</div>}

        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <input 
              type="text" 
              className="form-control" 
              placeholder="First Name" 
              value={firstName} 
              onChange={(e) => setFirstName(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-3">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Last Name" 
              value={lastName} 
              onChange={(e) => setLastName(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-3">
            <input 
              type="text" 
              className={`form-control ${errors.username ? "is-invalid" : ""}`} 
              placeholder="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
            {errors.username && <div className="invalid-feedback">{errors.username}</div>}
          </div>
          <div className="mb-3">
            <input 
              type="email" 
              className={`form-control ${errors.email ? "is-invalid" : ""}`} 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
          <div className="mb-3">
            <input 
              type="password" 
              className="form-control" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn text-white w-100" style={{ backgroundColor: "#e91e63" }}>
            Sign up
          </button>
        </form>
        
        <button className="btn btn-secondary w-100 mt-2" onClick={() => navigate(-1)}>
          Return
        </button>
      </div>
    </div>
  );
};

export default Register;
