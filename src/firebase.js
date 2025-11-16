import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyDaJA6Swob964_6w9-It_Av9UQzUrV1Rno",
    authDomain: "rfid-library-system-42627.firebaseapp.com",
    databaseURL: "https://rfid-library-system-42627-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "rfid-library-system-42627",
    storageBucket: "rfid-library-system-42627.firebasestorage.app",
    messagingSenderId: "711271739889",
    appId: "1:711271739889:web:6ae022575d80eae7429450"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };