import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDg_VsxfkmlyoG0_r3NunSQkWmDCL0cAP8",
  authDomain: "levelup-reactjs-tt.firebaseapp.com",
  projectId: "levelup-reactjs-tt",
  storageBucket: "levelup-reactjs-tt.firebasestorage.app",
  messagingSenderId: "1096653546807",
  appId: "1:1096653546807:web:82ad3f595ef5dfc29926b2"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);