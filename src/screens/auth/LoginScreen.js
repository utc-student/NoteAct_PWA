// LoginScreen.js
import React, { useState } from "react";
import { auth } from "../../firebase/firebaseConfig"; // Ajusta la ruta según tu estructura
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";

const LoginScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            console.log("Usuario logueado:", userCredential.user.uid);

            // Redirige a la página principal después del login
            navigate("/home");
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.error("Error:", error.message);
                setError("Correo electrónico o contraseña incorrectos.");
            }
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Iniciar Sesión</h1>
            <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
            />
            <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
            />
            {error && <p style={styles.error}>{error}</p>}
            <button onClick={handleLogin} style={styles.button}>
                INICIAR SESIÓN
            </button>
            <p style={styles.registerText}>
                ¿No tienes una cuenta?{" "}
                <span
                    style={styles.registerLink}
                    onClick={() => navigate("/register")} // Redirige a /register
                >
                    Regístrate
                </span>
            </p>
        </div>
    );
};

export default LoginScreen;

// Estilos
const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
        padding: 20,
    },
    title: {
        fontSize: "24px",
        marginBottom: "20px",
        color: "#333",
    },
    input: {
        width: "100%",
        maxWidth: "300px",
        padding: "10px",
        marginBottom: "15px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        fontSize: "16px",
    },
    button: {
        width: "100%",
        maxWidth: "300px",
        padding: "10px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        fontSize: "16px",
        cursor: "pointer",
    },
    error: {
        color: "red",
        marginBottom: "10px",
    },
    registerText: {
        marginTop: "20px",
        color: "#333",
    },
    registerLink: {
        color: "#007bff",
        textDecoration: "underline",
        cursor: "pointer",
    },
};
