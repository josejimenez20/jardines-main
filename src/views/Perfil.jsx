import React, { useEffect } from "react";
import "../styles/Perfil.css";
import { useAuth } from "../contexts/useAuth";

export default function Perfil() {
  const { user, fetchUserData } = useAuth();

  useEffect(()=> {
    if(!user){
      fetchUserData();
    }
  },[])

  return (
    <div className="perfil-wrapper">
      <div className="perfil-card">
        <a href="/" className="back-home" title="Volver al inicio">
          <i className="bi bi-door-open-fill"></i>
        </a>

        <header className="perfil-header">
          <h2>Hola, <span>{user?.name}</span></h2>
          <p className="email">📧 {user?.email}</p>
        </header>

        {/* Cambio de contraseña */}
        <section className="perfil-section">
          <h3>Cambiar contraseña</h3>
          <form className="formulario">
            <input type="password" name="current_password" placeholder="Contraseña actual" required />
            <input type="password" name="new_password" placeholder="Nueva contraseña" required minLength={8} />
            <input type="password" name="confirm_password" placeholder="Confirmar nueva contraseña" required />
            <button type="submit" className="btn-primary">Actualizar contraseña</button>
          </form>
        </section>

        <hr />

        {/* Cambio de correo */}
        <section className="perfil-section">
          <h3>Cambiar correo electrónico</h3>
          <form className="formulario">
            <input type="email" name="email" placeholder="Nuevo correo" value={user?.email} readOnly />
            <button type="submit" className="btn-primary">Actualizar correo</button>
          </form>
        </section>

        <hr />

        {/* Eliminar cuenta */}
        <section className="perfil-section">
          <h3>Eliminar cuenta</h3>
          <button type="button" className="btn-danger">Eliminar cuenta</button>
        </section>
      </div>
    </div>
  );
}
