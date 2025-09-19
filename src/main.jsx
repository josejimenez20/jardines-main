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

// Views existentes
import Inicio from "./views/Inicio";
import Perfil from "./views/Perfil";
import Favoritos from "./views/Favoritos";
import Login from "./views/Login";

// Nuevas views
import Dashboard from "./views/Dashboard";
import Resultados from "./views/Resultados";
import DetallePlanta from "./views/DetallePlanta";
import ConfiguracionPreferencias from "./views/ConfiguracionPreferencias";
import { AuthContextProvider } from "./contexts/useAuth";
import { PlantaContextProvider } from "./contexts/usePlanta";

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("currentUser");
  if (!user) return <Navigate to="/login" replace />;
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
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <PlantaContextProvider>
        <RouterProvider router={router} />
      </PlantaContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
