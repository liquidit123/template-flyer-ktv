// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCXGTvpk2r2E8AOqzJUhXfc0YLvtCisoMM",
  authDomain: "template-menu-ktv-db.firebaseapp.com",
  databaseURL: "https://template-menu-ktv-db-default-rtdb.firebaseio.com",
  projectId: "template-menu-ktv-db",
  storageBucket: "template-menu-ktv-db.firebasestorage.app",
  messagingSenderId: "909369408068",
  appId: "1:909369408068:web:681f42ad55305039211a11",
  measurementId: "G-0CYNS8SQNQ"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
