import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo, Card, CardContent, CardHeader, Button } from '../components/ui';
import { MetricsOverview, AlertsPanel, FiltersPanel, UsersList } from '../components/operator';
import './OperatorDashboardPage.css';

// Datos de ejemplo para el mockup
const mockUsers = [
  {
    id: '1',
    fullName: 'María González',
    email: 'maria.gonzalez@example.com',
    phone: '+52 55 1234 5678',
    trustIndex: 78,
    conversionPotential: 'Alto',
    lastActivity: '2023-03-09T14:30:00',
    stage: 'intercambiar_confiar',
    alerts: ['Completó simulación con éxito', 'Alto interés en productos'],
    tags: ['Emprendedor', 'Préstamo Negocio']
  },
  {
    id: '2',
    fullName: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@example.com',
    phone: '+52 55 8765 4321',
    trustIndex: 65,
    conversionPotential: 'Medio',
    lastActivity: '2023-03-08T10:15:00',
    stage: 'conocer',
    alerts: ['Inactivo por 2 días'],
    tags: ['Estudiante', 'Crédito Educativo']
  },
  {
    id: '3',
    fullName: 'Ana Martínez',
    email: 'ana.martinez@example.com',
    phone: '+52 55 2468 1357',
    trustIndex: 92,
    conversionPotential: 'Alto',
    lastActivity: '2023-03-09T16:45:00',
    stage: 'concretar',
    alerts: ['Lista para oferta personalizada', 'Completó perfil 100%'],
    tags: ['Profesionista', 'Hipoteca']
  },
  {
    id: '4',
    fullName: 'Juan Pérez',
    email: 'juan.perez@example.com',
    phone: '+52 55 1357 2468',
    trustIndex: 45,
    conversionPotential: 'Bajo',
    lastActivity: '2023-03-07T09:20:00',
    stage: 'conocer',
    alerts: ['Abandonó simulación', 'Inactivo por 3 días'],
    tags: ['Empleado', 'Crédito Personal']
  },
  {
    id: '5',
    fullName: 'Laura Sánchez',
    email: 'laura.sanchez@example.com',
    phone: '+52 55 9876 5432',
    trustIndex: 83,
    conversionPotential: 'Alto',
    lastActivity: '2023-03-09T11:10:00',
    stage: 'intercambiar_confiar',
    alerts: ['Interesada en más información'],
    tags: ['Emprendedor', 'Préstamo Negocio']
  },
  {
    id: '6',
    fullName: 'Roberto Díaz',
    email: 'roberto.diaz@example.com',
    phone: '+52 55 5432 1098',
    trustIndex: 71,
    conversionPotential: 'Medio',
    lastActivity: '2023-03-08T15:30:00',
    stage: 'intercambiar_confiar',
    alerts: [],
    tags: ['Profesionista', 'Inversión']
  },
  {
    id: '7',
    fullName: 'Patricia López',
    email: 'patricia.lopez@example.com',
    phone: '+52 55 6789 0123',
    trustIndex: 89,
    conversionPotential: 'Alto',
    lastActivity: '2023-03-09T13:25:00',
    stage: 'concretar',
    alerts: ['Lista para oferta personalizada'],
    tags: ['Empleado', 'Crédito Auto']
  }
];

// Datos de ejemplo para métricas
const mockMetrics = {
  totalUsers: 1254,
  activeUsers: 876,
  averageTrustIndex: 72,
  highPotentialUsers: 342,
  conversionRate: 18.5,
  newUsersToday: 24
};

// Datos de ejemplo para alertas
const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'opportunity',
    message: '3 usuarios listos para oferta personalizada',
    timestamp: '2023-03-09T16:30:00',
    priority: 'high'
  },
  {
    id: '2',
    type: 'warning',
    message: '5 usuarios con alto potencial inactivos por más de 2 días',
    timestamp: '2023-03-09T14:15:00',
    priority: 'medium'
  },
  {
    id: '3',
    type: 'info',
    message: '12 nuevos usuarios completaron onboarding hoy',
    timestamp: '2023-03-09T10:45:00',
    priority: 'low'
  },
  {
    id: '4',
    type: 'opportunity',
    message: '7 usuarios mostraron interés en productos de inversión',
    timestamp: '2023-03-09T09:20:00',
    priority: 'medium'
  }
];

const OperatorDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('trustIndex');
  const [sortOrder, setSortOrder] = useState('desc');

  // Filtrar usuarios basado en los criterios seleccionados
  const filteredUsers = mockUsers.filter(user => {
    // Filtrar por término de búsqueda
    if (searchTerm && !user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !user.email.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filtrar por potencial de conversión
    if (activeFilter === 'high' && user.conversionPotential !== 'Alto') {
      return false;
    }
    if (activeFilter === 'medium' && user.conversionPotential !== 'Medio') {
      return false;
    }
    if (activeFilter === 'low' && user.conversionPotential !== 'Bajo') {
      return false;
    }
    if (activeFilter === 'alerts' && user.alerts.length === 0) {
      return false;
    }
    
    return true;
  });

  // Ordenar usuarios
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === 'trustIndex') {
      return sortOrder === 'desc' ? b.trustIndex - a.trustIndex : a.trustIndex - b.trustIndex;
    }
    if (sortBy === 'name') {
      return sortOrder === 'desc' 
        ? b.fullName.localeCompare(a.fullName) 
        : a.fullName.localeCompare(b.fullName);
    }
    if (sortBy === 'lastActivity') {
      return sortOrder === 'desc' 
        ? new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
        : new Date(a.lastActivity).getTime() - new Date(b.lastActivity).getTime();
    }
    return 0;
  });

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleSortChange = (sortField: string) => {
    if (sortField === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(sortField);
      setSortOrder('desc');
    }
  };

  const handleUserClick = (userId: string) => {
    // En una implementación real, esto navegaría al perfil detallado del usuario
    alert(`Ver perfil detallado del usuario ${userId}`);
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="operator-dashboard-page">
      <header className="operator-header">
        <div className="header-left">
          <Logo size="medium" />
          <h1>Panel de Control - Operadores</h1>
        </div>
        <div className="header-right">
          <div className="operator-info">
            <span className="operator-name">Operador: Juan Ramírez</span>
            <span className="operator-role">Asesor Financiero Senior</span>
          </div>
          <Button variant="outline" onClick={handleLogout}>Cerrar Sesión</Button>
        </div>
      </header>

      <main className="operator-content">
        <div className="dashboard-top-row">
          <MetricsOverview metrics={mockMetrics} />
          <AlertsPanel alerts={mockAlerts} />
        </div>

        <div className="dashboard-main-content">
          <div className="filters-container">
            <FiltersPanel 
              activeFilter={activeFilter} 
              searchTerm={searchTerm}
              onFilterChange={handleFilterChange}
              onSearchChange={handleSearchChange}
            />
          </div>
          
          <Card className="users-list-card">
            <CardHeader title="Usuarios" subheader={`${sortedUsers.length} usuarios encontrados`} />
            <CardContent>
              <UsersList 
                users={sortedUsers} 
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
                onUserClick={handleUserClick}
              />
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="operator-footer">
        <p>TrustBridge © 2023 - Panel de Operadores v1.0</p>
      </footer>
    </div>
  );
};

export default OperatorDashboardPage; 