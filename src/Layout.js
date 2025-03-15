import React from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { FaHome, FaUser } from "react-icons/fa";
import HomeScreen from "./screens/tabs/HomeScreen";
import AboutScreen from "./screens/tabs/AboutScreen";

export default function Layout() {
  const location = useLocation();

  const linkStyle = (path) => ({
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    color: location.pathname === path ? "blue" : "gray",
  });

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/about" element={<AboutScreen />} />
        </Routes>
      </div>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-around",
          padding: "10px",
          backgroundColor: "#f0f0f0",
        }}
      >
        <Link to="/home" style={linkStyle("/home")}>
          <FaHome style={{ marginRight: "5px" }} />
          Notas
        </Link>
        <Link to="/about" style={linkStyle("/about")}>
          <FaUser style={{ marginRight: "5px" }} />
          User
        </Link>
      </nav>
    </div>
  );
}
