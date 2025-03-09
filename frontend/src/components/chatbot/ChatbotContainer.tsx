import React, { useEffect } from 'react';
import { Chatbot } from './';
import { useChatbot } from './ChatbotContext';
import { TrustAction } from './TrustIndexCalculator';

interface ChatbotContainerProps {
  userName?: string;
}

const ChatbotContainer: React.FC<ChatbotContainerProps> = ({ userName = 'Usuario' }) => {
  const { 
    isOpen, 
    toggleChat, 
    messages, 
    addMessage, 
    handleUserResponse,
    isTyping,
    currentOnboardingStep,
    isOnboardingComplete,
    userProfile,
    addTrustAction
  } = useChatbot();

  // Registrar inicio de sesión diario
  useEffect(() => {
    const lastLoginDate = localStorage.getItem('last_login_date');
    const today = new Date().toDateString();
    
    if (lastLoginDate !== today) {
      // Es un nuevo día, registrar inicio de sesión
      localStorage.setItem('last_login_date', today);
      
      // Añadir acción de inicio de sesión diario
      if (isOnboardingComplete) {
        addTrustAction(TrustAction.DAILY_LOGIN, 'Inicio de sesión diario');
      }
    }
  }, [isOnboardingComplete, addTrustAction]);

  // Manejar el envío de mensajes del usuario
  const handleSendMessage = (message: string) => {
    // Añadir mensaje del usuario
    addMessage({
      text: message,
      sender: 'user'
    });

    // Si estamos en el flujo de onboarding, manejar la respuesta según el flujo
    if (!isOnboardingComplete && currentOnboardingStep) {
      handleUserResponse(message);
    } else {
      // Si no estamos en el flujo de onboarding, usar respuestas generales
      simulateGeneralResponse(message);
      
      // Incrementar el Índice de Confianza por interacción con el chatbot
      if (message.length > 10) {
        // Solo para mensajes significativos (más de 10 caracteres)
        addTrustAction(TrustAction.ANSWER_QUESTION, 'Interacción con chatbot');
      }
      
      // Detectar si el usuario está preguntando sobre temas educativos
      if (
        message.toLowerCase().includes('cómo') || 
        message.toLowerCase().includes('qué es') || 
        message.toLowerCase().includes('explica') ||
        message.toLowerCase().includes('significa')
      ) {
        // Incrementar por interés en contenido educativo
        addTrustAction(TrustAction.EDUCATIONAL_CONTENT, 'Interés en contenido educativo');
      }
    }
  };

  // Simular respuestas generales (fuera del flujo de onboarding)
  const simulateGeneralResponse = (userInput: string) => {
    // Verificar si el usuario quiere iniciar el onboarding
    if (
      userInput.toLowerCase().includes('comenzar onboarding') || 
      userInput.toLowerCase().includes('iniciar onboarding') ||
      userInput.toLowerCase().includes('hacer preguntas')
    ) {
      // Reiniciar el onboarding
      handleUserResponse('Sí, comencemos');
      return;
    }

    // Verificar si el usuario menciona completar su perfil
    if (
      userInput.toLowerCase().includes('completar perfil') || 
      userInput.toLowerCase().includes('actualizar perfil') ||
      userInput.toLowerCase().includes('editar perfil')
    ) {
      // Incrementar por interés en completar perfil
      addTrustAction(TrustAction.COMPLETE_PROFILE, 'Interés en completar perfil');
    }

    // Verificar si el usuario menciona el simulador
    if (
      userInput.toLowerCase().includes('simulador') || 
      userInput.toLowerCase().includes('simular') ||
      userInput.toLowerCase().includes('probar simulador')
    ) {
      // Incrementar por interés en el simulador
      addTrustAction(TrustAction.USE_SIMULATOR, 'Interés en el simulador de crédito');
    }

    // Generar respuesta basada en palabras clave
    let botResponse = '';

    if (userInput.toLowerCase().includes('hola') || userInput.toLowerCase().includes('buenos días') || userInput.toLowerCase().includes('buenas')) {
      botResponse = `¡Hola! ¿En qué puedo ayudarte hoy?`;
    } else if (userInput.toLowerCase().includes('crédito') || userInput.toLowerCase().includes('préstamo')) {
      botResponse = `Para acceder a un crédito, primero necesitas aumentar tu Índice de Confianza. Te recomiendo completar el simulador de crédito para demostrar tus habilidades financieras.`;
    } else if (userInput.toLowerCase().includes('índice') || userInput.toLowerCase().includes('confianza')) {
      botResponse = `Tu Índice de Confianza actual es ${userProfile.trustIndex}. Este índice refleja tu progreso en la construcción de una relación financiera sólida. Completa acciones recomendadas como el simulador de crédito para aumentarlo.`;
    } else if (userInput.toLowerCase().includes('etapa') || userInput.toLowerCase().includes('journey')) {
      botResponse = `Actualmente estás en la etapa de ${userProfile.currentStage?.toUpperCase() || 'CONOCER'}. En TrustBridge, avanzas por 4 etapas: Conocer, Intercambiar, Confiar y Concretar. Cada etapa te acerca más a obtener productos financieros personalizados.`;
    } else if (userInput.toLowerCase().includes('simulador')) {
      botResponse = `El simulador de crédito te permite demostrar tus habilidades financieras en situaciones reales. Completarlo aumentará significativamente tu Índice de Confianza.`;
    } else if (userInput.toLowerCase().includes('gracias')) {
      botResponse = `¡De nada! Estoy aquí para ayudarte en tu viaje financiero. ¿Hay algo más en lo que pueda asistirte?`;
    } else {
      botResponse = `Gracias por tu mensaje. Para ayudarte mejor, ¿podrías darme más detalles sobre lo que necesitas? Puedo informarte sobre tu Índice de Confianza, las etapas del journey, o cómo usar el simulador de crédito.`;
    }

    // Simular tiempo de respuesta (entre 1 y 3 segundos)
    setTimeout(() => {
      // Añadir respuesta del bot
      addMessage({
        text: botResponse,
        sender: 'bot'
      });
    }, Math.floor(Math.random() * 2000) + 1000);
  };

  return (
    <>
      <Chatbot
        userName={userName}
        isOpen={isOpen}
        toggleChat={toggleChat}
        onSendMessage={handleSendMessage}
        messages={messages}
        isTyping={isTyping}
        currentOnboardingStep={currentOnboardingStep}
      />
    </>
  );
};

export default ChatbotContainer; 