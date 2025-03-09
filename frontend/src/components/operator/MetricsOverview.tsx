import React from 'react';
import { Card, CardContent } from '../../components/ui';

interface MetricsProps {
  metrics: {
    totalUsers: number;
    activeUsers: number;
    averageTrustIndex: number;
    highPotentialUsers: number;
    conversionRate: number;
    newUsersToday: number;
  };
}

const MetricsOverview: React.FC<MetricsProps> = ({ metrics }) => {
  return (
    <Card>
      <CardContent>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '1.2rem' }}>Métricas Clave</h2>
        <div className="metrics-overview">
          <div className="metric-card">
            <div className="metric-title">Total de Usuarios</div>
            <div className="metric-value">{metrics.totalUsers.toLocaleString()}</div>
            <div className="metric-trend trend-up">
              <span>↑</span> 12% vs. mes anterior
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-title">Usuarios Activos</div>
            <div className="metric-value">{metrics.activeUsers.toLocaleString()}</div>
            <div className="metric-trend trend-up">
              <span>↑</span> 8% vs. mes anterior
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-title">Índice de Confianza Promedio</div>
            <div className="metric-value">{metrics.averageTrustIndex}</div>
            <div className="metric-trend trend-up">
              <span>↑</span> 5 puntos vs. mes anterior
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-title">Usuarios de Alto Potencial</div>
            <div className="metric-value">{metrics.highPotentialUsers.toLocaleString()}</div>
            <div className="metric-trend trend-up">
              <span>↑</span> 15% vs. mes anterior
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-title">Tasa de Conversión</div>
            <div className="metric-value">{metrics.conversionRate}%</div>
            <div className="metric-trend trend-down">
              <span>↓</span> 2% vs. mes anterior
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-title">Nuevos Usuarios Hoy</div>
            <div className="metric-value">{metrics.newUsersToday}</div>
            <div className="metric-trend trend-neutral">
              <span>→</span> Similar al promedio diario
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricsOverview; 