import React, { useState, useEffect } from "react";
import { getFirestore, collection, addDoc, query, onSnapshot, doc, updateDoc, deleteDoc, where, getDoc } from 'firebase/firestore';
import { app } from "@/firebase/firebaseConfig";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";
import "@/App.css"; 
import ToggleSwitch from './ToggleSwitch'; 
import './ToggleSwitch.css';

const db = getFirestore(app);

const AnalisisGastos = ({ darkMode, toggleDarkMode }) => { 
  const [gastos, setGastos] = useState([]);

  useEffect(() => {
    const obtenerGastos = () => {
      const gastosRef = collection(db, "gastos");
      const q = query(gastosRef);
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const gastosData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGastos(gastosData);
      });
      return () => unsubscribe();
    };

    obtenerGastos();
  }, []);

  // Prepara los datos para el gráfico de barras (gastos por categoría)
  const gastosPorCategoria = () => {
    const categorias = {};
    gastos.forEach((gasto) => {
      const categoria = gasto.categoria;
      if (categorias[categoria]) {
        categorias[categoria] += gasto.monto;
      } else {
        categorias[categoria] = gasto.monto;
      }
    });

    const data = Object.keys(categorias).map((categoria) => ({
      categoria: categoria,
      monto: categorias[categoria],
    }));
    return data;
  };

  // Prepara los datos para el gráfico de pastel (distribución de gastos)
  const distribucionGastos = () => {
    const totalGastos = gastos.reduce((total, gasto) => total + gasto.monto, 0);
    const data = gastos.map((gasto) => ({
      nombre: gasto.nombre,
      monto: gasto.monto,
      porcentaje: ((gasto.monto / totalGastos) * 100).toFixed(2),
    }));
    return data;
  };

  // Define los colores para el gráfico de pastel
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#A8A495"];

  return (
    <div className={`analisis-gastos-container ${darkMode ? 'dark-mode' : ''}`}> {/* Aplica la clase dark-mode */}
      <h2>Análisis de Gastos</h2>

      {/* ToggleSwitch */}
      <ToggleSwitch isToggled={darkMode} onToggle={toggleDarkMode} />

      {/* Gráfico de barras (Gastos por categoría) */}
      <h3>Gastos por Categoría</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={gastosPorCategoria()}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="categoria" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="monto" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      {/* Gráfico de pastel (Distribución de gastos) */}
      <h3>Distribución de Gastos</h3>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={distribucionGastos()}
            dataKey="monto"
            nameKey="nombre"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            label
          >
            {distribucionGastos().map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      
    </div>
  );
};

export default AnalisisGastos;
