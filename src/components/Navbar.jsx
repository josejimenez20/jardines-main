import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo + Título */}
        <div className="navbar-logo">
          {/* Opción 1: desde public */}
          <img src="/logo.png" alt="Logo Jardines" />
          
          {/* Opción 2: si guardas en src/assets */}
          {/* <img src={require("../assets/logo.png")} alt="Logo Jardines" /> */}
          
          <span className="titulo-app">FLORGAERFRA</span>
        </div>

        {/* Navegación */}
        <nav>
          <ul>
            <li>
              <Link to="/inicio">Inicio</Link>
            </li>
            <li>
              <Link to="/favoritos">Plantas Favoritas</Link>
            </li>
            <li>
              <Link to="/perfil">Mi cuenta</Link>
            </li>   
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

