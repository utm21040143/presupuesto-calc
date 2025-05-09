import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "@/pages/Login";
import Inicio from "@/pages/Inicio";
import MenuInferior from "@/components/MenuInferior";
import GestionGastos from "@/components/GestionGastos";
import AnalisisGastos from "@/components/AnalisisGastos";
import MetasAhorro from "@/components/MetasAhorro";
import Perfil from '@/components/Perfil';
import ErrorBoundary from "@/components/ErrorBoundary";

function App() {
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Router>
      <div className={`App ${darkMode ? "dark-mode" : ""}`}>
        <ErrorBoundary>
          <Routes>
            {/* Página de inicio */}
            <Route path="/" element={<Inicio />} />

            {/* Login */}
            <Route path="/login" element={<Login />} />

            {/* Páginas principales con gestión */}
            <Route
              path="/gastos"
              element={
                <GestionGastos 
                  darkMode={darkMode} 
                  toggleDarkMode={toggleDarkMode} 
                />
              }
            />
            
            <Route
              path="/analisis"
              element={
                <AnalisisGastos 
                  darkMode={darkMode} 
                  toggleDarkMode={toggleDarkMode} 
                />
              }
            />
            
            <Route
              path="/metas-ahorro"
              element={
                <MetasAhorro 
                  darkMode={darkMode} 
                  toggleDarkMode={toggleDarkMode} 
                />
              }
            />
            
            <Route
              path="/perfil"
              element={
                <Perfil 
                  darkMode={darkMode} 
                  toggleDarkMode={toggleDarkMode} 
                />
              }
            />
          </Routes>
        </ErrorBoundary>

        {/* Mostrar el menú inferior excepto en la ruta /login */}
        {!window.location.pathname.includes('/login') && <MenuInferior />}
      </div>
    </Router>
  );
}

export default App;
