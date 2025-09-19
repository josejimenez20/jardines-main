import React from "react";
import { useNavigate } from "react-router-dom"; // <-- Importar
import "../styles/Favoritos.css";

export default function Favoritos() {
  const navigate = useNavigate(); // <-- Hook de navegación

  // Datos simulados de plantas favoritas
  const plantas = [
    {
      id: 1,
      nombre: "Rosa",
      nombre_cientifico: "Rosa indica",
      imagen: "/img/rosa.jpg",
      exposicion_luz: "Sol pleno",
      tipo_suelo: "Fértil",
      frecuencia_agua: "Media",
    },
    {
      id: 2,
      nombre: "Lavanda",
      nombre_cientifico: "Lavandula",
      imagen: "/img/lavanda.jpg",
      exposicion_luz: "Semi sombra",
      tipo_suelo: "Arenoso",
      frecuencia_agua: "Baja",
    },
  ];

  const eliminarFavorito = (id) => {
    alert(`Planta ${id} eliminada de favoritas (simulado)`);
  };

  const verDetalle = (plantaId) => {
    navigate(`/planta/${plantaId}`); // <-- Redirige al detalle de la planta
  };

  return (
    <main className="favoritas-main">
      <h1>Mis Plantas Favoritas</h1>
      {plantas.length === 0 && (
        <div className="alert-info">
          <i className="bi bi-info-circle-fill"></i> Aún no has agregado plantas a tu lista de favoritas.
        </div>
      )}

      <div className="plant-grid">
        {plantas.map((planta) => (
          <div className="plant-card" key={planta.id}>
            <div 
              className="plant-image" 
              onClick={() => verDetalle(planta.id)} 
              style={{ cursor: "pointer" }} // <-- cursor clickeable
            >
              <img src={planta.imagen} alt={planta.nombre} />
            </div>
            <div 
              className="plant-info" 
              onClick={() => verDetalle(planta.id)} 
              style={{ cursor: "pointer" }}
            >
              <div className="plant-name">{planta.nombre}</div>
              <div className="plant-scientific"><em>{planta.nombre_cientifico}</em></div>
              <div className="plant-tags">
                <span className="plant-tag">{planta.exposicion_luz}</span>
                <span className="plant-tag">{planta.tipo_suelo}</span>
                <span className="plant-tag">{planta.frecuencia_agua} agua</span>
              </div>
            </div>
            <div className="favorito-wrapper">
              <button
                className="btn-eliminar"
                onClick={() => eliminarFavorito(planta.id)}
              >
                🗑 Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
