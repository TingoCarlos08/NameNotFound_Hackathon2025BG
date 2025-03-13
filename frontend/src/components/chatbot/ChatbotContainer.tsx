import React, { useEffect } from "react";
import { Chatbot } from "./";
import { useChatbot } from "./ChatbotContext";
import { TrustAction } from "./TrustIndexCalculator";

interface ChatbotContainerProps {
  userName?: string;
}

// Obtener la URL base del archivo .env
const API_BASE_URL = import.meta.env.VITE_BASE_URL_CHATBOT;

// Añadir esta función para procesar los links en el texto
const processMessageLinks = (text: string) => {
  // Buscar patrones de tipo [texto](url)
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  
  // Si no hay links, retornar el texto original
  if (!text.match(linkPattern)) {
    return text;
  }

  // Dividir el texto en partes y procesar los links
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = linkPattern.exec(text)) !== null) {
    // Añadir el texto antes del link
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    // Crear el elemento anchor
    parts.push(
      `<a href="${match[2]}" target="_blank" rel="noopener noreferrer" style="color: #E6007E; text-decoration: underline;">${match[1]}</a>`
    );

    lastIndex = match.index + match[0].length;
  }

  // Añadir cualquier texto restante después del último link
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.join('');
};

const ChatbotContainer: React.FC<ChatbotContainerProps> = ({
  userName = "Usuario",
}) => {
  const {
    isOpen,
    toggleChat,
    messages,
    addMessage,
    handleUserResponse,
    isTyping,
    currentOnboardingStep,
    isOnboardingComplete,
    addTrustAction,
    setIsTyping
  } = useChatbot();

  // Registrar inicio de sesión diario
  useEffect(() => {
    const lastLoginDate = localStorage.getItem("last_login_date");
    const today = new Date().toDateString();

    if (lastLoginDate !== today) {
      // Es un nuevo día, registrar inicio de sesión
      localStorage.setItem("last_login_date", today);

      // Añadir acción de inicio de sesión diario
      if (isOnboardingComplete) {
        addTrustAction(TrustAction.DAILY_LOGIN, "Inicio de sesión diario");
      }
    }
  }, [isOnboardingComplete, addTrustAction]);

  // Función para enviar mensaje al servidor
  const sendMessageToServer = async (chatInput: string, sessionId: string) => {
    try {
      setIsTyping(true);
      const response = await fetch(`${API_BASE_URL}/webhook/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatInput , sessionId }),
      });

      if (!response.ok) {
        throw new Error("Error al enviar mensaje al servidor");
      }

      const data = await response.json();
      setIsTyping(false);
      return data.output;
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };

  // Manejar el envío de mensajes del usuario
  
  const handleSendMessage = (message: string) => {
    // Añadir mensaje del usuario
    addMessage({
      text: message,
      sender: "user",
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
        addTrustAction(TrustAction.ANSWER_QUESTION, "Interacción con chatbot");
      }

      // Detectar si el usuario está preguntando sobre temas educativos
      if (
        message.toLowerCase().includes("cómo") ||
        message.toLowerCase().includes("qué es") ||
        message.toLowerCase().includes("explica") ||
        message.toLowerCase().includes("significa")
      ) {
        // Incrementar por interés en contenido educativo
        addTrustAction(
          TrustAction.EDUCATIONAL_CONTENT,
          "Interés en contenido educativo"
        );
      }
    }
  };

  // Simular respuestas generales (fuera del flujo de onboarding)
  const simulateGeneralResponse = async (userInput: string) => {
    // Verificar si el usuario quiere iniciar el onboarding
    if (
      userInput.toLowerCase().includes("comenzar onboarding") ||
      userInput.toLowerCase().includes("iniciar onboarding") ||
      userInput.toLowerCase().includes("hacer preguntas")
    ) {
      handleUserResponse("Sí, comencemos");
      return;
    }

    let uniqueKey = ''

    if(localStorage.getItem('sessionId')){
      uniqueKey = localStorage.getItem('sessionId')!
    }else{
      uniqueKey = Date.now().toString(36) + Math.random().toString(36).substring(2);
      localStorage.setItem('sessionId', uniqueKey);
    }
    
    const response = await sendMessageToServer(userInput, uniqueKey);
    
    // Procesar los links antes de añadir el mensaje
    addMessage({
      text: processMessageLinks(response),
      sender: "bot",
      isHtml: true  // Añadir esta propiedad para indicar que el contenido es HTML
    });
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
