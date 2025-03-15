import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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

