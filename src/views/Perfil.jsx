import React, { useEffect, useRef, useState } from "react";
import "../styles/Perfil.css";
import { useAuth } from "../contexts/useAuth";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast'; // <-- IMPORTAR TOAST

export default function Perfil() {
  const { user, fetchUserData, changePassword, changeEmail, deleteAccount, logout, updateUserPicture, updateUserName } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [newName, setNewName] = useState("");

  useEffect(()=> {
    if(!user){
      fetchUserData();
    } else {
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

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen válida (JPEG, PNG, etc.)'); // <-- Reemplazado
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen es demasiado grande. Máximo 5MB permitido.'); // <-- Reemplazado
      return;
    }

    const toastId = toast.loading('Subiendo imagen...'); // <-- Toast de carga
    try {
      await updateUserPicture(file, user._id);
      toast.success('Imagen de perfil actualizada.', { id: toastId }); // <-- Reemplazado

      await fetchUserData();
      event.target.value = '';
    } catch (error) {
      console.error('❌ Error subiendo imagen:', error);
      toast.error('Error al actualizar la imagen.', { id: toastId }); // <-- Reemplazado
      event.target.value = '';
    }
  };

  const handleChangeName = async (e) => {
    e.preventDefault();
    if (!newName || newName.trim() === "") {
      toast.error("El nombre no puede estar vacío."); // <-- Reemplazado
      return;
    }
    if (newName === user.name) {
      toast.error("El nombre es el mismo."); // <-- Reemplazado
      return;
    }

    const toastId = toast.loading('Actualizando nombre...');
    try {
      await updateUserName(user._id, newName.trim());
      toast.success("Nombre actualizado con éxito.", { id: toastId }); // <-- Reemplazado
    } catch (error) {
      toast.error(`Error: ${error.message || "No se pudo cambiar el nombre."}`, { id: toastId }); // <-- Reemplazado
      console.error("Error al cambiar el nombre:", error);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const current_password = e.target.current_password.value;
    const new_password = e.target.new_password.value;
    const confirm_password = e.target.confirm_password.value;

    if(new_password !== confirm_password){
      toast.error("Las nuevas contraseñas no coinciden."); // <-- Reemplazado
      return;
    }
    const userData = {
      userId: user._id,
      currentPassword: current_password,
      newPassword: new_password,
      verifyPassword: confirm_password
    }
    
    const toastId = toast.loading('Actualizando contraseña...');
    try{
      const response = await changePassword(userData);
      // Asumiendo que el backend responde con éxito (el DTO valida la contraseña)
      toast.success("Contraseña actualizada con éxito.", { id: toastId }); // <-- Reemplazado
      e.target.reset();
    }catch(e){
      // El backend (auth.service) arroja UnauthorizedException si la contraseña actual es incorrecta
      toast.error(e.response?.data?.message || "Error al cambiar la contraseña.", { id: toastId }); // <-- Reemplazado
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
    
    const toastId = toast.loading('Actualizando correo...');
    try{
      const response = await changeEmail(userData);
      if (response.message === "El correo electrónico ha sido cambiado exitosamente"){
        toast.success("Correo electrónico actualizado.", { id: toastId }); // <-- Reemplazado
        e.target.reset();
      } else {
        toast.error(response.message || "No se pudo cambiar el correo.", { id: toastId }); // <-- Reemplazado
      }
    }catch(e){
      toast.error(e.response?.data?.message || "Error al cambiar el correo.", { id: toastId }); // <-- Reemplazado
      console.error("Error al cambiar el correo electrónico:", e);
    }
  }

  const handleDelete = async() => {
    // Usamos un toast especial de confirmación
    toast((t) => (
      <span>
        ¿Seguro que quieres eliminar tu cuenta?
        <button 
          onClick={() => {
            toast.dismiss(t.id);
            confirmDeleteAccount();
          }} 
          style={{ background: '#E74C3C', color: 'white', margin: '0 8px' }}
        >
          Eliminar
        </button>
        <button onClick={() => toast.dismiss(t.id)}>
          Cancelar
        </button>
      </span>
    ), { duration: 6000 });
  }
  
  const confirmDeleteAccount = async () => {
    const toastId = toast.loading('Eliminando cuenta...');
    try {
      const response = await deleteAccount(user._id);
      if(response.message === "User has been deleted successfully"){
        toast.success("Cuenta eliminada.", { id: toastId }); // <-- Reemplazado
        logout();
        navigate('/');
      }
    }catch(error) {
      toast.error("Error al eliminar la cuenta.", { id: toastId }); // <-- Reemplazado
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
    return "/default-avatar.png";
  };
  
  return (
    <div className="perfil-wrapper">
      <div className="perfil-card">
        <a href="/" className="back-home" title="Volver al inicio">
          <i className="bi bi-door-open-fill"></i>
        </a>

        <header className="perfil-header">
          <h2><span>{newName || user?.name}</span></h2>
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

        <section className="perfil-section">
          <h3>Cambiar correo electrónico</h3>
          <form className="formulario" onSubmit={handleChangeEmail}>
            <input type="email" name="email" placeholder="usuario@ejemplo.com" required />
            <button type="submit" className="btn-primary">Actualizar correo</button>
          </form>
        </section>

        <hr />

        <section className="perfil-section-buttons">
          <button type="button" className="btn-danger" onClick={handleDelete}>Eliminar cuenta</button>
          <button type="button" className="btn-logout" onClick={() => { logout(); navigate('/') }}>Cerrar sesión</button>
        </section>

      </div>
    </div>
  );
}