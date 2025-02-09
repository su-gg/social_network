import React, {useContext} from "react";
import { AuthContext } from "../context/AuthContext";

const Profile: React.FC = () => {
  const auth = useContext(AuthContext);

  const handleLogout = () => {
    auth?.logout();
  };

  return (
    <div>
      
      <h1>Tableau de bord</h1>
      <button onClick={handleLogout}>Déconnexion</button>
    </div>
  )
}

export default Profile;
