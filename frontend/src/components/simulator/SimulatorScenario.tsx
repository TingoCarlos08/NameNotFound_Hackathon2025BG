import React, { useState } from 'react';
import { Card, CardContent, Button } from '../../components/ui';
import { useChatbot, TrustAction } from '../../components/chatbot';

interface Option {
  id: string;
  text: string;
  impact: 'positive' | 'neutral' | 'negative';
  points: number;
  feedback: string;
}

interface Decision {
  id: string;
  title: string;
  description: string;
  options: Option[];
}

interface SimulatorScenarioProps {
  currentStep: number;
  onNext: () => void;
  onPrevious: () => void;
  onComplete: (score: number) => void;
}

const SimulatorScenario: React.FC<SimulatorScenarioProps> = ({
  currentStep,
  onNext,
  onPrevious,
  onComplete
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const { addTrustAction } = useChatbot();

  // Definición de las decisiones del escenario
  const decisions: Decision[] = [
    {
      id: 'loan_amount',
      title: 'Monto del préstamo',
      description: 'Estás iniciando un pequeño negocio de artesanías. ¿Cuánto dinero solicitarías para comenzar?',
      options: [
        {
          id: 'small_loan',
          text: '$5,000 - Lo mínimo necesario para comenzar',
          impact: 'positive',
          points: 10,
          feedback: 'Excelente decisión. Comenzar con un préstamo pequeño reduce tu riesgo financiero y demuestra una gestión prudente.'
        },
        {
          id: 'medium_loan',
          text: '$15,000 - Un balance entre necesidades y crecimiento',
          impact: 'neutral',
          points: 5,
          feedback: 'Una decisión equilibrada. Este monto te permite cubrir necesidades básicas y tener algo de margen para crecimiento.'
        },
        {
          id: 'large_loan',
          text: '$30,000 - Para tener un buen margen de crecimiento',
          impact: 'negative',
          points: 0,
          feedback: 'Esta cantidad podría ser excesiva para un negocio que recién comienza. Un préstamo grande implica pagos más altos y mayor riesgo.'
        }
      ]
    },
    {
      id: 'payment_term',
      title: 'Plazo de pago',
      description: 'Has decidido el monto de tu préstamo. Ahora, ¿qué plazo de pago elegirías?',
      options: [
        {
          id: 'short_term',
          text: '12 meses - Pagos más altos pero menos intereses totales',
          impact: 'neutral',
          points: 5,
          feedback: 'Un plazo corto significa pagos mensuales más altos, pero pagarás menos intereses en total. Es una buena opción si tu flujo de caja es estable.'
        },
        {
          id: 'medium_term',
          text: '36 meses - Balance entre pagos mensuales e intereses',
          impact: 'positive',
          points: 10,
          feedback: 'Excelente elección. Este plazo ofrece un buen equilibrio entre pagos mensuales manejables y un costo total razonable.'
        },
        {
          id: 'long_term',
          text: '60 meses - Pagos mensuales más bajos pero más intereses totales',
          impact: 'negative',
          points: 2,
          feedback: 'Un plazo largo reduce tus pagos mensuales, pero aumenta significativamente el costo total del préstamo debido a los intereses acumulados.'
        }
      ]
    },
    {
      id: 'unexpected_expense',
      title: 'Gasto inesperado',
      description: 'Tres meses después de iniciar tu negocio, tu equipo principal se avería y necesitas $2,000 para repararlo. ¿Qué harías?',
      options: [
        {
          id: 'use_savings',
          text: 'Usar tus ahorros personales de emergencia',
          impact: 'positive',
          points: 10,
          feedback: 'Excelente decisión. Usar ahorros de emergencia para gastos inesperados del negocio demuestra planificación financiera responsable.'
        },
        {
          id: 'credit_card',
          text: 'Pagar con tarjeta de crédito y dividir el pago en cuotas',
          impact: 'neutral',
          points: 5,
          feedback: 'Esta opción puede funcionar si tienes un plan claro para pagar la deuda rápidamente, pero ten cuidado con los altos intereses de las tarjetas.'
        },
        {
          id: 'additional_loan',
          text: 'Solicitar un préstamo adicional para cubrir la reparación',
          impact: 'negative',
          points: 0,
          feedback: 'Acumular más deuda tan pronto puede ser riesgoso. Esto podría iniciar un ciclo de endeudamiento difícil de romper.'
        }
      ]
    },
    {
      id: 'business_growth',
      title: 'Oportunidad de crecimiento',
      description: 'Tu negocio está funcionando bien y tienes la oportunidad de expandirte a un local más grande. ¿Qué decisión tomarías?',
      options: [
        {
          id: 'wait_save',
          text: 'Esperar y ahorrar durante 6 meses antes de expandirte',
          impact: 'positive',
          points: 10,
          feedback: 'Excelente decisión. Esperar y ahorrar demuestra paciencia y planificación financiera sólida, reduciendo la necesidad de endeudamiento adicional.'
        },
        {
          id: 'partial_loan',
          text: 'Financiar parte con ahorros y parte con un pequeño préstamo',
          impact: 'neutral',
          points: 7,
          feedback: 'Un enfoque equilibrado que combina recursos propios con financiamiento externo. Esto distribuye el riesgo y aprovecha la oportunidad.'
        },
        {
          id: 'full_loan',
          text: 'Solicitar un préstamo completo para expandirte inmediatamente',
          impact: 'negative',
          points: 3,
          feedback: 'Esta opción aumenta significativamente tu nivel de deuda. Aunque permite un crecimiento rápido, también incrementa el riesgo financiero.'
        }
      ]
    }
  ];

  // Obtener la decisión actual basada en el paso
  const currentDecision = decisions[currentStep - 1];

  // Manejar la selección de una opción
  const handleSelectOption = (optionId: string) => {
    setSelectedOption(optionId);
  };

  // Manejar el botón de continuar
  const handleContinue = () => {
    if (!selectedOption) return;

    // Encontrar la opción seleccionada
    const option = currentDecision.options.find(opt => opt.id === selectedOption);
    
    if (option) {
      // Actualizar la puntuación
      const newScore = score + option.points;
      setScore(newScore);
      
      // Mostrar retroalimentación
      setShowFeedback(true);
      
      // Si es el último paso, completar el escenario
      if (currentStep === decisions.length) {
        setTimeout(() => {
          addTrustAction(TrustAction.COMPLETE_SCENARIO, 'Completó escenario de simulación de crédito', option.points);
          onComplete(newScore);
        }, 3000);
      }
    }
  };

  // Manejar el botón de siguiente después de mostrar la retroalimentación
  const handleNext = () => {
    setShowFeedback(false);
    setSelectedOption(null);
    onNext();
  };

  // Obtener la opción seleccionada
  const selectedOptionData = selectedOption 
    ? currentDecision.options.find(opt => opt.id === selectedOption) 
    : null;

  return (
    <Card className="simulator-scenario-card">
      <CardContent>
        {!showFeedback ? (
          <>
            <h2>{currentDecision.title}</h2>
            <p className="scenario-description">{currentDecision.description}</p>
            
            <div className="scenario-options">
              {currentDecision.options.map((option) => (
                <div 
                  key={option.id}
                  className={`scenario-option ${selectedOption === option.id ? 'selected' : ''}`}
                  onClick={() => handleSelectOption(option.id)}
                >
                  <div className="option-content">
                    <div className="option-text">{option.text}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="simulator-actions">
              <Button 
                variant="primary" 
                onClick={handleContinue}
                disabled={!selectedOption}
              >
                Continuar
              </Button>
              {currentStep > 1 && (
                <Button 
                  variant="outline" 
                  onClick={onPrevious}
                >
                  Anterior
                </Button>
              )}
            </div>
          </>
        ) : (
          <div className="feedback-container">
            <h2>Retroalimentación</h2>
            <div className={`feedback-box impact-${selectedOptionData?.impact}`}>
              <p>{selectedOptionData?.feedback}</p>
              <div className="points-indicator">
                +{selectedOptionData?.points} puntos
              </div>
            </div>
            <div className="simulator-actions">
              <Button 
                variant="primary" 
                onClick={handleNext}
              >
                {currentStep < decisions.length ? 'Siguiente decisión' : 'Ver resultados'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SimulatorScenario; 