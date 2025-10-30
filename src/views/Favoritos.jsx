import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Favoritos.css";
import { useAuth } from "../contexts/useAuth";
import api from "../shared/api";
import toast from 'react-hot-toast'; // <-- IMPORTAR TOAST

export default function Favoritos() {
  const { user, fetchUserData } = useAuth();
  const plantas = user?.favorites || []; 
  const navigate = useNavigate(); 


  const verDetalle = (plantaId) => {
    navigate(`/planta/${plantaId}`); 
  };

  useEffect(() => {
    if (user === null) {
      fetchUserData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const eliminarFavorito = async (plantaId) => {
    if (!user) {
      toast.error("Debes iniciar sesión para eliminar favoritos."); // <-- Reemplazado
      return;
    }
    
    const toastId = toast.loading('Eliminando de favoritos...');
    try {
      const response = await api.delete("/favoritas", {
        data: { userId: user._id, plantaId: plantaId },
      });
      if (response) {
        toast.success('Planta eliminada de favoritos.', { id: toastId }); // <-- Toast de éxito
        fetchUserData(); 
      } else {
        toast.error("No se pudo eliminar de favoritos.", { id: toastId }); // <-- Reemplazado
      }
    } catch (error) {
      console.error("Error al eliminar favorito:", error);
      toast.error("Hubo un problema al eliminar.", { id: toastId }); // <-- Reemplazado
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
              style={{ cursor: "pointer" }}
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