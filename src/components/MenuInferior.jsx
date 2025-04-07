import React from 'react';
import { Link } from 'react-router-dom';
import { FaChartPie, FaPiggyBank, FaListAlt, FaUser } from 'react-icons/fa'; 


const MenuInferior = () => {
  return (
    <nav className="menu-inferior">
      <ul className="menu-inferior-list">
        <li className="menu-inferior-item">
          <Link to="/gastos" className="menu-inferior-link">
            <FaListAlt size={24} />
            <span>Gastos</span>
          </Link>
        </li>
        <li className="menu-inferior-item">
          <Link to="/analisis" className="menu-inferior-link">
            <FaChartPie size={24} />
            <span>Análisis</span>
          </Link>
        </li>
        <li className="menu-inferior-item">
          <Link to="/metas-ahorro" className="menu-inferior-link"> 
            <FaPiggyBank size={24} />
            <span>Ahorro</span>
          </Link>
        </li>
        <li className="menu-inferior-item">
          <Link to="/perfil" className="menu-inferior-link">
            <FaUser size={24} />
            <span>Perfil</span>
          </Link>
        </li>
    
      </ul>
    </nav>
  );
};

export default MenuInferior;
