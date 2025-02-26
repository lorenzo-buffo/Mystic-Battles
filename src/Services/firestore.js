// src/services/firestore.js
import { db } from './firebaseConfig';//Importa db desde firebaseConfig.js, que es la instancia de Firestore.
import { collection, addDoc, getDocs } from "firebase/firestore";//Importa funciones de Firestore para manejar documentos en la base de datos.

const scoresCollection = collection(db, "scores");//Crea una referencia a  scores en la base de datos de Firestore.


export const addScore = async (name, points) => {//Guarda una nueva puntuación en Firestore.
  try {
    await addDoc(scoresCollection, { name, points });//Usa addDoc() para insertar estos datos en scores
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const getScores = async () => {//Usa getDocs() para recuperar los documentos de scores
  const querySnapshot = await getDocs(scoresCollection);
  const scores = [];//Recorre cada documento y lo agrega al arreglo scores
  querySnapshot.forEach((doc) => {
    scores.push(doc.data());
  });
  return scores;//Retorna un arreglo con todas las puntuaciones.
};

