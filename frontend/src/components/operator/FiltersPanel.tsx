import React from 'react';

interface FiltersPanelProps {
  activeFilter: string;
  searchTerm: string;
  onFilterChange: (filter: string) => void;
  onSearchChange: (term: string) => void;
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({
  activeFilter,
  searchTerm,
  onFilterChange,
  onSearchChange
}) => {
  return (
    <div className="filters-panel">
      <div className="filter-buttons">
        <button 
          className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => onFilterChange('all')}
        >
          Todos
        </button>
        <button 
          className={`filter-button ${activeFilter === 'high' ? 'active' : ''}`}
          onClick={() => onFilterChange('high')}
        >
          Alto Potencial
        </button>
        <button 
          className={`filter-button ${activeFilter === 'medium' ? 'active' : ''}`}
          onClick={() => onFilterChange('medium')}
        >
          Potencial Medio
        </button>
        <button 
          className={`filter-button ${activeFilter === 'low' ? 'active' : ''}`}
          onClick={() => onFilterChange('low')}
        >
          Potencial Bajo
        </button>
        <button 
          className={`filter-button ${activeFilter === 'alerts' ? 'active' : ''}`}
          onClick={() => onFilterChange('alerts')}
        >
          Con Alertas
        </button>
      </div>
      
      <div className="search-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por nombre o email..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default FiltersPanel; 