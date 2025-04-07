import React, { createContext, useState, useEffect } from 'react';

export const GastosContext = createContext();

export const GastosProvider = ({ children }) => {
  const [presupuesto, setPresupuesto] = useState(0);
  const [gastos, setGastos] = useState([]);
  const [restante, setRestante] = useState(0);

  useEffect(() => {
    calcularRestante();
  }, [presupuesto, gastos]);

  const establecerPresupuesto = (cantidad) => {
    setPresupuesto(cantidad);
    setRestante(cantidad);
  };

  const agregarGasto = (gasto) => {
    setGastos([...gastos, gasto]);
  };

  const calcularRestante = () => {
    const gastado = gastos.reduce((total, gasto) => total + gasto.monto, 0);
    setRestante(presupuesto - gastado);
  };

  return (
    <GastosContext.Provider value={{
      presupuesto,
      gastos,
      restante,
      establecerPresupuesto,
      agregarGasto
    }}>
      {children}
    </GastosContext.Provider>
  );
};
