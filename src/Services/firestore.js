// src/services/firestore.js
import { db } from './firebaseConfig';
import { collection, addDoc, getDocs } from "firebase/firestore";

const scoresCollection = collection(db, "scores");

export const addScore = async (name, points) => {
  try {
    await addDoc(scoresCollection, { name, points });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const getScores = async () => {
  const querySnapshot = await getDocs(scoresCollection);
  const scores = [];
  querySnapshot.forEach((doc) => {
    scores.push(doc.data());
  });
  return scores;
};