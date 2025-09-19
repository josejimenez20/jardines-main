import React, { useEffect, useState } from "react";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import api from "../shared/api";

export default function LoginView() {
  const [municipios, setMunicipios] = useState([]);
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [showRegister, setShowRegister] = useState(false);
  const [loginPasswordVisible, setLoginPasswordVisible] = useState(false);
  const [registerPasswordVisible, setRegisterPasswordVisible] = useState(false);


  useEffect(() => {
    const fetchMunicipios = async () => {
      try {
        const response = await api.get("/municipio");
        setMunicipios(response.data);
      } catch (error) {
        console.error("Error fetching municipios:", error);
      }
    };
    fetchMunicipios();
  }, []);
  // Alterna entre Login y Registro
  const toggleForms = () => setShowRegister(!showRegister);

  // Alterna visibilidad de contraseña
  const togglePassword = (type) => {
    if (type === "login") setLoginPasswordVisible(!loginPasswordVisible);
    if (type === "register") setRegisterPasswordVisible(!registerPasswordVisible);
  };

  // Manejo del Login
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await login({ email, password });
      if (response) {
        navigate("/dashboard");
      } else {
        alert("Error en el inicio de sesión. Revisa tus credenciales.");
      }
    } catch (err) {
      console.error("Error en login:", err);
      alert("Hubo un problema al iniciar sesión.");
    }
  };

  // Manejo del Registro
  const handleRegister = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const municipio = e.target.municipio.value;

    const newUser = { name, email, password, municipio };
    await register(newUser);
    setShowRegister(false); // vuelve al login
  };

  return (
    <div className="page">
      <div className={`container ${showRegister ? "show-register" : ""}`}>
        {/* Panel lateral Login */}
        <div className="side-panel login-panel">
          <img src="/logo_imagen.png" alt="Logo" className="logo" />
          <h2>¡Hola!</h2>
          <p>Regístrate con tus datos personales para usar todas las funciones del sitio</p>
          <button className="toggle-btn" onClick={toggleForms}>
            Registrarte
          </button>
        </div>

        {/* Panel lateral Registro */}
        <div className="side-panel register-panel">
          <img src="/logo_imagen.png" alt="Logo" className="logo" />
          <h2>¡Bienvenido!</h2>
          <p>Inicia sesión con tus datos para acceder a tus recomendaciones personalizadas</p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowRegister(false)}
          >
            Iniciar Sesión
          </button>
        </div>

        {/* Formulario Login */}
        <div className="form-container login-container">
          <div className="form-header">
            <h1>Iniciar Sesión</h1>
            <p>Accede a tu cuenta para ver tus recomendaciones</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input type="email" name="email" placeholder="Correo electrónico" required />
            </div>
            <div className="form-group password-wrapper">
              <input
                type={loginPasswordVisible ? "text" : "password"}
                name="password"
                placeholder="Contraseña"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePassword("login")}
              >
                <i className={`bi ${loginPasswordVisible ? "bi-eye" : "bi-eye-slash"}`}></i>
              </button>
            </div>
            <button type="submit" className="btn">Iniciar Sesión</button>
          </form>
        </div>

        {/* Formulario Registro */}
        <div className="form-container register-container">
          <div className="form-header">
            <h1>Crear Cuenta</h1>
            <p>Comienza a recibir recomendaciones para tu jardín</p>
          </div>
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <input type="text" name="name" placeholder="Nombre" required />
            </div>
            <div className="form-group">
              <input type="email" name="email" placeholder="Correo electrónico" required />
            </div>
            <div className="form-group password-wrapper">
              <input
                type={registerPasswordVisible ? "text" : "password"}
                name="password"
                placeholder="Contraseña"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePassword("register")}
              >
                <i className={`bi ${registerPasswordVisible ? "bi-eye" : "bi-eye-slash"}`}></i>
              </button>
            </div>
            <div className="form-group">
              <select name="municipio" required defaultValue="">
                <option value="" disabled hidden>
                  Selecciona un municipio
                </option>
                {
                  municipios.map(mun => (
                    <option key={mun._id} value={mun._id}>{mun.name}</option>
                  ))
               }
              </select>
            </div>
            <p className="note">Podrás personalizar más tus recomendaciones después</p>
            <button type="submit" className="btn">Registrate</button>
          </form>
        </div>
      </div>
    </div>
  );
}
