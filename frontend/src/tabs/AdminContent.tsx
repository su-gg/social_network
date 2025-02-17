import React, { useState, useEffect } from "react";

const AdminContent: React.FC = () => {
  const [isProfilePublic, setIsProfilePublic] = useState<boolean>(true);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [birthDate, setBirthDate] = useState<string>("");
  const [gender, setGender] = useState<string>("Homme");
  const [displayNameType, setDisplayNameType] = useState<"firstName" | "lastName" | "fullName" | "username">("fullName");
  //const API_URL = "https://prod-beyondwords-04dd84f0b17e.herokuapp.com";
  const API_URL = "http://localhost:3010";
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:3010/api/auth/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
    
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
    
        const contentType = response.headers.get("Content-Type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Réponse invalide, attendu du JSON");
        }
    
        const data = await response.json(); 
    
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setUsername(data.username || "");
        setBirthDate(data.birthDate || "");
        setGender(data.gender || "Homme");
        setDisplayNameType(data.displayNameType || "fullName");
        setIsProfilePublic(data.isProfilePublic !== undefined ? data.isProfilePublic : true);

        if (data.birthDate) {
          const formattedDate = new Date(data.birthDate).toISOString().split("T")[0];
          setBirthDate(formattedDate); 
        }
      } catch (error) {
        console.error("Erreur lors du chargement des informations :", error);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:3010/api/auth/updateProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ firstName, lastName, username, birthDate, gender, displayNameType, isProfilePublic }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Profil mis à jour avec succès !");
      } else {
        alert(`Erreur : ${data.message}`);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      alert("Erreur lors de la mise à jour du profil.");
    }
  };

  const getDisplayName = () => {
    switch (displayNameType) {
      case "firstName":
        return firstName;
      case "lastName":
        return lastName;
      case "fullName":
        return `${firstName} ${lastName}`;
      case "username":
        return username;
      default:
        return username;
    }
  };

  return (
    <div className="card p-4 shadow-lg" style={{ borderColor: "#e91e63" }}>
      <h2 className="text-center" style={{ color: "#e91e63" }}>Admin</h2>

      {/* Champs Nom, Prénom, Username */}
      <div className="mb-3">
        <label className="form-label fw-bold" style={{ color: "#880e4f" }}>Nom</label>
        <input type="text" className="form-control" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold" style={{ color: "#880e4f" }}>Prénom</label>
        <input type="text" className="form-control" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold" style={{ color: "#880e4f" }}>Nom d'utilisateur</label>
        <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>

      {/* Date de naissance */}
      <div className="mb-3">
        <label className="form-label fw-bold" style={{ color: "#880e4f" }}>Date de naissance</label>
        <input type="date" className="form-control" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
      </div>

      {/* Sélection du sexe */}
      <div className="mb-3">
        <label className="form-label fw-bold" style={{ color: "#880e4f" }}>Sexe</label>
        <select className="form-control" value={gender} onChange={(e) => setGender(e.target.value)}>
          <option>Homme</option>
          <option>Femme</option>
          <option>Autre</option>
        </select>
      </div>

      {/* Affichage en tant que */}
      <div className="mb-3">
        <label className="form-label fw-bold" style={{ color: "#880e4f" }}>Afficher en tant que :</label>
        <select className="form-select" value={displayNameType} onChange={(e) => setDisplayNameType(e.target.value as any)}>
          <option value="firstName">Prénom ({firstName})</option>
          <option value="lastName">Nom ({lastName})</option>
          <option value="fullName">Nom Complet ({firstName} {lastName})</option>
          <option value="username">Nom d'utilisateur ({username})</option>
        </select>
      </div>

      {/* Aperçu */}
      <div className="mb-4 p-3 border rounded text-center" style={{ backgroundColor: "#fce4ec" }}>
        <strong>Aperçu : </strong>
        <span style={{ color: "#e91e63" }}>{getDisplayName()}</span>
      </div>

      {/* Visibilité du profil */}
      <div className="mb-4">
        <label className="form-label fw-bold" style={{ color: "#880e4f" }}>Visibilité du profil :</label>
        <div className="d-flex">
          <label className="me-3">
            <input type="radio" name="visibility" checked={isProfilePublic} onChange={() => setIsProfilePublic(true)} className="me-1" />
            Public
          </label>
          <label>
            <input type="radio" name="visibility" checked={!isProfilePublic} onChange={() => setIsProfilePublic(false)} className="me-1" />
            Privé
          </label>
        </div>
      </div>

      {/* Bouton Sauvegarder */}
      <button className="btn mt-3" style={{ backgroundColor: "#e91e63", color: "white", fontWeight: "bold" }} onClick={handleSave}>
        Sauvegarder
      </button>
    </div>
  );
};

export default AdminContent;
