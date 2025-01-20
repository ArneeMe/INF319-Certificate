import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";


const echo_firebaseConfig = {
    apiKey: "AIzaSyBGTLIqBRpFC1qPNJsFyP2v1zUT1uSTVtI",
    authDomain: "echo-attest.firebaseapp.com",
    databaseURL: "https://echo-attest-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "echo-attest",
    storageBucket: "echo-attest.firebasestorage.app",
    messagingSenderId: "824360539665",
    appId: "1:824360539665:web:7273f3916dd285218143b0"
};

const echo_app = initializeApp(echo_firebaseConfig);
export const auth = getAuth(echo_app);

export const db = getFirestore(echo_app);