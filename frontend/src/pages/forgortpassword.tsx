import React, { useState } from "react";
import axios from "axios";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3010/api/auth/forgot-password", { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage("❌ Une erreur est survenue. Vérifiez votre email.");
    }
  };

  return (
    <div className="container">
      <h2>🔐 Réinitialisation du mot de passe</h2>
      <p>Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.</p>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Envoyer</button>
      </form>
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
};

export default ForgotPassword;
