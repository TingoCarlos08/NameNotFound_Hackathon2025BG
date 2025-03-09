import React from 'react';

interface SimulatorProgressProps {
  currentStep: number;
  totalSteps: number;
}

const SimulatorProgress: React.FC<SimulatorProgressProps> = ({ currentStep, totalSteps }) => {
  // Crear un array con el número total de pasos
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);
  
  // Nombres de los pasos
  const stepNames = [
    'Inicio',
    'Planificación',
    'Decisiones',
    'Imprevistos',
    'Resultados'
  ];

  return (
    <div className="simulator-progress">
      {steps.map((step) => {
        // Determinar el estado del paso
        const isCompleted = step < currentStep;
        const isActive = step === currentStep;
        
        // Clases CSS basadas en el estado
        const stepClass = `progress-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`;
        
        return (
          <div key={step} className={stepClass}>
            <div className="progress-connector"></div>
            <div className="step-indicator">
              {isCompleted ? '✓' : step}
            </div>
            <div className="step-label">
              {stepNames[step - 1] || `Paso ${step}`}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SimulatorProgress; 