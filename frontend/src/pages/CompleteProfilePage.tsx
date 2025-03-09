import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/ui';
import CompleteProfileForm from '../components/profile/CompleteProfileForm';
import { ChatbotContainer } from '../components/chatbot';
import './CompleteProfilePage.css';

const CompleteProfilePage: React.FC = () => {
  const [profileSuccess, setProfileSuccess] = useState(false);
  const navigate = useNavigate();

  // Verificar si el usuario ya tiene el perfil completo
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData.profileCompleted) {
        // Si ya tiene el perfil completo, redirigir al dashboard
        navigate('/dashboard');
      }
    } else {
      // Si no hay usuario, redirigir al registro
      navigate('/register');
    }
  }, [navigate]);

  const handleProfileComplete = () => {
    setProfileSuccess(true);
    // Redirigir al dashboard después de 3 segundos
    setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
  };

  return (
    <div className="complete-profile-page">
      <header className="profile-header">
        <Logo size="medium" />
      </header>

      <main className="profile-content">
        {profileSuccess ? (
          <div className="success-message">
            <h2>¡Perfil completado!</h2>
            <p>Tu perfil ha sido actualizado correctamente.</p>
            <p>Serás redirigido a tu dashboard en unos segundos...</p>
          </div>
        ) : (
          <>
            <div className="profile-intro">
              <h1>Completa tu perfil</h1>
              <p>
                Añade información adicional para personalizar tu experiencia y aumentar tu Índice de Confianza.
                Conectar tus redes sociales nos ayuda a verificar tu identidad y construir una relación más sólida.
              </p>
            </div>
            <CompleteProfileForm onProfileComplete={handleProfileComplete} />
          </>
        )}
      </main>

      <footer className="profile-footer">
        <p>TrustBridge © 2023 - Construyendo puentes de confianza financiera</p>
      </footer>

      {/* Chatbot */}
      <ChatbotContainer />
    </div>
  );
};

export default CompleteProfilePage; 