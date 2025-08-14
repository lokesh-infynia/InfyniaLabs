import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'infynia-labs',
  appId: '1:177304616146:web:c0a17bdc95ffa9e11b410b',
  storageBucket: 'infynia-labs.appspot.com',
  apiKey: 'AIzaSyCde_rvio_M5fL-sBAbfHj4Nrgg3rSbiCY',
  authDomain: 'infynia-labs.firebaseapp.com',
  messagingSenderId: '177304616146',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { app, auth, googleProvider, db };
