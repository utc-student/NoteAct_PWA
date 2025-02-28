import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function AboutScreen() {
    const [name, setName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserName = async () => {
            const user = auth.currentUser;
            if (user) {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setName(docSnap.data().name);
                }
            }
        };

        fetchUserName();
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate("/login"); // Redirige a la pantalla de login después de cerrar sesión
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <p>Bienvenido, {name}</p>
            <button onClick={handleSignOut} style={{ padding: "10px", backgroundColor: "red", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>Cerrar sesión</button>
        </div>
    );
}