import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Message } from './Chatbot';
import {  onboardingFlow, getNextStep } from './OnboardingFlow';
import { TrustHistory, TrustAction, addTrustEvent, getTrustActionExplanation, getCelebrationMessage } from './TrustIndexCalculator';

interface ChatbotContextType {
  isOpen: boolean;
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  messages: Message[];
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  isOnboardingComplete: boolean;
  currentOnboardingStep: string | null;
  handleUserResponse: (message: string) => void;
  isTyping: boolean;
  userProfile: UserProfile;
  updateUserProfile: (data: Partial<UserProfile>) => void;
  addTrustAction: (action: TrustAction, details?: string, value?: number) => void;
  showTrustAnimation: boolean;
  celebrationThreshold: number | null;
  setIsTyping: (isTyping: boolean) => void;
  
}

export interface UserProfile {
  financialGoal?: string;
  creditExperience?: string;
  financialKnowledge?: string;
  incomeStatus?: string;
  savingHabits?: string;
  budgetControl?: string;
  shortTermGoals?: string;
  trustIndex?: number;
  onboardingCompleted?: boolean;
  currentStage?: 'conocer' | 'intercambiar' | 'confiar' | 'concretar';
  trustHistory?: TrustHistory;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

interface ChatbotProviderProps {
  children: ReactNode;
}

export const ChatbotProvider: React.FC<ChatbotProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [currentOnboardingStep, setCurrentOnboardingStep] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    trustIndex: 10,
    onboardingCompleted: false,
    currentStage: 'conocer',
    trustHistory: { events: [], lastCalculation: new Date() },
  });
  const [showTrustAnimation, setShowTrustAnimation] = useState(false);
  const [celebrationThreshold, setCelebrationThreshold] = useState<number | null>(null);

  // Cargar el estado del onboarding desde localStorage
  useEffect(() => {
    const savedOnboardingState = localStorage.getItem('chatbot_onboarding');
    if (savedOnboardingState) {
      const { isComplete, currentStep } = JSON.parse(savedOnboardingState);
      setIsOnboardingComplete(isComplete);
      setCurrentOnboardingStep(currentStep);
    } else {
      // Si no hay estado guardado, iniciar con el primer paso
      setCurrentOnboardingStep(onboardingFlow.initialStep);
    }

    // Cargar el perfil del usuario desde localStorage
    const savedUserProfile = localStorage.getItem('chatbot_user_profile');
    if (savedUserProfile) {
      setUserProfile(JSON.parse(savedUserProfile));
    }
  }, []);

  // Guardar el estado del onboarding en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('chatbot_onboarding', JSON.stringify({
      isComplete: isOnboardingComplete,
      currentStep: currentOnboardingStep,
    }));
  }, [isOnboardingComplete, currentOnboardingStep]);

  // Guardar el perfil del usuario en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('chatbot_user_profile', JSON.stringify(userProfile));
    
    // Sincronizar con el perfil de usuario principal si existe
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser && userProfile.trustIndex !== undefined) {
        const parsedUser = JSON.parse(storedUser);
        
        // Si el índice de confianza ha cambiado, actualizar el perfil principal
        if (parsedUser.trustIndex !== userProfile.trustIndex) {
          // Usar el valor más alto
          const newTrustIndex = Math.max(parsedUser.trustIndex || 0, userProfile.trustIndex);
          
          // Solo actualizar si es diferente
          if (parsedUser.trustIndex !== newTrustIndex) {
            parsedUser.trustIndex = newTrustIndex;
            localStorage.setItem('user', JSON.stringify(parsedUser));
          }
        }
      }
    } catch (error) {
      console.error('Error synchronizing trust index:', error);
    }
  }, [userProfile]);

  // Iniciar el flujo de onboarding cuando se abre el chat por primera vez
  useEffect(() => {
    if (isOpen && !isOnboardingComplete && currentOnboardingStep === onboardingFlow.initialStep && messages.length === 0) {
      startOnboardingFlow();
    }
  }, [isOpen, isOnboardingComplete, currentOnboardingStep, messages.length]);

  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };

  const openChat = () => {
    setIsOpen(true);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: `${message.sender}-${Date.now()}`,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const updateUserProfile = (data: Partial<UserProfile>) => {
    setUserProfile(prev => ({
      ...prev,
      ...data,
    }));
  };

  // Iniciar el flujo de onboarding
  const startOnboardingFlow = async () => {
    if (!currentOnboardingStep) return;
    
    const currentStep = onboardingFlow.steps[currentOnboardingStep];
    if (!currentStep) return;
    
    // Añadir el mensaje del paso actual
    await sendBotMessage(currentStep.message, currentStep.delay || 1000);
    
    // Si el paso actual es una pregunta, esperar la respuesta del usuario
    if (!currentStep.isQuestion) {
      // Si no es una pregunta, avanzar al siguiente paso automáticamente
      const nextStep = getNextStep(currentStep.id);
      if (nextStep) {
        setCurrentOnboardingStep(nextStep.id);
      }
    }
  };

  // Manejar la respuesta del usuario en el flujo de onboarding
  const handleUserResponse = async (message: string) => {
    if (!currentOnboardingStep) return;
    
    const currentStep = onboardingFlow.steps[currentOnboardingStep];
    if (!currentStep) return;
    
    // Actualizar el perfil del usuario según la pregunta actual
    updateUserProfileFromResponse(currentOnboardingStep, message);
    
    // Obtener el siguiente paso basado en la respuesta
    const nextStep = getNextStep(currentStep.id, message);
    
    if (nextStep) {
      // Establecer el siguiente paso
      setCurrentOnboardingStep(nextStep.id);
      
      // Si es el paso final, marcar el onboarding como completo
      if (nextStep.id === 'end') {
        setIsOnboardingComplete(true);
        updateUserProfile({ onboardingCompleted: true });
        return;
      }
      
      // Enviar el mensaje del siguiente paso
      await sendBotMessage(nextStep.message, nextStep.delay || 1000);
      
      // Si el siguiente paso no es una pregunta, continuar automáticamente
      if (!nextStep.isQuestion && nextStep.nextStep) {
        const nextNextStep = getNextStep(nextStep.id);
        if (nextNextStep) {
          setCurrentOnboardingStep(nextNextStep.id);
        }
      }
    }
  };

  // Actualizar el perfil del usuario según la respuesta a una pregunta específica
  const updateUserProfileFromResponse = (stepId: string, response: string) => {
    switch (stepId) {
      case 'question_1':
        updateUserProfile({ financialGoal: response });
        addTrustAction(TrustAction.ANSWER_QUESTION, `Objetivo financiero: ${response}`);
        break;
      case 'question_2':
        updateUserProfile({ creditExperience: response });
        addTrustAction(TrustAction.ANSWER_QUESTION, `Experiencia crediticia: ${response}`);
        break;
      case 'question_3':
        updateUserProfile({ financialKnowledge: response });
        addTrustAction(TrustAction.ANSWER_QUESTION, `Conocimiento financiero: ${response}`);
        break;
      case 'question_4':
        updateUserProfile({ incomeStatus: response });
        addTrustAction(TrustAction.ANSWER_QUESTION, `Ingresos: ${response}`);
        break;
      case 'question_5':
        updateUserProfile({ savingHabits: response });
        addTrustAction(TrustAction.ANSWER_QUESTION, `Hábitos de ahorro: ${response}`);
        break;
      case 'question_6':
        updateUserProfile({ budgetControl: response });
        addTrustAction(TrustAction.ANSWER_QUESTION, `Control de presupuesto: ${response}`);
        break;
      case 'question_7':
        updateUserProfile({ shortTermGoals: response });
        addTrustAction(TrustAction.ANSWER_QUESTION, `Metas a corto plazo: ${response}`);
        break;
      case 'next_steps':
        // Incrementar el índice de confianza al completar el onboarding
        addTrustAction(TrustAction.COMPLETE_ONBOARDING, 'Onboarding completado');
        break;
    }
  };

  // Enviar un mensaje del bot con un retraso para simular escritura
  const sendBotMessage = async (message: string, delay = 1000) => {
    if (!message) return;
    
    setIsTyping(true);
    
    return new Promise<void>(resolve => {
      setTimeout(() => {
        addMessage({
          text: message,
          sender: 'bot',
        });
        setIsTyping(false);
        resolve();
      }, delay);
    });
  };

  // Función para añadir una acción que afecta al Índice de Confianza
  const addTrustAction = async (action: TrustAction, details?: string, value?: number) => {
    // Añadir el evento y obtener el nuevo perfil y posible celebración
    const { newProfile, celebration } = addTrustEvent(userProfile, action, details, value);
    
    // Actualizar el perfil
    setUserProfile(newProfile);
    
    // Mostrar animación de incremento
    setShowTrustAnimation(true);
    // La animación se ocultará automáticamente gracias a la animación CSS fade-out
    
    // Si hay celebración, mostrarla y enviar mensaje
    if (celebration) {
      setCelebrationThreshold(celebration);
      setTimeout(() => setCelebrationThreshold(null), 5000);
      
      // Enviar mensaje de celebración
      await sendBotMessage(getCelebrationMessage(celebration), 1000);
    }
    
    // Enviar mensaje explicando cómo afecta la acción al Índice de Confianza
    await sendBotMessage(getTrustActionExplanation(action), 1500);
  };

  const value = {
    isOpen,
    toggleChat,
    openChat,
    closeChat,
    messages,
    addMessage,
    isOnboardingComplete,
    currentOnboardingStep,
    handleUserResponse,
    isTyping,
    setIsTyping,
    userProfile,
    updateUserProfile,
    addTrustAction,
    showTrustAnimation,
    celebrationThreshold,
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = (): ChatbotContextType => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};

export default ChatbotContext; 