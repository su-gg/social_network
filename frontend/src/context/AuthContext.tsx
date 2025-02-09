
import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3010/api/auth";

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser: any = jwtDecode(token);
        setUser({
          id: decodedUser.id,
          name: decodedUser.name,
          username: decodedUser.username,
          email: decodedUser.email,
        });

      } catch (err) {
        console.error ("token invalide");
        logout();
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await axios.post(`${API_URL}/login`, { email, password }, { withCredentials: true });
      localStorage.setItem("token", data.token);
      setUser(data.user);
      navigate("/profile");
    } catch (error) {
      console.error("Erreur de connexion :", error);
      alert("Erreur de connexion. Veuillez vérifier vos identifiants");
    }
  };
  
  const register = async (name: string, username: string, email: string, password: string) => {
    try {
      await axios.post(`${API_URL}/register`, { name, username, email, password });
    navigate("/login");
    } catch (error) {
      alert("Erreur d'inscription. Veuillez essayer à nouveau.")
    }
    
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/home");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
