// RegisterScreen.js
import React, { useState } from "react";
import { auth } from "../../firebase/firebaseConfig"; // Ajusta la ruta según tu estructura
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";

const RegisterScreen = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [credentialsError, setCredentialsError] = useState("");
    const navigate = useNavigate();

    const validateFields = () => {
        let valid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            setEmailError("El correo electrónico es obligatorio.");
            valid = false;
        } else if (!emailRegex.test(email)) {
            setEmailError("El formato del correo electrónico no es válido.");
            valid = false;
        } else {
            setEmailError("");
        }

        if (!password) {
            setPasswordError("La contraseña es obligatoria.");
            valid = false;
        } else {
            setPasswordError("");
        }

        if (password !== confirmPassword) {
            setConfirmPasswordError("Las contraseñas no coinciden.");
            valid = false;
        } else {
            setConfirmPasswordError("");
        }

        return valid;
    };

    const handleRegister = async () => {
        if (!validateFields()) return;

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            console.log("Usuario registrado:", userCredential.user.uid);
            navigate("/home"); // Redirige a Home después del registro
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.error("Error:", error.message);
                if (error.code === "auth/invalid-email") {
                    setEmailError("El correo electrónico no es válido.");
                } else if (error.code === "auth/email-already-in-use") {
                    setEmailError("El correo electrónico ya está en uso.");
                } else {
                    setCredentialsError("Error al registrar el usuario.");
                }
            }
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Registrarse</h1>
            <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                    ...styles.input,
                    borderColor: emailError ? "red" : "#ccc",
                    borderWidth: emailError ? "2px" : "1px",
                }}
            />
            {emailError && <p style={styles.error}>{emailError}</p>}
            <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                    ...styles.input,
                    borderColor: passwordError ? "red" : "#ccc",
                    borderWidth: passwordError ? "2px" : "1px",
                }}
            />
            {passwordError && <p style={styles.error}>{passwordError}</p>}
            <input
                type="password"
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                    ...styles.input,
                    borderColor: confirmPasswordError ? "red" : "#ccc",
                    borderWidth: confirmPasswordError ? "2px" : "1px",
                }}
            />
            {confirmPasswordError && (
                <p style={styles.error}>{confirmPasswordError}</p>
            )}
            {credentialsError && <p style={styles.error}>{credentialsError}</p>}
            <button onClick={handleRegister} style={styles.button}>
                Registrarse
            </button>
            <p style={styles.registerText}>
                ¿Ya tienes una cuenta?{" "}
                <span
                    style={styles.registerLink}
                    onClick={() => navigate("/")} // Redirige a / (LoginScreen)
                >
                    Inicia sesión
                </span>
            </p>
        </div>
    );
};

export default RegisterScreen;

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
