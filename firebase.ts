import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, update, remove, onValue, Database } from 'firebase/database';
import { getAuth, signInAnonymously, Auth } from 'firebase/auth';

// Firebase configuration - استخدم بيانات اعتماد Firebase الخاصة بك
const firebaseConfig = {
  apiKey: 'AIzaSyDummyKeyForDevelopment',
  authDomain: 'mashatl-app.firebaseapp.com',
  databaseURL: 'https://mashatl-app-default-rtdb.firebaseio.com',
  projectId: 'mashatl-app',
  storageBucket: 'mashatl-app.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abcdef123456',
};

let app: any;
let database: Database;
let auth: Auth;

try {
  app = initializeApp(firebaseConfig);
  database = getDatabase(app);
  auth = getAuth(app);
  
  // تسجيل الدخول بشكل مجهول
  signInAnonymously(auth).catch((error) => {
    console.log('Auth error:', error);
  });
} catch (error) {
  console.log('Firebase initialization error:', error);
}

export { database, auth, ref, push, update, remove, onValue };
