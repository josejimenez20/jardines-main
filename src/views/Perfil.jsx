import React, { useEffect, useRef, useState } from "react";
import "../styles/Perfil.css";
import "../styles/Progreso.css"; // <-- 1. IMPORTAR NUEVO CSS
import { useAuth } from "../contexts/useAuth";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast'; // (Asumimos que ya lo tienes)

// Componente de Progreso (para mantener Perfil.jsx limpio)
// Componente de Progreso (para mantener Perfil.jsx limpio)
const ProgresoJardin = () => {
  // 1. Traer la nueva función
  const { getProgreso, uploadProgreso, deleteProgresoFoto, updateFotoPrivacy } = useAuth();

  const [progresoFotos, setProgresoFotos] = useState([]); // Galería
  // ... (otros estados: selectedFiles, uploadProgress, etc. SIN CAMBIOS)
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [abortController, setAbortController] = useState(null);
  const fileInputRef = useRef(null);

  // ... (useEffect, fetchProgreso, handleFileChange, handleRemovePreview, handleUpload, handleCancelUpload - SIN CAMBIOS)
  useEffect(() => {
    fetchProgreso();
  }, []);

  const fetchProgreso = async () => {
    try {
      const fotos = await getProgreso();
      setProgresoFotos(fotos);
    } catch (error) {
      toast.error(error.message || "Error al cargar galería de progreso.");
    }
  };
  
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    
    if (files.length > 5) {
      toast.error("Puedes subir un máximo de 5 imágenes a la vez.");
      return;
    }
    const validFiles = [];
    for (const file of files) {
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        toast.error(`Formato inválido: ${file.name} (Solo JPG, PNG)`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`Tamaño excedido: ${file.name} (Máx 5MB)`);
        continue;
      }
      file.preview = URL.createObjectURL(file);
      validFiles.push(file);
    }
    setSelectedFiles(validFiles);
    event.target.value = null; 
  };
  
  const handleRemovePreview = (index) => {
    URL.revokeObjectURL(selectedFiles[index].preview);
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };
  
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    const formData = new FormData();
    selectedFiles.forEach(file => { formData.append('files', file); });
    setIsUploading(true);
    setUploadProgress(0);
    const controller = new AbortController();
    setAbortController(controller);
    try {
      const onUploadProgress = (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percent);
      };
      await uploadProgreso(formData, onUploadProgress, controller.signal);
      toast.success("¡Fotos subidas correctamente!");
      setSelectedFiles([]); 
      await fetchProgreso(); 
    } catch (error) {
      if (error.code === 'ERR_CANCELED') {
        toast.error("Subida cancelada.");
      } else {
        toast.error(error.message || "Error al subir las fotos.");
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setAbortController(null);
      selectedFiles.forEach(file => URL.revokeObjectURL(file.preview));
    }
  };
  
  const handleCancelUpload = () => {
    if (abortController) {
      abortController.abort();
    }
  };
  
  const handleDelete = async (imageId) => {
    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontFamily: 'Arial, sans-serif', fontSize: '15px', color: '#333' }}>
          ¿Eliminar esta foto?
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => {
              toast.dismiss(t.id);
              confirmDelete(imageId);
            }} 
            style={{ 
              background: '#DC3545', 
              color: 'white', 
              border: 'none', 
              padding: '8px 12px', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontFamily: 'Arial, sans-serif',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            Eliminar
          </button>
          <button 
            onClick={() => toast.dismiss(t.id)}
            style={{ 
              background: '#6C757D', 
              color: 'white', 
              border: 'none', 
              padding: '8px 12px', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontFamily: 'Arial, sans-serif',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    ), { 
      duration: 6000,
      style: { 
        padding: '12px 16px',
        borderRadius: '8px',
      },
    });
  };
  
  const confirmDelete = async (imageId) => {
    const toastId = toast.loading('Eliminando...');
    try {
      await deleteProgresoFoto(imageId);
      toast.success('Foto eliminada.', { id: toastId });
      await fetchProgreso();
    } catch (error) {
      toast.error(error.message, { id: toastId });
    }
  };

  // --- NUEVA FUNCIÓN AÑADIDA ---
  const handlePrivacyChange = async (e, imageId) => {
    const newPrivacy = e.target.value;
    
    // Evitar recargar si no hay cambio
    const fotoActual = progresoFotos.find(f => f._id === imageId);
    if (fotoActual.privacy === newPrivacy) return;

    const toastId = toast.loading('Actualizando privacidad...');
    try {
      // Requisito: "Enviar al frontend mensajes claros de éxito o error."
      const response = await updateFotoPrivacy(imageId, newPrivacy);
      toast.success(response.message, { id: toastId });
      
      // Actualizar el estado local para reflejar el cambio en el dropdown
      setProgresoFotos(prevFotos => 
        prevFotos.map(foto => 
          foto._id === imageId ? { ...foto, privacy: newPrivacy } : foto
        )
      );

    } catch (error) {
      toast.error(error.message, { id: toastId });
    }
  };

  return (
    <section className="progreso-section">
      <hr />
      <h3>Progreso del jardín</h3>
      
      {/* ... (Botón de subir, input, previsualización, barra de progreso - SIN CAMBIOS) ... */}
       <button 
        type="button" 
        className="progreso-btn-primary" 
        onClick={() => fileInputRef.current.click()}
        disabled={isUploading}
      >
        Subir foto del progreso
      </button>
      
      <input 
        type="file" 
        multiple
        accept="image/png, image/jpeg"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="progreso-input-hidden"
      />
      {selectedFiles.length > 0 && (
        <div className="progreso-preview-area">
          {selectedFiles.map((file, index) => (
            <div key={index} className="progreso-preview-item">
              <img src={file.preview} alt={file.name} />
              <button 
                className="progreso-preview-remove"
                onClick={() => handleRemovePreview(index)}
                disabled={isUploading}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
      {selectedFiles.length > 0 && !isUploading && (
        <button 
          type="button" 
          className="progreso-btn-primary" 
          style={{ marginTop: '15px' }}
          onClick={handleUpload}
        >
          Confirmar y Subir {selectedFiles.length} {selectedFiles.length > 1 ? 'fotos' : 'foto'}
        </button>
      )}
      {isUploading && (
        <div className="progreso-upload-wrapper">
          <progress className="progreso-upload-bar" value={uploadProgress} max="100"></progress>
          <span className="progreso-upload-text">{uploadProgress}%</span>
          <button 
            type="button" 
            className="progreso-upload-cancel" 
            onClick={handleCancelUpload}
          >
            Cancelar subida
          </button>
        </div>
      )}


      {/* 5. Galería de Fotos Subidas (MODIFICADA) */}
      <h3 style={{ marginTop: '30px' }}>Mi Galería</h3>
      {progresoFotos.length > 0 ? (
        <div className="progreso-gallery">
          {progresoFotos.map((foto) => (
            <div key={foto._id} className="progreso-image-card">
              <img src={foto.url} alt={foto.title || 'Progreso'} />
              
              {/* --- INICIO DE MODIFICACIÓN (Añadir Dropdown) --- */}
              <div className="progreso-privacy-wrapper">
                <select 
                  className="progreso-privacy-select"
                  value={foto.privacy}
                  onChange={(e) => handlePrivacyChange(e, foto._id)}
                >
                  <option value="Solo yo">Solo yo</option>
                  <option value="Amigos">Amigos</option>
                  <option value="Público">Público</option>
                </select>
              </div>
              {/* --- FIN DE MODIFICACIÓN --- */}

              <button 
                className="progreso-image-delete"
                onClick={() => handleDelete(foto._id)}
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="progreso-empty-text">Aún no has subido fotos de tu progreso.</p>
      )}
    </section>
  );
};


// --- COMPONENTE PRINCIPAL (PERFIL) ---
// (Este componente no se modifica, solo el sub-componente ProgresoJardin)
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

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen válida (JPEG, PNG, etc.)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen es demasiado grande. Máximo 5MB permitido.');
      return;
    }

    const toastId = toast.loading('Subiendo imagen...');
    try {
      await updateUserPicture(file, user._id);
      toast.success('Imagen de perfil actualizada.', { id: toastId });
      await fetchUserData();
      event.target.value = '';
    } catch (error) {
      console.error('❌ Error subiendo imagen:', error);
      toast.error('Error al actualizar la imagen.', { id: toastId });
      event.target.value = '';
    }
  };

  const handleChangeName = async (e) => {
    e.preventDefault();
    if (!newName || newName.trim() === "") {
      toast.error("El nombre no puede estar vacío.");
      return;
    }
    if (newName === user.name) {
      toast.error("El nombre es el mismo.");
      return;
    }

    const toastId = toast.loading('Actualizando nombre...');
    try {
      await updateUserName(user._id, newName.trim());
      toast.success("Nombre actualizado con éxito.", { id: toastId });
    } catch (error) {
      toast.error(`Error: ${error.message || "No se pudo cambiar el nombre."}`, { id: toastId });
      console.error("Error al cambiar el nombre:", error);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const current_password = e.target.current_password.value;
    const new_password = e.target.new_password.value;
    const confirm_password = e.target.confirm_password.value;

    if(new_password !== confirm_password){
      toast.error("Las nuevas contraseñas no coinciden.");
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
      await changePassword(userData);
      toast.success("Contraseña actualizada con éxito.", { id: toastId });
      e.target.reset();
    }catch(e){
      toast.error(e.response?.data?.message || "Error al cambiar la contraseña.", { id: toastId });
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
        toast.success("Correo electrónico actualizado.", { id: toastId });
        e.target.reset();
      } else {
        toast.error(response.message || "No se pudo cambiar el correo.", { id: toastId });
      }
    }catch(e){
      toast.error(e.response?.data?.message || "Error al cambiar el correo.", { id: toastId });
      console.error("Error al cambiar el correo electrónico:", e);
    }
  }

  const handleDelete = async() => {
    toast((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontFamily: 'Arial, sans-serif', fontSize: '15px', color: '#333', textAlign: 'center' }}>
          ¿Seguro que quieres eliminar tu cuenta?
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => {
              toast.dismiss(t.id);
              confirmDeleteAccount();
            }} 
            style={{ 
              background: '#E74C3C', 
              color: 'white', 
              border: 'none', 
              padding: '8px 12px', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontFamily: 'Arial, sans-serif',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            Eliminar
          </button>
          <button 
            onClick={() => toast.dismiss(t.id)}
            style={{ 
              background: '#6C757D', 
              color: 'white', 
              border: 'none', 
              padding: '8px 12px', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontFamily: 'Arial, sans-serif',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    ), { 
      duration: 6000,
      style: { 
        padding: '12px 16px', 
        borderRadius: '8px',
      },
    });
  }
  
  const confirmDeleteAccount = async () => {
    const toastId = toast.loading('Eliminando cuenta...');
    try {
      const response = await deleteAccount(user._id);
      if(response.message === "User has been deleted successfully"){
        toast.success("Cuenta eliminada.", { id: toastId });
        logout();
        navigate('/');
      }
    }catch(error) {
      toast.error("Error al eliminar la cuenta.", { id: toastId });
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
          <h2>Hola, <span>{newName || user?.name}</span></h2>
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

        {/* --- INICIO DE SECCIÓN "PROGRESO DEL JARDÍN" --- */}
        <ProgresoJardin />
        {/* --- FIN DE SECCIÓN "PROGRESO DEL JARDÍN" --- */}

        <hr />

        <section className="perfil-section-buttons">
          <button type="button" className="btn-danger" onClick={handleDelete}>Eliminar cuenta</button>
          <button type="button" className="btn-logout" onClick={() => { logout(); navigate('/') }}>Cerrar sesión</button>
        </section>

      </div>
    </div>
  );
}
