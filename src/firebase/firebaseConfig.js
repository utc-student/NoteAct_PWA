// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken } from "firebase/messaging";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyAznR49xc0nqKFu1-GPXcaKnuPvxWieIOM",
	authDomain: "noteact-87c77.firebaseapp.com",
	databaseURL: "https://noteact-87c77-default-rtdb.firebaseio.com",
	projectId: "noteact-87c77",
	storageBucket: "noteact-87c77.firebasestorage.app",
	messagingSenderId: "386486265387",
	appId: "1:386486265387:web:b252d10583e4bb97e82c6e",
	measurementId: "G-6XEDC6GYNR"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
const myToken = "BAkb2Grc0KaLU_hxPpftRsbWVBhvWvk07ZQd9j06N1XL9Rf6OSMooSr_ksyuZ7MNbaRFXLoE8AugCxbesXYIxt8"


const messaging = getMessaging(app)
getToken(messaging, {vapidKey: myToken});

// Función para solicitar permisos y obtener el token
function requestPermission() {
  console.log('Solicitando permiso...');
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Permiso para notificaciones concedido.');

      getToken(messaging, { vapidKey: myToken })
        .then((currentToken) => {
          if (currentToken) {
            console.log("Token obtenido:", currentToken);
          } else {
            console.log("No se pudo obtener el token. Solicita permiso para recibir notificaciones.");
          }
        })
        .catch((err) => {
          console.log("Error al obtener el token:", err);
        });
    } else {
      console.log('Permiso para notificaciones denegado.');
    }
  });
}

requestPermission();
export { messaging }