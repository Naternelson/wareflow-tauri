// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyBMVJCVpsLZkqL01_NxHWmju3e3qEC_9mI",
	authDomain: "wareflow-backend.firebaseapp.com",
	projectId: "wareflow-backend",
	storageBucket: "wareflow-backend.appspot.com",
	messagingSenderId: "388116318387",
	appId: "1:388116318387:web:cf12e066213e63df9808c6",
	measurementId: "G-LGJ5ZGM095",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics}