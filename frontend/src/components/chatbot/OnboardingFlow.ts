/**
 * TrustBridge Chatbot Onboarding Flow
 * Define el flujo de onboarding para nuevos usuarios
 */

export interface OnboardingStep {
  id: string;
  message: string;
  options?: string[];
  nextStep?: string | ((answer: string) => string);
  isQuestion?: boolean;
  delay?: number;
}

export interface OnboardingFlow {
  steps: Record<string, OnboardingStep>;
  initialStep: string;
}

// Flujo de onboarding para el chatbot
export const onboardingFlow: OnboardingFlow = {
  initialStep: 'welcome',
  steps: {
    // Paso 1: Mensaje de bienvenida
    welcome: {
      id: 'welcome',
      message: '👋 ¡Hola! Soy TrustBuddy, tu asistente financiero personal en TrustBridge. Estoy aquí para guiarte en tu viaje hacia la confianza financiera.',
      nextStep: 'intro1',
      delay: 1000,
    },
    
    // Paso 2: Introducción a TrustBridge (parte 1)
    intro1: {
      id: 'intro1',
      message: 'TrustBridge es una plataforma que transforma la evaluación crediticia tradicional en un journey de construcción de confianza mutua entre tú y el banco.',
      nextStep: 'intro2',
      delay: 2000,
    },
    
    // Paso 3: Introducción a TrustBridge (parte 2)
    intro2: {
      id: 'intro2',
      message: 'A través de 4 etapas (Conocer, Intercambiar, Confiar y Concretar), te ayudaremos a construir un perfil financiero sólido, incluso si no tienes historial crediticio previo.',
      nextStep: 'ask_start_onboarding',
      delay: 2500,
    },
    
    // Paso 4: Preguntar si quiere comenzar el onboarding
    ask_start_onboarding: {
      id: 'ask_start_onboarding',
      message: '¿Te gustaría que te haga algunas preguntas para personalizar tu experiencia en TrustBridge?',
      options: ['Sí, comencemos', 'Ahora no'],
      isQuestion: true,
      nextStep: (answer) => {
        if (answer.toLowerCase().includes('sí') || answer.toLowerCase().includes('si') || answer.toLowerCase().includes('comenc')) {
          return 'onboarding_start';
        } else {
          return 'skip_onboarding';
        }
      },
    },
    
    // Paso 5: Saltar onboarding
    skip_onboarding: {
      id: 'skip_onboarding',
      message: 'No hay problema. Puedes iniciar el onboarding en cualquier momento escribiendo "comenzar onboarding". Mientras tanto, ¿hay algo específico en lo que pueda ayudarte?',
      nextStep: 'end',
    },
    
    // Paso 6: Iniciar onboarding
    onboarding_start: {
      id: 'onboarding_start',
      message: '¡Excelente! Vamos a comenzar con algunas preguntas sencillas para conocerte mejor. Esto nos ayudará a personalizar tu experiencia en TrustBridge.',
      nextStep: 'question_1',
      delay: 1500,
    },
    
    // Pregunta 1: Objetivo financiero
    question_1: {
      id: 'question_1',
      message: '¿Cuál es tu principal objetivo financiero en este momento?',
      options: ['Obtener un crédito', 'Mejorar mis finanzas', 'Aprender sobre finanzas', 'Otro'],
      isQuestion: true,
      nextStep: 'question_2',
    },
    
    // Pregunta 2: Experiencia crediticia
    question_2: {
      id: 'question_2',
      message: '¿Has tenido alguna experiencia previa con productos crediticios?',
      options: ['Sí, tengo/tuve créditos', 'No, nunca he tenido créditos', 'Solo tarjetas de crédito'],
      isQuestion: true,
      nextStep: 'question_3',
    },
    
    // Pregunta 3: Conocimiento financiero
    question_3: {
      id: 'question_3',
      message: '¿Cómo calificarías tu nivel de conocimiento sobre finanzas personales?',
      options: ['Principiante', 'Intermedio', 'Avanzado'],
      isQuestion: true,
      nextStep: 'question_4',
    },
    
    // Pregunta 4: Ingresos
    question_4: {
      id: 'question_4',
      message: '¿Actualmente cuentas con ingresos regulares?',
      options: ['Sí, empleo formal', 'Sí, trabajo independiente', 'Ingresos variables', 'No tengo ingresos regulares'],
      isQuestion: true,
      nextStep: 'question_5',
    },
    
    // Pregunta 5: Ahorro
    question_5: {
      id: 'question_5',
      message: '¿Sueles ahorrar parte de tus ingresos mensualmente?',
      options: ['Sí, regularmente', 'A veces', 'Rara vez', 'Nunca'],
      isQuestion: true,
      nextStep: 'question_6',
    },
    
    // Pregunta 6: Presupuesto
    question_6: {
      id: 'question_6',
      message: '¿Llevas un presupuesto o control de tus gastos?',
      options: ['Sí, detalladamente', 'De manera general', 'No llevo control'],
      isQuestion: true,
      nextStep: 'question_7',
    },
    
    // Pregunta 7: Metas a corto plazo
    question_7: {
      id: 'question_7',
      message: '¿Tienes alguna meta financiera a corto plazo (próximos 12 meses)?',
      options: ['Comprar algo específico', 'Ahorrar cierta cantidad', 'Pagar deudas', 'No tengo metas definidas'],
      isQuestion: true,
      nextStep: 'onboarding_complete',
    },
    
    // Onboarding completo
    onboarding_complete: {
      id: 'onboarding_complete',
      message: '¡Gracias por compartir esta información! He registrado tus respuestas y las utilizaré para personalizar tu experiencia en TrustBridge.',
      nextStep: 'explain_trust_index',
      delay: 1500,
    },
    
    // Explicación del Índice de Confianza
    explain_trust_index: {
      id: 'explain_trust_index',
      message: 'Basado en tus respuestas, hemos creado tu Índice de Confianza inicial. Este índice refleja tu relación financiera con TrustBridge y aumentará a medida que interactúes con la plataforma, completes el simulador de crédito y demuestres comportamientos financieros responsables.',
      nextStep: 'next_steps',
      delay: 3000,
    },
    
    // Próximos pasos
    next_steps: {
      id: 'next_steps',
      message: 'Para comenzar a aumentar tu Índice de Confianza, te recomiendo estas acciones:\n\n1️⃣ Completar tu perfil con información adicional\n2️⃣ Probar el simulador de crédito\n3️⃣ Explorar los recursos educativos\n\n¿Con cuál te gustaría comenzar?',
      options: ['Completar perfil', 'Simulador de crédito', 'Recursos educativos', 'Hablar con un asesor'],
      isQuestion: true,
      nextStep: 'action_recommendation',
    },
    
    // Recomendación de acción
    action_recommendation: {
      id: 'action_recommendation',
      message: 'Excelente elección. Te ayudaré a avanzar en tu journey financiero. Recuerda que estoy aquí para responder tus dudas en cualquier momento. ¡Juntos construiremos tu confianza financiera!',
      nextStep: 'end',
    },
    
    // Fin del flujo
    end: {
      id: 'end',
      message: '',
    },
  },
};

// Función para obtener el siguiente paso del flujo
export const getNextStep = (currentStepId: string, answer?: string): OnboardingStep | null => {
  const currentStep = onboardingFlow.steps[currentStepId];
  if (!currentStep) return null;
  
  // Si no hay siguiente paso, terminar
  if (!currentStep.nextStep) return null;
  
  // Si el siguiente paso es una función, evaluarla con la respuesta
  let nextStepId: string;
  if (typeof currentStep.nextStep === 'function' && answer) {
    nextStepId = currentStep.nextStep(answer);
  } else {
    nextStepId = currentStep.nextStep as string;
  }
  
  return onboardingFlow.steps[nextStepId];
};

export default onboardingFlow; 