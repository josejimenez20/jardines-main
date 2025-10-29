// src/views/ForgotPassword.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import '../styles/TwoStepLogin.css'; 
// Reutiliza los estilos de TwoStepLogin.css

export default function ForgotPassword() { // <-- Usa export default
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      // Usamos el API de forgotPassword que definiste en useAuth
      await forgotPassword(email);
      setSuccess(true);
      setError('');
    } catch (err) {
      console.error('Error al solicitar restablecimiento:', err);
      // Asume que el error ya viene en formato string o usa un mensaje genérico
      setError(err.toString().includes('Email no encontrado') ? 'El correo no está registrado.' : 'Error al procesar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="two-step-container">
      <div className="two-step-card">
        <h1 className="two-step-title">¿Olvidaste tu contraseña?</h1>
        <p className="two-step-subtitle">
          Ingresa el correo electrónico asociado a tu cuenta para recibir un enlace.
        </p>

        {success ? (
          <div style={{ color: '#27ae60', fontWeight: 'bold', marginBottom: '20px' }}>
            Se ha enviado un enlace a tu correo.
            <button className="two-step-button" onClick={() => navigate('/login')} style={{ marginTop: '20px' }}>
              Volver al inicio de sesión
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="two-step-form">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="two-step-input"
              style={{ width: '100%', height: '50px', fontSize: '1rem', padding: '0 15px' }}
            />
            {error && <p className="two-step-error">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="two-step-button"
            >
              {loading ? 'Enviando...' : 'Enviar enlace'}
            </button>
          </form>
        )}
        <div style={{ marginTop: '1rem' }}>
          <Link to="/login" style={{ color: '#2563eb' }}>Volver al login</Link>
        </div>
      </div>
    </div>
  );
}