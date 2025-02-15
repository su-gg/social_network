import React, { createContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";

const API_URL = "http://localhost:3010/api/auth";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  gender?: "homme" | "femme" | "autre";
  birthDate?: Date;
}

interface Post {
  id: string;
  message: string;
  photoUrl?: string;
  author: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  posts: Post[];
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, username: string, email: string, password: string) => Promise<void>; // ✅ Correction
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const navigate = useNavigate();
  const location = useLocation(); 

  const logout = () => {
    console.log("Déconnexion...");
    localStorage.removeItem("token");
    setUser(null);
    setPosts([]);
    navigate("/home");
  };

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/posts`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);

      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Erreur lors du chargement des posts :", error);
    }
  };

  useEffect(() => {
    console.log("🌀 useEffect exécuté !");

    const loadUserFromToken = () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const decodedUser: any = jwtDecode(token);
        setUser({
          id: decodedUser.id,
          firstName: decodedUser.firstName,
          lastName: decodedUser.lastName,
          username: decodedUser.username,
          email: decodedUser.email,
          gender: decodedUser.gender || "autre",
          birthDate: decodedUser.birthDate || "",
        });

        fetchPosts();

        if (location.pathname === "/login" || location.pathname === "/register") {
          navigate("/profile");
        }
      } catch (err) {
        console.error("❌ Token invalide ou expiré:", err);
        logout();
      }
    };

    loadUserFromToken();
  }, []); 

  const login = async (email: string, password: string) => {
    try {
      console.log("Tentative de connexion avec :", { email });

      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error("Erreur lors de la connexion");

      const data = await response.json();

      if (!data.token || !data.user) {
        throw new Error("Réponse API invalide");
      }

      localStorage.setItem("token", data.token);
      console.log("✅ Token enregistré dans localStorage :", localStorage.getItem("token"));

      setUser(data.user);
      fetchPosts();
      navigate("/profile");
    } catch (error) {
      console.error("Erreur de connexion :", error);
      alert("Erreur de connexion. Veuillez vérifier vos identifiants");
    }
  };

  const register = async (firstName: string, lastName: string, username: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ firstName, lastName, username, email, password }),
      });

      if (!response.ok) throw new Error("Erreur lors de l'inscription");

      navigate("/login");
    } catch (error) {
      console.error("Erreur d'inscription :", error);
      alert("Erreur d'inscription. Veuillez essayer à nouveau.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, posts, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
