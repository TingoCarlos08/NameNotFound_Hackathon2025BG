import React, {useState, useEffect} from 'react';
import './TrustIndexAnimation.css';

interface TrustIndexAnimationProps {
  show: boolean;
  value: number;
  celebrationThreshold: number | null;
}

const TrustIndexAnimation: React.FC<TrustIndexAnimationProps> = ({
  show,
  value,
  celebrationThreshold,
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (show) {
      setIsVisible(true);
      
      // Animar el valor desde 0 hasta el valor actual
      let start = 0;
      const end = value;
      const duration = 2000; // 2 segundos
      const increment = end / (duration / 16); // 60 FPS
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          clearInterval(timer);
          setAnimatedValue(end);
        } else {
          setAnimatedValue(Math.round(start));
        }
      }, 16);
      
      // Ocultar la animación después de 5 segundos
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
      
      return () => {
        clearInterval(timer);
        clearTimeout(hideTimer);
      };
    } else {
      setAnimatedValue(0);
      setIsVisible(false);
    }
  }, [show, value]);
  
  if (!isVisible) return null;
  
  return (
    <div className={`trust-index-animation ${celebrationThreshold ? 'celebrating' : ''}`}>
      <div className="trust-index-animation-content">
        <div className="trust-index-animation-icon">
          {celebrationThreshold ? '🎉' : '📈'}
        </div>
        <div className="trust-index-animation-text">
          <div className="trust-index-animation-label">
            {celebrationThreshold 
              ? '¡Nuevo nivel alcanzado!' 
              : 'Índice de Confianza actualizado'}
          </div>
          <div className="trust-index-animation-value">
            {animatedValue}
            <span className="trust-index-animation-max">/100</span>
          </div>
        </div>
      </div>
      
      {celebrationThreshold && (
        <div className="trust-index-celebration">
          <div className="confetti-container">
            {Array.from({ length: 15 }).map((_, i) => (
              <div 
                key={i} 
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrustIndexAnimation;
