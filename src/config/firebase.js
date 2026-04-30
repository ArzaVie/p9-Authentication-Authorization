import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyC0TDDcdML6KZSqoJP8pDnrkjshBJHkJGY",
  authDomain: "auth-praktikum-d98cf.firebaseapp.com",
  projectId: "auth-praktikum-d98cf",
  storageBucket: "auth-praktikum-d98cf.firebasestorage.app",
  messagingSenderId: "314414973409",
  appId: "1:314414973409:web:1a64618abad81fbb7a92a0",
  measurementId: "G-8M43KJSF22"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});