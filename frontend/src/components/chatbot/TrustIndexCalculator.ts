/**
 * TrustBridge Trust Index Calculator
 * Sistema para calcular y actualizar el Índice de Confianza del usuario
 */

import { UserProfile } from './ChatbotContext';

// Tipos de acciones que afectan al Índice de Confianza
export enum TrustAction {
  COMPLETE_ONBOARDING = 'complete_onboarding',
  ANSWER_QUESTION = 'answer_question',
  COMPLETE_PROFILE = 'complete_profile',
  USE_SIMULATOR = 'use_simulator',
  VISIT_SIMULATOR = 'visit_simulator',
  START_SIMULATOR = 'start_simulator',
  COMPLETE_SCENARIO = 'complete_scenario',
  EDUCATIONAL_CONTENT = 'educational_content',
  DAILY_LOGIN = 'daily_login',
  CONSISTENT_BEHAVIOR = 'consistent_behavior',
}

// Interfaz para los eventos que afectan al Índice de Confianza
export interface TrustEvent {
  action: TrustAction;
  value?: number;
  details?: string;
  timestamp: Date;
}

// Interfaz para el historial de eventos
export interface TrustHistory {
  events: TrustEvent[];
  lastCalculation: Date;
}

// Puntos base para cada tipo de acción
const ACTION_POINTS: Record<TrustAction, number> = {
  [TrustAction.COMPLETE_ONBOARDING]: 5,
  [TrustAction.ANSWER_QUESTION]: 1,
  [TrustAction.COMPLETE_PROFILE]: 3,
  [TrustAction.USE_SIMULATOR]: 10,
  [TrustAction.VISIT_SIMULATOR]: 2,
  [TrustAction.START_SIMULATOR]: 5,
  [TrustAction.COMPLETE_SCENARIO]: 15,
  [TrustAction.EDUCATIONAL_CONTENT]: 2,
  [TrustAction.DAILY_LOGIN]: 1,
  [TrustAction.CONSISTENT_BEHAVIOR]: 5,
};

// Umbrales para celebraciones
export const CELEBRATION_THRESHOLDS = [25, 50, 75, 100];

// Función para calcular el Índice de Confianza basado en el historial de eventos
export const calculateTrustIndex = (history: TrustEvent[], baseIndex: number = 10): number => {
  // Sumar puntos de todas las acciones
  const points = history.reduce((total, event) => {
    // Si el evento tiene un valor específico, usarlo
    if (event.value !== undefined) {
      return total + event.value;
    }
    
    // Si no, usar el valor predeterminado para el tipo de acción
    return total + (ACTION_POINTS[event.action] || 0);
  }, baseIndex);
  
  // Limitar el índice a un máximo de 100
  return Math.min(Math.round(points), 100);
};

// Función para añadir un evento al historial y recalcular el índice
export const addTrustEvent = (
  profile: UserProfile,
  action: TrustAction,
  details?: string,
  value?: number
): { newProfile: UserProfile; celebration: number | null } => {
  // Obtener el historial actual o crear uno nuevo
  const history: TrustHistory = profile.trustHistory || { events: [], lastCalculation: new Date() };
  
  // Crear el nuevo evento
  const newEvent: TrustEvent = {
    action,
    details,
    value,
    timestamp: new Date(),
  };
  
  // Añadir el evento al historial
  const updatedHistory: TrustHistory = {
    events: [...history.events, newEvent],
    lastCalculation: new Date(),
  };
  
  // Calcular el nuevo índice
  const oldIndex = profile.trustIndex || 10;
  
  // Verificar si hay un valor en localStorage para sincronizar
  let baseIndex = 10;
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.trustIndex !== undefined) {
        // Usar el valor más alto como base
        baseIndex = Math.max(baseIndex, parsedUser.trustIndex);
      }
    }
  } catch (error) {
    console.error('Error reading trust index from localStorage:', error);
  }
  
  // Calcular el nuevo índice usando el valor base sincronizado
  const newIndex = calculateTrustIndex(updatedHistory.events, baseIndex);
  
  // Verificar si se ha alcanzado un umbral de celebración
  let celebration: number | null = null;
  for (const threshold of CELEBRATION_THRESHOLDS) {
    if (oldIndex < threshold && newIndex >= threshold) {
      celebration = threshold;
      break;
    }
  }
  
  // Actualizar el perfil
  const newProfile: UserProfile = {
    ...profile,
    trustIndex: newIndex,
    trustHistory: updatedHistory,
  };
  
  // Sincronizar con localStorage
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      parsedUser.trustIndex = newIndex;
      localStorage.setItem('user', JSON.stringify(parsedUser));
    }
  } catch (error) {
    console.error('Error updating trust index in localStorage:', error);
  }
  
  return { newProfile, celebration };
};

// Función para obtener una explicación de cómo afecta una acción al Índice de Confianza
export const getTrustActionExplanation = (action: TrustAction): string => {
  const points = ACTION_POINTS[action];
  
  switch (action) {
    case TrustAction.COMPLETE_ONBOARDING:
      return `Completar el proceso de onboarding aumenta tu Índice de Confianza en ${points} puntos. Esto demuestra tu interés en construir una relación financiera sólida.`;
    
    case TrustAction.ANSWER_QUESTION:
      return `Responder preguntas aumenta tu Índice de Confianza en ${points} punto. Cada interacción nos ayuda a conocerte mejor.`;
    
    case TrustAction.COMPLETE_PROFILE:
      return `Completar tu perfil aumenta tu Índice de Confianza en ${points} puntos. La transparencia es clave en la construcción de confianza.`;
    
    case TrustAction.USE_SIMULATOR:
      return `Usar el simulador de crédito aumenta tu Índice de Confianza en ${points} puntos. Demuestra tu capacidad para tomar decisiones financieras responsables.`;
    
    case TrustAction.VISIT_SIMULATOR:
      return `Visitar el simulador de crédito aumenta tu Índice de Confianza en ${points} puntos. Muestra tu interés en mejorar tus habilidades financieras.`;
    
    case TrustAction.START_SIMULATOR:
      return `Iniciar una simulación aumenta tu Índice de Confianza en ${points} puntos. Demuestra tu compromiso con el aprendizaje financiero.`;
    
    case TrustAction.COMPLETE_SCENARIO:
      return `Completar un escenario de simulación aumenta tu Índice de Confianza en ${points} puntos. Refleja tu capacidad para enfrentar situaciones financieras complejas.`;
    
    case TrustAction.EDUCATIONAL_CONTENT:
      return `Consumir contenido educativo aumenta tu Índice de Confianza en ${points} puntos. El conocimiento financiero es fundamental para tomar mejores decisiones.`;
    
    case TrustAction.DAILY_LOGIN:
      return `Iniciar sesión diariamente aumenta tu Índice de Confianza en ${points} punto. La consistencia es importante en la construcción de confianza.`;
    
    case TrustAction.CONSISTENT_BEHAVIOR:
      return `Mantener un comportamiento consistente aumenta tu Índice de Confianza en ${points} puntos. La predictibilidad es un factor clave en la evaluación crediticia.`;
    
    default:
      return `Esta acción afecta positivamente a tu Índice de Confianza. Cada interacción con TrustBridge te acerca más a obtener productos financieros personalizados.`;
  }
};

// Función para obtener un mensaje de celebración al alcanzar un umbral
export const getCelebrationMessage = (threshold: number): string => {
  switch (threshold) {
    case 25:
      return `¡Felicidades! Has alcanzado un Índice de Confianza de ${threshold}. Estás demostrando un buen compromiso con tu salud financiera.`;
    
    case 50:
      return `¡Increíble! Tu Índice de Confianza ha llegado a ${threshold}. Estás a mitad de camino hacia el máximo nivel de confianza. Sigue así.`;
    
    case 75:
      return `¡Excelente trabajo! Con un Índice de Confianza de ${threshold}, estás demostrando un comportamiento financiero muy responsable. Estás muy cerca de desbloquear todos los beneficios.`;
    
    case 100:
      return `¡Felicitaciones! Has alcanzado el máximo Índice de Confianza de ${threshold}. Has demostrado un comportamiento financiero ejemplar y estás listo para acceder a los mejores productos financieros.`;
    
    default:
      return `¡Felicidades! Has alcanzado un nuevo hito en tu Índice de Confianza. Sigue construyendo tu confianza financiera.`;
  }
};

export default {
  calculateTrustIndex,
  addTrustEvent,
  getTrustActionExplanation,
  getCelebrationMessage,
  CELEBRATION_THRESHOLDS,
  ACTION_POINTS,
}; 