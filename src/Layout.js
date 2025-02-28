import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import HomeScreen from "./screens/tabs/HomeScreen";
import AboutScreen from "./screens/tabs/AboutScreen";

export default function Layout() {
    return (
        <div>
            <nav style={{ display: "flex", justifyContent: "space-around", padding: "10px", backgroundColor: "#f0f0f0" }}>
                <Link to="/home">Notas</Link>
                <Link to="/about">User</Link>
            </nav>
            <Routes>
                <Route path="/home" element={<HomeScreen />} />
                <Route path="/about" element={<AboutScreen />} />
            </Routes>
        </div>
    );
}