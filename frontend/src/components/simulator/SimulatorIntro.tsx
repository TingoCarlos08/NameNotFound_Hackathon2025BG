import React from 'react';
import { Button } from '../../components/ui';

interface SimulatorIntroProps {
  onStart: () => void;
}

const SimulatorIntro: React.FC<SimulatorIntroProps> = ({ onStart }) => {
  return (
    <div className="simulator-intro">
      <h1>Simulador de Crédito TrustBridge</h1>
      <p>
        Bienvenido al simulador de crédito de TrustBridge. Esta herramienta te permitirá 
        experimentar escenarios financieros realistas y entender cómo tus decisiones 
        afectan tu perfil crediticio.
      </p>
      <p>
        A través de situaciones simuladas, podrás practicar la toma de decisiones 
        financieras sin riesgos reales, aumentando tu confianza y conocimiento.
      </p>

      <div className="simulator-benefits">
        <div className="benefit-item">
          <div className="benefit-icon">💡</div>
          <div className="benefit-title">Aprende sin riesgos</div>
          <div className="benefit-description">
            Toma decisiones financieras en un entorno seguro sin consecuencias reales
          </div>
        </div>
        <div className="benefit-item">
          <div className="benefit-icon">📈</div>
          <div className="benefit-title">Mejora tu Índice de Confianza</div>
          <div className="benefit-description">
            Cada simulación completada aumenta tu Índice de Confianza en la plataforma
          </div>
        </div>
        <div className="benefit-item">
          <div className="benefit-icon">🎯</div>
          <div className="benefit-title">Recibe retroalimentación</div>
          <div className="benefit-description">
            Obtén consejos personalizados basados en tus decisiones
          </div>
        </div>
      </div>

      <div className="start-button">
        <Button variant="primary" onClick={onStart} size="large">
          Comenzar Simulación
        </Button>
      </div>
    </div>
  );
};

export default SimulatorIntro; 