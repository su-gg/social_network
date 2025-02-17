import React, { createContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";
import socket from "../socket"; // WebSocket

//const API_URL = "http://localhost:3010/api/auth";
const API_URL = "https://prod-beyondwords-04dd84f0b17e.herokuapp.com/api/auth";
console.log("API_URL utilisé coucou Su 1:", API_URL);


interface User {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  gender?: "homme" | "femme" | "autre";
  birthDate?: Date;
  friends?: User[];
}

interface Message {
  sender: string;
  text: string;
}

interface AuthContextType {
  user: User | null;
  onlineFriends: User[];
  messages: Message[];
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  sendFriendRequest: (friendUsername: string) => Promise<void>;
  respondToFriendRequest: (requestId: string, action: "accept" | "decline") => Promise<void>;
  fetchFriends: () => Promise<void>;
  sendMessage: (text: string) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [onlineFriends, setOnlineFriends] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Déconnexion
  const logout = () => {
    localStorage.removeItem("token");
    if (user) socket.emit("userDisconnected", user._id);
    setUser(null);
    navigate("/");
  };

  // Récupération des amis
  const fetchFriends = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/listFriend`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

      const data = await response.json();
      setUser((prevUser) => (prevUser ? { ...prevUser, friends: data.friends } : prevUser));
    } catch (error) {
      console.error("Erreur lors de la récupération des amis :", error);
    }
  };

  // Chargement de l'utilisateur depuis le token
  useEffect(() => {
    const loadUserFromToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const decodedUser: any = jwtDecode(token);
        const response = await fetch(`${API_URL}/me`, {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Impossible de récupérer les informations utilisateur");

        const userData = await response.json();
        setUser({ ...decodedUser, ...userData });

        if (location.pathname === "/login" || location.pathname === "/register") {
          navigate("/profile");
        }

        socket.emit("userConnected", userData._id);

      } catch (err) {
        console.error("Token invalide ou expiré:", err);
        logout();
      }
    };

    loadUserFromToken();
  }, []);

  // Mise à jour des amis en ligne via WebSocket
  useEffect(() => {
    socket.on("onlineUsers", (onlineUserIds: string[]) => {
      if (!user?.friends) return;
      const onlineFriendsList = user.friends.filter(friend => onlineUserIds.includes(friend._id));
      setOnlineFriends(onlineFriendsList);
    });

    return () => {
      socket.off("onlineUsers");
    };
  }, [user?.friends]);

  // Connexion
  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Erreur lors de la connexion");

      const data = await response.json();
      console.error("response.json()  :", response.json());

      localStorage.setItem("token", data.token);
      setUser(data.user);
      navigate("/profile");

      socket.emit("userConnected", data.user._id);

    } catch (error) {
      console.error("Erreur de connexion :", error);
      alert("Erreur de connexion. Veuillez vérifier vos identifiants");
    }
  };

  // Inscription
  const register = async (firstName: string, lastName: string, username: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, username, email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Erreur lors de l'inscription");

      navigate("/login");
    } catch (error) {
      console.error("Erreur d'inscription :", error);
      alert("Erreur d'inscription. Veuillez vérifier vos informations.");
    }
  };

  // Envoi de demande d'ami
  const sendFriendRequest = async (friendUsername: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/sendFriendRequest`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ friendUsername }),
      });

      if (!response.ok) throw new Error("Erreur lors de l'envoi de la demande d'ami");
      alert("Demande d'ami envoyée !");
    } catch (error) {
      console.error("Erreur lors de l'envoi de la demande d'ami :", error);
      alert("Erreur lors de l'envoi de la demande d'ami.");
    }
  };

  // Réponse à une demande d'ami
  const respondToFriendRequest = async (requestId: string, action: "accept" | "decline") => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/respondToFriendRequest`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action }),
      });

      if (!response.ok) throw new Error("Erreur lors de la réponse à la demande d'ami");
      alert(`Demande d'ami ${action === "accept" ? "acceptée" : "refusée"} !`);
      fetchFriends();
    } catch (error) {
      console.error("Erreur lors de la réponse à la demande d'ami :", error);
      alert("Erreur lors de la réponse à la demande d'ami.");
    }
  };

  const sendMessage = (text: string) => {
    if (!user) return;
  
    const message: Message = { sender: user._id, text };
    socket.emit("sendMessage", message);
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      onlineFriends, 
      messages, 
      login, 
      register, 
      logout, 
      sendFriendRequest, 
      respondToFriendRequest, 
      fetchFriends,
      sendMessage 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
