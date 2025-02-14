import React, { useState } from "react";

const AdminContent: React.FC = () => {
  const [isProfilePublic, setIsProfilePublic] = useState<boolean>(true);

  return (
    <div className="card p-4 shadow-lg" style={{ borderColor: "#e91e63" }}>
      <h2 className="text-center" style={{ color: "#e91e63" }}>Admin</h2>
      <p className="text-center">Choisissez la visibilité de votre profil :</p>
      <div className="d-flex justify-content-center">
        <label className="mr-3" style={{ color: "#880e4f", fontWeight: "bold" }}>
          <input
            type="radio"
            name="visibility"
            checked={isProfilePublic}
            onChange={() => setIsProfilePublic(true)}
            className="mr-1"
          />
          Public
        </label>
        <label style={{ color: "#880e4f", fontWeight: "bold" }}>
          <input
            type="radio"
            name="visibility"
            checked={!isProfilePublic}
            onChange={() => setIsProfilePublic(false)}
            className="mr-1"
          />
          Privé
        </label>
      </div>
      <p className="text-center mt-3" style={{ color: "#e91e63" }}>
        Votre profil est actuellement <strong>{isProfilePublic ? "Public" : "Privé"}</strong>.
      </p>
    </div>
  );
};

export default AdminContent;
