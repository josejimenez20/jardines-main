import React from "react";
import "../styles/dashboard.css"; // CSS adaptado

export default function Dashboard({ userName }) {
  const redirectToStart = () => {
    window.location.href = "/inicio"; 
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="user-container">
        </div>
      </header>

      <main className="main-content">
        <img src="/logo_imagen.png" alt="Logo Jardines" className="main-logo" />
        <h1>¡Bienvenido {userName} a FLORGAERFRA!</h1>
        <p className="subtitle">Tu asistente personal para crear el jardín perfecto</p>
        <p>Comienza obteniendo recomendaciones personalizadas de plantas</p>
        <button type="button" className="btn" onClick={redirectToStart}>
          Recomendación de especies
        </button>
      </main>
    </div>
  );
}
