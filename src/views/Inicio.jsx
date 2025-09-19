/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate, createSearchParams } from "react-router-dom";
import "../styles/Inicio.css";
import { useAuth } from "../contexts/useAuth";
import { useEffect } from "react";
import { usePlanta } from "../contexts/usePlanta";

export default function Inicio() {
  const { user, fetchUserData } = useAuth();
  const { filterPlant } = usePlanta();
  const navigate = useNavigate();
  useEffect(() => {
    fetchUserData();
  }, []);
  const handleContinue = () => {
    const filter = {
      tipo_suelo: user?.municipio?.tipo_suelo || "",
      frecuencia_agua: user?.municipio?.frecuencia_agua || "",
      exposicion_luz: user?.municipio?.exposicion_luz || "",
    };

    // 1. Llamar a la API
    filterPlant(filter);

    // 2. Navegar con query params visibles en la URL
    navigate({
      pathname: "/resultados",
      search: `?${createSearchParams(filter)}`,
    });
  };
  return (
    <main className="main-content">
      <h1>Recomendación de especies para tu jardín</h1>

      <p className="info-text">
        Basado en tu ubicación <strong>{user?.municipio?.name || "desconocida"}</strong> <br />
        ¿Deseas ajustar los filtros manualmente?
      </p>

      <div className="toggle-buttons">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => navigate("/preferencias")}
        >
          Sí, ajustar filtros
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            handleContinue();
          }}
        >
          No, continuar
        </button>
      </div>

      <form className="reco-form">
        <label htmlFor="suelo">Tipo de suelo</label>
        <input type="text" id="suelo" value={user?.municipio?.tipo_suelo || "Desconocido"} readOnly />

        <label htmlFor="agua">Disponibilidad de agua</label>
        <input type="text" id="agua" value={user?.municipio?.frecuencia_agua || "Desconocida"} readOnly />

        <label htmlFor="luz">Exposición a la luz</label>
        <input type="text" id="luz" value={user?.municipio?.exposicion_luz || "Desconocida"} readOnly />

      </form>
    </main>
  );
}
