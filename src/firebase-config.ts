// Import the functions you need from the SDKs you need
import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import config  from "./firebase.config.json";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig: FirebaseOptions = config;
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = isSupported().then(() => getAnalytics(app));
const authPort = 9099;
const firestorePort = 8080;
const isDev = process.env.NODE_ENV === "development";
if(isDev) {
	connectAuthEmulator(getAuth(app), `http://localhost:${authPort}`) 
	connectFirestoreEmulator(getFirestore(app), "localhost", firestorePort);
	connectFunctionsEmulator(getFunctions(app), "localhost", 5001);
}

export { app, analytics}