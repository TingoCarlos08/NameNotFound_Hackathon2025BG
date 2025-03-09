import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';
import { onboardingFlow } from './OnboardingFlow';
import { useChatbot } from './ChatbotContext';
import TrustIndexAnimation  from './TrustIndexAnimation'; 

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface ChatbotProps {
  userName?: string;
  onSendMessage?: (message: string) => void;
  onClose?: () => void;
  isOpen: boolean;
  toggleChat: () => void;
  messages: Message[];
  isTyping?: boolean;
  currentOnboardingStep?: string | null;
}

const Chatbot: React.FC<ChatbotProps> = ({
  userName = 'Usuario',
  onSendMessage,
  onClose,
  isOpen,
  toggleChat,
  messages,
  isTyping = false,
  currentOnboardingStep = null,
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { showTrustAnimation, userProfile, celebrationThreshold } = useChatbot();

  // Obtener el valor del índice de confianza de forma segura
  const trustIndexValue = userProfile?.trustIndex ?? 0;
  
  // Valor seguro para la animación
  const safeAnimationValue = Number(trustIndexValue);
  
  // Desplazar al final de los mensajes cuando se añade uno nuevo
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Enfocar el input cuando se abre el chat
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Notificar al componente padre
    if (onSendMessage) {
      onSendMessage(inputValue);
    }

    // Limpiar el input
    setInputValue('');
  };


  return (
    <>
      {/* Botón flotante del chatbot */}
      <div 
        className={`chatbot-button ${isOpen ? 'active' : ''}`} 
        onClick={toggleChat}
        aria-label="Abrir chat con TrustBuddy"
      >
        <div className="chatbot-icon">💬</div>
        <span className="chatbot-label">TrustBuddy</span>
      </div>

      {/* Ventana del chatbot */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Encabezado del chatbot */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">🤖</div>
              <div className="chatbot-title">
                <h3>TrustBuddy</h3>
                <span className="chatbot-status">En línea</span>
              </div>
            </div>
            <div className="chatbot-header-actions">
              <button 
                className="minimize-button" 
                onClick={toggleChat}
                aria-label="Minimizar chat"
              >
                _
              </button>
              <button 
                className="close-button" 
                onClick={onClose || toggleChat}
                aria-label="Cerrar chat"
              >
                ×
              </button>
            </div>
          </div>

          {/* Contenido del chatbot */}
          <div className="chatbot-content">
            {/* Mensajes */}
            <div className="chatbot-messages">
              {messages.map(message => (
                <div 
                  key={message.id} 
                  className={`message ${message.sender}`}
                >
                  {message.text}
                  <span className="message-time">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              
              {/* Indicador de escritura */}
              {isTyping && (
                <div className="typing-indicator">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              )}
              
              {/* Opciones de respuesta */}
              {currentOnboardingStep && 
               onboardingFlow.steps && 
               onboardingFlow.steps[currentOnboardingStep] &&
               onboardingFlow.steps[currentOnboardingStep].options &&
               onboardingFlow.steps[currentOnboardingStep].options.length > 0 && 
               !isTyping && (
                <div className="response-options">
                  {onboardingFlow.steps[currentOnboardingStep].options.map((option, index) => (
                    <button
                      key={index}
                      className="response-option"
                      onClick={() => onSendMessage && onSendMessage(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Referencia para desplazamiento automático */}
              <div ref={messagesEndRef} />
            </div>

            {/* Entrada de texto */}
            <div className="chatbot-input-container">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje..."
                ref={inputRef}
                aria-label="Mensaje para TrustBuddy"
              />
              <button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                aria-label="Enviar mensaje"
              >
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animación del Índice de Confianza */}
      {showTrustAnimation && (
        <TrustIndexAnimation 
          show={true}
          value={safeAnimationValue}
          celebrationThreshold={celebrationThreshold}
        />
      )}
    </>
  );
};

export default Chatbot; 