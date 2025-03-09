import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/ui';
import RegisterForm from '../components/auth/RegisterForm';
import { ChatbotContainer } from '../components/chatbot';
import './RegisterPage.css';

const RegisterPage: React.FC = () => {
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegisterSuccess = () => {
    setRegistrationSuccess(true);
    // Redirigir al dashboard después de 3 segundos
    setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
  };

  return (
    <div className="register-page">
      <header className="register-header">
        <Logo size="medium" />
      </header>

      <main className="register-content">
        {registrationSuccess ? (
          <div className="success-message">
            <h2>¡Registro exitoso!</h2>
            <p>Tu cuenta ha sido creada correctamente.</p>
            <p>Serás redirigido a tu dashboard en unos segundos...</p>
          </div>
        ) : (
          <>
            <div className="register-intro">
              <h1>Bienvenido a TrustBridge</h1>
              <p>
                Estás a un paso de comenzar tu viaje hacia la confianza financiera.
                Regístrate para acceder a todas las herramientas que te ayudarán a
                construir tu futuro financiero.
              </p>
            </div>
            <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
          </>
        )}
      </main>

      <footer className="register-footer">
        <p>TrustBridge © 2023 - Construyendo puentes de confianza financiera</p>
      </footer>

      {/* Chatbot */}
      <ChatbotContainer userName="Visitante" />
    </div>
  );
};

export default RegisterPage; 