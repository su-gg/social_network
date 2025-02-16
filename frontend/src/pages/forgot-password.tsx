import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:3010/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la demande de réinitialisation.");
      }

      setMessage(`✅ ${data.message}`);
    } catch (error: any) {
      setMessage(`❌ ${error.message || "Erreur réseau. Vérifiez votre connexion."}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="container d-flex justify-content-center mt-5">
      <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-3">🔐 Réinitialisation du mot de passe</h2>
        <p className="text-center text-muted">
          Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.
        </p>

        {message && (
          <div 
            className="alert text-white text-center" 
            style={{ backgroundColor: message.startsWith("✅") ? "#4CAF50" : "#e91e63" }}
            role="alert"
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <button type="submit" className="btn w-100 text-white" style={{ backgroundColor: "#e91e63" }} disabled={loading}>
            {loading ? "Envoi en cours..." : "Envoyer"}
          </button>
        </form>

        <button className="btn btn-secondary mt-3 w-100" onClick={handleGoBack}>
          Retour
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
