import React from "react"
import "../../styles/SplashStyles.css"
import NotesLogo from "../../Images/NotesLogo.jpeg"


const SplashScreen = () => {
    return (
        <div className="splash-screen">
            <img src={NotesLogo} alt="Logo" className="splash-logo" />
            <h1 className="splash-logo">Loading...</h1>
        </div>
    );
};

export default SplashScreen
