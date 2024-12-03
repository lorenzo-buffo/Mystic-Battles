import Phaser from "phaser";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  setDoc,
  doc,
  addDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  getDoc,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  signInWithPopup,
  onAuthStateChanged,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCrWfuflmkEpkgDnmEaow6ecjxm7rwyWg0",
    authDomain: "mysticbattle-89a74.firebaseapp.com",
    projectId: "mysticbattle-89a74",
    storageBucket: "mysticbattle-89a74.firebasestorage.app",
    messagingSenderId: "182725332771",
    appId: "1:182725332771:web:3293bce878b577fe5c8696",
  };

export  class FirebasePlugin extends Phaser.Plugins.BasePlugin {
  constructor(pluginManager) {
    super(pluginManager);
    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
    this.auth = getAuth(app);
    this.onLoggedInCallback = () => {};

    this.authStateChangedUnsubscribe = onAuthStateChanged(this.auth, (user) => {
      if (user && this.onLoggedInCallback) {
        this.onLoggedInCallback();
      }
    });
  }

  destroy() {
    this.authStateChangedUnsubscribe();
    super.destroy();
  }

  onLoggedIn(callback) {
    this.onLoggedInCallback = callback;
  }

  async saveGameData(userId, data) {
    await setDoc(doc(this.db, "game-data", userId), data);
  }

  async loadGameData(userId) {
    const snap = await getDoc(doc(this.db, "game-data", userId));
    return snap.data();
  }

  async signInAnonymously() {
    const credentials = await signInAnonymously(this.auth);
    return credentials.user;
  }

  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const credentials = await signInWithPopup(this.auth, provider);
    return credentials.user;
  }

  async signInWithGithub() {
    const provider = new GithubAuthProvider();
    const credentials = await signInWithPopup(this.auth, provider);
    return credentials.user;
  }

  getUser() {
    return this.auth.currentUser;
  }

  async addHighScore(name, score) {
    await addDoc(collection(this.db, "high-scores"), {
      name,
      score,
      createdAt: new Date(),
    });
  }

  async getHighScores() {
    const q = query(
      collection(this.db, "high-scores"),
      orderBy("score", "desc"),
      limit(10)
    );
    const querySnapshot = await getDocs(q);
    const scores = [];
    querySnapshot.forEach((d) => {
      scores.push(d.data());
    });

    return scores;
  }
}