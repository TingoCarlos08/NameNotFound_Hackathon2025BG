import React from 'react';
import { Card, CardContent, Button } from '../../components/ui';

interface Alert {
  id: string;
  type: 'opportunity' | 'warning' | 'info';
  message: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
}

interface AlertsPanelProps {
  alerts: Alert[];
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts }) => {
  // Formatear la fecha para mostrarla de forma amigable
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card>
      <CardContent>
        <div className="alerts-panel">
          <div className="alerts-header">
            <h2>Alertas y Oportunidades</h2>
            <Button variant="text" size="small">Ver todas</Button>
          </div>
          
          <div className="alerts-list">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`alert-item ${alert.priority} ${alert.type === 'opportunity' ? 'opportunity' : ''}`}
              >
                <div className="alert-message">{alert.message}</div>
                <div className="alert-timestamp">Hoy, {formatTimestamp(alert.timestamp)}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsPanel; 