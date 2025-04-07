import React, { useState, useContext } from 'react';
import { GastosContext } from '@/context/GastosContext';

const FormularioGasto = () => {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [monto, setMonto] = useState('');
  const { agregarGasto } = useContext(GastosContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nombre && categoria && monto) {
      agregarGasto({ nombre, categoria, monto: parseFloat(monto) });
      setNombre('');
      setCategoria('');
      setMonto('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="formulario-gasto">
      <h3>Agregar Gasto</h3>
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre del gasto"
        required
      />
      <select
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        required
      >
        <option value="">Selecciona una categoría</option>
        <option value="Alimentación">Alimentación</option>
        <option value="Transporte">Transporte</option>
        <option value="Entretenimiento">Entretenimiento</option>
        <option value="Salud">Salud</option>
        <option value="Vivienda">Vivienda</option>
        <option value="Otros">Otros</option>
      </select>
      <input
        type="number"
        value={monto}
        onChange={(e) => setMonto(e.target.value)}
        placeholder="Monto"
        required
      />
      <button type="submit">Agregar Gasto</button>
    </form>
  );
};


export default FormularioGasto;
