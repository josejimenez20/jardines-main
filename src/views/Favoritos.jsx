import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // <-- Importar
import "../styles/Favoritos.css";
import { useAuth } from "../contexts/useAuth";
import api from "../shared/api";

export default function Favoritos() {
  const { user, fetchUserData } = useAuth();
  const plantas = user?.favorites || []; // Simulando plantas favoritas
  const navigate = useNavigate(); // <-- Hook de navegación


  const verDetalle = (plantaId) => {
    navigate(`/planta/${plantaId}`); // <-- Redirige al detalle de la planta
  };

  useEffect(() => {
    if (user === null) {
      fetchUserData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const eliminarFavorito = async (plantaId) => {
    if (!user) {
      alert("Debes iniciar sesión para eliminar favoritos.");
      return;
    }
    try {
      const response = await api.delete("/favoritas", {
        data: { userId: user._id, plantaId: plantaId },
      });
      if (response) {
        fetchUserData(); // Actualiza los datos del usuario para reflejar el cambio
      } else {
        alert("No se pudo eliminar de favoritos. Intenta de nuevo.");
      }
    } catch (error) {
      console.error("Error al eliminar favorito:", error);
      alert("Hubo un problema al eliminar de favoritos.");
    }
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
          <div className="plant-card" key={planta._id}>
            <div 
              className="plant-image" 
              onClick={() => verDetalle(planta.id)} 
              style={{ cursor: "pointer" }} // <-- cursor clickeable
            >
              <img src={planta.imagen.url} alt={planta.nombre} />
            </div>
            <div 
              className="plant-info" 
              onClick={() => verDetalle(planta._id)} 
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
                onClick={() => eliminarFavorito(planta._id)}
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
