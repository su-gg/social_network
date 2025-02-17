import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

interface Friend {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  statusVisibility: "fullname" | "username";
}

interface FriendRequest {
  _id: string;
  sender: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
  };
}

const FriendsContent: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [suggestions, setSuggestions] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [friendUsername, setFriendUsername] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  //const API_URL = "http://localhost:3010/api/auth";
  const API_URL = "https://prod-beyondwords-04dd84f0b17e.herokuapp.com/api/auth";

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Token manquant");
          return;
        }

        const response = await fetch(`${API_URL}/listFriend`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (response.ok) {
          setFriends(Array.isArray(data.friends) ? data.friends : []);
        } else {
          setError(data.message);
        }
      } catch {
        setError("Erreur lors de la récupération des amis");
      }
    };
    fetchFriends();
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/getUserSuggestion`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (response.ok) {
          setSuggestions(Array.isArray(data) ? data : []);
        } else {
          setError(data.message);
        }
      } catch {
        setError("Erreur lors de la récupération des suggestions d'amis");
      }
    };
    fetchSuggestions();
  }, []);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/getFriendRequest`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (response.ok) {
          setFriendRequests(Array.isArray(data) ? data : []);
        } else {
          setError(data.message);
        }
      } catch {
        setError("Erreur lors de la récupération des demandes d'amis");
      }
    };
    fetchFriendRequests();
  }, []);

  const handleAddFriend = async (friendUsername: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/sendFriendRequest`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ friendUsername }),
      });
      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setError(data.message);
      }
    } catch {
      setError("Erreur lors de l'ajout d'ami");
    }
  };

  const handleRespondToRequest = async (requestId: string, action: "accept" | "decline") => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/respondToFriendRequest`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ requestId, action }),
      });

      if (response.ok) {
        setFriendRequests(friendRequests.filter(request => request._id !== requestId));
      } else {
        setError("Erreur lors de la réponse à la demande d'ami");
      }
    } catch {
      setError("Erreur lors de la réponse à la demande d'ami");
    }
  };

  const handleRemoveFriend = async (friendId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/removeFriend`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ friendId }),
      });

      if (response.ok) {
        setFriends(friends.filter(friend => friend._id !== friendId));
      } else {
        setError("Erreur lors de la suppression de l'ami");
      }
    } catch {
      setError("Erreur lors de la suppression de l'ami");
    }
  };

  return (
    <div className="card p-4 shadow-lg" style={{ borderColor: "#e91e63" }}>
      <h2 className="text-center" style={{ color: "#e91e63" }}>Amis</h2>
      {message && <p className="text-success">{message}</p>}
      {error && <p className="text-danger">{error}</p>}

      <div className="mb-4">
        <h3>Ajouter un ami</h3>
        <div className="d-flex">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Nom d'utilisateur de l'ami"
            value={friendUsername}
            onChange={(e) => setFriendUsername(e.target.value)}
          />
          <button className="btn" style={{ backgroundColor: "#e91e63", color: "white" }} onClick={() => handleAddFriend(friendUsername)}>Ajouter</button>
        </div>
      </div>

      <h3>Demandes d'amis reçues :</h3>
      {friendRequests.length === 0 ? (
        <p className="text-muted">Aucune demande en attente.</p>
      ) : (
        <ul className="list-group">
          {friendRequests.map((request) => (
            <li className="list-group-item d-flex justify-content-between" key={`request-${request._id}`}>
              <div>{request.sender.firstName} {request.sender.lastName} ({request.sender.username})</div>
              <div>
                <button className="btn btn-success btn-sm me-2" onClick={() => handleRespondToRequest(request._id, "accept")}>Accepter</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleRespondToRequest(request._id, "decline")}>Refuser</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <h3>Amis existants :</h3>
      {friends.length === 0 ? (
        <p className="text-muted">Vous n'avez pas encore d'amis.</p>
      ) : (
        <ul className="list-group">
          {friends.map((friend) => (
            <li className="list-group-item d-flex justify-content-between" key={`friend-${friend._id}`}>
              <div>{friend.statusVisibility === "fullname" ? `${friend.firstName} ${friend.lastName}` : `@${friend.username}`}</div>
              <button className="btn btn-danger btn-sm" onClick={() => handleRemoveFriend(friend._id)}>Supprimer</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendsContent;
