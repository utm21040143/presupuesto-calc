import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, query, onSnapshot, doc, updateDoc, deleteDoc, where, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '@/firebase/firebaseConfig';

const db = getFirestore(app);
const auth = getAuth(app);

const MetasAhorro = () => {
  const [metas, setMetas] = useState([]);
  const [nombre, setNombre] = useState('');
  const [montoObjetivo, setMontoObjetivo] = useState('');
  const [fechaLimite, setFechaLimite] = useState('');
  const [userId, setUserId] = useState(null);

  // Obtener usuario autenticado
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setUserId(user ? user.uid : null);
    });
    return () => unsubscribeAuth();
  }, []);

  // Cargar metas del usuario autenticado
  useEffect(() => {
    if (!userId) return;

    const metasRef = collection(db, "metas_ahorro");
    const q = query(metasRef, where("userId", "==", userId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const metasData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMetas(metasData);
    });

    return () => unsubscribe();
  }, [userId]);

  const crearMeta = async (e) => {
    e.preventDefault();
    if (!userId) return alert("Debes iniciar sesión");

    try {
      const nuevaMeta = {
        nombre,
        montoObjetivo: parseFloat(montoObjetivo),
        fechaLimite,
        montoAhorrado: 0,
        userId,
      };

      await addDoc(collection(db, "metas_ahorro"), nuevaMeta);
      setNombre('');
      setMontoObjetivo('');
      setFechaLimite('');
    } catch (error) {
      console.error("Error al crear meta:", error);
    }
  };

  const abonarMeta = async (metaId, monto) => {
    if (!userId || monto <= 0) return;
    
    const metaRef = doc(db, "metas_ahorro", metaId);
    const metaDoc = await getDoc(metaRef);

    if (metaDoc.exists() && metaDoc.data().userId === userId) {
      const nuevoMontoAhorrado = metaDoc.data().montoAhorrado + parseFloat(monto);
      await updateDoc(metaRef, { montoAhorrado: nuevoMontoAhorrado });
    }
  };

  const eliminarMeta = async (metaId) => {
    try {
      const metaRef = doc(db, "metas_ahorro", metaId);
      const metaDoc = await getDoc(metaRef);

      if (metaDoc.exists() && metaDoc.data().userId === userId) {
        await deleteDoc(metaRef);
      }
    } catch (error) {
      console.error("Error al eliminar la meta:", error);
    }
  };

  return (
    <div className="metas-ahorro-container">
      <h2>Metas de Ahorro</h2>

      <div className="formulario-meta">
        <h3>Crear Nueva Meta</h3>
        <form onSubmit={crearMeta}>
          <label>Nombre:</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />

          <label>Monto Objetivo:</label>
          <input type="number" value={montoObjetivo} onChange={(e) => setMontoObjetivo(e.target.value)} required />

          <label>Fecha Límite:</label>
          <input type="date" value={fechaLimite} onChange={(e) => setFechaLimite(e.target.value)} required />

          <button type="submit">Crear Meta</button>
        </form>
      </div>

      <hr />

      <div className="lista-metas">
        <h3>Mis Metas</h3>
        {metas.length > 0 ? (
          <ul>
            {metas.map((meta) => (
              <li key={meta.id}>
                <strong>{meta.nombre}</strong> <br />
                Objetivo: ${meta.montoObjetivo} <br />
                Ahorrado: ${meta.montoAhorrado} <br />
                <span style={{ fontWeight: "bold", color: "red" }}>
                  Restante: ${meta.montoObjetivo - meta.montoAhorrado}
                </span>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    abonarMeta(meta.id, e.target.montoAbono.value);
                    e.target.reset();
                  }}
                >
                  <input type="number" name="montoAbono" placeholder="Monto a abonar" required />
                  <button type="submit">Abonar</button>
                </form>

                <button onClick={() => eliminarMeta(meta.id)}>Eliminar</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tienes metas de ahorro.</p>
        )}
      </div>
    </div>
  );
};

export default MetasAhorro;
