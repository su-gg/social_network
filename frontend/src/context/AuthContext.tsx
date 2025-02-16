import React, { createContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";

const API_URL = "http://localhost:3010/api/auth";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  gender?: "homme" | "femme" | "autre";
  birthDate?: Date;
}

interface Post {
  _id: string;
  content: string;
  photoUrl?: string;
}

interface RegisterResponse {
  message: string;
  errors?: { field: string; message: string }[];
}

interface AuthContextType {
  user: User | null;
  posts: Post[];
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, username: string, email: string, password: string) => Promise<RegisterResponse>;
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
    navigate("/");
    setUser(null);
    setPosts([]);
    
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
          _id: decodedUser.id,
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

  const register = async (
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string
  ): Promise<RegisterResponse> => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, username, email, password }),
      });
  
      const data = await response.json();
      console.log("📌 Réponse API brute :", data); // Debugging
  
      if (!response.ok) {
        console.error("❌ Échec de l'inscription :", data);
  
        return {
          message: "Registration failed",
          errors: data.errors || [{ field: "global", message: data.message || "Unknown error" }],
        };
      }
  
      return {
        message: data.message || "Registration successful",
      };
    } catch (error) {
      console.error("❌ Erreur réseau :", error);
      return {
        message: "Network error, please try again later.",
        errors: [{ field: "global", message: "Server connection failed" }],
      };
    }
  };
  
  
  

  return (
    <AuthContext.Provider value={{ user, posts, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
