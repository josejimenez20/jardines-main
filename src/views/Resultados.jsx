import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"; // <-- Importar
import "../styles/Resultados.css";
import { usePlanta } from "../contexts/usePlanta";

export default function Resultados() {
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
    filterPlant(filters); // Ejecuta la búsqueda al cargar la página
  }, [searchParams]);

  const agregarFavorito = (plantaId) => {
    alert(`Planta ${plantaId} añadida a favoritos (simulado)`);
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
          <div className="plant-card" key={planta.id}>
            <div 
              className="plant-image" 
              onClick={() => verDetalle(planta.id)} // <-- click en la imagen
              style={{ cursor: "pointer" }}
            >
              <img
                src={planta.imagen}
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
                onClick={() => agregarFavorito(planta.id)}
              >
                ❤️
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
