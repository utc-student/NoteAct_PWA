// PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig"; // Ajusta la ruta según tu estructura

const PrivateRoute = ({ children }) => {
  const user = auth.currentUser; // Verifica si hay un usuario autenticado

  if (!user) {
    // Si no hay usuario, redirige al login
    return <Navigate to="/" />;
  }

  // Si hay usuario, permite el acceso a la ruta protegida
  return children;
};

export default PrivateRoute;