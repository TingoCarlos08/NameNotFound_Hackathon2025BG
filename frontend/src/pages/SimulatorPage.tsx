import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo, Card, CardContent, Button } from '../components/ui';
import { ChatbotContainer, useChatbot, TrustAction } from '../components/chatbot';
import { SimulatorIntro, SimulatorProgress, SimulatorScenario, SimulatorResults } from '../components/simulator';
import './SimulatorPage.css';

interface UserData {
  id: string;
  fullName: string;
  email: string;
  trustIndex: number;
}

const SimulatorPage: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const { addTrustAction } = useChatbot();

  // Número total de pasos en el simulador
  const totalSteps = 4;
  // Puntuación máxima posible
  const maxScore = 40;

  useEffect(() => {
    // Cargar datos del usuario desde localStorage
    const loadUserData = () => {
      setLoading(true);
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUserData(parsedUser);
        } else {
          // Si no hay usuario, redirigir al registro
          navigate('/register');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
    
    // Registrar que el usuario visitó el simulador
    addTrustAction(TrustAction.VISIT_SIMULATOR, 'Visita al simulador de crédito');
  }, [navigate, addTrustAction]);

  const handleStartSimulation = () => {
    setStarted(true);
    setCurrentStep(1);
    setScore(0);
    setShowResults(false);
    addTrustAction(TrustAction.START_SIMULATOR, 'Inicio de simulación de crédito');
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCompleteScenario = (finalScore: number) => {
    setScore(finalScore);
    setShowResults(true);
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="simulator-loading">
        <div className="loading-spinner"></div>
        <p>Cargando simulador...</p>
      </div>
    );
  }

  return (
    <div className="simulator-page">
      <header className="simulator-header">
        <Logo size="medium" className="clickable" />
        <div className="header-actions">
          <Button 
            variant="outline" 
            onClick={handleBackToDashboard}
          >
            Volver al Dashboard
          </Button>
        </div>
      </header>

      <main className="simulator-content">
        {!started ? (
          <SimulatorIntro onStart={handleStartSimulation} />
        ) : showResults ? (
          <SimulatorResults 
            score={score}
            maxScore={maxScore}
            onRestart={handleStartSimulation}
            onFinish={handleBackToDashboard}
          />
        ) : (
          <>
            <SimulatorProgress currentStep={currentStep} totalSteps={totalSteps} />
            <SimulatorScenario 
              currentStep={currentStep}
              onNext={handleNextStep}
              onPrevious={handlePreviousStep}
              onComplete={handleCompleteScenario}
            />
          </>
        )}
      </main>

      <footer className="simulator-footer">
        <p>TrustBridge © 2023 - Simulador de Crédito</p>
      </footer>

      {/* Chatbot */}
      <ChatbotContainer userName={userData?.fullName || 'Usuario'} />
    </div>
  );
};

export default SimulatorPage; 