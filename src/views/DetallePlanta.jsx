export default function DetallePlanta({ planta }) {
  // Protege el componente si planta no está disponible
  if (!planta) {
    return (
      <main style={{ padding: "40px 20px", textAlign: "center", color: "#7F5539" }}>
        <h2>Selecciona una planta para ver sus detalles</h2>
        <p>No se encontró información de la planta.</p>
      </main>
    );
  }

  return (
    <main className="detalle-planta-container">
      <div className="imagen-planta">
        <img src={planta.imagen} alt={planta.nombre} />
        <div className="recomendaciones">
          <h4>¿Por qué te la recomendamos?</h4>
          <ul>
            <li>Ideal para clima {planta.clima.toLowerCase()}</li>
            <li>Prefiere suelo {planta.tipo_suelo.toLowerCase()}</li>
            <li>Necesita exposición: {planta.exposicion_luz}</li>
          </ul>
        </div>
      </div>

      <div className="contenido">
        <h2>Detalle de Planta</h2>
        <h3>{planta.nombre}</h3>
        <p><em>Nombre científico: {planta.nombre_cientifico}</em></p>

        <div className="tags">
          <span>{planta.proposito}</span>
          <span>{planta.exposicion_luz}</span>
          <span>{planta.tipo_suelo}</span>
        </div>

        <div className="descripcion">
          <h4>Descripción</h4>
          <p>{planta.descripcion}</p>
        </div>

        <section className="cuidados">
          <h4>Cuidados principales</h4>
          <ol>
            <li>Riego {planta.frecuencia_agua}</li>
            <li>{planta.exposicion_luz}</li>
            <li>Clima {planta.clima}</li>
          </ol>
        </section>

        <div className="boton-agregar">
          <div className="botones-extra">
            <button className="btn btn-outline-success">
              <i className="bi bi-heart-fill me-2"></i> Ver Mis Plantas Favoritas
            </button>
            <button className="btn btn-outline-secondary">
              Volver a Resultados
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
