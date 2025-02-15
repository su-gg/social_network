import React, { useState, useEffect } from "react";
import socket from "../socket"; // Import du socket

const ChatContent: React.FC = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [friends, setFriends] = useState<string[]>([]);

  useEffect(() => {
    socket.on("message", (data: string) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch("http://localhost:3010/api/friends", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await response.json();
        setFriends(data.friends || []);
      } catch (error) {
        console.error("Erreur lors du chargement des amis :", error);
      }
    };

    fetchFriends();
  }, []);

  const sendMessage = () => {
    if (message.trim() !== "") {
      socket.emit("message", message);
      setMessages((prev) => [...prev, `Moi: ${message}`]);
      setMessage("");
    }
  };

  return (
    <div className="card p-4 shadow-lg" style={{ borderColor: "#e91e63" }}>
      <h2 className="text-center" style={{ color: "#e91e63" }}>Espace Chat</h2>
      <p className="text-muted text-center">Amis connectés :</p>
      {friends.length > 0 ? (
        <ul className="list-group mb-3">
          {friends.map((friend, index) => (
            <li
              key={index}
              className="list-group-item d-flex justify-content-between align-items-center"
              style={{ backgroundColor: "#fce4ec", borderColor: "#e91e63", color: "#880e4f" }}
            >
              {friend}
              <button
                className="btn btn-sm"
                style={{ backgroundColor: "#e91e63", color: "white" }}
                onClick={() => alert(`Conversation lancée avec ${friend}`)}
              >
                Démarrer conversation
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-muted">Invite tes amis à te rejoindre !</p>
      )}

      <div className="border p-3 chat-box" style={{ maxHeight: "300px", overflowY: "auto", backgroundColor: "#fce4ec" }}>
        {messages.map((msg, index) => (
          <p key={index} className="p-2 rounded" style={{ backgroundColor: "#fff", color: "#880e4f" }}>
            {msg}
          </p>
        ))}
      </div>

      <div className="input-group mt-3">
        <input
          type="text"
          className="form-control"
          placeholder="Écris un message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="btn" style={{ backgroundColor: "#e91e63", color: "white" }} onClick={sendMessage}>
          Envoyer
        </button>
      </div>
    </div>
  );
};

export default ChatContent;
