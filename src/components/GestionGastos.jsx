import React, { useState, useEffect } from "react";
import { getFirestore, collection, addDoc, query, onSnapshot, doc, updateDoc, getDoc, deleteDoc, getDocs } from "firebase/firestore";
import { app } from "@/firebase/firebaseConfig";
import "@/App.css";
import ToggleSwitch from './ToggleSwitch';
import './ToggleSwitch.css';

const db = getFirestore(app);

const GestionGastos = () => {
  const [presupuesto, setPresupuesto] = useState(0);
  const [restante, setRestante] = useState(0);
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [monto, setMonto] = useState("");
  const [gastos, setGastos] = useState([]);
  const [presupuestoId, setPresupuestoId] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  // Función para obtener el presupuesto y el restante desde Firestore
  useEffect(() => {
    const obtenerPresupuesto = async () => {
      const presupuestoRef = collection(db, "presupuesto");
      const q = query(presupuestoRef);
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const data = doc.data();
          setPresupuesto(data.presupuesto || 0);
          setRestante(data.restante || 0);
          setPresupuestoId(doc.id);
        } else {
          // Si no existe el documento, crea uno
          crearPresupuestoInicial();
        }
      });
      return () => unsubscribe();
    };

    obtenerPresupuesto();
  }, []);

  // Función para crear el presupuesto inicial en Firestore
  const crearPresupuestoInicial = async () => {
    const presupuestoRef = collection(db, "presupuesto");
    const nuevoPresupuesto = {
      presupuesto: 0,
      restante: 0,
    };
    const docRef = await addDoc(presupuestoRef, nuevoPresupuesto);
    setPresupuestoId(docRef.id);
  };

  // Función para establecer el presupuesto
  const establecerPresupuesto = async () => {
    if (presupuestoId) {
      const presupuestoRef = doc(db, "presupuesto", presupuestoId);
      await updateDoc(presupuestoRef, {
        presupuesto: presupuesto,
        restante: presupuesto,
      });
      setRestante(presupuesto);
    }
  };

  // Función para calcular el restante y actualizar en Firestore
  const actualizarRestante = async (nuevoMonto) => {
    if (presupuestoId) {
      const presupuestoRef = doc(db, "presupuesto", presupuestoId);
      const nuevoRestante = Number(restante) - Number(nuevoMonto);
      await updateDoc(presupuestoRef, {
        restante: nuevoRestante,
      });
      setRestante(nuevoRestante);
    }
  };

  // Función para agregar un gasto
  const agregarGasto = async (e) => {
    e.preventDefault();
    if (nombre && categoria && monto > 0) {
      const nuevoGasto = { nombre, categoria, monto: parseFloat(monto) };
      try {
        await addDoc(collection(db, "gastos"), nuevoGasto);
        await actualizarRestante(monto); // Actualiza el restante en Firestore
        setNombre("");
        setCategoria("");
        setMonto("");
      } catch (error) {
        console.error("Error al agregar gasto:", error);
      }
    }
  };

  // Función para reiniciar el presupuesto
  const reiniciarPresupuesto = async () => {
    if (presupuestoId) {
      const presupuestoRef = doc(db, "presupuesto", presupuestoId);
      await updateDoc(presupuestoRef, {
        restante: presupuesto, // Reinicia el restante al valor del presupuesto
      });
      setRestante(presupuesto);
    }
  };

  // Función para eliminar un gasto individual
  const eliminarGasto = async (gastoId) => {
    try {
      await deleteDoc(doc(db, "gastos"), gastoId);
    } catch (error) {
      console.error("Error al eliminar gasto:", error);
    }
  };

  // Función para eliminar todos los gastos
  const eliminarTodosLosGastos = async () => {
    try {
      const gastosRef = collection(db, "gastos");
      const q = query(gastosRef);
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      // Reiniciar el restante
      if (presupuestoId) {
        const presupuestoRef = doc(db, "presupuesto", presupuestoId);
        await updateDoc(presupuestoRef, {
          restante: presupuesto
        });
        setRestante(presupuesto);
      }
    } catch (error) {
      console.error("Error al eliminar gastos:", error);
    }
  };

  // Función para alternar el modo oscuro
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Obtener los gastos desde Firestore en tiempo real
  useEffect(() => {
    const q = query(collection(db, "gastos"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const gastosFirestore = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGastos(gastosFirestore);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className={`gastos-container ${darkMode ? 'dark-mode' : ''}`}>
      <h2>Gestión de Gastos</h2>
      <ToggleSwitch isToggled={darkMode} onToggle={toggleDarkMode} /> {/* ToggleSwitch */}
      {/* Establecer Presupuesto */}
      <div className="presupuesto">
        <label htmlFor="presupuesto">Presupuesto Mensual:</label>
        <input
          type="number"
          id="presupuesto"
          value={presupuesto}
          onChange={(e) => setPresupuesto(parseFloat(e.target.value))}
          onBlur={establecerPresupuesto}
        />
        <p>Restante: <strong>${isNaN(restante) ? 0 : Number(restante).toFixed(2)}</strong></p>
        <button className="btn-reiniciar" onClick={reiniciarPresupuesto}>
          Reiniciar Presupuesto
        </button>

      </div>

      <hr />

      {/* Formulario para agregar un gasto */}
      <div className="formulario-gasto">
        <h3>Agregar Gasto</h3>
        <form onSubmit={agregarGasto}>
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Comida, Transporte"
            required
          />

          <label htmlFor="categoria">Categoría:</label>
          <select
            id="categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
          >
            <option value="" disabled>Selecciona una categoría</option>
            <option value="Alimentación">Alimentación</option>
            <option value="Transporte">Transporte</option>
            <option value="Entretenimiento">Entretenimiento</option>
            <option value="Salud">Salud</option>
            <option value="Vivienda">Vivienda</option>
            <option value="Otros">Otros</option>
          </select>

          <label htmlFor="monto">Monto:</label>
          <input
            type="number"
            id="monto"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            required
          />

          <button type="submit" className="btn-agregar">
            Agregar Gasto
          </button>
        </form>
      </div>

      <hr />

      {/* Lista de gastos */}
      <div className="lista-gastos">
        <h3>Lista de Gastos</h3>
        {gastos.length > 0 && (
          <button
            className="btn-eliminar-todos"
            onClick={eliminarTodosLosGastos}
          >
            Eliminar Todos los Gastos
          </button>
        )}
        {gastos.length > 0 ? (
          <ul>
            {gastos.map((gasto) => (
              <li key={gasto.id}>
                {gasto.nombre} - {gasto.categoria}:{" "}
                <strong>${typeof gasto.monto === 'number' ? gasto.monto.toFixed(2) : '0.00'}</strong>
                <button
                  className="btn-eliminar"
                  onClick={() => eliminarGasto(gasto.id)}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay gastos registrados.</p>
        )}
      </div>
    </div>
  );
};

export default GestionGastos;
