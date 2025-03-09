import React from 'react';

interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  trustIndex: number;
  conversionPotential: string;
  lastActivity: string;
  stage: string;
  alerts: string[];
  tags: string[];
}

interface UsersListProps {
  users: User[];
  sortBy: string;
  sortOrder: string;
  onSortChange: (field: string) => void;
  onUserClick: (userId: string) => void;
}

const UsersList: React.FC<UsersListProps> = ({
  users,
  sortBy,
  sortOrder,
  onSortChange,
  onUserClick
}) => {
  // Formatear la fecha para mostrarla de forma amigable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHrs < 24) {
      if (diffHrs === 0) {
        const diffMins = Math.floor(diffMs / (1000 * 60));
        return `Hace ${diffMins} minutos`;
      }
      return `Hace ${diffHrs} horas`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Mapear la etapa a un nombre más amigable
  const getStageName = (stage: string) => {
    switch (stage) {
      case 'conocer':
        return 'Conocer';
      case 'intercambiar_confiar':
        return 'Intercambiar';
      case 'concretar':
        return 'Confiar';
      default:
        return stage;
    }
  };

  // Renderizar el indicador de ordenamiento
  const renderSortIndicator = (field: string) => {
    if (sortBy === field) {
      return <span className="sort-indicator">{sortOrder === 'asc' ? '↑' : '↓'}</span>;
    }
    return null;
  };

  return (
    <table className="users-list">
      <thead>
        <tr>
          <th onClick={() => onSortChange('name')}>
            Usuario {renderSortIndicator('name')}
          </th>
          <th onClick={() => onSortChange('trustIndex')}>
            Índice de Confianza {renderSortIndicator('trustIndex')}
          </th>
          <th onClick={() => onSortChange('conversionPotential')}>
            Potencial {renderSortIndicator('conversionPotential')}
          </th>
          <th>Etapa</th>
          <th>Alertas</th>
          <th>Intereses</th>
          <th onClick={() => onSortChange('lastActivity')}>
            Última Actividad {renderSortIndicator('lastActivity')}
          </th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id} className="user-row" onClick={() => onUserClick(user.id)}>
            <td>
              <div className="user-name">{user.fullName}</div>
              <div className="user-email">{user.email}</div>
            </td>
            <td>
              <div className="trust-index-cell">
                <span className="trust-index-value">{user.trustIndex}</span>
                <div className="trust-index-bar">
                  <div 
                    className="trust-index-progress" 
                    style={{ width: `${user.trustIndex}%` }}
                  ></div>
                </div>
              </div>
            </td>
            <td>
              <span className={`conversion-tag ${user.conversionPotential.toLowerCase()}`}>
                {user.conversionPotential}
              </span>
            </td>
            <td>{getStageName(user.stage)}</td>
            <td>
              <div className="user-alerts">
                {user.alerts.map((alert, index) => (
                  <span key={index} className="user-alert-badge">
                    {alert}
                  </span>
                ))}
              </div>
            </td>
            <td>
              <div className="user-tags">
                {user.tags.map((tag, index) => (
                  <span key={index} className="user-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </td>
            <td>
              <span className="last-activity">
                {formatDate(user.lastActivity)}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UsersList; 