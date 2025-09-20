import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"; // <-- Importar
import "../styles/Resultados.css";
import { usePlanta } from "../contexts/usePlanta";
import { HeartFilledIcon, HeartIcon } from "../components/icons/Icons";
import { useAuth } from "../contexts/useAuth";
import api from "../shared/api";
import { CgKey } from "react-icons/cg";

export default function Resultados() {
  const { user, fetchUserData } = useAuth();
  const navigate = useNavigate();
  const { filterPlanta, filterPlant } = usePlanta();
  const [searchParams] = useSearchParams();

  // Leer los filtros desde los query params
  const filters = {
    frecuencia_agua: searchParams.get("frecuencia_agua") || "",
    tipo_suelo: searchParams.get("tipo_suelo") || "",
    exposicion_luz: searchParams.get("exposicion_luz") || "",
    tamano_espacio: searchParams.get("tamano_espacio") || "",
  };

  useEffect(() => {
    if (user === null) {
      fetchUserData();
    }
    filterPlant(filters); // Ejecuta la búsqueda al cargar la página
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams,]);


  const agregarFavorito = async (plantaId) => {
    if (!user) {
      alert("Debes iniciar sesión para agregar favoritos.");
      return;
    }
    try {
      const response = await api.post("/favoritas", {
        userId: user._id,
        plantaId: plantaId,
      });
      if (response) {
        fetchUserData(); // Actualiza los datos del usuario para reflejar el cambio
      } else {
        alert("No se pudo agregar a favoritos. Intenta de nuevo.");
      }
    } catch (error) {
      console.error("Error al agregar favorito:", error);
      alert("Hubo un problema al agregar a favoritos.");
    }
  };

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

  const isFavorito = (plantaId) => {
    return user?.favorites?.includes(plantaId);
  };
  const verDetalle = (plantaId) => {
    navigate(`/planta/${plantaId}`);
  };
  return (
    <main className="resultados-main">
      <h1>Recomendaciones de Plantas</h1>
      <p className="info-text">
        Estas son las plantas que mejor se adaptan a tus preferencias de jardín.
      </p>

      <div className="plant-grid">
        
        {
          filterPlanta?.data?.length === 0 && (
            <p>No se encontraron plantas que coincidan con los filtros seleccionados.</p>
          )
        }

        {
          filterPlanta?.data?.map((planta) => (
          <div className="plant-card" key={planta._id}>
            <div 
              className="plant-image" 
              onClick={() => verDetalle(planta.id)} // <-- click en la imagen
              style={{ cursor: "pointer" }}
            >
              <img
                src={planta.imagen.url}
                alt={planta.nombre}
                width="300"
                height="160"
              />
            </div>
            <div className="plant-info" onClick={() => verDetalle(planta.id)} style={{ cursor: "pointer" }}>
              <div className="plant-name">{planta.nombre}</div>
              <div className="plant-scientific">
                <em>{planta.nombre_cientifico}</em>
              </div>
              <div className="plant-tags">
                <span className="plant-tag">{planta.exposicion_luz}</span>
                <span className="plant-tag">{planta.tipo_suelo}</span>
                <span className="plant-tag">{planta.frecuencia_agua} agua</span>
              </div>
            </div>
            <div className="favorito-wrapper">
              <button
                className="btn-favorito"
                  onClick={() => {
                    isFavorito(planta._id) ? eliminarFavorito(planta._id) : agregarFavorito(planta._id)
                  }}
                >
                  {
                    isFavorito(planta._id) ? <HeartFilledIcon size={32} /> : <HeartIcon size={32} />
                  }
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
