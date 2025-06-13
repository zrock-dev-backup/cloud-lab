import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCgflLyZsNGA84mGw7-VzjBwkwTF8nsxXo",
    authDomain: "cloud-dev-lab.firebaseapp.com",
    databaseURL: "https://cloud-dev-lab-default-rtdb.firebaseio.com",
    projectId: "cloud-dev-lab",
    storageBucket: "cloud-dev-lab.firebasestorage.app",
    messagingSenderId: "524034662384",
    appId: "1:524034662384:web:68bc764cae210984450735"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
