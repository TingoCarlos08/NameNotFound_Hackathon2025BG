import React, { useEffect } from 'react';
import { Card, CardContent, Button } from '../../components/ui';
import { useChatbot, TrustAction } from '../../components/chatbot';

interface SimulatorResultsProps {
  score: number;
  maxScore: number;
  onRestart: () => void;
  onFinish: () => void;
}

const SimulatorResults: React.FC<SimulatorResultsProps> = ({
  score,
  maxScore,
  onRestart,
  onFinish
}) => {
  const { addTrustAction } = useChatbot();
  const percentage = Math.round((score / maxScore) * 100);
  
  // Determinar el nivel de desempeño
  let performanceLevel = '';
  let performanceDescription = '';
  let performanceColor = '';
  
  if (percentage >= 80) {
    performanceLevel = 'Excelente';
    performanceDescription = 'Has demostrado un excelente entendimiento de los principios financieros y toma de decisiones responsables. Tus elecciones reflejan una sólida planificación financiera y gestión de riesgos.';
    performanceColor = '#4CAF50';
  } else if (percentage >= 60) {
    performanceLevel = 'Bueno';
    performanceDescription = 'Has tomado buenas decisiones financieras en general. Con algunas mejoras en la gestión de riesgos y planificación a largo plazo, podrías optimizar aún más tus resultados.';
    performanceColor = '#2196F3';
  } else if (percentage >= 40) {
    performanceLevel = 'Regular';
    performanceDescription = 'Has tomado algunas decisiones acertadas, pero hay áreas importantes que podrías mejorar. Te recomendamos revisar los principios de gestión financiera responsable.';
    performanceColor = '#FF9800';
  } else {
    performanceLevel = 'Necesita mejorar';
    performanceDescription = 'Tus decisiones financieras podrían beneficiarse de un enfoque más conservador y una mejor planificación. Te recomendamos revisar los conceptos básicos de gestión financiera.';
    performanceColor = '#F44336';
  }
  
  // Recomendaciones basadas en el desempeño
  const getRecommendations = () => {
    if (percentage >= 80) {
      return [
        'Considera diversificar tus inversiones para maximizar el crecimiento a largo plazo',
        'Mantén un fondo de emergencia sólido para imprevistos',
        'Explora opciones de financiamiento con tasas preferenciales basadas en tu excelente historial'
      ];
    } else if (percentage >= 60) {
      return [
        'Enfócate en reducir deudas de alto interés antes de asumir nuevos compromisos',
        'Establece un presupuesto más detallado para controlar gastos',
        'Considera opciones de financiamiento con plazos que se ajusten mejor a tu flujo de caja'
      ];
    } else if (percentage >= 40) {
      return [
        'Prioriza la creación de un fondo de emergencia antes de expandir tu negocio',
        'Busca asesoría financiera para mejorar tu planificación',
        'Considera opciones de financiamiento más conservadoras y con plazos más manejables'
      ];
    } else {
      return [
        'Enfócate en mejorar tu educación financiera básica',
        'Establece un presupuesto estricto y cúmplelo rigurosamente',
        'Considera alternativas al endeudamiento para financiar tu negocio'
      ];
    }
  };
  
  // Efecto para registrar la finalización del simulador
  useEffect(() => {
    // Registrar la finalización del simulador con la puntuación obtenida
    addTrustAction(
      TrustAction.COMPLETE_SCENARIO, 
      `Completó el simulador con una puntuación de ${score}/${maxScore} (${percentage}%)`,
      Math.round(percentage / 10) // Puntos basados en el porcentaje
    );
  }, [addTrustAction, score, maxScore, percentage]);

  return (
    <Card className="simulator-results-card">
      <CardContent>
        <h2>Resultados de la Simulación</h2>
        
        <div className="results-summary">
          <div className="score-container">
            <div 
              className="score-circle" 
              style={{ 
                background: `conic-gradient(${performanceColor} ${percentage}%, #f0f0f0 0)` 
              }}
            >
              <div className="score-value">{percentage}%</div>
            </div>
            <div className="score-label">
              <span style={{ color: performanceColor }}>{performanceLevel}</span>
              <span className="score-points">{score}/{maxScore} puntos</span>
            </div>
          </div>
          
          <div className="performance-description">
            <p>{performanceDescription}</p>
          </div>
        </div>
        
        <div className="recommendations-section">
          <h3>Recomendaciones</h3>
          <ul className="recommendations-list">
            {getRecommendations().map((recommendation, index) => (
              <li key={index}>{recommendation}</li>
            ))}
          </ul>
        </div>
        
        <div className="trust-index-impact">
          <h3>Impacto en tu Índice de Confianza</h3>
          <p>
            Esta simulación ha contribuido positivamente a tu Índice de Confianza en TrustBridge.
            Tu desempeño demuestra tu compromiso con la responsabilidad financiera.
          </p>
          <div className="trust-points">
            +{Math.round(percentage / 10)} puntos añadidos a tu Índice de Confianza
          </div>
        </div>
        
        <div className="simulator-actions">
          <Button 
            variant="primary" 
            onClick={onFinish}
          >
            Volver al Dashboard
          </Button>
          <Button 
            variant="outline" 
            onClick={onRestart}
          >
            Reiniciar Simulación
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimulatorResults; 