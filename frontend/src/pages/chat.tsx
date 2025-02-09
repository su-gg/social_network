import React, { useState, useEffect } from "react";
import socket from "../socket"; // Import du socket

const Chat: React.FC = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.on("message", (data: string) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() !== "") {
      socket.emit("message", message); // Envoi du message au serveur
      setMessage("");
    }
  };

  return (
    <div>
      <h1>Chat en temps réel</h1>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Écris un message..."
      />
      <button onClick={sendMessage}>Envoyer</button>
    </div>
  );
};

export default Chat;
