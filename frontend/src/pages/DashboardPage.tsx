import React, { useEffect, useState } from 'react';
import { Logo, Card, CardHeader, CardContent, Button, Modal } from '../components/ui';
import { ChatbotContainer, useChatbot, TrustAction } from '../components/chatbot';
import SocialConnections from '../components/profile/SocialConnections';
import './DashboardPage.css';

interface UserData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  trustIndex: number;
  currentStage: 'conocer' | 'intercambiar' | 'confiar' | 'concretar';
  socialNetworks?: {
    facebook: boolean;
    instagram: boolean;
    linkedin: boolean;
    twitter: boolean;
  };
}

const DashboardPage: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const { openChat, userProfile, addTrustAction, updateUserProfile } = useChatbot();

  // Sincronizar el índice de confianza entre el dashboard y el chatbot
  useEffect(() => {
    // Simulamos la carga de datos del usuario desde localStorage
    const loadUserData = () => {
      setLoading(true);
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // Añadimos la etapa actual si no existe
          if (!parsedUser.currentStage) {
            parsedUser.currentStage = 'conocer';
          }
          
          // Sincronizar con el índice de confianza del chatbot si existe
          if (userProfile && userProfile.trustIndex !== undefined) {
            // Si el índice en el dashboard es diferente al del chatbot
            if (parsedUser.trustIndex !== userProfile.trustIndex) {
              // Usar el valor más alto entre ambos
              const newTrustIndex = Math.max(parsedUser.trustIndex || 0, userProfile.trustIndex);
              parsedUser.trustIndex = newTrustIndex;
              
              // Actualizar localStorage con el nuevo índice
              localStorage.setItem('user', JSON.stringify(parsedUser));
              
              // También actualizar el perfil del chatbot si es necesario
              if (userProfile.trustIndex !== newTrustIndex) {
                updateUserProfile({ trustIndex: newTrustIndex });
              }
            }
          } else if (parsedUser.trustIndex !== undefined && userProfile) {
            // Si el chatbot no tiene índice pero el dashboard sí, actualizar el chatbot
            updateUserProfile({ trustIndex: parsedUser.trustIndex });
          }
          
          setUserData(parsedUser);
        } else {
          // Si no hay usuario, redirigir al registro
          window.location.href = '/register';
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [userProfile, updateUserProfile]);

  const handleChatbotToggle = () => {
    openChat();
  };

  const handleCompleteProfile = () => {
    // Redirigir a la página de completar perfil
    window.location.href = '/complete-profile';
  };

  const handleSimulatorClick = () => {
    // Incrementar el índice de confianza por usar el simulador
    addTrustAction(TrustAction.USE_SIMULATOR, 'Uso del simulador de crédito desde el dashboard');
    // Redirigir al simulador
    window.location.href = '/simulator';
  };

  const handleSocialConnect = () => {
    setIsSocialModalOpen(true);
  };

  const handleSocialConnected = (network: string) => {
    // Actualizar los datos del usuario
    if (userData) {
      const socialNetworks = {
        facebook: userData.socialNetworks?.facebook || false,
        instagram: userData.socialNetworks?.instagram || false,
        linkedin: userData.socialNetworks?.linkedin || false,
        twitter: userData.socialNetworks?.twitter || false,
        [network]: true
      };
      
      const updatedUserData = {
        ...userData,
        socialNetworks
      };
      
      setUserData(updatedUserData);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Cargando tu dashboard...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="dashboard-error">
        <h2>Error al cargar datos</h2>
        <p>No se pudo cargar la información de tu cuenta.</p>
        <Button onClick={() => window.location.href = '/register'}>
          Volver al registro
        </Button>
      </div>
    );
  }

  // Determinar la etapa actual del usuario en el journey
  const journeyStages = [
    { id: 'conocer', label: 'Conocer', description: 'Compartimos información básica' },
    { id: 'intercambiar_confiar', label: 'Intercambiar', description: 'Aprendizaje y simulaciones' },
    { id: 'concretar', label: 'Confiar', description: 'Cumplimos tus sueños financieros' }
  ];

  // Mapear la etapa actual del usuario al nuevo esquema de 3 etapas
  const mapStageToJourney = (stage: string) => {
    switch (stage) {
      case 'conocer':
        return 'conocer';
      case 'intercambiar':
      case 'confiar':
        return 'intercambiar_confiar';
      case 'concretar':
        return 'concretar';
      default:
        return 'conocer';
    }
  };

  const currentStageId = mapStageToJourney(userData.currentStage);
  const currentStageIndex = journeyStages.findIndex(stage => stage.id === currentStageId);

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="header-logo">
          <Logo size="medium" />
        </div>
        <div className="header-user">
          <span className="user-greeting">Hola, {userData.fullName.split(' ')[0]}</span>
          <Button variant="text" size="small">Cerrar sesión</Button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="dashboard-welcome">
          <h1>Bienvenido a tu Dashboard Personal</h1>
          <p>
            Estás en la etapa de <strong>{journeyStages[currentStageIndex].label}</strong> de tu viaje financiero.
            Sigue avanzando para construir confianza y acceder a mejores oportunidades.
          </p>
        </div>

        <div className="dashboard-grid">
          {/* Journey de 3 etapas (ahora en la posición superior izquierda) */}
          <Card variant="elevated" className="journey-card">
            <CardHeader title="Tu Viaje Financiero" />
            <CardContent>
              <div className="journey-steps">
                {journeyStages.map((stage, index) => (
                  <React.Fragment key={stage.id}>
                    <div className={`journey-step ${index <= currentStageIndex ? 'active' : ''} ${index === currentStageIndex ? 'current' : ''}`}>
                      <div className="step-number">{index + 1}</div>
                      <div className="step-label">{stage.label}</div>
                      <div className="step-description">{stage.description}</div>
                    </div>
                    {index < journeyStages.length - 1 && (
                      <div className={`journey-connector ${index < currentStageIndex ? 'active' : ''}`}></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Próximo Nivel (ahora a la derecha del viaje financiero) */}
          <Card variant="outlined" className="next-level-card">
            <CardHeader title="Tu Próximo Nivel" />
            <CardContent>
              <div className="next-level-info">
                <div className="next-level-icon">
                  {userData.currentStage === 'conocer' && '📚'}
                  {(userData.currentStage === 'intercambiar' || userData.currentStage === 'confiar') && '🔄'}
                  {userData.currentStage === 'concretar' && '🏆'}
                </div>
                <div className="next-level-details">
                  <h3>
                    {userData.currentStage === 'conocer' && 'Etapa de Construcción de Confianza'}
                    {userData.currentStage === 'intercambiar' && 'Etapa de Construcción de Confianza'}
                    {userData.currentStage === 'confiar' && 'Etapa de Concreción'}
                    {userData.currentStage === 'concretar' && 'Experto Financiero'}
                  </h3>
                  <div className="next-level-progress">
                    <div className="progress-label">Progreso hacia el siguiente nivel</div>
                    <div className="progress-bar-container">
                      <div 
                        className="progress-bar" 
                        style={{ width: `${Math.min(userData.trustIndex * 2, 100)}%` }}
                      ></div>
                    </div>
                    <div className="progress-value">{Math.min(userData.trustIndex * 2, 100)}%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Índice de Confianza (ahora en la parte inferior izquierda) */}
          <Card variant="elevated" className="trust-index-card">
            <CardHeader title="Tu Índice de Confianza" />
            <CardContent>
              <div className="trust-index">
                <div className="trust-index-value">{userData.trustIndex}</div>
                <div className="trust-index-label">de 100</div>
              </div>
              <div className="trust-index-progress">
                <div 
                  className="trust-index-progress-bar" 
                  style={{ width: `${userData.trustIndex}%` }}
                ></div>
              </div>
              <p className="trust-index-description">
                Tu índice de confianza refleja tu progreso en la construcción de una relación
                financiera sólida. Completa acciones recomendadas para aumentarlo.
              </p>
              <div className="trust-index-actions">
                <p className="trust-index-actions-title">Acciones para aumentar tu índice:</p>
                <ul className="trust-index-actions-list">
                  <li>Completar tu perfil (+3 puntos)</li>
                  <li>Usar el simulador de crédito (+10 puntos)</li>
                  <li>Interactuar con TrustBuddy (+1 punto por respuesta)</li>
                  <li>Iniciar sesión diariamente (+1 punto)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Acciones Recomendadas (ahora en la parte inferior derecha) */}
          <Card variant="filled" className="actions-card">
            <CardHeader title="Acciones Recomendadas" />
            <CardContent>
              <ul className="action-list">
                <li className="action-item">
                  <Button variant="primary" size="small" onClick={handleCompleteProfile}>
                    Completar perfil
                  </Button>
                  <span>Añade más información para personalizar tu experiencia</span>
                </li>
                <li className="action-item">
                  <Button variant="primary" size="small" onClick={handleSocialConnect}>
                    Conectar redes sociales
                  </Button>
                  <span>Verifica tu identidad y aumenta tu Índice de Confianza</span>
                </li>
                <li className="action-item">
                  <Button variant="primary" size="small" onClick={handleChatbotToggle}>
                    Hablar con TrustBuddy
                  </Button>
                  <span>Nuestro chatbot te ayudará a resolver tus dudas</span>
                </li>
                <li className="action-item">
                  <Button variant="primary" size="small" onClick={handleSimulatorClick}>
                    Probar simulador de crédito
                  </Button>
                  <span>Demuestra tus habilidades financieras en situaciones reales</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="dashboard-footer">
        <p>TrustBridge © 2023 - Construyendo puentes de confianza financiera</p>
      </footer>

      {/* Modal de conexiones a redes sociales */}
      <Modal
        isOpen={isSocialModalOpen}
        onClose={() => setIsSocialModalOpen(false)}
        title="Conecta tus redes sociales"
        size="small"
      >
        <div className="social-modal-content">
          <p className="social-modal-description">
            Conectar tus redes sociales nos ayuda a verificar tu identidad y aumenta tu Índice de Confianza.
            No publicaremos nada en tu nombre ni accederemos a tu información privada.
          </p>
          <SocialConnections
            initialConnections={userData?.socialNetworks}
            onConnect={handleSocialConnected}
          />
        </div>
      </Modal>

      {/* Chatbot */}
      {userData && (
        <ChatbotContainer userName={userData.fullName.split(' ')[0]} />
      )}
    </div>
  );
};

export default DashboardPage; 