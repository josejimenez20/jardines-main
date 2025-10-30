/* eslint-disable react-refresh/only-export-components */
// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import { Toaster } from "react-hot-toast"; 

// Views existentes
import Inicio from "./views/Inicio";
import Perfil from "./views/Perfil";
import Favoritos from "./views/Favoritos";
import Login from "./views/Login";
import LoginStepTwo from "./views/TwoStepLogin";
import GoogleCallback from "./views/GoogleCallback";

// Nuevas views
import Dashboard from "./views/Dashboard";
import Resultados from "./views/Resultados";
import DetallePlanta from "./views/DetallePlanta";
import ForgotPassword from "./views/ForgotPassword";
import ResetPassword from "./views/ResetPassword";
import ConfiguracionPreferencias from "./views/ConfiguracionPreferencias";
import { AuthContextProvider } from "./contexts/useAuth";
import { PlantaContextProvider } from "./contexts/usePlanta";

// Componente para proteger rutas
// CORRECCIÓN: Se elimina la verificación del token de localStorage.
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("currentUser");
  // Se ha eliminado: const token = localStorage.getItem("accessToken");

  // Verificar solo la existencia del objeto de usuario
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> }, // redirige al login por defecto
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/inicio",
        element: (
          <ProtectedRoute>
            <Inicio />
          </ProtectedRoute>
        ),
      },
      {
        path: "/perfil",
        element: (
          <ProtectedRoute>
            <Perfil />
          </ProtectedRoute>
        ),
      },
      {
        path: "/favoritos",
        element: (
          <ProtectedRoute>
            <Favoritos />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/resultados",
        element: (
          <ProtectedRoute>
            <Resultados />
          </ProtectedRoute>
        ),
      },
      {
        path: "/planta/:id",
        element: (
          <ProtectedRoute>
            <DetallePlanta />
          </ProtectedRoute>
        ),
      },
      {
        path: "/preferencias",
        element: (
          <ProtectedRoute>
            <ConfiguracionPreferencias />
          </ProtectedRoute>
        ),
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/login-step-two", element: <LoginStepTwo /> },
  { path: "/auth/google/callback", element: <GoogleCallback /> },
  
  // Rutas de recuperación de contraseña (ya incluidas)
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <PlantaContextProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <RouterProvider router={router} />
      </PlantaContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);