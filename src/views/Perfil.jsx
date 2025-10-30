import React, { useEffect, useRef, useState} from "react";
import "../styles/Perfil.css";
import { useAuth } from "../contexts/useAuth";
import { useNavigate } from "react-router-dom";

export default function Perfil() {
  const { user, fetchUserData, changePassword, changeEmail, deleteAccount, logout, updateUserPicture, updateUserName } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  //Estado para el nombre de usuario
  const [newName, setNewName] = useState("");
  useEffect(()=> {
    if(!user){
      fetchUserData();
    } else {
      //Sincroniznos el estado localcon el nombre del usuario
      setNewName(user.name);
    }
  },[user, fetchUserData]);


  //Imagen de perfil
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida (JPEG, PNG, etc.)');
      return;
    }

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen es demasiado grande. Máximo 5MB permitido.');
      return;
    }

    try {
      console.log('📸 Subiendo imagen...');
      await updateUserPicture(file, user._id);
      alert('✅ Imagen de perfil actualizada correctamente');

      // Recargar datos del usuario
      await fetchUserData();

      // Limpiar input
      event.target.value = '';
    } catch (error) {
      console.error('❌ Error subiendo imagen:', error);
      alert('Error al actualizar la imagen. Intenta de nuevo.');
      event.target.value = '';
    }
  };
  const handleChangeName = async (e) => {
    e.preventDefault();
    if (!newName || newName.trim() === "") {
      alert("El nombre no puede estar vacío.");
      return;
    }
    if (newName === user.name) {
      alert("El nombre es el mismo.");
      return;
    }

    try {
      await updateUserName(user._id, newName.trim());
      alert("Nombre actualizado con éxito.");
      // fetchUserData() se llama automáticamente desde updateUserName
    } catch (error) {
      // El backend enviará el mensaje de error (Req #6)
      alert(`Error: ${error.message || "No se pudo cambiar el nombre."}`);
      console.error("Error al cambiar el nombre:", error);
    }
  };

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

  const handleDelete = async() => {
    try {
      const response = await deleteAccount(user._id);
      if(response.message === "User has been deleted successfully"){
        logout();
        navigate('/')
      }
    }catch(error) {
      console.error('Error al borrar cuenta', error);
      throw error;
    }
  }
  const getProfileImage = () => {
    if (user?.pictureMongo?.url) {
      return user.pictureMongo.url;
    }
    if (user?.picture) {
      return user.picture;
    }
    return "/default-avatar.png"; // Imagen por defecto
  };
  return (
    <div className="perfil-wrapper">
      <div className="perfil-card">
        <a href="/" className="back-home" title="Volver al inicio">
          <i className="bi bi-door-open-fill"></i>
        </a>

        <header className="perfil-header">
          <h2><span>{user?.name}</span></h2>
          {/* Imagen de perfil clickeable */}
          <div className="profile-image-container">
            <img
              src={getProfileImage()}
              alt="imagen de perfil"
              className="img-perfil"
              onClick={handleImageClick}
            />
            <div className="image-overlay" onClick={handleImageClick}>
              <i className="bi bi-camera-fill"></i>
              <span>Cambiar imagen</span>
            </div>
          </div>

          {/* Input de archivo oculto */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </header>

        <section className="perfil-section">
          <h3>Cambiar nombre</h3>
          <form className="formulario" onSubmit={handleChangeName}>
            <input 
              type="text" 
              name="name" 
              placeholder="Nuevo nombre" 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required 
            />
            <button type="submit" className="btn-primary">Actualizar nombre</button>
          </form>
        </section>
        <hr />

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
        <section className="perfil-section-buttons">
          <button type="button" className="btn-danger" onClick={handleDelete}>Eliminar cuenta</button>
          <button type="button" className="btn-logout" onClick={() => { logout(); navigate('/') }}>Cerrar sesión</button>
        </section>

      </div>
    </div>
  );
}
