// src/views/GoogleCallback.jsx
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
// import api from '../shared/api';

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser, fetchUserData } = useAuth();

  useEffect(() => {
    const processGoogleCallback = async () => {
      try {
        const accessToken = searchParams.get('accessToken');
        const success = searchParams.get('success');


        if (accessToken && success === 'true') {
          localStorage.setItem('accessToken', accessToken);

          try {
            await fetchUserData();
          
          // eslint-disable-next-line no-unused-vars
          } catch (error) {
            console.log(error);
          }

          // Redirigir al dashboard
          navigate('/dashboard', { replace: true });
        } else {
          // Si no hay token, hubo un error
          navigate('/login?error=google_auth_failed');
        }
      } catch (error) {
        console.error( error);
        navigate('/login?error=auth_failed');
      }
    };

    processGoogleCallback();
  }, [searchParams, navigate, setUser, fetchUserData]);

  return (
    <div>
      <h2>Procesando autenticación...</h2>
      <p>Por favor espera mientras te redirigimos.</p>
    </div>
  );
}