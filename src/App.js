// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import PrivateRoute from "./components/PrivateRoute"; // Ajusta la ruta según tu estructura

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta raíz: muestra el LoginScreen */}
        <Route path="/" element={<LoginScreen />} />

        {/* Ruta protegida para la página principal */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <HomeScreen />
            </PrivateRoute>
          }
        />

        {/* Redirige cualquier ruta no definida a la raíz */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;