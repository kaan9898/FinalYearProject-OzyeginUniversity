import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "api",
  authDomain: "kah-beg-512bb.firebaseapp.com",
  projectId: "kah-beg-512bb",
  storageBucket: "kah-beg-512bb.appspot.com",
  messagingSenderId: "348280549163",
  appId: "1:348280549163:web:35ac0d4e1da9dda9591f6e",
  measurementId: "G-726BJ74VKP",
  databaseURL: "https://kah-beg-512bb-default-rtdb.europe-west1.firebasedatabase.app/"
};

export const app = firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const database = getDatabase(app);

export default firebase;
