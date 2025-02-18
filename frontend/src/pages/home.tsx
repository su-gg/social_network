import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4">Welcome to Beyond Words</h1>
      <p className="lead">Log in to connect with the community.</p>
      
      <div className="d-flex justify-content-center gap-3 mt-4">
        <Link to="/login" className="btn text-white px-4" style={{ backgroundColor: "#e6a4b4" }}>
          Login
        </Link>
        <Link to="/register" className="btn btn-outline-dark px-4">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Home;
