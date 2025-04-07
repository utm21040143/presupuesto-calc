import { app } from '@/firebase/firebaseConfig'; // Importamos 'app' en lugar de 'db'
import { getFirestore, collection, addDoc, deleteDoc, doc } from 'firebase/firestore'; // Importar las funciones necesarias de firestore

//Obtenemos una referencia de la base de datos
const db = getFirestore(app); //Definimos 'db' usando getFirestore y la 'app' importada

export const guardarGasto = async (gasto) => {
  try {
    const docRef = await addDoc(collection(db, 'gastos'), gasto);
    console.log('Gasto guardado con ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error guardando gasto:', error);
  }
  // Eliminar gasto
  eliminarGasto: async (gastoId) => {
    try {
      await deleteDoc(doc(db, gastosCollection, gastoId));
    } catch (error) {
      console.error(`Error eliminando gasto: ${error}`);
        throw error;
    }
  }
};
//Agregue return docRef.id al metodo guardarGasto