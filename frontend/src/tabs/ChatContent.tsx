import React, { useState, useEffect, useContext, useMemo } from "react";
import { io } from "socket.io-client";
import { AuthContext } from "../context/AuthContext";

const API_URL = "https://prod-beyondwords-04dd84f0b17e.herokuapp.com";

interface User {
  id: string;
  username: string;
  friends: User[];
}

const socket = io(API_URL, {
  withCredentials: true,
  transports: ["websocket"],
  autoConnect: false,
});

const ChatContent: React.FC = () => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user as User | null;

  const friends = useMemo(() => user?.friends || [], [user?.friends]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [onlineFriends, setOnlineFriends] = useState<User[]>([]);

  useEffect(() => {
    if (!user || socket.connected) return;

    console.log("🟡 Connexion WebSocket avec user :", user);

    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Connecté au WebSocket avec ID :", socket.id);
      socket.emit("userConnected", user.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Erreur de connexion WebSocket :", err);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (!user) return;
    console.log("👤 Utilisateur connecté :", user);

    const handleOnlineUsers = (onlineUsers: string[]) => {
      console.log("👥 Liste des amis de l'utilisateur :", user.friends);

      const onlineFriendsList: User[] = (user.friends || [])
        .filter(friend => onlineUsers.includes(friend.id))
        .map(friend => ({
          ...friend,
          friends: [], // 🔥 Correction : Assure que la structure User est respectée
        }));

      console.log("✅ Amis en ligne après filtrage :", onlineFriendsList);
      setOnlineFriends(onlineFriendsList);
    };

    socket.on("onlineUsers", handleOnlineUsers);
    return () => {
      socket.off("onlineUsers", handleOnlineUsers);
    };
  }, [friends, user]);

  useEffect(() => {
    if (!user) return;

    const handleMessage = (data: { sender: string; text: string }) => {
      const senderObj = friends.find(f => f.id === data.sender);
      const senderName = senderObj ? senderObj.username : "Ami";

      setMessages(prev => [...prev, `${data.sender === user.id ? "Moi" : senderName}: ${data.text}`]);
    };

    socket.on("message", handleMessage);
    return () => {
      socket.off("message", handleMessage);
    };
  }, [user, friends]);

  const sendMessage = () => {
    if (message.trim() !== "" && user) {
      socket.emit("message", { sender: user.id, text: message });
      setMessages(prev => [...prev, `Moi: ${message}`]);
      setMessage("");
    }
  };

  return (
    <div className="card p-4 shadow-lg" style={{ borderColor: "#e91e63" }}>
      <h2 className="text-center" style={{ color: "#e91e63" }}>Espace Chat</h2>

      <p className="text-muted text-center">Amis en ligne :</p>
      {onlineFriends.length > 0 ? (
        <ul className="list-group mb-3">
          {onlineFriends.map(friend => (
            <li key={friend.id} className="list-group-item d-flex justify-content-between align-items-center"
                style={{ backgroundColor: "#fce4ec", borderColor: "#e91e63", color: "#880e4f" }}>
              {friend.username}
              <button
                className="btn btn-sm"
                style={{ backgroundColor: "#e91e63", color: "white" }}
                onClick={() => alert(`Conversation lancée avec ${friend.username}`)}
              >
                Démarrer conversation
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-muted">Aucun ami en ligne.</p>
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
