import React from "react";

const ChatContent: React.FC = () => {
  const friends = ["Alice", "Bob", "Charlie", "David"];

  return (
    <div className="card p-4 shadow-lg" style={{ borderColor: "#e91e63" }}>
      <h2 className="text-center" style={{ color: "#e91e63" }}>Espace Chat</h2>
      <p className="text-muted text-center">Amis connectés :</p>
      <ul className="list-group">
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
    </div>
  );
};

export default ChatContent;
