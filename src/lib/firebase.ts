import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCde_rvio_M5fL-sBAbfHj4Nrgg3rSbiCY",
  authDomain: "infynia-labs.firebaseapp.com",
  projectId: "infynia-labs",
  storageBucket: "infynia-labs.appspot.com",
  messagingSenderId: "177304616146",
  appId: "1:177304616146:web:c0a17bdc95ffa9e11b410b"
};

// Initialize Firebase
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { app, auth, googleProvider, db };
