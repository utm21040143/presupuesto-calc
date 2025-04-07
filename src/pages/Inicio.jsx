import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Inicio.css'; 


const Inicio = () => {
  const navigate = useNavigate();

  const handleComenzar = () => {
    // Changed from '/inicio' to '/' to navigate to the root path
    navigate('/login'); 
  };

  return (
    <div className="inicio-container">
      <div className="inicio-content">
        <img
          src="/inicio-image.jpg" 
          alt="Imagen de inicio"
          className="inicio-image"
        />
        <button className="inicio-button" onClick={handleComenzar}>
          Comenzar
        </button>
      </div>
    </div>
  );
};

export default Inicio;
