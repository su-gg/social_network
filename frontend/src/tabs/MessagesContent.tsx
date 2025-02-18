import React, { useState } from "react";

const MessagesContent: React.FC = () => {
  const [newMessage, setNewMessage] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;
    setMessages([...messages, newMessage]);
    setNewMessage("");
  };

  return (
    <div className="card p-4 shadow-lg" style={{ borderColor: "#e6a4b4" }}>
      <h2 className="text-center" style={{ color: "#e6a4b4" }}>Messagerie</h2>
      <form onSubmit={handleSendMessage} className="mb-3">
        <textarea
          className="form-control mb-2"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Écrivez un nouveau message..."
          rows={3}
          style={{ borderColor: "#e6a4b4", backgroundColor: "#fce4ec", color: "#880e4f" }}
        />
        <button
          type="submit"
          className="btn w-100"
          style={{ backgroundColor: "#e6a4b4", color: "white" }}
        >
          Envoyer
        </button>
      </form>
      <h3 className="text-center" style={{ color: "#e6a4b4" }}>Messages envoyés</h3>
      <ul className="list-group">
        {messages.map((msg, index) => (
          <li
            key={index}
            className="list-group-item"
            style={{ backgroundColor: "#fce4ec", borderColor: "#e6a4b4", color: "#880e4f" }}
          >
            {msg}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MessagesContent;
