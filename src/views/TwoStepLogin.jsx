import { useState } from "react";
import "../styles/TwoStepLogin.css";
import { useAuth } from "../contexts/useAuth";
import { useNavigate } from "react-router-dom";


export default function TwoStepLogin() {
  const [code, setCode] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { loginStepTwo } = useAuth();
  const navigate = useNavigate();

  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const enteredCode = code.join("");
    const user = JSON.parse(localStorage.getItem("idLoginStepOne"));
    try {
      if (!user) {
        throw new Error("User ID not found. Please restart the login process.");
      }
      const response = await loginStepTwo({ userId: user, code: enteredCode });
      if (response) {
        localStorage.removeItem("idLoginStepOne");
        localStorage.setItem("currentUser", JSON.stringify(response));
        navigate("/dashboard");
      }      
    } catch (err) {
      setError("Código inválido o expirado");
      console.error("Error al verificar el código:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="two-step-container">
      <div className="two-step-card">
        <h1 className="two-step-title">Verificación en dos pasos</h1>
        <p className="two-step-subtitle">
          Ingresa el código de 6 dígitos que enviamos a tu correo
        </p>

        <form onSubmit={handleSubmit} className="two-step-form">
          <div className="two-step-inputs">
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                className="two-step-input"
              />
            ))}
          </div>

          {error && <p className="two-step-error">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="two-step-button"
          >
            {loading ? "Verificando..." : "Confirmar"}
          </button>
        </form>
      </div>
    </div>
  );
}
