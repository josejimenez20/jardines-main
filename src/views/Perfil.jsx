import React, { useEffect } from "react";
import "../styles/Perfil.css";
import { useAuth } from "../contexts/useAuth";

export default function Perfil() {
  const { user, fetchUserData, changePassword, changeEmail } = useAuth();

  useEffect(()=> {
    if(!user){
      fetchUserData();
    }
  },[user, fetchUserData]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const current_password = e.target.current_password.value;
    const new_password = e.target.new_password.value;
    const confirm_password = e.target.confirm_password.value;

    if(new_password !== confirm_password){
      alert("Las nuevas contraseñas no coinciden.");
      return;
    }
    const userData = {
      userId: user._id,
      currentPassword: current_password,
      newPassword: new_password,
      verifyPassword: confirm_password
    }
    try{
      const response = await changePassword(userData);
      if(response.message === "Password changed successfully"){
        alert("Contraseña actualizada con éxito.");
        e.target.reset();
      } else {
        alert(response.message || "No se pudo cambiar la contraseña.");
      }
    }catch(e){
      alert("Error al cambiar la contraseña. Intenta de nuevo.");
      console.error("Error al cambiar la contraseña:", e);
    }
  }

  const handleChangeEmail = async (e) => {
    e.preventDefault();
    const new_email = e.target.email.value;

    const userData = {
      userId: user._id,
      newEmail: new_email
    }
    try{
      const response = await changeEmail(userData);
      if (response.message === "El correo electrónico ha sido cambiado exitosamente"){
        alert("Correo electrónico actualizado con éxito.");
        e.target.reset();
      } else {
        alert(response.message || "No se pudo cambiar el correo electrónico.");
      }
    }catch(e){
      alert("Error al cambiar el correo electrónico. Intenta de nuevo.");
      console.error("Error al cambiar el correo electrónico:", e);
    }
  }

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
          <form className="formulario" onSubmit={handleChangePassword}>
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
          <form className="formulario" onSubmit={handleChangeEmail}>
            <input type="email" name="email" placeholder="usuario@ejemplo.com" required />
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
