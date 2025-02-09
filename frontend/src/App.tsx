import React from "react";
import { Routes, Route} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Profile from "./pages/profile";
import Chat from "./pages/chat";

import Navbar from "./components/navbar";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPassword from "./pages/forgortpassword";

const App: React.FC = () => {
  return (
    <>
    <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
        path="/profile"
        element={<PrivateRoute element={<Profile />} />}
      />
        <Route path="/chat" element={<Chat />} />
    
        </Routes>
        </div>
        </>
  );
};

export default App;

