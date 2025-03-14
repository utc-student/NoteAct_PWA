import React, { useEffect, useState } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Layout from "./Layout"
import LoginScreen from "./screens/auth/LoginScreen"
import RegisterScreen from "./screens/auth/RegisterScreen"
import SplashScreen from "./screens/Splash/SplashScreen"
// import { messaging } from './firebase';
// import { generateToken } from "./firebase/firebaseConfig"

export default function App() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }, [])

    return (
        loading ? ( 
            <SplashScreen /> 
        ) : (
            <Router>
                <Routes>
                    <Route path="/" element={<LoginScreen />} />
                    <Route path="/register" element={<RegisterScreen />} />
                    <Route path="/*" element={<Layout />} />
                </Routes>
            </Router>
        )
    );
}
