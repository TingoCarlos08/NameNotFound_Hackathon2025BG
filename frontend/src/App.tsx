import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { RegisterPage, DashboardPage, CompleteProfilePage, SimulatorPage } from './pages';
import { ChatbotProvider } from './components/chatbot';

// Componente para proteger rutas que requieren autenticación
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Verificar si hay un usuario en localStorage
  const isAuthenticated = localStorage.getItem('user') !== null;
  
  // Si no está autenticado, redirigir al registro
  if (!isAuthenticated) {
    return <Navigate to="/register" replace />;
  }
  
  // Si está autenticado, mostrar el contenido protegido
  return <>{children}</>;
};

function App() {
  return (
    <ChatbotProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/complete-profile" element={<CompleteProfilePage />} />
            <Route 
              path="/simulator" 
              element={
                <ProtectedRoute>
                  <SimulatorPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </ChatbotProvider>
  );
}

export default App;