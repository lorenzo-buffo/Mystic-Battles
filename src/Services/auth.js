// src/services/auth.js
import { auth, googleProvider, githubProvider, signInAnonymously } from './firebaseConfig';
import { signInWithPopup } from "firebase/auth";

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
export const signInWithGithub = () => signInWithPopup(auth, githubProvider);
export const signInAnonymously = () => signInAnonymously(auth);