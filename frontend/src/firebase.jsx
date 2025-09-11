// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// Import other services like getFirestore, getStorage, etc.

const firebaseConfig = {
  apiKey: "AIzaSyDLKH7p3fa8zQbRPCx6hqoKa-r_MlvB54A",
  authDomain: "rentapp-d5be9.firebaseapp.com",
  projectId: "rentapp-d5be9",
  storageBucket: "rentapp-d5be9.firebaseapp.com",
  messagingSenderId: "677460868627",
  appId: "1:677460868627:web:c6e3473d2dc760b73309e6",
  measurementId: "G-9Z09BTLB04"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// Export other services as needed

