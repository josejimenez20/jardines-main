// src/views/ResetPassword.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import "../styles/TwoStepLogin.css"; 
import { useAuth } from "../contexts/useAuth";

export default function ResetPassword() { // <-- Usa export default
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState(null);
  
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (!urlToken) {
        setError("Token de restablecimiento no encontrado.");
    } else {
        setToken(urlToken);
    }
  }, [searchParams]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    
    if (!token) {
        setError("Token inválido. Por favor, reinicia el proceso.");
        return;
    }
    
    // El backend requiere mínimo 8, por el IsStrongPassword en CreateUserRequest, pero
    // el DTO ResetPasswordDto solo requiere MinLength(8). Usaremos 8 como mínimo.
    if (newPassword.length < 8) { 
        setError("La contraseña debe tener al menos 8 caracteres.");
        return;
    }

    setLoading(true);

    try {
      await resetPassword(token, newPassword);
      setSuccess(true);
      setError("");
    } catch (err) {
      console.error("Error al restablecer contraseña:", err);
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="two-step-container">
      <div className="two-step-card">
        <h1 className="two-step-title">Establecer Nueva Contraseña</h1>
        <p className="two-step-subtitle">
          Ingresa y confirma tu nueva contraseña.
        </p>

        {success ? (
          <div style={{ color: '#27ae60', fontWeight: 'bold', marginBottom: '20px' }}>
            Contraseña restablecida con éxito.
            <button className="two-step-button" onClick={() => navigate('/login')} style={{ marginTop: '20px' }}>
              Volver al inicio de sesión
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="two-step-form">
            <input
              type="password"
              placeholder="Nueva Contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className="two-step-input"
              style={{ width: '100%', height: '50px', fontSize: '1rem', padding: '0 15px' }}
            />
            <input
              type="password"
              placeholder="Confirmar Contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="two-step-input"
              style={{ width: '100%', height: '50px', fontSize: '1rem', padding: '0 15px' }}
            />
            {error && <p className="two-step-error">{error}</p>}
            <button
              type="submit"
              disabled={loading || !token}
              className="two-step-button"
            >
              {loading ? "Restableciendo..." : "Restablecer Contraseña"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}